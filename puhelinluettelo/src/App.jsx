import { useState, useEffect } from 'react'
import contactsServices from './services/contacts'
import Filter from './components/Filter'
import Contact from './components/Contact'
import AddPersonForm from './components/AddPersonForm'
import './App.css';

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('')


  const hook = () => {
    console.log('useEffect')
    contactsServices.getAll().then(contacts => {setPersons(contacts)})
  }
  
  // Call the hook function on first render only to fetch notes from the server
  useEffect(hook, [])

  const showError = function(message, type)
  {
    setErrorType(type)
    setErrorMessage(message)
    setTimeout(() => {setErrorMessage(null); setErrorType("")}, 5000)
  }

  // Add new contact to the phonebook
  const addName = event => {
    event.preventDefault()

    const nameObj = {
      name: newName,
      number: newNumber
    }

    if(!persons.some(person => person.name === newName))
      contactsServices.create(nameObj)
      .then(response => {
        setPersons(oldPersons => [...oldPersons, response])
        showError("Added person " + response.name, "good")
      })
      .catch(error => {
        showError(error.response.data.error)
      })
    
    else
    {
      if(newNumber == "")
        showError('Person already exists in the phonebook', "bad")

      else if(window.confirm("Person already exists. Update phone number?"))
        {
          const person = persons.find(p => p.name === nameObj.name)

          contactsServices.update({...person, number: newNumber}, person.id)
            .then(res => {
              setPersons(oldPersons => oldPersons.map((oldPerson) => oldPerson.name === nameObj.name ? {...oldPerson, number: nameObj.number} : oldPerson))

              showError("Successfully updated person " + nameObj.name, "good")
              
            }
            )
        }
    }

    setNewName('')
    setNewNumber('')

  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)  
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)  
  }

  const handleSearchChange = (event) => 
  {
    setSearchTerm(event.target.value)
  }

  const getErrorStyle = () => {
    const errorMessageStyleGood = 
    {
      backgroundColor: 'green',
      color: 'white',
      padding: 20
    }
  
    const errorMessageStyleBad = 
    {
      backgroundColor: 'red',
      color: 'white',
      padding: 20
    }

    if(errorType == "good")
      return errorMessageStyleGood

    else if(errorType == "bad")
      return errorMessageStyleBad

    else
      return null
  }

  const deleteContact = (id) => {
    
    let toBeDeletedPerson = persons.find(p => p.id === id)

    if(window.confirm("Do you really want to delete this contact?"))
    {
      contactsServices.deletePerson(id)
        .then(() => {
          setPersons(oldPersons => oldPersons.filter(oldPerson => oldPerson.id !== id))
          showError("Successfully deleted person " + toBeDeletedPerson.name, "good")
        }

        )
        .catch(showError("Person has already been deleted from the server", "bad"))
      
    }
    /*
       .then(returnedNotes => {
            console.log(returnedNotes)
            setNotes(returnedNotes)
      })*/
  }

  const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()) || person.number.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <p className='errorMessage' style={getErrorStyle()}>{errorMessage}</p>
        <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

        <AddPersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addName={addName} />


      <h2>Contacts</h2>
        {peopleToShow.map((contact) => <Contact contact={contact} deleteContact={deleteContact} />
        )}
    </div>
  )

}

export default App