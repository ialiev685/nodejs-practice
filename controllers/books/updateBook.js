const Book = require('../../models/Book')


const updateBook=async(req,res)=>{

    const {id} = req.params
    const result = await Book.findByIdAndUpdate(id, {...req.body}, {new:true, runValidators:true})
    // console.log('updateBook')
    return res.status(200).json({data: result, message: 'success'})
}

module.exports = updateBook