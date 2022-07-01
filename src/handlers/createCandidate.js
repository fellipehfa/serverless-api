import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createCandidate(event, context) {
  const { fullName, skills } = JSON.parse(event.body);
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

  await dynamodb.put({
    TableName: 'CandidatesTable',
    Item: candidate,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(candidate),
  };
}

export const handler = createCandidate;


