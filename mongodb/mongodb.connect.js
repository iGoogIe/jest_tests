const mongoose = require("mongoose");

const MONGO_USER = process.env["MONGO_USER"];
const MONGO_PASSWORD = process.env["MONGO_PASSWORD"];

async function connect () {
    try {
        await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@mongo-project.a1fbq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
            {useNewUrlParser: true}
        );
        console.log("Connected to MongoDB");
    }

    catch (err) {
        console.error("Error connecting to mongodb")
        console.error(err)
    }
}

module.exports = {connect}

// const uri = "mongodb+srv://<username>:<password>@mongo-project.a1fbq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });