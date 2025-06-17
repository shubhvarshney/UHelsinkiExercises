import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login"
import Recommendations from "./components/Recommendations"
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const client = useApolloClient()

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
