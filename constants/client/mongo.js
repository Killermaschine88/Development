function connectMongo() {
  const MClient = require("mongodb").MongoClient;
  const MongoClient = new MClient(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  MongoClient.connect();
  log("Connected to MongoDB");
  return MongoClient;
}

module.exports = { connectMongo };
