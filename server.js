const http = require('http');
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3001 ;
const mu = "mongodb+srv://SelinSelinay:f9bwoMLEvVnVEs0x@selin-blog-cluster.ruxcp7k.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || mu, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Create HTTP server for production
    http.createServer(app).listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
