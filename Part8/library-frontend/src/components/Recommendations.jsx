import { useEffect } from 'react'
import { USER, ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'

const Recommendations = (props) => {
    const resultUser = useQuery(USER)

    const favoriteGenre = resultUser?.data?.me?.favoriteGenre

    const resultGenre = useQuery(ALL_BOOKS, {
        variables: { genre: favoriteGenre },
        skip: resultUser.loading
    })

    if (!props.show) {
        return null
    }

    if (resultUser.loading || resultGenre.loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <b>{favoriteGenre}</b></p>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {resultGenre.data.allBooks.map((b) => (
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                     ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations