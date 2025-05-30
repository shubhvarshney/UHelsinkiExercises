const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
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

    const listWithMultipleBlogsDupe = [
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
            likes: 10000,
            __v: 0
        }

    ]

    test('of an empty list is null', () => {
        const result = listHelper.favoriteBlog(listWithNoBlog)
        assert.deepStrictEqual(result, null)
    })

    test('when list has only one blog, equals that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, listWithOneBlog[0])
    })

    test('of a bigger list has the most likes', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        assert.deepStrictEqual(result, listWithMultipleBlogs[1])
    })

    test('of a bigger list with multiple blogs with the most likes works with either solution', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogsDupe)
        
        try {
            assert.deepStrictEqual(result, listWithMultipleBlogsDupe[1])
        } catch {
            assert.deepStrictEqual(result, listWithMultipleBlogsDupe[2])
        }

    })
})