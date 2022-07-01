import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function listCandidates(event, context) {
  // const { skills } = event.queryStringParameters;

  const params = {
    TableName: process.env.CANDIDATES_TABLE_NAME,
    // KeyConditionExpression: '#skills = :skills',
    // ExpressionAttributeValues: {
    //   ':skills': skills,
    // },
    // ExpressionAttributeNames: {
    //   '#skills': 'skills',
    // },
  };

  let allCandidates;

  try{
    const result = await dynamodb.scan(params).promise();
    allCandidates = result.Items;
  } catch(err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }

  // const hasSkills = [];

  // for (let candidate of allCandidates) {
  //   for (let skill of skills) {
  //     if (candidate.skills.includes(skill)) hasSkills.push(candidate);
  //   };
  // };

  // if (hasSkills.length == 0) {
  //   return {
  //     statusCode: 403,
  //     body: JSON.stringify({ message: 'does not have any candidate whit this skills!' })
  //   };
  // };

  // const equalsRemoved = new Set(hasSkills);
  // const candidatesSelected = Array.from(equalsRemoved);

  // const winners = [];
  // let winnerSkillsMatched = 0;

  // for (let candidate of candidatesSelected) {
  //   let skillsMatched = 0;
  //   for (let skill of skills) {
  //     if(candidate.skills.includes(skill)) skillsMatched++;
  //   };
  //   if (skillsMatched > winnerSkillsMatched) {
  //     winners.push(candidate);
  //     winnerSkillsMatched = skillsMatched;
  //   } else if (skillsMatched == winnerSkillsMatched) {
  //     winners.push(candidate);
  //   };
  // };
  // let winner = winners[0];

  // if (winners.length > 1) {
  //   for (let candidate of winners) {
  //     if (candidate.skills.length > winner.skills.length) winner = candidate;
  //   };
  // };

  return {
    statusCode: 200,
    body: JSON.stringify(allCandidates)
  };
};

export const handler = middy(listCandidates)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());