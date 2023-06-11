const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); 
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(express.json())
app.use(cors())


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


// add all classes by instructor
app.post('/users/addclass', async(req, res) =>{
  const body = req.body
  const result = await classCollection.insertOne(body)
  res.send(result)
})

// get all classes posted by instructor
app.get('/users/addclass', async(req, res) => {
  const result = await classCollection.find().toArray();
  res.send(result)
})

// update class status admin
app.patch('/users/addclass/approve/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: { status: 'approved' }
  };
  const result = await classCollection.updateOne(query, updateDoc);
  res.send(result);
});

// update class status deny
app.patch('/users/addclass/deny/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: { status: 'deny' }
  };
  const result = await classCollection.updateOne(query, updateDoc);
  res.send(result);
});


// give a feedback
app.put('/users/feedback/:id', async (req, res) => {
  const id = req.params.id;
  const feedback = req.body;
  const query = { _id: new ObjectId(id) };
  const options = { upsert: true }
  const updateDoc = {
    $set:{
      feedback
    }
  };
  const result = await classCollection.updateOne(query, updateDoc, options);
  res.send(result);
});

// Get classes posted by a single instructor
app.get('/instructors/:email/classes', async (req, res) => {
  const email = req.params.email;
  const query = { instructorEmail: email };
  const result = await classCollection.find(query).toArray();
  res.send(result);
});

// update one instructor class
app.put(`/instructors/class/update/:id`, async (req, res) => {
  const id = req.params.id;
  const { className, classImage, availableSeats, price } = req.body; // Destructure the properties from req.body
  const filter = { _id: new ObjectId(id) };
  const update = {
    $set: {
      className,
      classImage,
      availableSeats,
      price,
    },
  };

  const result = await classCollection.updateOne(filter, update);
  res.send(result);
});


// select class as a student
// app.post('/users/selectclass', async(req, res) =>{
//   // const id = req.params.id;
//   const selectedClass = req.body;
  
//   const result = await selectCollect.insertOne(selectedClass);
//   res.send(result)
// })
app.post('/users/selectclass', async(req, res) =>{
  // const id = req.params.id;
  const selectedClass = req.body;
  const result = await selectCollect.insertOne(selectedClass);
  res.send(result)
})


// get selected classess
// app.get('/users/selectclass/my-class', async (req, res) =>{
//   // const email= req.params.email;
//  const email =  req.query.email;
//  if (!email){
//   res.send([])
//  }
//   const query = {email: email}
//   const result = await selectCollect.find(query).toArray();
//   res.send(result)
// })
// ----------------------------
app.get(`/users/selectclass/:email`, async (req, res) =>{
  // const email= req.params.email;
 const email =  req.params.email;
 if (!email){
  res.send([])
 }
  const query = {email: email}
  const result = await selectCollect.find(query).toArray();
  res.send(result)
})







app.delete('/users/selectclass/delete/:id', async (req, res) => {
  const id = req.params.id;
  // console.log(id)
  const result = await  selectCollect.deleteOne({ _id: new ObjectId(id)})
  res.send(result)
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