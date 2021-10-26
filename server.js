const express = require('express')
const dotenv = require('dotenv')
const {colors} = require('./helpers')
const connectDB =require('./config/db')

//load env variables
dotenv.config({path:'./config/config.env'})

//init application
const app = express()




const{PORT, NODE_ENV}=process.env

//connectDB
connectDB()
const server =app.listen(PORT, ()=>console.log(`SERVER runnig on port ${PORT} in ${NODE_ENV} mode`.cyan.bold.bgGray))
process.on('unhandledRejection',(err,_)=>{
    console.log(`Error message: ${err.message}`.red)
    server.close(()=>process.exit(1))
})