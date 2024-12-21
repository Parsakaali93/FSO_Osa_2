
export default function AddPersonForm({addName, newName, handleNameChange, handleNumberChange, newNumber}) {
  return (
    <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          phone: <input value={newNumber} onChange={handleNumberChange} />
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}
