import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR }  from '../queries'

const EditBirth = ({ authors, token }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')


  const [editNumber] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      console.log(messages)
    }
  })

  const changeNumber = (event) => {
    event.preventDefault()

    const bornNumber = Number(born)
    editNumber({ variables: { name, setBornTo: bornNumber } })

    setName('')
    setBorn('')
  }

  if (!token) {
    return <div></div>
  } else {
    return (
    <div>
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
}

const Authors = (props) => {
  const resultAuthors = useQuery(ALL_AUTHORS)
  
  if (!props.show) {
    return null
  }

  if (resultAuthors.loading) {
    return <div>loading...</div>
  } 

  const authors = resultAuthors.data.allAuthors

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
      <EditBirth authors={authors} token={props.token} />
    </div>
  )
}

export default Authors
