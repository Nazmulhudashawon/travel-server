const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibdox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
async function run() {
    try {
        await client.connect();
        const database = client.db('travel');
        const servicesCollection = database.collection('traveldata');
        const orderCollection = database.collection('orders');

         // GET API
         app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

          // Use POST to get data by keys
          app.post('/services/:id', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const services = await servicesCollection.find(query).toArray();
            res.send(services);
        });
        
        //user data to db
        await client.connect(); 
    const database1 = client.db("newusers");
    const usercollection = database1.collection("data");

    //get api 
    app.get('/users',async(req, res)=>{
      const cursor=usercollection.find({});
      const users=await cursor.toArray();
      res.send(users);

    })
   
    //post method
app.post('/users', async (req, res)=>{
  const newuser=req.body;
  const result = await usercollection.insertOne(newuser);
  console.log('hitting the post', req.body)
  res.json(result)
});

//delete api
app.delete('/users/:id', async (req, res)=>{
  const id=req.params.id;
  const query= {_id: ObjectId(id) }
  const result=await usercollection.deleteOne(query);
  console.log("deleting id", result);
  res.json(result)
}) 


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running  Server');
});



app.listen(port, () => {
    console.log('Running Server on port', port);
})