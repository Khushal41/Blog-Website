const mongoose = require('mongoose') // Import Mongoose library for MongoDB object modeling.
const { marked } = require('marked') // Import 'marked' for converting Markdown to HTML.
const slugify = require('slugify') // Import 'slugify' for generating URL-friendly slugs.
const createDomPurify = require('dompurify') // Import 'dompurify' to sanitize HTML and prevent XSS attacks.
const { JSDOM } = require('jsdom') // Import 'jsdom' to create a DOM environment for DOMPurify.
const dompurify = createDomPurify(new JSDOM().window) // Create a new DOMPurify instance with a JSDOM window.

const articleSchema = new mongoose.Schema({ // Define the schema for the Article model.
    title: { // Title field for the article.
        type: String, // Data type is String.
        required: true // This field is required.
    },
    description: { // Description field for the article.
        type: String // Data type is String.
    },
    markdown: { // Markdown field for the article content.
        type: String, // Data type is String.
        required: true // This field is required.
    },
    createdAt: { // Field to store the date the article was created.
        type: Date, // Data type is Date.
        default: Date.now // Default value is the current date/time.
    },
    slug: { // Slug field for generating a URL-friendly version of the title.
        type: String, // Data type is String.
        required: true, // This field is required.
        unique: true // This field must be unique across all articles.
    },
    sanitizedHTML: { // Field for storing sanitized HTML content.
        type: String, // Data type is String.
        required: true // This field is required.
    }
})

// Pre-save hook that runs before validating the article document.
articleSchema.pre('validate', function (next) {
    // Check if the title is provided.
    if (this.title) {
        // Generate a slug from the title and assign it to the slug field.
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    // Check if the markdown is provided.
    if (this.markdown) {
        // Convert Markdown to HTML and sanitize it to prevent XSS attacks.
        this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
    }

    next() // Call the next middleware in the stack.
})

// Export the Article model based on the articleSchema.
module.exports = mongoose.model('Article', articleSchema)
