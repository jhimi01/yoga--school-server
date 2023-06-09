const express = require('express')
var cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(express.json())
app.use(cors())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const uri = `mongodb+srv://${process.env.YOGA_SCHOOL}:${process.env.YOGA_SCHOOL_PASSWORD}@cluster0.ysrfscy.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb://${process.env.YOGA_SCHOOL}:${process.env.YOGA_SCHOOL_PASSWORD}@ac-ia0nlto-shard-00-00.ysrfscy.mongodb.net:27017,ac-ia0nlto-shard-00-01.ysrfscy.mongodb.net:27017,ac-ia0nlto-shard-00-02.ysrfscy.mongodb.net:27017/?ssl=true&replicaSet=atlas-24z2ze-shard-0&authSource=admin&retryWrites=true&w=majority`;


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
    const classCollection = client.db('yoga-school').collection('classes');
    const selectCollect = client.db('yoga-school').collection('selectClass');

//   save user email and role in db
app.put('/users/:email', async(req, res) =>{
  const email = req.params.email;
  const user = req.body;
    // Set the default role to "student"
    user.role = 'student';
  const query = { email: email}
  const options = { upsert: true }
  const updateDoc = {
    $set: user
  }
  const result = await userCollection.updateOne(query, updateDoc ,options);
  res.send(result)
})

// get all users
app.get('/users', async(req, res) =>{
  const result = await userCollection.find().toArray()
  res.send(result)
})

// get specific item details of users
// app.get(`/users/role/:id`, async(req, res) =>{
//   const id = req.params.id;
//   const query = { _id : new ObjectId(id)};
//   const result = await userCollection.find(query).toArray();
//   res.send(result)
// });


// get role details
app.get(`/users/role/:email`, async(req, res) =>{
  const email = req.params.email;
  const query = { email : email};
  const result = await userCollection.find(query).toArray()
  res.send(result)
});


// make instructor to student 
app.patch('/users/instructor/:email', async(req, res) =>{
   const email = req.params.email;
   const filter = {email: email}
   const updateDoc = {
    $set:{
      role: 'instructor'
    },
   }
   const result = await userCollection.updateOne(filter, updateDoc);
   res.send(result)
});


// get all instructor
app.get(`/users/instructor`, async(req, res) =>{
 const filter = {role: 'instructor'}
 const result = await userCollection.find(filter).toArray()
 res.send(result)
});


// make instructor to admin 
app.patch('/users/admin/:email', async(req, res) =>{
   const email = req.params.email;
   const filter = {email: email}
   const updateDoc = {
    $set:{
      role: 'admin'
    },
   }
   const result = await userCollection.updateOne(filter, updateDoc);
   res.send(result)
});


// add all classes
app.post('/users/addclass', async(req, res) =>{
  const body = req.body
  const result = await classCollection.insertOne(body)
  res.send(result)
})

// get all classes
app.get('/users/addclass', async(req, res) => {
  const result = await classCollection.find().toArray();
  res.send(result)
})


// select class as a student
app.post('/users/selectclass/:id', async(req, res) =>{
       const id = req.params.id;
       const selectedClass = req.body;
       
       const result = await selectCollect.insertOne(selectedClass);
       res.send(result)
})

// get selected classess
// app.get('', async (req, res) =>{
//   const result = await classCollection.find().toArray();
//   res.send(result)
// })

// get instructor- my class
// app.get(`/users/instructor/myclass/:email`, async(req, res) =>{
// const email = req.params.email;
// const filter = {email: email}
// const result = await classCollection.find(filter).toArray()
// res.send(result)
// })

// Get classes posted by a single instructor
app.get('/instructors/:email/classes', async (req, res) => {
  const email = req.params.email;
  const query = { instructorEmail: email };
  const result = await classCollection.find(query).toArray();
  res.send(result);
});






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