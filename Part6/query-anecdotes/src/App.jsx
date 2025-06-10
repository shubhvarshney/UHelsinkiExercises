import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, updateAnecdote } from './services/anecdotes'
import { useContext } from 'react'
import NotificationContext from './components/NotificationContext'

const App = () => {
  const [message, messageDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const updatedAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a =>
        a.id === updatedAnecdote.id
        ? updatedAnecdote
        : a
      ))
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  } else if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    updatedAnecdoteMutation.mutate(newAnecdote)
    messageDispatch({
      type: 'SET_MESSAGE',
      payload: `anecdote '${newAnecdote.content}' voted`
    })

    setTimeout(() => {
      messageDispatch({ type: 'REMOVE_MESSAGE' })
    }, 5000)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
