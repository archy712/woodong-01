import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { DEFAULT_AVATAR_KEY, isAvatarKey } from "@/lib/woodong/avatars";

async function ProfileContent() {
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, name, phone_number, bio")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  const { data: woodongProfile, error: woodongProfileError } = await supabase
    .from("woodong_profiles")
    .select("avatar_key")
    .eq("user_id", userId)
    .maybeSingle();

  if (woodongProfileError) {
    throw woodongProfileError;
  }

  const avatarKey =
    woodongProfile && isAvatarKey(woodongProfile.avatar_key)
      ? woodongProfile.avatar_key
      : DEFAULT_AVATAR_KEY;

  return (
    <ProfileForm
      profile={
        profile ?? {
          id: userId,
          email: data.claims.email ?? null,
          name: null,
          phone_number: null,
          bio: null,
        }
      }
      avatarKey={avatarKey}
    />
  );
}

export default function ProfilePage() {
  return (
    <div className="flex w-full flex-1 flex-col gap-4 p-8">
      <Suspense>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
