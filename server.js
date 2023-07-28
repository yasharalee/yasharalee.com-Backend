const http = require('http');
const https = require('https');
const fs = require('fs');
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    if (isProduction) {
      // Create HTTPS server for production
      const httpsOptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/lapisel-dev.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/lapisel-dev.com/fullchain.pem')
      };
      https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } else {
      // Create HTTPS server for local development using self-signed certificates
      const httpsOptions = {
        key: fs.readFileSync('private-key.pem'),
        cert: fs.readFileSync('certificate.pem')
      };
      https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
