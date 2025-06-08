import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView] = useState(false)

  const toggleView = () => {
    setView(!view)
  }

  const handleLike = () => {
    const blogObject = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    updateBlog(blogObject)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  if (view) {
    return (
      <div style={blogStyle} className="blog" >
        <p>{blog.title} {blog.author} <button onClick={toggleView}>hide</button></p>
        <a href={blog.url}>{blog.url}</a>
        <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
        <p>{blog.user.name}</p>
        { blog.user.id.toString() === user.id.toString() ? <button style={{ backgroundColor: '#24A0ED', borderWidth: 1, borderRadius: 4, marginBottom: 1 }} onClick={handleRemove}>remove</button> : <div></div> }
      </div>
    )
  } else {
    return (
      <div style={blogStyle} className="blog" >
        {blog.title} {blog.author} <button onClick={toggleView}>view</button>
      </div>
    )
  }
}

export default Blog