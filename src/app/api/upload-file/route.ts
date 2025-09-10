import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// Backblaze B2 configuration
const B2_ACCOUNT_ID = process.env.BACKBLAZE_ACCOUNT_ID!;
const B2_APPLICATION_KEY = process.env.BACKBLAZE_APPLICATION_KEY!;
const B2_BUCKET_ID = process.env.BACKBLAZE_BUCKET_ID!;
const B2_BUCKET_NAME = process.env.BACKBLAZE_BUCKET_NAME!;

interface B2AuthResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
}

interface B2UploadUrlResponse {
  bucketId: string;
  uploadUrl: string;
  authorizationToken: string;
}

interface B2UploadResponse {
  fileId: string;
  fileName: string;
  accountId: string;
  bucketId: string;
  contentLength: number;
  contentSha1: string;
  contentType: string;
  fileInfo: Record<string, string>;
  action: string;
  uploadTimestamp: number;
}

interface UploadError extends Error {
  status?: number;
  retryable?: boolean;
}

// Validate environment variables
function validateEnv(): void {
  if (
    !B2_ACCOUNT_ID ||
    !B2_APPLICATION_KEY ||
    !B2_BUCKET_ID ||
    !B2_BUCKET_NAME
  ) {
    throw new Error(
      `Missing required Backblaze environment variables: ${JSON.stringify({
        B2_ACCOUNT_ID: !!B2_ACCOUNT_ID,
        B2_APPLICATION_KEY: !!B2_APPLICATION_KEY,
        B2_BUCKET_ID: !!B2_BUCKET_ID,
        B2_BUCKET_NAME: !!B2_BUCKET_NAME,
      })}`
    );
  }
}

// Enhanced delay function with exponential backoff
function delay(ms: number, attempt: number = 1): Promise<void> {
  // Exponential backoff: base delay * 2^(attempt-1) + random jitter
  const exponentialDelay = ms * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 1000; // Add up to 1 second of jitter
  const totalDelay = Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds

  console.log(
    `Waiting ${Math.round(totalDelay)}ms before retry attempt ${attempt}`
  );
  return new Promise((resolve) => setTimeout(resolve, totalDelay));
}

// Check if error is retryable
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Retry on 503, 502, 504, 429, and network errors
    return (
      message.includes("503") ||
      message.includes("502") ||
      message.includes("504") ||
      message.includes("429") ||
      message.includes("network") ||
      message.includes("timeout") ||
      message.includes("cpu too busy")
    );
  }
  return false;
}

