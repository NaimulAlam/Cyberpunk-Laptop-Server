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


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log('connection err', err);
  const laptopCollection = client.db("cyberpunkLaptop").collection("laptops");

    app.get('/laptops', (req, res) => {
        laptopCollection.find({})
        .toArray((err, items) => {
            // console.log('from db', items);
            res.send(items)
        })
    })

    //getting user checkout info......................
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

//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})