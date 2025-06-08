const Message = ({ message, error }) => {
  if (message.length === 0) {
    return (<div></div>)
  } else {
    return (
      <div>
        <p className='message' id={ error ? 'error' : 'notification' }>{ message }</p>
      </div>
    )
  }
}

export default Message