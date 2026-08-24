import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/lib/supabase/database.types";

// profiles는 다른 앱과 공유하는 테이블이라 읽기 전용으로만 표시한다(PRD 5.0/5.1 — id/email/name/phone_number/bio 외 컬럼은 재사용 금지).
type Profile = Pick<
  Tables<"profiles">,
  "id" | "email" | "name" | "phone_number" | "bio"
>;

export function ProfileForm({
  profile,
  className,
  ...props
}: { profile: Profile } & React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">내 프로필</CardTitle>
          <CardDescription>회원 프로필 정보입니다(읽기 전용).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={profile.email ?? ""}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                value={profile.name ?? ""}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone-number">전화번호</Label>
              <Input
                id="phone-number"
                type="text"
                value={profile.phone_number ?? ""}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">자기소개</Label>
              <Input id="bio" type="text" value={profile.bio ?? ""} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
