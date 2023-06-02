require('dotenv').config()
const express=require('express')
const app=express()

const cors=require('cors')

app.use(cors())
app.use(express.json())

const port=process.env.PORT || 3000


app.use('/query',require('./routes/query'))

app.listen(port,()=>{
    console.log(`Village server running on port ${port}`);
  })



