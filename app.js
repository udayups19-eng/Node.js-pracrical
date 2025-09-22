const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// 1. Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 2. Create Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

// 3. Create Model
const User = mongoose.model("User", userSchema);

// 4. CREATE → Insert user
app.post("/adduser", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "✅ User inserted successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. READ → Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. UPDATE → Update user by ID
app.put("/updateuser/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "✅ User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. DELETE → Delete user by ID
app.delete("/deleteuser/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "✅ User deleted", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Start Server
app.listen(3000, () => console.log("🚀 Server running on port 3000"));
