import { getMultiUploadUrls } from './get-multi-upload-urls'
import { uploadFile } from './upload-files'

export const uploadFilesOnS3WithUrls = async (
  folderNameOnS3: string,
  files: File[] | undefined,
  setProgress: (progress: number, index: number) => void = () => {},
) => {
  if (!files?.length) return []

  const { data: uploadUrls } = await getMultiUploadUrls(files, folderNameOnS3)

  for (let i = 0; i < files.length; i++) {
    await uploadFile({
      file: files[i],
      response: uploadUrls[i],
      onProgress: (fileProgress: number) => {
        setProgress(fileProgress, i)
      },
    })
  }

  return uploadUrls.map((url) => url.path)
}
type MediaType =
  | FileList
  | File[]
  | string[]
  | (string | File)[]
  | null
  | undefined
export const filterAndJoinUploadedFilesWithUrls = async (
  folderNameOnS3: string,
  media: MediaType,
) => {
  const filesFromDataMedia = Array.from(media || []).filter(
    (item) => item instanceof File,
  )
  const urlsFromDataMedia = Array.from(media || []).filter(
    (item) => typeof item === 'string',
  )
  const uploadedFiles = await uploadFilesOnS3WithUrls(
    folderNameOnS3,
    filesFromDataMedia,
  )
  return [...urlsFromDataMedia, ...uploadedFiles]
}
