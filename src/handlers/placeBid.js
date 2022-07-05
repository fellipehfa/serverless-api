import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import createError from 'http-errors';
import placeBidSchema from '../lib/schemas/placeBidSchema'


import { getAuctionById } from './getAuction'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  if (!amount) throw new createError.BadRequest('Amount is required!')

  const auction = await getAuctionById(id)

  if (auction.status !== 'OPEN') throw new createError.Forbidden(`You cannot bid on closed auctions!`)

  if (amount <= auction.highestBid.amount) throw new createError.Forbidden(`Bid must be higjert than ${auction.highestBid.amount}`)

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

export const handler = commonMiddleware(placeBid)
  .use(validator({ inputSchema: placeBidSchema }));