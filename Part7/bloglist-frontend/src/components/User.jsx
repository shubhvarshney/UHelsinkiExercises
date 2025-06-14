import { Card, CardContent, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import BookIcon from '@mui/icons-material/Book';


const User = ({ user }) => {
  if (user) {
    return (
      <Card>
        <CardContent>
          <h2>{user.name}</h2>
        <List>
          <h3>Added Blogs</h3>
          {user.blogs.map((b) => (
            <ListItem key={b.id}>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText>
                {b.title}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        </CardContent>
      </Card>
    );
  }
};

export default User;
