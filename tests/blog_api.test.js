const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Testi 1',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Testi 2',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }
]

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blogObj => blogObj.save())
  await Promise.all(promiseArray)
})

describe('GET /api/blogs', async () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain('Testi 1')
  })
})

describe('POST /api/blogs', async () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 19
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('New Blog')
  })

  test('a blog without likes set is added with 0 likes', async () => {
    const newBlogWithoutLikes = {
      title: 'New Blog without likes',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const addedBlog = response.body.find(blog => blog.title === 'New Blog without likes')

    expect(addedBlog).not.toBeUndefined()
    expect(addedBlog.likes).toBe(0)
  })

  test('a blog without title is not added', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    }

    const blogsBefore = await api.get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfter = await api.get('/api/blogs')

    expect(blogsAfter.body.length).toBe(blogsBefore.body.length)
  })

  test('a blog without url is not added', async () => {
    const newBlog = {
      title: 'Testi 1',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    const blogsBefore = await api.get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfter = await api.get('/api/blogs')

    expect(blogsAfter.body.length).toBe(blogsBefore.body.length)
  })
})

afterAll(() => {
  server.close()
})