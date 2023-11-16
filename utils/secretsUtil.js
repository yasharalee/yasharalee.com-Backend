const { SecretsManager } = require("@aws-sdk/client-secrets-manager");

const initializeEnvVars = async (key) => {
  const region = "us-east-2";
  const client = new SecretsManager({
    region: region,
    credentials:
      process.env.NODE_ENV !== "production"
        ? {
            accessKeyId: process.env.access,
            secretAccessKey: process.env.sec,
          }
        : undefined,
  });

  try {
    const data = await client.getSecretValue({
      SecretId: process.env.ENV,
    });

    if ("SecretString" in data) {
      const parsedSecrets = JSON.parse(data.SecretString);
      return parsedSecrets[key];
    } else {
      const buff = Buffer.from(data.SecretBinary, "base64");
      return buff.toString("ascii");
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred.";
    switch (error.name) {
      case "DecryptionFailureException":
        errorMessage =
          "Secrets Manager can't decrypt the protected secret text using the provided KMS key.";
        break;
      case "InternalServiceErrorException":
        errorMessage = "An error occurred on the server side.";
        break;
      case "InvalidParameterException":
        errorMessage = "You provided an invalid value for a parameter.";
        break;
      case "InvalidRequestException":
        errorMessage =
          "You provided a parameter value that is not valid for the current state of the resource.";
        break;
      case "ResourceNotFoundException":
        errorMessage = "The requested secret was not found.";
        break;
    }
    throw new Error(`${errorMessage} Additional details: ${error.message}`);
  }
};

const getSecret = async (key) => {
  try {
    const secret = await initializeEnvVars(key);
    return secret;
  } catch (error) {
    console.error("Failed to get secret:", error);
    throw error;
  }
};

module.exports = {
  getSecret,
};
