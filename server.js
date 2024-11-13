const express = require('express')
const articleRouter = require("./routes/articles")
const Article = require('./models/article')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()

// Require necessary modules:
// - express: A Node.js framework for building web applications.
// - articleRouter: The router handling article-related routes, imported from the "articles" route file.
// - Article: The Mongoose model representing articles in the database.
// - mongoose: A MongoDB object modeling tool for managing the database.
// - methodOverride: A middleware that allows overriding HTTP methods (for example, simulating DELETE or PUT with POST).

mongoose.connect('mongodb://localhost/bharatInternDatabase')
// Connects to the MongoDB database named 'bharatInternDatabase' hosted on localhost.
// mongoose.connect establishes a connection to the MongoDB database for storing and retrieving data.

app.set("views", "./view")
app.set('view engine', 'ejs')
// Sets the views directory to "./view" where the EJS templates (view files) are located.
// Sets 'ejs' as the view engine to render EJS templates.

app.use(express.urlencoded({ extended: false }))
// Middleware to parse incoming request bodies in URL-encoded format (from form submissions).
// extended: false means that only simple key-value pairs will be parsed.

app.use(methodOverride('_method'))
// Method-override middleware allows using HTTP methods like PUT or DELETE in forms where the browser only supports GET and POST.
// It looks for a `_method` parameter in the form to override the method (e.g., method="POST" but using ?_method=DELETE to simulate DELETE).

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})
// GET request for the homepage ('/').
// Retrieves all articles from the database (using Mongoose's `Article.find()`), sorted in descending order by the creation date (latest first).
// Renders the 'index.ejs' view file from the 'articles' directory and passes the retrieved articles to the view to be displayed on the page.

app.use('/articles', articleRouter)
// All routes that start with '/articles' are handled by the 'articleRouter', which is imported from the './routes/articles' file.
// This allows for cleaner route organization by splitting article-related routes into a separate file.

app.listen(3000)
// Starts the Express server on port 3000.
// The server will listen for incoming connections and handle requests.
