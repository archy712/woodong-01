export const MAX_UPLOAD_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_MAX_DIMENSION_PX = 1600;
const RESIZE_JPEG_QUALITY = 0.85;

export function validateImageFile(
  file: File,
): { valid: true } | { valid: false; error: string } {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "지원하지 않는 이미지 형식입니다(JPEG/PNG/WebP만 가능).",
    };
  }
  if (file.size > MAX_UPLOAD_IMAGE_SIZE_BYTES) {
    return { valid: false, error: "이미지 용량은 5MB를 초과할 수 없습니다." };
  }
  return { valid: true };
}

export async function resizeImageFile(
  file: File,
  maxDimension = DEFAULT_MAX_DIMENSION_PX,
  quality = RESIZE_JPEG_QUALITY,
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) return file;

  const resizedName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], resizedName, { type: "image/jpeg" });
}
