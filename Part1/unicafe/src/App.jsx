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
      <button onClick={props.onClick}>
        {props.text}
      </button>
    </>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      <td>
        {props.text}
      </td>
      <td>
        {props.value}
      </td>
    </>
  )
}

const Statistics = ({good, neutral, bad}) => {
  let all = good + neutral + bad
  let average = (good * 1 + bad * -1) / all
  let positive = (good / all) * 100

  if (all > 0) {
    return (
      <>
        <table>
          <tbody>
            <tr>
              <StatisticLine text={"good"} value={good} />
            </tr>
            <tr>
              <StatisticLine text={"neutral"} value={neutral} />
            </tr>
            <tr>
              <StatisticLine text={"bad"} value={bad} />
            </tr>
            <tr>
              <StatisticLine text={"all"} value={all} />
            </tr>
            <tr>
              <StatisticLine text={"average"} value={average} />    
            </tr>
            <tr>
              <StatisticLine text={"positive"} value={positive + " %"} />  
            </tr>
          </tbody>
        </table>
      </>
    )
  } else {
    return (
      <p>No feedback given</p>
    )
  }
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <>
      <Heading text={"give feedback"} />
      <Button onClick={handleGoodClick} text={"good"} />
      <Button onClick={handleNeutralClick} text={"neutral"} />
      <Button onClick={handleBadClick} text={"bad"} />
      <Heading text={"statistics"} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App