import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id }
  };

  let auction;

  try{
    const result = await dynamodb.get(params).promise();
    auction = result.Item;
  } catch(err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }

  if (!auction) throw new createError.NotFound(`Auction with ID "${id}" not found!`)

  return {
    statusCode: 200,
    body: JSON.stringify(auction)
  };
};

export const handler = commonMiddleware(getAuction);