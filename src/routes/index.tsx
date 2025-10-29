import { createFileRoute } from '@tanstack/react-router'

import SubmittableForm from '$/features/examples/submittable-form/SubmittableForm'
import ExamplesListing from '$/features/examples/table-context/ExamplesListing'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-white text-white text-[calc(10px+2vmin)]">
        <SubmittableForm />
        <ExamplesListing />
        <a
          className="text-[#61dafb] hover:underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="text-[#61dafb] hover:underline"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </header>
    </div>
  )
}
