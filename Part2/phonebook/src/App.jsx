import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Display from './components/Display'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456'},
    { name: 'Ada Lovelace', number: '39-44-5323523'},
    { name: 'Dan Abramov', number: '12-43-234345'},
    { name: 'Mary Poppendieck', number: '39-23-6423122'}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [search, setSearch] = useState('')

  const addDetails = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNum}
    if ((persons.filter(person => person.name === newName)).length > 0) {
      alert(`${newName} is already added to phonebook`)
    } else if (newName.length === 0 || newNum.length === 0) {
      alert(`Please enter a name and a number before continuing`)
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNum('')
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

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <h2>add a new</h2>
      <PersonForm addDetails={addDetails} newNum={newNum} newName={newName} handleNameChange={handleNameChange} handleNumChange={handleNumChange} />
      <h2>Numbers</h2>
      <Display persons={persons} search={search} />
    </div>
  )
}

export default App