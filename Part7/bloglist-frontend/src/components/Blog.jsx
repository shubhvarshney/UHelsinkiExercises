import { useState } from "react";
import { Button, TextField, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Card, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment';

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
      <div>
      <TableContainer component={Card} className="blog">
        <Table>
          <TableHead>
              <TableRow>
                <TableCell align="left">
                  <h2>{blog.title}</h2>
                </TableCell>
                <TableCell align="right" >  
                  <h2>By {blog.author}</h2>
                </TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="left">More Info:</TableCell>
              <TableCell align="right"> <a href={blog.url}>{blog.url}</a> </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Likes:</TableCell>
              <TableCell align="right">
                <p>
                  {blog.likes} <Button style = { { marginLeft: 20 } } variant="outlined" onClick={handleLike}>like</Button>
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">
                Added By: 
              </TableCell>
              <TableCell align="right">
                <p>{blog.user.name}</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <h3>Comments</h3>
        <form onSubmit={handleComment}>
          <TextField
            label="Comment"
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <div>
            <Button style={ { marginTop: 10 } } variant="contained" type="submit">add comment</Button>
          </div>
        </form>
        <List>
          {blog.comments.map((c) => (
            <ListItem key={c}>
              <ListItemIcon>
                <CommentIcon  />
              </ListItemIcon>
              <ListItemText>
                {c}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        {blog.user.id.toString() === user.id.toString() ? (
          <Button
            variant="outlined"
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
