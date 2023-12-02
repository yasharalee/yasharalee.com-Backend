const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Yaslanding.com",
      version: "1.0.0",
      description: "yasalee-qa.com backend",
    },
    servers: [
      {
        url: process.env.Environment,
      },
    ],
  },
  apis: [path.join(__dirname, "ymlfiles", "*.yml")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
