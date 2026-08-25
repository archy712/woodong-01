"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { useServerActionForm } from "@/hooks/use-server-action-form";
import { updateGroupAction } from "@/lib/woodong/actions/groups";
import {
  updateGroupSchema,
  GROUP_TYPE_SUGGESTIONS,
  type UpdateGroupInput,
} from "@/lib/woodong/groups";
import { createClient } from "@/lib/supabase/client";
import {
  buildGroupObjectPath,
  WOODONG_COVERS_BUCKET,
} from "@/lib/supabase/storage";
import { resizeImageFile, validateImageFile } from "@/lib/storage/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const GROUP_TYPE_DATALIST_ID = "group-settings-type-suggestions";

/**
 * 모임 정보 수정 폼 (Task 019).
 *
 * 대표 이미지는 Supabase Storage 서버 사이드 변환이 Pro 플랜 전용이라(Task 004),
 * 브라우저에서 검증 → 리사이즈 → 비공개 버킷 업로드까지 마친 뒤 **오브젝트 경로만**
 * `updateGroupAction`에 넘긴다. 업로드는 제출 시점에 한 번만 수행해, 저장하지 않고
 * 떠나는 사용자가 쓰레기 파일을 남기지 않도록 한다.
 */
export function GroupSettingsForm({
  groupId,
  defaultValues,
  coverUrl,
  labels,
  createLabels,
  commonLabels,
}: {
  groupId: string;
  defaultValues: UpdateGroupInput;
  /** 현재 저장된 대표 이미지의 서명 URL(없으면 null). */
  coverUrl: string | null;
  labels: Dictionary["groups"]["settings"];
  createLabels: Dictionary["groups"]["create"];
  commonLabels: Dictionary["common"];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { form, onSubmit, isPending } = useServerActionForm({
    schema: updateGroupSchema,
    defaultValues,
    action: async (values) => {
      // 이미지 처리 결과를 액션 입력에 얹는다. 변경이 없으면 키 자체를 넘기지 않아
      // 서버가 기존 경로를 그대로 유지한다.
      let coverImageObjectPath: string | null | undefined;

      if (removeCover) {
        coverImageObjectPath = null;
      } else if (coverFile) {
        const uploaded = await uploadCover(coverFile);
        if (!uploaded.ok) {
          return { success: false as const, formError: uploaded.error };
        }
        coverImageObjectPath = uploaded.path;
      }

      return updateGroupAction({ ...values, coverImageObjectPath });
    },
    successMessage: labels.saveSuccessToast,
    onSuccess: () => {
      setCoverFile(null);
      setPreviewUrl(null);
      setRemoveCover(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    },
  });

  async function uploadCover(
    file: File,
  ): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
    setIsUploading(true);
    try {
      const resized = await resizeImageFile(file);
      const path = buildGroupObjectPath(groupId, resized.name);
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(WOODONG_COVERS_BUCKET)
        .upload(path, resized, { contentType: resized.type });

      if (error) {
        console.error("[GroupSettingsForm] cover upload failed:", error);
        return { ok: false, error: labels.coverUploadError };
      }
      return { ok: true, path };
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // 원본 5MB/형식 제한은 업로드 전에 브라우저에서 먼저 막는다(Task 004의 validateImageFile).
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      event.target.value = "";
      return;
    }

    setCoverFile(file);
    setRemoveCover(false);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  }

  function handleRemoveCover() {
    setCoverFile(null);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setRemoveCover(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const shownCover = previewUrl ?? (removeCover ? null : coverUrl);
  const busy = isPending || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{createLabels.nameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={createLabels.namePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{createLabels.descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={createLabels.descriptionPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{createLabels.typeLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={createLabels.typePlaceholder}
                  list={GROUP_TYPE_DATALIST_ID}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultDueAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{createLabels.defaultDueAmountLabel}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  placeholder={createLabels.defaultDueAmountPlaceholder}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
          <Label htmlFor="group-cover">{labels.coverImageLabel}</Label>
          {shownCover && (
            <div className="relative aspect-[3/1] w-full overflow-hidden rounded-md bg-muted">
              <Image
                src={shownCover}
                alt={labels.coverImageLabel}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
                unoptimized={Boolean(previewUrl)}
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Input
              id="group-cover"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="max-w-xs"
            />
            {shownCover && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveCover}
              >
                {labels.coverImageRemoveButton}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {labels.coverImageHint}
          </p>
        </div>

        <Button type="submit" className="w-fit" disabled={busy}>
          {busy ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              {createLabels.submittingLabel}
            </>
          ) : (
            commonLabels.save
          )}
        </Button>
      </form>

      <datalist id={GROUP_TYPE_DATALIST_ID}>
        {GROUP_TYPE_SUGGESTIONS.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </Form>
  );
}
