import { useState } from 'react'

const Heading = (props) => {
  return (
    <>
      <h1>{props.text}</h1>
    </>
  )
}

const Button = (props) => {
  return (
    <>
      <button onClick={props.onClick}>{props.text}</button>
    </>
  )
}

const Display = (props) => {
  return (
    <>
      <p>{props.anecdote}</p>
      <p>has {props.votes} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const handleNextClick = () => {
    let n = anecdotes.length
    setSelected(Math.floor(Math.random() * n))
  }

  const handleVoteClick = () => {
    const copy = {...votes}
    copy[selected] += 1
    setVotes(copy)
  }

  const getMaxIndex = () => {
    let maxIndex = 0
    for (let i = 1; i < anecdotes.length; i++) {
      if (votes[i] > votes[maxIndex]) {
        maxIndex = i
      }
    }
    return maxIndex
  }

  let maxSelected = getMaxIndex()

  return (
    <>
      <Heading text={"Anecdote of the day"} />
      <Display anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={handleVoteClick} text={"vote"} />
      <Button onClick={handleNextClick} text={"next anecdote"} />
      <Heading text={"Anecdote with most votes"} />
      <Display anecdote={anecdotes[maxSelected]} votes={votes[maxSelected]} />
    </>
  )
}

export default App