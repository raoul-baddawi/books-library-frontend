type RecordsOptionsDropdownProps = {
  onSetPageLimit: (limit: number) => void
  pageLimit: number
  isDisabled: boolean
}
export default function RecordsOptionsDropdown({
  onSetPageLimit,
  pageLimit,
  isDisabled,
}: RecordsOptionsDropdownProps) {
  return (
    <div className="hidden gap-4 md:flex">
      <label htmlFor="records">Nombre de lignes</label>
      <select
        disabled={isDisabled}
        className="bg-grey-200 rounded-md"
        value={pageLimit}
        onChange={(e) => onSetPageLimit(Number(e.target.value))}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>
  )
}
