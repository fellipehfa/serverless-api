const schema = {
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
      },
      required: ['title'],
    }
  },
};

export default schema;