// Get authorization token from Backblaze
async function getB2Authorization(): Promise<B2AuthResponse> {
  validateEnv();
  const credentials = Buffer.from(
    `${B2_ACCOUNT_ID}:${B2_APPLICATION_KEY}`
  ).toString("base64");

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${credentials}`,
          },
          // Add timeout
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(
          `B2 authorization failed: ${response.status} - ${errorText}`
        );

        if (isRetryableError(error) && attempt < maxRetries) {
          console.warn(`Authorization attempt ${attempt} failed, retrying...`);
          lastError = error;
          await delay(1000, attempt);
          continue;
        }
        throw error;
      }

      const result = await response.json();
      return result as B2AuthResponse;
    } catch (error) {
      lastError = error as Error;
      if (isRetryableError(error) && attempt < maxRetries) {
        console.warn(`Authorization attempt ${attempt} failed, retrying...`);
        await delay(1000, attempt);
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("Authorization failed after all retries");
}

// Get upload URL from Backblaze
async function getB2UploadUrl(
  authToken: string,
  apiUrl: string
): Promise<B2UploadUrlResponse> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
        method: "POST",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketId: B2_BUCKET_ID,
        }),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(
          `Failed to get upload URL: ${response.status} - ${errorText}`
        );

        if (isRetryableError(error) && attempt < maxRetries) {
          console.warn(`Get upload URL attempt ${attempt} failed, retrying...`);
          lastError = error;
          await delay(1000, attempt);
          continue;
        }
        throw error;
      }

      const result = await response.json();
      return result as B2UploadUrlResponse;
    } catch (error) {
      lastError = error as Error;
      if (isRetryableError(error) && attempt < maxRetries) {
        console.warn(`Get upload URL attempt ${attempt} failed, retrying...`);
        await delay(1000, attempt);
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("Failed to get upload URL after all retries");
}

// Upload file to Backblaze
async function uploadToB2(
  file: File,
  uploadUrl: string,
  uploadAuthToken: string,
  fileName: string
): Promise<B2UploadResponse> {
  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);

  // Calculate SHA1 hash of the file content
  const sha1Hash = createHash("sha1").update(fileBuffer).digest("hex");

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadAuthToken,
      "X-Bz-File-Name": encodeURIComponent(fileName),
      "Content-Type": file.type || "application/octet-stream",
      "Content-Length": buffer.byteLength.toString(),
      "X-Bz-Content-Sha1": sha1Hash,
    },
    body: buffer,
    // Add timeout for upload
    signal: AbortSignal.timeout(120000), // 2 minute timeout for uploads
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result as B2UploadResponse;
}

// Generate unique filename
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");
  const sanitizedName = nameWithoutExtension.replace(/[^a-zA-Z0-9]/g, "_");

  return `certifications/${timestamp}_${randomString}_${sanitizedName}.${extension}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes: string[] = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "File type not supported. Please upload PDF, Word documents, or images.",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const uniqueFileName = generateUniqueFileName(file.name);

    // Step 1: Get B2 authorization (now with built-in retry)
    const authData = await getB2Authorization();

    // Enhanced retry logic for the complete upload process
    const maxRetries = 5; // Increased from 3
    let attempt = 1;
    let uploadResult: B2UploadResponse | null = null;
    let lastError: Error | null = null;

    while (attempt <= maxRetries && !uploadResult) {
      try {
        console.log(`Upload attempt ${attempt}/${maxRetries}`);

        // Step 2: Get a fresh upload URL for each attempt
        const uploadData = await getB2UploadUrl(
          authData.authorizationToken,
          authData.apiUrl
        );

        // Step 3: Upload file
        uploadResult = await uploadToB2(
          file,
          uploadData.uploadUrl,
          uploadData.authorizationToken,
          uniqueFileName
        );

        console.log(`Upload successful on attempt ${attempt}`);
      } catch (error) {
        lastError = error as Error;
        console.error(`Upload attempt ${attempt} failed:`, error);

        if (isRetryableError(error) && attempt < maxRetries) {
          console.warn(
            `Attempt ${attempt} failed with retryable error, retrying...`
          );
          await delay(2000, attempt); // Start with 2 second base delay
          attempt++;
          continue;
        } else if (attempt < maxRetries) {
          // For non-503 errors, still retry but with shorter delay
          console.warn(
            `Attempt ${attempt} failed with non-retryable error, but retrying anyway...`
          );
          await delay(1000);
          attempt++;
          continue;
        }

        // If we've exhausted retries or hit a non-retryable error on last attempt
        throw error;
      }
    }

    if (!uploadResult) {
      throw new Error(
        `Upload failed after ${maxRetries} retries. Last error: ${
          lastError?.message || "Unknown error"
        }`
      );
    }

    // Construct the public URL
    const publicUrl = `${authData.downloadUrl}/file/${B2_BUCKET_NAME}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileId: uploadResult.fileId,
      uploadTimestamp: uploadResult.uploadTimestamp,
    });
  } catch (error) {
    console.error("Upload error:", error, {
      stack: error instanceof Error ? error.stack : null,
    });

    // Return different status codes based on error type
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const isServiceUnavailable =
      errorMessage.includes("503") ||
      errorMessage.includes("CPU too busy") ||
      errorMessage.includes("service_unavailable");

    return NextResponse.json(
      {
        error: "Upload failed",
        details: errorMessage,
        retryable: isServiceUnavailable,
      },
      {
        status: isServiceUnavailable ? 503 : 500,
      }
    );
  }
}
