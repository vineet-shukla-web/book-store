const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
 
async function getSecret(secretName) {
  const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(secret.SecretString);
}
 
exports.handler = async (event) => {
  try {
    const { tableName } = await getSecret('BookstoreSecret');
    const { bookId, title, author } = JSON.parse(event.body);
 
    const params = {
      TableName: tableName,
      Item: { bookId, title, author },
    };
 
    await dynamoDB.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Book created successfully!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};