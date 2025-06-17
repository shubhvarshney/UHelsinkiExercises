import { useState, useEffect } from 'react'
import { useMutation, useApolloClient } from '@apollo/client'
import { LOGIN, USER } from '../queries'

const Login = ({ show, setToken, setPage }) => {
    const client = useApolloClient()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [login, result] = useMutation(LOGIN, {
      onError: (error) => {
        setError(error.graphQLErrors[0].message)
      },
    })

    useEffect(() => {
      if (result.data) {
        const token = result.data.login.value 
        setToken(token)
        client.resetStore()
        localStorage.setItem('library-token', token)
      }
    }, [result.data])

    const handleLogin = (event) => {
        event.preventDefault()
        login( { variables: { username, password } } )
        setPage('authors')
    }

    if (!show) {
        return <div></div>
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input value={username} onChange={({target}) => setUsername(target.value)}/>
                </div>
                <div>
                    password
                    <input type='password' value={password} onChange={({target}) => setPassword(target.value)}/>
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default Login