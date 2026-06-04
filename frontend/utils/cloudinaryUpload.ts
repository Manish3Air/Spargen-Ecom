import BASE_URL from "@/utils/api";

type CloudinarySignature = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  uploadPreset: string;
};

const getErrorMessage = async (res: Response) => {
  try {
    const data = await res.json();
    return data.message || data.error?.message || data.error || res.statusText;
  } catch {
    return res.statusText;
  }
};

export const uploadProductImages = async (files: FileList, token: string) => {
  const sigRes = await fetch(`${BASE_URL}/api/cloudinary/signature`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!sigRes.ok) {
    throw new Error(`Failed to get Cloudinary signature: ${await getErrorMessage(sigRes)}`);
  }

  const sigData = (await sigRes.json()) as CloudinarySignature;
  const uploadedImages: string[] = [];

  for (const file of Array.from(files)) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", sigData.uploadPreset);
    formData.append("timestamp", String(sigData.timestamp));
    formData.append("signature", sigData.signature);
    formData.append("api_key", sigData.apiKey);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error(`Cloudinary upload failed: ${await getErrorMessage(res)}`);
    }

    const data = await res.json();
    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed: secure_url missing from response");
    }

    uploadedImages.push(data.secure_url);
  }

  return uploadedImages;
};
