import { useState } from "react";
import { Button, TextField, TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material'

const Blog = ({ blog, updateBlog, deleteBlog, addComment, user }) => {
  const [comment, setComment] = useState("");
  const handleLike = () => {
    const blogObject = { ...blog, likes: blog.likes + 1, user: blog.user.id };
    updateBlog(blogObject);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  const handleComment = async () => {
    event.preventDefault();
    await addComment(blog.id, comment);
    setComment("");
  };

  if (blog) {
    return (
      <div className="blog">
        <h2>
          {blog.title} by {blog.author}
        </h2>
        <a href={blog.url}>{blog.url}</a>
        <p>
          likes {blog.likes} <Button style = { { marginLeft: 20 } } variant="outlined" onClick={handleLike}>like</Button>
        </p>
        <p>added by {blog.user.name}</p>
        <h3>comments</h3>
        <form onSubmit={handleComment}>
          <TextField
            label="Comment"
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button style={ { marginLeft: 10 } } variant="contained" type="submit">add comment</Button>
        </form>
        <ul>
          {blog.comments.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        {blog.user.id.toString() === user.id.toString() ? (
          <Button
            style={{
              backgroundColor: "#24A0ED",
              borderWidth: 1,
              borderRadius: 4,
              marginBottom: 1,
            }}
            onClick={handleRemove}
          >
            remove
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
};

export default Blog;
