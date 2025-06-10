import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessage(state, action) {
            const message = action.payload
            return message
        },
        removeMessage(state, action) {
            return ''
        }
    }
})

export const { setMessage, removeMessage } = notificationSlice.actions

export const setNotification = (message, seconds) => {
    return async dispatch => {
      dispatch(setMessage(message))
      setTimeout(() => {
      dispatch(removeMessage())
      }, seconds * 1000)
    }
}

export default notificationSlice.reducer