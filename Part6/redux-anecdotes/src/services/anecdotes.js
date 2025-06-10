import axios from 'axios'

const baseURL = '/api/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseURL)
    return response.data
}

const createNew = async (anecdote) => {
    const anecdoteObject = {
        content: anecdote,
        votes: 0
    }
    const response = await axios.post(baseURL, anecdoteObject)
    return response.data
}

const vote = async (anecdote) => {
    const url = `${baseURL}/${anecdote.id}`
    const anecdoteObject = {
        ...anecdote,
        votes: anecdote.votes + 1
    }
    const response = await axios.put(url, anecdoteObject)
    return response.data
}

export default { getAll, createNew, vote }