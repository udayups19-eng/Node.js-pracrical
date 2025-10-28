// DCL Operations in MongoDB using Node.js
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017/admin"; // admin DB required for user creation
const client = new MongoClient(url);

async function dclOperations() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB (Admin)");

    const db = client.db("collegeDB");

    // Create a new user with readWrite permission
    const result = await db.command({
      createUser: "testUser",
      pwd: "password123",
      roles: [{ role: "readWrite", db: "collegeDB" }]
    });

    console.log(" User created successfully:", result);

    // (Optional) To show existing users
    const users = await db.command({ usersInfo: 1 });
    console.log(" Users in DB:", users.users.map(u => u.user));

  } catch (err) {
    console.error(" Error:", err.message);
  } finally {
    await client.close();
    console.log(" Connection closed");
  }
}

dclOperations();
