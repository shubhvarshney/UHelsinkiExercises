const typeDefs = `
  type Subscription {
    bookAdded: Book!,
  }
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

module.exports = typeDefs