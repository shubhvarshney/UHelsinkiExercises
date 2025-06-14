import { createContext, useReducer } from "react";

const messageReducer = (state, action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return { message: action.payload.message, error: action.payload.error };
    case "REMOVE_MESSAGE":
      return { message: null, error: false };
    default:
      return state;
  }
};

const MessageContext = createContext();

export const MessageContextProvider = (props) => {
  const [messageObject, messageDispatch] = useReducer(messageReducer, {
    message: "",
    error: false,
  });
  const message = messageObject.message;
  const error = messageObject.error;
  return (
    <MessageContext.Provider value={[message, error, messageDispatch]}>
      {props.children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
