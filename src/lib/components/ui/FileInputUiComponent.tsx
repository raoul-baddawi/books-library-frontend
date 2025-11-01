import { UploadIcon } from 'lucide-react'

import Button from './buttons/Button'

export default function FileInputUiComponent() {
  return (
    <div className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-primary py-10">
      <div className="rounded-full bg-primary-light p-3">
        <UploadIcon className="h-7 w-7 text-primary" />
      </div>
      <p className="text-lg font-semibold">Upload</p>
      <span className="p-2 text-center text-sm text-neutral-medium">
        Drag and drop or click to select images
      </span>
      <div className="flex flex-col items-center justify-center gap-2 p-2 text-center sm:flex-row">
        <Button className="bg-primary text-sm font-normal text-white">
          Select Files
        </Button>
      </div>
    </div>
  )
}
