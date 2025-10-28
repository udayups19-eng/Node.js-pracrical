// DDL Operations in MongoDB using Node.js
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "collegeDB";

async function ddlOperations() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB");

    const db = client.db(dbName);

    // Create a new collection
    await db.createCollection("students");
    console.log(" Collection 'students' created");

    // List all collections in the database
    const collections = await db.listCollections().toArray();
    console.log(" Collections in DB:", collections.map(c => c.name));

    // Drop a collection
    await db.collection("students").drop();
    console.log(" Collection 'students' dropped");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log(" Connection closed");
  }
}

ddlOperations();
