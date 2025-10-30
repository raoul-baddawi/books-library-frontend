import UserTable from './UsersTable'
import UserTableFilters from './UsersTableFilters'
import UserTableProvider from './UsersTableProvider'

function UsersListing() {
  return (
    <UserTableProvider>
      <div className="grid grid-cols-1 grid-rows-[auto_1fr] col-span-1 row-span-1 h-full">
        <UserTableFilters />

        <UserTable />
      </div>
    </UserTableProvider>
  )
}

export default UsersListing
