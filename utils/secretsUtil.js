
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

const initializeEnvVars = async (key) => {
  const client = new SecretsManager({
    region: "us-east-1",
  });

  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: process.env.ENV }, (err, data) => {
      if (err) {
        if (err.code === "DecryptionFailureException")
          reject(
            "Secrets Manager can't decrypt the protected secret text using the provided KMS key."
          );
        else if (err.code === "InternalServiceErrorException")
          reject("An error occurred on the server side.");
        else if (err.code === "InvalidParameterException")
          reject("You provided an invalid value for a parameter.");
        else if (err.code === "InvalidRequestException")
          reject(
            "You provided a parameter value that is not valid for the current state of the resource."
          );
        else if (err.code === "ResourceNotFoundException")
          reject("The requested secret was not found.");
        else reject(err);
      } else {
        if ("SecretString" in data) {
          const parsedSecrets = JSON.parse(data.SecretString);
          resolve(parsedSecrets[key]);
        } else {
          let buff = new Buffer.from(data.SecretBinary, "base64");
          resolve(buff.toString("ascii"));
        }
      }
    });
  });
};

const getSecret = async (key) => {
  const secret = await initializeEnvVars(key);
  return secret;
};

module.exports = {
  getSecret,
};