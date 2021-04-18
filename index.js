const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wumse.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 4000


const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
  res.send("working")
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("seniorCare").collection("service");
  const reviewCollection = client.db("seniorCare").collection("review");
  const bookCollection = client.db("seniorCare").collection("book");
  const adminCollection = client.db("seniorCare").collection("admin");

    // service part

    app.post("/addService", (req,res)=>{
        const service = req.body;
        console.log(service);
        collection.insertOne(service)
        .then(result =>{
        //  console.log(result);
        res.send(result.insertedCount>0)
        })
    })

    app.get("/services",(req,res)=>{
        collection.find({})
        .toArray((err, documents)=>{
          res.send(documents);
        })
    })

    app.get("/service/:id",(req,res)=>{
        collection.find({_id:ObjectId(req.params.id)})
        .toArray((err, documents)=>{
          res.send(documents);
        })
      })
    


    //review part


    app.post("/addReview", (req,res)=>{
        const review = req.body;
        //console.log(service);
        reviewCollection.insertOne(review)
        .then(result =>{
        //  console.log(result);
        res.send(result.insertedCount>0)
        })
    })

    app.get("/review",(req,res)=>{
        reviewCollection.find({})
        .toArray((err, documents)=>{
          res.send(documents);
        })
    })

    //order book part..
    
    app.post("/addBook", (req,res)=>{
      const book = req.body;
      // console.log(order);
      bookCollection.insertOne(book)
      .then(result =>{
        // console.log(result);
        res.send(result.insertedCount>0)
      })
    })

    app.get("/orderBook",(req,res)=>{
      bookCollection.find({email:req.query.email})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })
    app.get("/orderBookAll",(req,res)=>{
      bookCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })

    // service delete

    app.delete('/delete/:id',(req,res)=>{
       console.log(req.params.id)
      collection.deleteOne({_id:ObjectId(req.params.id)})
      .then((err, documents)=>{
        console.log(documents);
         res.send(documents);
      })
    })

    //add admin

    app.post("/addAdmin", (req,res)=>{
      const admin = req.body;
      console.log(admin);
      adminCollection.insertOne(admin)
      .then(result =>{
       //  console.log(result);
        res.send(result.insertedCount>0)
      })
    })
    
    app.get("/getAdmin",(req,res)=>{
      adminCollection.find({email:req.query.email})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })
   

});




app.listen(process.env.PORT || port)