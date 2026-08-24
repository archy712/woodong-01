import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserNavMenu } from "./user-nav-menu";

export async function AuthButton({
  profileLabel,
  logoutLabel,
}: {
  profileLabel: string;
  logoutLabel: string;
}) {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <UserNavMenu
      email={user.email ?? ""}
      profileLabel={profileLabel}
      logoutLabel={logoutLabel}
    />
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
