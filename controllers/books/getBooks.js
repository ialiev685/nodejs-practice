const Book = require('../../models/Book')

const getBooks=async(req,res)=>{

    const result = await Book.find({}).exec()

    return res.status(200).json({data: result, message: 'success'})
}

module.exports = getBooks