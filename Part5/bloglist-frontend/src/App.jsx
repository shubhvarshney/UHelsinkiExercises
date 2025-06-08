import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Message from './components/Message'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      setMessage('successfully logged in')
      setTimeout(() => {
        setMessage('')
      }, 3000)
    } catch (exception) {
      setUsername('')
      setPassword('')
      setMessage('wrong username or password')
      setError(true)
      setTimeout(() => {
        setMessage('')
        setError(false)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setMessage('successfully logged out')
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  const createBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setMessage(`a new blog ${response.title} by ${response.author} added`)
    } catch (exception) {
      setMessage('adding blog unsuccessful')
      setError(true)
    }
    blogFormRef.current.toggleVisibility()
    setTimeout(() => {
      setMessage('')
      setError(false)
    }, 3000)
  }

  const updateBlog = async (blogObject) => {
    try {
      const response = await blogService.update(blogObject)
      setBlogs(blogs.map(b => b.id !== response.id ? b : { ...response, user: b.user }))
      setMessage(`liked ${response.title} by ${response.author}`)
    } catch (exception) {
      setMessage('like unsuccessful')
      setError(true)
    }
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  const deleteBlog = async (id) => {
    try {
      const response = await blogService.deleteItem(id)
      setBlogs(blogs.filter(b => b.id !== id))
      setMessage('deleted blog successfully')
    } catch (exception) {
      setMessage('deleting blog unsuccessful')
      setError(true)
    }
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs([...blogs].sort((a, b) => b.likes - a.likes))
    )
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (user === null) {
    return (
      <div>
        <h2> log in to application </h2>
        <Message message={message} error={error} />
        <Login handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Message message={message} error={error} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button> </p>
      <h2>create new</h2>
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      </div>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />
        )}
      </div>
    </div>
  )
}

export default App