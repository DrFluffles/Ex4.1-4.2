const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog.js");
const assert = require("node:assert");

const api = supertest(app);

const testBlogs = [
  {
    title: "testblog1",
    author: "test author1",
    url: "test.com",
    likes: 5,
  },
  {
    title: "testblog2",
    author: "test author2",
    url: "test.com",
    likes: 10,
  },
];

test("Blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, 2);
});

test("get blog id", async () => {
    const response = await api.get("/api/blogs");
    for(let i = 0; i < response.body.length; i++){
        assert.strictEqual(response.body[i].hasOwnProperty("id"), true)
    }
  });

test("blog can be added", async () =>{
    const newBlog = {
        title: "newBlog",
        author: "test author1",
        url: "test.com"
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, testBlogs.length + 1);
})

test("Missing like field", async () =>{
    const newBlog = {
        title: "newBlog",
        author: "test author1",
        url: "test.com"
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        const response = await api.get("/api/blogs");
        const newlyAdded = response.body[response.body.length-1];
    if(!newBlog.like){
        assert.strictEqual(newlyAdded.likes, 0);
    }
})

test("missing title or url", async () =>{
    const newBlog = {
        author: "test",
        likes: "10"
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        const response = await api.get("/api/blogs");
    assert.strictEqual(testBlogs.length, response.body.length)

})

test("Note can be deleted", async () =>{
    const blogsAtStart = await Blog.find({});
    await api
        .delete(`/api/blogs/${blogsAtStart[0].id}`)
        .expect(204)
    const blogsAtEnd = await Blog.find({});
    
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length-1)
})

test("Note can be updated", async() => {
    const newBlog = {
        title: "new title",
        author: "new author",
        url: "new url",
        likes: 5,
    }
    const blogsAtStart = await Blog.find({});
    await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(newBlog)
        .expect(200)
    const response = await api.get('/api/blogs');
    const content = response.body.map(r => r.content)
    assert(content.includes(newBlog.content))
})

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(testBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(testBlogs[1]);
  await blogObject.save();
});

after(async () => {
  await mongoose.connection.close();
});
