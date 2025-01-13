
const { DynamoDB } = require('aws-sdk');
const { handler } = require('../src/getBooks'); 


jest.mock('aws-sdk', () => ({
  SecretsManager: jest.fn().mockImplementation(() => ({
    getSecretValue: jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({SecretString:JSON.stringify('test')})
    }))
  })),
 
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      scan: jest.fn().mockImplementation(() => ({
        promise:jest.fn().mockResolvedValue({Items:[{}]}),
      })),
    }))
  }
}));
 
describe('Lambda Handler',() => {
  test('should get books', async () => {
    const response = await handler();
    expect(response.statusCode).toEqual(200);
  });
});
 