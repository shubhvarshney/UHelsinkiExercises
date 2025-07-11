import { useState, useEffect } from 'react'
import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK }  from '../queries'
import { useMutation } from '@apollo/client'
import { updateCache } from '../App'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [addNewBook] = useMutation(ADD_BOOK, {
    update: (cache, response) => {
      response.data.addBook.genres.forEach((genre) => {
        updateCache(cache, { query: ALL_BOOKS, variables: { genre } }, response.data.addBook)
      })
    },
    refetchQueries: [ { query: ALL_BOOKS, variables: { genre: null } }, { query: ALL_AUTHORS } ]
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const publishedNumber = Number(published)
    addNewBook( { variables: { title, published: publishedNumber, author, genres } } )

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
    props.setPage('books')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook