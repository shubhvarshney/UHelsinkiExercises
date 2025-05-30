const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    const listWithNoBlog = []
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
        }
    ]
    const listWithMultipleBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: "68391d5cfa816af764f8ed4e",
            title: "Pristine Places In The World",
            author: "Shubh Varshney",
            url: "https://shubhvarshney.com/blogs/foo",
            likes: 10000,
            __v: 0
        },
        {
            _id: "683922e8652acb5875ede7f4",
            title: "How To Walk Your Dog",
            author: "Christina Applesauce",
            url: "https://christinaapplesauce.com/blogs/1337",
            likes: 1,
            __v: 0
        }
    ]

    test('of an empty list is zero', () => {
        const result = listHelper.totalLikes(listWithNoBlog)
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        assert.strictEqual(result, 10006)
    })
})