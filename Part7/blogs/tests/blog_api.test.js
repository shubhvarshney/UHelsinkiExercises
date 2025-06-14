const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialBlogs = [
    {
        title: "Pristine Places In The World",
        author: "Shubh Varshney",
        url: "https://shubhvarshney.com/blogs/foo",
        likes: 10000
    },
    {
        title: "How To Walk Your Dog",
        author: "Christina Applesauce",
        url: "https://christinaapplesauce.com/blogs/1337",
        likes: 1
    }

]

const initialUser = {
    username: "shubhvarshney",
    name: "Shubh Varshney",
    password: "v3ryS3cur3"
}

beforeEach(async () => {
    await User.deleteMany({})
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(initialUser.password, saltRounds)
    const userObject = new User({ username: initialUser.username, name: initialUser.name, passwordHash })
        
    await Blog.deleteMany({})
    for (let blog of initialBlogs) {
        const blogObject = new Blog({ title: blog.title, author: blog.author, url: blog.url, likes: blog.likes, user: userObject.id })
        await blogObject.save()
        userObject.blogs = userObject.blogs.concat(blogObject.id)
        await userObject.save()
    }
})

describe('accessing all the blogs', () => {
    test('the blogs are returned successfully as json, with the right amount', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('the unique identifier property of the blog posts is named id, not _id', async () => {
        const response = await api.get('/api/blogs')

        for (blog of response.body) {
            assert('id' in blog && !('_id' in blog))
        }
    })
})

describe('adding a new blog', () => {
    test('fails with status code 401 if a token is not provided', async() => {

        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, initialBlogs.length)

    })

    test('blogs are successfully added using post', async () => {
        const loginResponse = await api.post('/api/login').send({ username: initialUser.username, password: initialUser.password })
        const token = `Bearer ${loginResponse.body.token}`
        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({ Authorization: token })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const contents = response.body.find(r => {
            return (r.author === newBlog.author && r.title === newBlog.title && r.url === newBlog.url && r.likes === newBlog.likes)
        })

        assert.strictEqual(response.body.length, initialBlogs.length + 1)
        assert(contents !== null)
    })

    test('if no likes are provided, a default value of 0 is given', async () => {
        const loginResponse = await api.post('/api/login').send({ username: initialUser.username, password: initialUser.password })
        const token = `Bearer ${loginResponse.body.token}`

        const newBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({ Authorization: token })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const contents = response.body.find(r => {
            return (r.author === newBlog.author && r.title === newBlog.title && r.url === newBlog.url)
        })

        assert(contents.likes === 0)
    })

    test('if no title or url provided, responds with status code 400 (bad request)', async () => {
        const loginResponse = await api.post('/api/login').send({ username: initialUser.username, password: initialUser.password })
        const token = `Bearer ${loginResponse.body.token}`
        
        const newBlogNoTitle = {
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
        }

        const newBlogNoUrl = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(newBlogNoTitle)
            .set({ Authorization: token })
            .expect(400)

        await api
            .post('/api/blogs')
            .send(newBlogNoUrl)
            .set({ Authorization: token })
            .expect(400)
    })
})

describe('deleting a blog', () => {
    test('successfully removes the blog post resource with status code 204 if id is valid', async () => {
        const loginResponse = await api.post('/api/login').send({ username: initialUser.username, password: initialUser.password })
        const token = `Bearer ${loginResponse.body.token}`

        let blogs = await Blog.find({})
        const blogsAtStart = blogs.map(b => b.toJSON())
        const blogToDelete = blogsAtStart[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`).set({ Authorization: token }).expect(204)

        blogs = await Blog.find({})
        const blogsAtEnd = blogs.map(b => b.toJSON())
        const urls = blogsAtEnd.map(b => b.url)
        assert(!urls.includes(blogToDelete.url))
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)
    })

    test('fails with status  code 400 if deleting with an invalid id', async () => {
        const loginResponse = await api.post('/api/login').send({ username: initialUser.username, password: initialUser.password })
        const token = `Bearer ${loginResponse.body.token}`

        let blogs = await Blog.find({})
        const blogsAtStart = blogs.map(b => b.toJSON())
        
        await api
            .delete(`/api/blogs/fakeidfoo`)
            .set({ Authorization: token })
            .expect(400)

        blogs = await Blog.find({})
        const blogsAtEnd = blogs.map(b => b.toJSON())
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
})

describe('updating a blog post', () => {
    test('successfully updates single pieces of information for a valid id', async () => {
        const loginResponse = await api.post('/api/login').send({ username: initialUser.username, password: initialUser.password })
        const token = `Bearer ${loginResponse.body.token}`

        let blogs = await Blog.find({})
        const blogsAtStart = blogs.map(b => b.toJSON())

        let blogToUpdate = blogsAtStart[0]
        const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 5 }

        const result = await api.put(`/api/blogs/${updatedBlog.id}`).set({ Authorization: token }).send(updatedBlog).expect(200)

        blogs = await Blog.find({})
        const blogsAtEnd = blogs.map(b => b.toJSON())
        updatedBlog.user = updatedBlog.user.toString()

        assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
        assert.deepStrictEqual(result.body, updatedBlog)
    })

    test('successfully updates multiple pieces of information for a valid id', async () => {
        const loginResponse = await api.post('/api/login').send({ username: initialUser.username, password: initialUser.password })
        const token = `Bearer ${loginResponse.body.token}`

        let blogs = await Blog.find({})
        const blogsAtStart = blogs.map(b => b.toJSON())

        let blogToUpdate = blogsAtStart[0]
        const updatedBlog = { ...blogToUpdate, author: "F. Scott Fitzgerald", likes: blogToUpdate.likes + 5 }

        const result = await api.put(`/api/blogs/${updatedBlog.id}`).set({ Authorization: token }).send(updatedBlog).expect(200)

        blogs = await Blog.find({})
        const blogsAtEnd = blogs.map(b => b.toJSON())
        updatedBlog.user = updatedBlog.user.toString()

        assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
        assert.deepStrictEqual(result.body, updatedBlog)
    })

    test('fails with status code 400 if updating at an invalid id', async () => {
        const loginResponse = await api.post('/api/login').send({ username: initialUser.username, password: initialUser.password })
        const token = `Bearer ${loginResponse.body.token}`

        let blogs = await Blog.find({})
        const blogsAtStart = blogs.map(b => b.toJSON())

        let blogToUpdate = blogsAtStart[0]
        const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 5 }

        await api.put(`/api/blogs/fakeFooBar`, updatedBlog).set({ Authorization: token }).expect(400)
    })
})


after(async () => {
    await mongoose.connection.close()
})