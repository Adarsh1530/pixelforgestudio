import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export interface StoredFile {
  filename: string;
  url: string;
  storageKey: string;
  type: string;
  size: number;
}

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function uploadFile(file: File): Promise<StoredFile> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Validate MIME type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, WEBP, and SVG images are allowed.");
  }

  // Max 5MB size limit
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${timestamp}_${safeName}`;
  const filePath = join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);

  const url = `/uploads/${filename}`;

  return {
    filename: file.name,
    url,
    storageKey: filename,
    type: file.type,
    size: file.size,
  };
}

export async function deleteStoredFile(storageKey: string): Promise<boolean> {
  try {
    const filePath = join(UPLOAD_DIR, storageKey);
    if (existsSync(filePath)) {
      await unlink(filePath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error deleting file:", err);
    return false;
  }
}
