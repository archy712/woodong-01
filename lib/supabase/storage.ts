import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const WOODONG_COVERS_BUCKET = "woodong-covers";
export const WOODONG_RECEIPTS_BUCKET = "woodong-receipts";
type WoodongBucket =
  typeof WOODONG_COVERS_BUCKET | typeof WOODONG_RECEIPTS_BUCKET;

const DEFAULT_SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60;

export async function getSignedStorageUrl(
  supabase: SupabaseClient<Database>,
  bucket: WoodongBucket,
  objectPath: string,
  expiresInSeconds = DEFAULT_SIGNED_URL_EXPIRES_IN_SECONDS,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresInSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}

export function buildGroupObjectPath(
  groupId: string,
  fileName: string,
): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${groupId}/${crypto.randomUUID()}-${safeName}`;
}
