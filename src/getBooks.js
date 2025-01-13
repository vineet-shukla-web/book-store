const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
 
async function getSecret(secretName) {
  const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(secret.SecretString);
}
 
exports.handler = async () => {
  try {
    const { tableName } = await getSecret('bookstoresecret');
 
    const params = { TableName: tableName };
    const result = await dynamoDB.scan(params).promise();
 
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
 