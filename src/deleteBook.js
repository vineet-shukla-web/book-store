const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
 
async function getSecret(secretName) {
  const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(secret.SecretString);
}
 
exports.handler = async (event) => {
  try {
    const { tableName } = await getSecret('bookstoresecret');
    const {bookId}=event.pathParameters;

    if(!bookId){
      return {
        statusCode:400,
        body:JSON.stringify({
          message:'bookId is required'
        })
      }
    }
 
    const params = {
      TableName: tableName,
      Key: { bookId },
    };
 
    await dynamoDB.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Book deleted successfully!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
 