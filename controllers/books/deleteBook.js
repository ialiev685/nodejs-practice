const Book = require('../../models/Book')


const deleteBook=async(req,res)=>{
const {id} = req.params
const result = await Book.findByIdAndDelete(id)
  
    return res.status(200).json({data: result, message: 'success'})
}

module.exports = deleteBook