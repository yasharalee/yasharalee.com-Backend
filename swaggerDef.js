const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerOptions: {
    host: process.env.Environment,
    securityDefinitions: {
      Bearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
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
        name: "Spec",
      },
    ],
  },

  apis: [path.join(__dirname, "ymlfiles", "*.yml")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
