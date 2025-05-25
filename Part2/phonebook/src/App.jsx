import { useState, useEffect } from 'react'
import personService from './services/persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Display from './components/Display'

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    personService.getAll().then(allPersons => { setPersons(allPersons) })
  }, [])

  const addDetails = (event) => {
    event.preventDefault()
    
    if ((persons.filter(person => person.name === newName)).length > 0) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const currPerson = persons.find(person => person.name == newName)
        const changedPerson = { ...currPerson, number: newNum }
        personService.update(currPerson.id, changedPerson).then(updatedPerson => {
          setPersons(persons.map(person => person.id === currPerson.id ? updatedPerson : person))
          setNewName('')
          setNewNum('')
        })
      }
    } else if (newName.length === 0 || newNum.length === 0) {
      alert(`Please enter a name and a number before continuing`)
    } else {
      const personObject = { name: newName, number: newNum }
      personService.create(personObject).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNum('')
      })
    }
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  
  const handleDeleteOf = (id) => {
    if (window.confirm(`delete ${persons.find(person => person.id === id).name}?`)) {
      personService.deletePerson(id).then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <h2>add a new</h2>
      <PersonForm addDetails={addDetails} newNum={newNum} newName={newName} handleNameChange={handleNameChange} handleNumChange={handleNumChange} />
      <h2>Numbers</h2>
      <Display persons={persons} search={search} handleDeleteOf={handleDeleteOf}/>
    </div>
  )
}

export default App