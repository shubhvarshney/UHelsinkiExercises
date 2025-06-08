import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = { title: title, author: author, url: url }
    createBlog(blogObject)
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <form onSubmit={ addBlog }>
      <div>
        <div>
          title: <input type="text" value={ title } name="Title" onChange={ ({ target }) => setTitle(target.value) } id="blog-title" data-testid='title'/>
        </div>
        <div>
          author: <input type="text" value={ author } name="Author" onChange={ ({ target }) => setAuthor(target.value) } id="blog-author" data-testid='author' />
        </div>
        <div>
          url: <input type="text" value={ url } name="Url" onChange={ ({ target }) => setUrl(target.value) } id="blog-url" data-testid='url' />
        </div>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm