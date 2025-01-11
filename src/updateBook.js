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
      Key: { bookId },
      UpdateExpression: 'SET title = :title, author = :author',
      ExpressionAttributeValues: { ':title': title, ':author': author },
      ReturnValues: 'ALL_NEW',
    };
 
    const result = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
 