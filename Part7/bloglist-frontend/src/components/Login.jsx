import PropTypes from "prop-types";
import { Container, Button, TextField } from '@mui/material'

const Login = (props) => {
  return (
    <Container align="center">
      <h2> Log in to Blog Application </h2>
      <form onSubmit={props.handleLogin}>
        <div style={ { paddingBottom: 20 } }>
          <TextField
            label="username"
            type="text"
            value={props.username}
            onChange={({ target }) => props.setUsername(target.value)}
            data-testid="username"
          />
        </div>
        <div style={ { paddingBottom: 20 } }>
          <TextField
            label="password"
            type="password"
            value={props.password}
            onChange={({ target }) => props.setPassword(target.value)}
            data-testid="password"
          />
        </div>
        <Button variant="contained" type="submit">login</Button>
      </form>
    </Container>
  );
};

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default Login;
