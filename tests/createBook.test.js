
const { handler } = require('../src/createBook'); 

jest.mock('aws-sdk', () => ({
  SecretsManager: jest.fn().mockImplementation(() => ({
    getSecretValue: jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({SecretString:JSON.stringify('test')})
    }))
  })),
 
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: jest.fn().mockImplementation(() => ({
        promise:jest.fn(),
      })),
    }))
  }
}));
 
describe('Lambda Handler',() => {
  test('should create book', async () => {
    const event = { body: JSON.stringify({ bookId: 'MOCK_ID', title: 'MOCK_TITLE', author: 'MOCK_AUTHOR' }) };
    const response = await handler(event);
    expect(response.statusCode).toEqual(201);
  });
  test('should return 400 error', async () => {
    try{
     await handler({});
    }catch(err){
      expect(err.message).toEqual('Request body can not be empty')
    }
  });
});
 