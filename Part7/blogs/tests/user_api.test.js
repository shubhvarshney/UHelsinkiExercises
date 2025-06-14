const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [{
    username: "shubhvarshney",
    name: "Shubh Varshney",
    password: "v3ryS3cur3"
}]

beforeEach(async () => {
    await User.deleteMany({})
    for (let user of initialUsers) {
        const userObject = new User(user)
        await userObject.save()
    }

})

describe('adding a new user', () => {
    test('fails with status code 400 and error message if username not provided', async () => {
        let users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const userToAdd = {
            name: "John Doe",
            password: "password"
        }

        const result = await api.post('/api/users').send(userToAdd).expect(400).expect('Content-Type', /application\/json/)
        
        users = await User.find({})
        const usersAtEnd = users.map(u => u.toJSON())
        assert(result.body.error.includes('Path `username` is required'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)

    })

    test('fails with status code 400 and error message if username too short', async () => {
        let users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const userToAdd = {
            username: "us",
            name: "John Doe",
            password: "password"
        }

        const result = await api.post('/api/users').send(userToAdd).expect(400).expect('Content-Type', /application\/json/)
        
        users = await User.find({})
        const usersAtEnd = users.map(u => u.toJSON())

        assert(result.body.error.includes('is shorter than the minimum allowed length'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('fails with status code 400 and error message if username not unique', async () => {
        let users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const userToAdd = {
            username: "shubhvarshney",
            name: "John Doe",
            password: "password"
        }

        const result = await api.post('/api/users').send(userToAdd).expect(400).expect('Content-Type', /application\/json/)
        
        users = await User.find({})
        const usersAtEnd = users.map(u => u.toJSON())

        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('fails with status code 400 and error message if password not provided', async () => {

        let users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const userToAdd = {
            username: "user1337",
            name: "John Doe",
        }

        const result = await api.post('/api/users').send(userToAdd).expect(400).expect('Content-Type', /application\/json/)
        
        users = await User.find({})
        const usersAtEnd = users.map(u => u.toJSON())

        assert(result.body.error.includes('Path `password` is required'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('fails with status code 400 and error message if password too short', async () => {

        let users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const userToAdd = {
            username: "user1337",
            name: "John Doe",
            password: "pa"
        }

        const result = await api.post('/api/users').send(userToAdd).expect(400).expect('Content-Type', /application\/json/)
        
        users = await User.find({})
        const usersAtEnd = users.map(u => u.toJSON())

        assert(result.body.error.includes('is shorter than the minimum allowed length'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('succeeds with status code 201 for proper data', async () => {

        let users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const userToAdd = {
            username: "uniqueUser333",
            name: "John Doe",
            password: "password"
        }

        const result = await api.post('/api/users').send(userToAdd).expect(201).expect('Content-Type', /application\/json/)
        
        users = await User.find({})
        const usersAtEnd = users.map(u => u.toJSON())

        assert.strictEqual( usersAtEnd.length, usersAtStart.length + 1)
        assert(usersAtEnd.find(u => u.username === userToAdd.username))
    })
})

after(async () => {
    await mongoose.connection.close()
})