import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createCandidate(event, context) {
  const { fullName, skills } = event.body;
  const now = new Date();

  const candidate = {
    id: uuid(),
    fullName,
    skills,
    createAt: now.toISOString(),
  };

  if (skills.length == 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'skills is required!' })
    };
  };

  try {
    await dynamodb.put({
      TableName: process.env.CANDIDATES_TABLE_NAME,
      Item: candidate,
    }).promise();
  } catch(err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  };

  return {
    statusCode: 201,
    body: JSON.stringify(candidate),
  };
};

export const handler = middy(createCandidate)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());


