const schema = {
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: {
          type: 'string',
        },
      },
      required: ['amount'],
    }
  },
}

export default schema