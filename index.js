const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dspyj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("WellCome to Cyberpunk Database");
});


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const laptopCollection = client.db("cyberpunkLaptop").collection("laptops");
  const OrderCollection = client.db("cyberpunkLaptop").collection("orders");

    app.get('/laptops', (req, res) => {
        laptopCollection.find({})
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.get("/laptop/:id", (req, res) => {
      laptopCollection.find({_id: ObjectID(req.params.id) })
        .toArray((err, documents) => {
          res.send(documents[0]);
        });
    });

  app.post('/addLaptop', (req, res) => {
    const newLaptop = req.body;
    laptopCollection.insertOne(newLaptop)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })
  
  app.post('/addOrders', (req, res) => {
    const newOrder = req.body;
    OrderCollection.insertOne(newOrder)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req,res) => {
    OrderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.delete("/delete/:id", (req, res) => {
    laptopCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then((result) =>{
      res.send(result.deletedCount > 0);
    })
  });  


});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})