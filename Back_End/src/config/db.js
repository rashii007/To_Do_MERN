const mongoose = require('mongoose')

exports.connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('MongoDB Connected Successfully')
    })
    .catch(()=>{
        console.log('Something when you try this')
    })
    
}