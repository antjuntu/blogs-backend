const totalLikes = (blogs) => {
  const likes = blogs.reduce((accumulator, current) => {
    return accumulator + current.likes
  }, 0)
  return likes
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return undefined
  }

  let maxLikes = 0
  let maxIndex = 0
  blogs.forEach((blog, index) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      maxIndex = index
    }
  })
  return {
    title: blogs[maxIndex].title,
    author: blogs[maxIndex].author,
    likes: blogs[maxIndex].likes
  }
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return undefined
  }

  const authors = blogs.reduce((authors, currentBlog) => {
    if (currentBlog.author in authors) {
      authors[currentBlog.author]++
    } else {
      authors[currentBlog.author] = 1
    }
    return authors
  }, {})
  const authorList = []
  for (const author in authors) {
    authorList.push({
      author: author,
      blogs: authors[author]
    })
  }
  return authorList.sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return undefined
  }

  const authors = blogs.reduce((authors, currentBlog) => {
    if (currentBlog.author in authors) {
      authors[currentBlog.author] += currentBlog.likes
    } else {
      authors[currentBlog.author] = currentBlog.likes
    }
    return authors
  }, {})

  const authorList = []
  for (const author in authors) {
    authorList.push({
      author: author,
      likes: authors[author]
    })
  }
  return authorList.sort((a, b) => b.likes - a.likes)[0]
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}