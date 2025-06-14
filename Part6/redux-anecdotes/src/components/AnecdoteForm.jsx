import { useDispatch } from 'react-redux'
import { addNewAnecdote } from '../reducers/anecdoteReducer'


const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = (event) => {
        event.preventDefault()
        const anecdote = event.target.anecdote.value 
        event.target.anecdote.value = ''
        dispatch(addNewAnecdote(anecdote))
        dispatch(setNotification(`new anecdote '${anecdote.content}'`, 5))
    }
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote} >
                <div><input name='anecdote' /></div>
                <button type='submit' >create</button>
             </form>
        </div>
    )
}

export default AnecdoteForm