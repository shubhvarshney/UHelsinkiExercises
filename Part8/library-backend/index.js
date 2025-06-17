const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected')
  })
  .catch((error) => {
    console.log('error:', error.message)
  })

/* 

 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type User {
    username: String!,
    favoriteGenre: String!,
    id: ID!
  } 
  type Token {
    value: String!
  }
  type Author {
    name: String!,
    id: ID!,
    born: Int
    bookCount: Int,
  }
  type Book {
    title: String!,
    published: Int,
    author: Author,
    id: ID!,
    genres: [String]
  }
  type Query {
    allAuthors: [Author]!,
    allBooks(author: String, genre: String): [Book]!,
    bookCount: Int!,
    authorCount: Int!
    me: User
  }
  type Mutation {
    addBook (
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book
    editAuthor (
      name: String!,
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Author: {
    bookCount: async (root) => (await Book.find({ author: root._id })).length
  },
  Query: {
    allAuthors: async () => Author.find({}),
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

      try {
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
        book.author = author._id
        await book.save()
      } catch (error) {
        if (error.name === 'ValidationError') {
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
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})