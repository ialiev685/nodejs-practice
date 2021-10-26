const Book = require('../../models/Book')

const getSingleBook=async(req,res)=>{
const {id} = req.params
const result = await Book.findById(id)
   
   return res.status(200).json({data: result, message: 'success'})
}

module.exports = getSingleBook