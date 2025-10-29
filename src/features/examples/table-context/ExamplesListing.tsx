import ExampleTable from './ExampleTable'
import ExampleTableFilters from './ExampleTableFilters'
import ExampleTableProvider from './ExampleTableProvider'

function ExamplesListing() {
  return (
    <ExampleTableProvider>
      <ExampleTableFilters />
      <ExampleTable />
    </ExampleTableProvider>
  )
}

export default ExamplesListing
