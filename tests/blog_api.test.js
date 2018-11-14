const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper')


describe('when there is initially some blogs saved', async () => {

  beforeAll(async () => {
    await Blog.remove()

    const blogObjects = initialBlogs.map(b => new Blog(b))
    await Promise.all(blogObjects.map(b => b.save()))
  })

  describe('GET /api/blogs', async () => {
    test('all blogs are returned as json', async () => {
      const blogsInDatabase = await blogsInDb()

      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(blogsInDatabase.length)

      const returnedTitles = response.body.map(blog => blog.title)
      blogsInDatabase.forEach(blog => {
        expect(returnedTitles).toContain(blog.title)
      })
    })
  })

  describe('POST /api/blogs', async () => {
    test('a valid blog can be added', async () => {
      const blogsAtStart = await blogsInDb()

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

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      const titles = blogsAfterOperation.map(b => b.title)
      expect(titles).toContain('New Blog')
    })

    test('a blog without likes set is added with 0 likes', async () => {
      const newBlogWithoutLikes = {
        title: 'New Blog without likes',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
      }

      const blogsAtStart = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      const addedBlog = blogsAfterOperation.find(blog => blog.title === 'New Blog without likes')

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      expect(addedBlog).not.toBeUndefined()
      expect(addedBlog.likes).toBe(0)

    })

    test('a blog without title is not added', async () => {
      const newBlog = {
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
      }

      const blogsAtStart = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })

    test('a blog without url is not added', async () => {
      const newBlog = {
        title: 'Testi 1',
        author: 'Edsger W. Dijkstra',
        likes: 5
      }

      const blogsAtStart = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
  })

  describe('DELETE /api/blogs/:id', async () => {
    let addedBlog = null

    beforeAll(async () => {
      addedBlog = new Blog({
        title: 'delete',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
      })
      await addedBlog.save()
    })

    test('succeeds with proper statuscode', async () => {
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(204)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(b => b.title)

      expect(titles).not.toContain(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
  })

  describe.only('when there is initially one user at db', async () => {
    beforeAll(async () => {
      await User.remove({})
      const user = new User({ username: 'root', password: 'salainen' })
      await user.save()
    })

    test('POST /api/users succeeds with a fresh username', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'antjuntu',
        name: 'Antti Juntunen',
        password: 'salasana'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
      const usernames = usersAfterOperation.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual({ error: 'username must be unique' })
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('password length must be at least 3', async () => {
      const usersBeforeOperation = await usersInDb()

      const newUser = {
        username: 'Kekkonen',
        name: 'Urho Kaleva Kekkonen',
        password: 'sa'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toEqual({ error: 'password length must be at least 3' })
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
  })

  afterAll(() => {
    server.close()
  })
})


