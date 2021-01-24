const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
const fs= require('fs');
const fileUpload = require('express-fileupload');

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
require('dotenv').config();
const port = 5000

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0rza7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
    const informationCollection = client.db("crudPractise").collection("information");
    console.log("hello i am connect");
    app.post('/add',(req,res) => {
    
        const name = req.body.name;
        const email = req.body.email;
        const body = req.body.body;
        
        informationCollection.insertOne({name, email, body})
        .then(result =>{
            res.send(result.insertedCount>0)
        })
    
    })
    
    app.get('/show',(req,res) => {
    informationCollection.find({})
    .toArray((err,document)=>{
    res.send(document)
    
    })
    })
    
  app.delete('/delete/:id',(req,res) => {
    informationCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    }) 
  
  
  })
  
  app.get('/editcomment/:id',(req,res) => {
    informationCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err , documents)=>{
      res.send(documents)
    })
  })
  
  app.patch('/update/:id',(req,res)=>{
    informationCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {name: req.body.name, email: req.body.email}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })
  


})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT ||port);