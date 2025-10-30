import UserTable from './UsersTable'
import UserTableFilters from './UsersTableFilters'
import UserTableProvider from './UsersTableProvider'

function UsersListing() {
  return (
    <UserTableProvider>
      {/* <UserTableFilters /> */}
      <UserTable />
    </UserTableProvider>
  )
}

export default UsersListing
