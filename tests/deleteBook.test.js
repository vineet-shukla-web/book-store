
const { handler } = require('../src/deleteBook'); 

jest.mock('aws-sdk', () => ({
  SecretsManager: jest.fn().mockImplementation(() => ({
    getSecretValue: jest.fn().mockImplementation(() => ({
      promise: jest.fn().mockResolvedValue({SecretString:JSON.stringify('test')})
    }))
  })),
 
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      delete: jest.fn().mockImplementation(() => ({
        promise:jest.fn(),
      })),
    }))
  }
}));
 
describe('Lambda Handler',() => {
  test('should delete book', async () => {
    const event = {
        pathParameters:{id:'1'
        },
    };
    const response = await handler(event);
    expect(response.statusCode).toEqual(200);
  });
   test('should return 400 error', async () => {
      try{
        const event={pathParameters:{}}
       await handler(event);
      }catch(err){
        expect(err.message).toEqual('bookId is required')
      }
    });
});
 