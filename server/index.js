const express = require('express')
const path = require('path')
const app = express()
const mongoDB= require("./db");
mongoDB();

app.use(express.static(path.join(__dirname, "../client/build")))

app.use((req, res, next) => {
  const allowedOrigin = process.env.CLIENT_URL || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
})

app.use(express.json())
app.use('/api', require("./Routes/CreateUser"))
app.use('/api', require("./Routes/DisplayData"));
app.use('/api', require("./Routes/OrderData"));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html")
  );
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`FoodNest backend listening on port ${port}`)
}) 