import path from "node:path";

const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

export function getUploadDir() {
  return process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");
}

export function createUploadFileName(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const safeBaseName = baseName || "image";
  const safeExt = contentTypes[ext] ? ext : ".png";

  return `${Date.now()}-${safeBaseName}${safeExt}`;
}

export function isSupportedImageUpload(originalName: string, contentType: string) {
  const ext = path.extname(originalName).toLowerCase();
  return Boolean(contentTypes[ext] && contentType.startsWith("image/"));
}

export function getImageContentType(filePath: string) {
  return contentTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

export function resolveUploadPath(segments: string[]) {
  if (segments.length === 0 || segments.some((segment) => !/^[a-zA-Z0-9._-]+$/.test(segment))) {
    return null;
  }

  const uploadDir = getUploadDir();
  const filePath = path.resolve(uploadDir, ...segments);
  const uploadRoot = path.resolve(uploadDir);
  if (filePath !== uploadRoot && filePath.startsWith(`${uploadRoot}${path.sep}`)) {
    return filePath;
  }

  return null;
}
