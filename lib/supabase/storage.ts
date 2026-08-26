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

/**
 * 여러 오브젝트의 서명 URL을 **한 번의 요청으로** 발급한다 (Task 035).
 *
 * 지출 목록은 행마다 영수증이 붙을 수 있어 `getSignedStorageUrl()`을 행 수만큼 부르면
 * 그대로 왕복 N회가 된다. Storage API의 복수형 엔드포인트를 쓰면 1회로 끝난다.
 *
 * 반환값은 `경로 → 서명 URL` 맵이다. 개별 오브젝트 발급이 실패하면 그 키만 빠지므로,
 * 호출부는 "없으면 null"로 다루면 된다(영수증 하나 때문에 목록 전체가 죽지 않는다).
 */
export async function getSignedStorageUrls(
  supabase: SupabaseClient<Database>,
  bucket: WoodongBucket,
  objectPaths: string[],
  expiresInSeconds = DEFAULT_SIGNED_URL_EXPIRES_IN_SECONDS,
): Promise<Record<string, string>> {
  if (objectPaths.length === 0) return {};

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(objectPaths, expiresInSeconds);

  if (error || !data) {
    console.error("[storage] createSignedUrls failed:", error);
    return {};
  }

  const urls: Record<string, string> = {};
  for (const item of data) {
    if (item.path && item.signedUrl && !item.error) {
      urls[item.path] = item.signedUrl;
    }
  }
  return urls;
}

export function buildGroupObjectPath(
  groupId: string,
  fileName: string,
): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${groupId}/${crypto.randomUUID()}-${safeName}`;
}
