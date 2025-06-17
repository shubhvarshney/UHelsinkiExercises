
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Author: {
    bookCount: async (root) => root.books.length
  },
  Query: {
    allAuthors: async () => Author.find({}).populate('books'),
    allBooks: async (root, args) => {
      let filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = args.genre
      }

      return Book.find(filter).populate('author')
    },
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    me: async (root, args, context) => context.currentUser
  },

  Mutation: {
    addBook: async (root, args, context) => {

      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const book = new Book({ ...args })
      let author = await Author.findOne({ name: args.author })
      let createdAuthor = false

      try {
        
        if (!author) {
          author = new Author({ name: args.author, books: [] })
          await author.save()
          createdAuthor = true
        }

        book.author = author._id
        await book.save()

        author.books = author.books.concat(book._id)
        await author.save()

      } catch (error) {
        
        if (createdAuthor) {
          await Author.deleteOne({ _id: author._id })
        }

        if (error.code === 11000) {
          throw new GraphQLError('Book title must be unique.', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
            }
          })
        } else if (error.name === 'ValidationError') {
          throw new GraphQLError(`Adding book failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
            }
          })
        } else {
          throw new GraphQLError('Internal server error', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              error
            }
          })
        }
      }

      const populatedBook = await book.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook})

      return Book.findOne({ _id: book._id }).populate('author')
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      let updatedAuthor = await Author.findOne({ name: args.name })
      if (!updatedAuthor) {
        return null
      }
      updatedAuthor.born = args.setBornTo

      try {
        await updatedAuthor.save()
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError(`Changing birthyear failed: ${error.message}`, {
              extensions: {
                code: 'BAD_USER_INPUT',
                error
              }
          })
        } else {
          throw new GraphQLError('Internal server error', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              error
            }
          })
        }
      }
      return updatedAuthor
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }

      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password != 'password') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })    
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers