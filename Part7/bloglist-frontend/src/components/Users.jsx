import { TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Card } from '@mui/material'
import { Link } from "react-router-dom";

const Users = ({ users }) => {
  return (
    <div>
      <TableContainer component={Card} >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <h2>Users</h2>
            </TableCell>
            <TableCell align="right" >
              <p>Blogs Created</p>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </TableCell>
              <TableCell align="right">{u.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
