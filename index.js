const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
  res.send('yoga school!')
})

app.listen(port, () => {
  console.log(`yoga school is running on port ${port}`)
})