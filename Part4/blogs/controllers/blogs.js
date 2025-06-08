const blogsRouter = require('express').Router()
const middleware  = require('../utils/middleware')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { 'username': 1, 'name': 1 })
    return response.json(blogs)
  } catch {
    return response.status(404).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  try {
    if (!request.user) {
      return response.status(400).json({ error: 'userId missing or not valid'})
    }

    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
      await user.save()
      return response.status(400).json({ error: 'blog missing or not valid'})
    }

    if (user.id.toString() !== blog.user.toString()) {
      return response.status(401).json({ error: 'unauthorized user'})
    }

    const result = await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(b => b.toString() !== result.id)
    await user.save()
    return response.status(204).end()
  } catch (error) {
    if (error.name ===  'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid'})
    } else {
      return response.status(400).json({ error: error.message })
    }
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  try {
    if (!request.user) {
      return response.status(400).json({ error: 'userId missing or not valid'})
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'no updated blog provided' })
    }

    response.status(200).json(updatedBlog)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const blog = new Blog(request.body)

  try {

    if (!request.user) {
      return response.status(400).json({ error: 'userId missing or not valid'})
    }

    const user = request.user 

    const blogObject = new Blog({ title: blog.title, author: blog.author, url: blog.url, likes: blog.likes, user: user.id })
    const result = await blogObject.save()
    user.blogs = user.blogs.concat(result.id)
    await user.save()
    return response.status(201).json(result)
    
  } catch (error) {
    if (error.name === "ValidationError") {
      return response.status(400).end()
    } else if (error.name ===  'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid'})
    } else {
      return response.status(400).json({ error: error.message })
    }
  }
  
})

module.exports = blogsRouter