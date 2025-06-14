const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
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
            likes: 10000,
            __v: 0
        },
        {
            _id: "683922e8654acb5875ed97f4",
            title: "How To Feed Your Cat",
            author: "Christina Applesauce",
            url: "https://christinaapplesauce.com/blogs/1336",
            likes: 900,
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
            likes: 10700,
            __v: 0
        },
        {
            _id: "683922e8652acb5875ede7f4",
            title: "How To Walk Your Dog",
            author: "Christina Applesauce",
            url: "https://christinaapplesauce.com/blogs/1337",
            likes: 10000,
            __v: 0
        },
        {
            _id: "683922e8654acb5875ed97f4",
            title: "How To Feed Your Cat",
            author: "Christina Applesauce",
            url: "https://christinaapplesauce.com/blogs/1336",
            likes: 900,
            __v: 0
        },
        {
            _id: "673902e8654acb5875ed97f5",
            title: "The 7 Wonders of the Ancience World",
            author: "Shubh Varshney",
            url: "https://shubhvarshney.com/blogs/123",
            likes: 200,
            __v: 0
        }
    ]

    test('of an empty list is null', () => {
        const result = listHelper.mostLikes(listWithNoBlog)
        assert.deepStrictEqual(result, null)
    })

    test('when list has only one blog is the author of that blog and their likes', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 5 })
    })

    test('of a bigger list has the author with most total likes', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        assert.deepStrictEqual(result, { author: "Christina Applesauce", likes: 10900 })
    })

    test('of a bigger list with multiple authors with the most likes still works', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogsDupe)
        try {
            assert.deepStrictEqual(result, { author: "Christina Applesauce", likes: 10900 })
        } catch {
            assert.deepStrictEqual(result, { author: "Shubh Varshney", likes: 10900 })
        }
    })
})