const {connect} = require('mongoose');




const connectDB = async()=>{
    const db = await connect(process.env.MONGO_DB_URI);
    console.log(`MongoDB connected: DB_NAME: ${db.connection.name}, Cluster: ${db.connection.host}`.cyan.italic);
}


module.exports = connectDB