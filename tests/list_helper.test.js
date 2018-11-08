const blogs = require('./blogs')
const listHelper = require('../utils/list_helper')

describe.skip('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const listWithOneBlog = []
    listWithOneBlog.push(blogs[0])
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(7)
  })

  test('when list is empty equals 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has many blogs is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe.skip('favorite blog', () => {
  test('when list is empty returns undefined', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBeUndefined()
  })

  test('when list has only one blog equals that blog', () => {
    const listWithOneBlog = []
    listWithOneBlog.push(blogs[0])
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('when list has many blogs is calculated right', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe.skip('most blogs', () => {
  test('when list is empty return undefined', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBeUndefined()
  })

  test('when list has only one blog has that blogs author', () => {
    const listWithOneBlog = []
    listWithOneBlog.push(blogs[0])
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('when list has many blogs is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe.skip('most likes', () => {
  test('when list is empty returns undefined', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBeUndefined()
  })

  test('when list has only one blog has that blogs author', () => {
    const listWithOneBlog = []
    listWithOneBlog.push(blogs[0])
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('when list has many blogs is calculated right', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})