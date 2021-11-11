const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
var cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dl2nf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("conncect in async")
        const database = client.db("dronetastic");
        const productCollection = database.collection("products");
        const orderCollection = database.collection("orders");

        // Add new product
        app.post('/addservice', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
            res.json('result')
        })

        // get all products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        // Post Order
        app.post('/purchaseorder', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })
        // Get all Order
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })

        // get single Product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await productCollection.findOne(query);
            res.json(service)
        })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send("Server Connected")
});
app.listen(port, () => {
    console.log("Connected from", port)
})