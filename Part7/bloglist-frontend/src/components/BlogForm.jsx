import { useState } from "react";
import { Button, TextField } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = { title: title, author: author, url: url };
    createBlog(blogObject);
    setTitle("");
    setAuthor("");
    setUrl("");
  };
  return (
    <form onSubmit={addBlog}>
      <div>
        <div>
          <TextField
            label="title"
            type="text"
            value={title}
            style={ { marginBottom: 10 } }
            onChange={({ target }) => setTitle(target.value)}
            id="blog-title"
            data-testid="title"
          />
        </div>
        <div>
          <TextField
            label="author"
            type="text"
            value={author}
            style={ { marginBottom: 10 } }
            onChange={({ target }) => setAuthor(target.value)}
            id="blog-author"
            data-testid="author"
          />
        </div>
        <div>
          <TextField
            label="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id="blog-url"
            data-testid="url"
          />
        </div>
      </div>
      <Button style={ { marginTop: 20, marginBottom: 20 } }variant='contained' type="submit">create</Button>
    </form>
  );
};

export default BlogForm;
