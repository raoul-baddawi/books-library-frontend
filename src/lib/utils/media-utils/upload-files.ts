import { FileMediaPath } from "./get-multi-upload-urls";

export const uploadFile = async ({
  file,
  response,
  onProgress,
}: {
  file: File;
  response: FileMediaPath;
  onProgress?: (progress: number, loaded: number, total: number) => void;
}) => {
  const url = response.url;
  if (!url) return;

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress?.(progress, event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during file upload"));
    };

    xhr.send(file);
  });
};
