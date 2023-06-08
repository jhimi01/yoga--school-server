const express = require('express')
var cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(express.json())
app.use(cors())




const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.YOGA_SCHOOL}:${process.env.YOGA_SCHOOL_PASSWORD}@cluster0.ysrfscy.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db('yoga-school').collection('users');



    app.put('/users/:email', async(req, res)=>{
      const email = req.params.email;;
      const user = req.body;
      const query = {email: email}
      const options = { upsert: true}
      const updateDoc = {
        $set: user
      }
      const result = await userCollection.updateOne(query,updateDoc, options);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('yoga school!')
})

app.listen(port, () => {
  console.log(`yoga school is running on port ${port}`)
})