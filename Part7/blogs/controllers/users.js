const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    return response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!password) {
        return response.status(400).json({ error: 'Path `password` is required' })
    } else if (password.length < 3) {
        return response.status(400).json({ error: 'Path `password` is shorter than the minimum allowed length (3)' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    try {
        const userObject = new User({
            username,
            name,
            passwordHash
        })

        const savedUser = await userObject.save()

        return response.status(201).json(savedUser)
        
    } catch (error) {
        if (error.name === "ValidationError") {
            return response.status(400).json({ error: error.message })
        } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
            return response.status(400).json({ error: 'expected `username` to be unique'})
        }
    }
})

module.exports = usersRouter