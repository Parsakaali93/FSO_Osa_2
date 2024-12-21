
export default function Filter({searchTerm, handleSearchChange}) {
  return (
    
    <input className='searchBar' placeholder='Filter Contacts' value={searchTerm} onChange={handleSearchChange}
    />
  )
}
