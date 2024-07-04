const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataPath = path.join(__dirname, 'data', 'posts.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));

const loadPosts = () => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

const savePosts = (posts) => {
    const data = JSON.stringify(posts, null, 2);
    fs.writeFileSync(dataPath, data);
};

// Get all posts
app.get('/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
});

// Get a specific post
app.get('/posts/:id', (req, res) => {
    const posts = loadPosts();
    const post = posts.find(p => p.id === req.params.id);

    res.json(post);
});

// Create a new Post
app.post('/create', (req, res) => {
    const posts = loadPosts();
    const newPost = {
        id: Date.now().toString(),
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    savePosts(posts);
    res.redirect('/');
});

// Update a Post
app.post('/update', (req, res) => {
    const posts = loadPosts();
    const index = posts.findIndex(p => p.id === req.body.id);
    if(index !== -1) {
        posts[index].title = req.body.title;
        posts[index].content = req.body.content;
        savePosts(posts);
    }
    res.redirect('/');
});

// Delete a Post
app.post('/delete', (req, res) => {
    const posts = loadPosts();
    const filteredPosts = posts.filter(p => p.id !== req.body.id);
    savePosts(filteredPosts);
    res.redirect('/');
});

// Navigate to show post page
app.get('/post/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'post.html'));
});


app.listen(PORT, () => {
    console.log(`Blog application is running at http://localhost:${PORT}`);
});