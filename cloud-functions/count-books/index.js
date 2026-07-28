const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization',
  'Access-Control-Allow-Methods':
    'GET, POST, OPTIONS',
}

const createResponse = (
  statusCode,
  body,
) => {
  return {
    statusCode,
    headers: corsHeaders,
    isBase64Encoded: false,
    body: JSON.stringify(body),
  }
}

const parseRequest = (event) => {
  const request =
    typeof event === 'string'
      ? JSON.parse(event)
      : event ?? {}

  if (!request.body) {
    return {
      request,
      payload: {},
    }
  }

  const rawBody =
    request.isBase64Encoded
      ? Buffer.from(
          request.body,
          'base64',
        ).toString('utf8')
      : request.body

  return {
    request,
    payload:
      typeof rawBody === 'string'
        ? JSON.parse(rawBody)
        : rawBody,
  }
}

exports.handler = async (
  event,
  context,
) => {
  try {
    const {
      request,
      payload,
    } = parseRequest(event)

    if (request.httpMethod === 'OPTIONS') {
      return createResponse(204, {})
    }

    if (request.httpMethod === 'GET') {
      return createResponse(200, {
        success: true,
        function: 'countBooks',
        instructions:
          'Send a POST request with a books array.',
        example: {
          books: [
            {
              title: '1984',
              author: 'George Orwell',
            },
          ],
        },
      })
    }

    const books =
      Array.isArray(payload.books)
        ? payload.books
        : []

    return createResponse(200, {
      success: true,
      count: books.length,
      message:
        `The cloud function counted ${books.length} books.`,
      processedBy:
        'Alibaba Cloud Function Compute',
      generatedAt:
        new Date().toISOString(),
    })
  } catch (error) {
    console.error(
      'countBooks error:',
      error,
    )

    return createResponse(400, {
      success: false,
      error:
        error.message ??
        'Invalid request body.',
    })
  }
}