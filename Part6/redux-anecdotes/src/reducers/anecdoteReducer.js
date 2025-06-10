import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const anecdote = action.payload
      return state.concat({
        content: anecdote.content,
        id: anecdote.id,
        votes: anecdote.votes
      })
    },
    addVote(state, action) {
      const id = action.payload
      return state.map(a =>
        a.id === id 
        ? { ...a, votes: a.votes + 1 }
        : a
      )
    }, 
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { createAnecdote, addVote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addNewAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const addNewVote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.vote(anecdote)
    dispatch(addVote(newAnecdote.id))
  }
}

export default anecdoteSlice.reducer