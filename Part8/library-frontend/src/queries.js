import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id,
      name,
      born,
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query getBooks($genre: String) {
    allBooks (
      genre: $genre
    ) {
      id,
      title,
      published,
      author {
        name
      },
      genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation addNewBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      id,
      title,
      published,
      author {
        name
      },
      genres
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editNumber($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name
      setBornTo: $setBornTo
    ) {
      name,
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const USER = gql`
  query {
    me {
      id,
      username,
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id,
      title,
      published,
      author {
        name
      },
      genres
    }
  }
`