const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { getSecret } = require("./utils/secretsUtil");

const PORT = process.env.PORT || 3001;


const initialize = async () => {
  try {
    const MONGODB_URI = await getSecret("MONGODB_URI");

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    http.createServer(app).listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error initializing application:", err);
  }
};

initialize();
