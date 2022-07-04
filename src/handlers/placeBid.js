import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
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

  return auction
}

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  if (!amount) throw new createError.BadRequest('Amount is required!')

  const auction = getAuctionById(id)
  if (!auction) throw new createError.NotFound(`Auction with ID "${id}" not found!`)

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW'
  };

  let updatedAuction;

  try{
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch(err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }


  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction)
  };
};

export const handler = commonMiddleware(placeBid);