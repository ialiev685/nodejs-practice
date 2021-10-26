const router = require('express').Router()
const {
    getBooks,
    getSingleBook,
    createBook,
    updateBook,
    deleteBook} = require('../controllers/books')

    router.route('/').get(getBooks)
    router.route('/:id').get(getSingleBook)
    router.route('/').post(createBook)
    router.route('/:id').put(updateBook)
    router.route('/:id').delete(deleteBook)

module.exports=router