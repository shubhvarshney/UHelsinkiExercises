import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { Link } from "react-router-dom";
import { TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material'

const Blogs = ({ blogs, createBlog, blogFormRef }) => {

  return (
    <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      <TableContainer component={Paper} >
        <Table>
          <TableBody>
        {blogs.map((blog) => (
          <TableRow key={blog.id}>
            <TableCell>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title}
              </Link>
            </TableCell>
            <TableCell align="right" >
              {blog.author}
            </TableCell>
          </TableRow>
        ))}
          </TableBody>
        </Table>
      </TableContainer >
    </div>
  );
};

export default Blogs;
