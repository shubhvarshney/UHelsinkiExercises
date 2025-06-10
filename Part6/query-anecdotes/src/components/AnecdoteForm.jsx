import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'

const AnecdoteForm = () => {
  const [message, messageDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const newAnecdoteMutator = useMutation(
    {
      mutationFn: createAnecdote,
      onSuccess: (newAnecdote) => {
        const anecdotes = queryClient.getQueryData(['anecdotes'])
        queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      },
      onError: () => {
        messageDispatch({
          type: 'SET_MESSAGE',
          payload: `too short anecdote, must have length 5 or more`
        })

        setTimeout(() => {
          messageDispatch({ type: 'REMOVE_MESSAGE' })
        }, 5000)
      }
    })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutator.mutate({ content, votes: 0 })
    messageDispatch({
      type: 'SET_MESSAGE',
      payload: `anecdote '${content}' created`
    })

    setTimeout(() => {
      messageDispatch({ type: 'REMOVE_MESSAGE' })
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
