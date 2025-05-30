const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    sumLikes = blogs.reduce((a, b) => a + b.likes, 0)
    return blogs.length === 0 ? 0 : sumLikes
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0 ? null : blogs.find(blog => blog.likes === (Math.max(...blogs.map(blog => blog.likes))))
}

const mostBlogs = (blogs) => {
    authorMap = {}
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].author in authorMap) {
            authorMap[blogs[i].author] += 1
        } else {
            authorMap[blogs[i].author] = 1
        }
    }
    
    authorList = []
    for (const [key, value] of Object.entries(authorMap)) {
        authorList.push({ author: key,  blogs: value })
    }

    return blogs.length === 0 ? null : authorList.find(author => author.blogs === (Math.max(...authorList.map(author => author.blogs))))
}

const mostLikes = (blogs) => {
    authorMap = {}

    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].author in authorMap) {
            authorMap[blogs[i].author] += blogs[i].likes
        } else {
            authorMap[blogs[i].author] = blogs[i].likes
        }
    }
    
    authorList = []
    for (const [key, value] of Object.entries(authorMap)) {
        authorList.push({ author: key,  likes: value })
    }

    return blogs.length === 0 ? null : authorList.find(author => author.likes === (Math.max(...authorList.map(author => author.likes))))
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}