import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
  };

  let allAuctions;

  try{
    const result = await dynamodb.scan(params).promise();
    allAuctions = result.Items;
  } catch(err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(allAuctions)
  };
};

export const handler = commonMiddleware(getAuctions);