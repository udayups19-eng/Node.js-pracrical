// DML Operations in MongoDB using Node.js
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "collegeDB";

async function dmlOperations() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB");

    const db = client.db(dbName);
    const students = db.collection("students");

    // Insert data
    await students.insertMany([
      { name: "Uday", age: 21, course: "B.Com" },
      { name: "Prakash", age: 22, course: "BCA" },
      { name: "Riya", age: 20, course: "BBA" }
    ]);
    console.log(" Data inserted successfully");

    // Read data
    const allStudents = await students.find().toArray();
    console.log(" All Students:", allStudents);

    // Update data
    await students.updateOne({ name: "ritu" }, { $set: { age: 22 } });
    console.log(" Updated Uday's age");

    // Delete data
    await students.deleteOne({ name: "Riya" });
    console.log(" Deleted Riya's record");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log(" Connection closed");
  }
}

dmlOperations();
