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

        // Add new product
        app.post('/addservice', async (req, res) => {
            // const service = req.body
            const service = {
                "name": "mavic mini 2",
                "describe": "The Loren range offers high performance in extremely compact dimensions. The use of high quality COB LEDs, with CRI 85 and CRI 93, is matched by clean and highly efficient optics. An innovative dissipative concept that reduces weight and dimensions, guaranteeing a long and efficient life-span even in particularly thermally demanding situations.",
                "img": "https://diamu.com.bd/wp-content/uploads/2021/01/DJI-Mavic-Mini-2-51.jpg"
            }
            const result = await productCollection.insertOne(service)
            res.json(result)
        })
        // get all products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
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