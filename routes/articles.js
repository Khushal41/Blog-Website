const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

// Import necessary modules:
// - express: A Node.js framework for building web applications.
// - Article: The Mongoose model for articles, representing the data structure for articles in MongoDB.
// - router: An instance of the Express Router, used to define routes specific to articles.

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})
// Route to display the form for creating a new article.
// - GET request to '/articles/new' renders the 'new' view in the 'articles' directory.
// - A new, empty Article instance is passed to the view for the form's data-binding.

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})
// Route to display the edit form for an article.
// - GET request to '/articles/edit/:id' (id is dynamic).
// - The article with the specified ID is fetched from the database and passed to the 'edit' view for editing.

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })
})
// Route to display a specific article by its slug (a unique URL identifier).
// - GET request to '/articles/:slug' (slug is dynamic).
// - If the article is not found (null), the user is redirected to the homepage ('/').
// - Otherwise, the 'show' view is rendered with the article data.

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticle('new'))
// Route to handle creating a new article.
// - POST request to '/articles'.
// - Before saving the article, a new empty Article instance is assigned to `req.article`.
// - The `saveArticle` middleware is called with the 'new' view path (in case of validation errors).

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticle('edit'))
// Route to handle updating an existing article.
// - PUT request to '/articles/:id' (id is dynamic).
// - The article with the specified ID is fetched from the database and assigned to `req.article`.
// - The `saveArticle` middleware is called with the 'edit' view path (in case of validation errors).

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})
// Route to handle deleting an article.
// - DELETE request to '/articles/:id' (id is dynamic).
// - The article is found by its ID and deleted from the database using `findByIdAndDelete`.
// - The user is redirected to the homepage after deletion.

function saveArticle(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        // This middleware handles saving an article (both for creating new articles and editing existing ones).
        // - It sets the article's title, description, and markdown fields from the form data (in `req.body`).

        try {
            article = await article.save()
            // Saves the article to the database. If successful, it redirects to the article's page using its slug.

            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            // If an error occurs (e.g., validation fails), the same form view (either 'new' or 'edit') is re-rendered.
            res.render(`articles/${path}`, { article: article })
        }
    }
}
// The `saveArticle` function is middleware that handles both saving new articles and updating existing ones.
// - It takes the view path (either 'new' or 'edit') as an argument to render the appropriate form view in case of validation errors.

module.exports = router
// Exports the router so that it can be used in other parts of the application (such as in the main Express app).
