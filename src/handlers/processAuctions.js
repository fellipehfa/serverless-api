import createError from 'http-errors';
import { getEndedAuctions } from '../lib/getEndedActions';
import { closeAuction } from '../lib/closeAuction';

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map(auction => closeAuction(auction))
    await Promise.all(closePromises);

    return { closed: closePromises.length };
  } catch(err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }
}

export const handler = processAuctions;