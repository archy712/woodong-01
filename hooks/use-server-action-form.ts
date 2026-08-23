"use client";

import { useTransition } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { ActionResult } from "@/lib/udong/common";

/**
 * react-hook-form이 검증한 입력값을 그대로 받아 `ActionResult`를 반환하는 Server Action의 타입.
 *
 * 이 프로젝트의 Server Action은 `<form action={...}>`/`useActionState`용 `FormData` 시그니처가
 * 아니라, 이미 클라이언트에서 zod로 검증된 객체를 인자로 받는 일반 async 함수로 정의한다
 * (`"use server"` 함수는 Client Component에서 그냥 호출해도 되는 일반 함수이므로 문제 없음).
 * react-hook-form이 이미 같은 zod 스키마로 검증했으므로 `FormData` 직렬화/역직렬화를 한 번 더
 * 거칠 이유가 없고, Server Action 내부에서 동일 스키마로 재검증(`safeParse`)하는 것으로
 * "서버-클라이언트 이중 검증" 원칙을 지킨다.
 */
export type ServerAction<TInput, TData = undefined> = (
  input: TInput,
) => Promise<ActionResult<TData>>;

export interface UseServerActionFormOptions<
  TSchema extends z.ZodType<FieldValues>,
  TData = undefined,
> {
  /** react-hook-form과 Server Action이 공유하는 zod 스키마. */
  schema: TSchema;
  defaultValues: DefaultValues<z.infer<TSchema>>;
  /** 검증된 입력값으로 호출할 Server Action. */
  action: ServerAction<z.infer<TSchema>, TData>;
  /**
   * 성공 시 콜백. `redirect()`를 호출하는 액션(이 프로젝트의 모임 생성 액션 등)은
   * 성공 경로에서 절대 resolve하지 않고 곧바로 페이지 이동하므로 이 콜백이 필요 없다.
   * 페이지 이동 없이 같은 화면에 머무는 폼(수정 폼 등)에서만 사용한다.
   */
  onSuccess?: (data: TData) => void | Promise<void>;
  /** 지정하면 성공 시 이 문구로 토스트를 띄운다(예: "저장되었습니다"). */
  successMessage?: string;
}

export interface UseServerActionFormReturn<
  TSchema extends z.ZodType<FieldValues>,
> {
  form: UseFormReturn<z.infer<TSchema>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  /** Server Action이 진행 중인지 여부(react-hook-form의 `isSubmitting`과 별개로 `useTransition` 기반). */
  isPending: boolean;
}

/**
 * react-hook-form + zod + Server Action 공통 래퍼.
 *
 * `docs/guides/forms-react-hook-form.md`의 패턴을 이 코드베이스의 실제 `ActionResult`
 * (`lib/udong/common.ts`)에 맞게 구현한 것 — 성공/필드 에러/폼 전체 에러 3갈래 분기를
 * 매번 손으로 반복하지 않도록 이 훅 하나로 감싼다.
 *
 * 분기 규칙:
 * - `success: false` + `fieldErrors` → 해당 필드에 `form.setError(field, { type: "server" })`
 *   (react-hook-form의 `FormMessage`가 그대로 표시)
 * - `success: false` + `formError` → 필드에 속하지 않는 일반 에러이므로 `toast.error()`로 알림
 *   (RLS 거부 등 `lib/udong/errors.ts`의 `mapSupabaseError()`가 만든 메시지가 여기로 들어온다)
 * - `success: true` → `successMessage`가 있으면 `toast.success()`, 이어서 `onSuccess(data)` 호출
 */
export function useServerActionForm<
  TSchema extends z.ZodType<FieldValues>,
  TData = undefined,
>({
  schema,
  defaultValues,
  action,
  onSuccess,
  successMessage,
}: UseServerActionFormOptions<
  TSchema,
  TData
>): UseServerActionFormReturn<TSchema> {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await action(values);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (!messages?.length) continue;
            form.setError(field as Path<z.infer<TSchema>>, {
              type: "server",
              message: messages[0],
            });
          }
        }

        if (result.formError) {
          toast.error(result.formError);
        }

        return;
      }

      if (successMessage) {
        toast.success(successMessage);
      }

      await onSuccess?.(result.data);
    });
  });

  return { form, onSubmit, isPending };
}

/*
 * 낙관적 UI 패턴(참고용 — 이번 Task 범위에서는 실사용하지 않음).
 *
 * 이후 Task(예: 투표 참여)에서 이 훅과 함께 쓸 패턴만 정의해 둔다. React의 `useOptimistic`으로
 * Server Action 응답을 기다리지 않고 화면을 먼저 갱신한 뒤, 액션이 실패하면 자동으로 이전 상태로
 * 되돌리는 방식이다:
 *
 * ```tsx
 * "use client";
 * import { useOptimistic, useTransition } from "react";
 *
 * function VoteOptions({ options }: { options: VoteOption[] }) {
 *   const [isPending, startTransition] = useTransition();
 *   const [optimisticOptions, addOptimisticVote] = useOptimistic(
 *     options,
 *     (state, optionId: string) =>
 *       state.map((o) => (o.id === optionId ? { ...o, myVote: true } : o)),
 *   );
 *
 *   const handleVote = (optionId: string) => {
 *     startTransition(async () => {
 *       addOptimisticVote(optionId); // 서버 응답을 기다리지 않고 즉시 반영
 *       const result = await castVoteAction({ optionId });
 *       if (!result.success) {
 *         toast.error(result.formError ?? "투표에 실패했습니다"); // 실패 시 useOptimistic이 자동 롤백
 *       }
 *     });
 *   };
 *
 *   return <VoteOptionList options={optimisticOptions} onVote={handleVote} disabled={isPending} />;
 * }
 * ```
 *
 * 핵심은 (1) `useOptimistic`의 갱신 함수는 순수 함수여야 하고, (2) 실패 시 별도의 되돌리기 코드를
 * 작성할 필요 없이 `startTransition`이 끝나면 실제 `options` prop 기준으로 자동 리렌더링된다는 것.
 * 이번 Task(모임 생성)는 생성 직후 상세 페이지로 리다이렉트하는 흐름이라 낙관적 업데이트가
 * 필요 없어 실사용은 생략한다.
 */
