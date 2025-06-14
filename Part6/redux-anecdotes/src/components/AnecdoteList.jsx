import { useSelector, useDispatch } from 'react-redux'
import { addNewVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.filter === 'ALL' 
      ? state.anecdotes
      : state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
    ).toSorted((a, b) => b.votes - a.votes)
    
    const dispatch = useDispatch()

    const vote = (id) => {
      const anecdote = anecdotes.find(a => a.id === id)
      dispatch(addNewVote(anecdote))
      dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
              <div key={anecdote.id}>
                <div>
                  {anecdote.content}
                </div>
                <div>
                  has {anecdote.votes}
                  <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
              </div>
            )}
        </div>
    )
}

export default AnecdoteList