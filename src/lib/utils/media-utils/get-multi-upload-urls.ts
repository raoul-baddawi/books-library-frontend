import { apiClient } from '../apiClient'

export type FileMediaPath = {
  path: string
  url: string
}

export const getMultiUploadUrls = async (files: File[], path: string) => {
  const extensions = files.map((file) => file.name)

  const res = await apiClient.post<{ data: FileMediaPath[] }>(
    `media/get-multi-upload-urls`,
    {
      json: {
        extensions,
        path,
      },
    },
  )
  return res.json()
}
