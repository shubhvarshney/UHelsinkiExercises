import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const resultBooks = useQuery(ALL_BOOKS, {
    variables: { genre }
  })
  const resultAllBooks = useQuery(ALL_BOOKS, {
    variables: { genre: null }
  })

  if (resultBooks.loading || resultAllBooks.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }

  const books = resultBooks.data.allBooks
  const genres = [...new Set(resultAllBooks.data.allBooks.flatMap(book => book.genres))]

  return (
    <div>
      <h2>books</h2>
      <div>in genre <b>{genre ? genre : "all"}</b></div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
