import { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!props.show) {
    return null
  }

  const authors = props.authors

  const changeNumber = (event) => {
    event.preventDefault()

    const bornNumber = Number(born)
    props.editNumber({ variables: { name, setBornTo: bornNumber } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={changeNumber}>
        <div>
          name
          <select value={name} onChange={({target}) => setName(target.value)}>
            <option value=''>Select an author</option>
            {authors.map((a) => (
            <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          born
          <input value={born} onChange={({target}) => setBorn(target.value)}/>
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
