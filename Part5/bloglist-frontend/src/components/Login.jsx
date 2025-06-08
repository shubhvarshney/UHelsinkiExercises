import PropTypes from 'prop-types'

const Login = (props) => {
  return (
    <form onSubmit={ props.handleLogin }>
      <div>
        username { ' ' }
        <input
          type='text'
          value={ props.username }
          name='Username'
          onChange={ ({ target }) => props.setUsername(target.value) }
          data-testid='username'
        />
      </div>
      <div>
        password { ' ' }
        <input
          type='password'
          value={ props.password }
          name='Password'
          onChange={ ({ target }) => props.setPassword(target.value) }
          data-testid='password'
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default Login