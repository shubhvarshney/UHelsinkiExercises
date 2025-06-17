import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login"
import Recommendations from "./components/Recommendations"
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqById = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.id
      return seen.has(k) ? false : seen.add(k)
    })
  }

  const existingData = cache.readQuery(query)

  if (!existingData) {
    return
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqById(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      alert(`${addedBook.title} has been added`)
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
      addedBook.genres.forEach((genre) => {
        updateCache(client.cache, { query: ALL_BOOKS, variables: { genre } }, addedBook)
      })
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('library-token')
    if (token) {
      setToken(token)
    }
  }, [])

  const handleLogout = () => {
    setPage('authors')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        { !token 
          ?  <button onClick={() => setPage("login")}>login</button> 
          : <>
              <button onClick={() => setPage("add")}>add book</button>
              <button onClick={() => setPage("recs")}>recommended</button>
              <button onClick={handleLogout}>logout</button>
            </>
        }
      </div>

      <Authors show={page === "authors"} token={token}/>

      <Books show={page === "books"} />

      <NewBook show={page === "add"} setPage={setPage}/>

      <Login show={page === "login"} setToken={setToken} setPage={setPage} />

      <Recommendations show={page === "recs"} />
    </div>
  );
};

export default App;
