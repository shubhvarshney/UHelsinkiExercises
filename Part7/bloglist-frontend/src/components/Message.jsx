import { useContext } from "react";
import MessageContext from "./MessageContext.jsx";
import { Alert } from '@mui/material'

const Message = () => {
  const [message, error] = useContext(MessageContext);
  if (!message) {
    return <div></div>;
  } else {
    return (
      <div>
        <Alert style={ { marginBottom: 20 } } severity={error ? "error" : "success"}>
          {message}
        </Alert>
      </div>
    );
  }
};

export default Message;
