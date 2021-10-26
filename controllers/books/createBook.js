const Book = require('../../models/Book')

const createBook=async(req,res)=>{
console.log(req.body)
    const result = await Book.create(req.body)
   return res.status(201).json({data: result, message: 'success'})
}

module.exports = createBook