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
  // 阿里云 FC 会把 event 作为 Buffer 传入
  const rawEvent = Buffer.isBuffer(event)
    ? event.toString('utf8')
    : event

  // 将整个 HTTP 请求转换为对象
  const request =
    typeof rawEvent === 'string'
      ? JSON.parse(rawEvent)
      : rawEvent ?? {}

  // HTTP Trigger 请求的数据通常位于 body 中
  if (
    request.body !== undefined &&
    request.body !== null
  ) {
    const rawBody =
      request.isBase64Encoded
        ? Buffer.from(
            request.body,
            'base64',
          ).toString('utf8')
        : request.body

    const payload =
      typeof rawBody === 'string'
        ? rawBody.trim()
          ? JSON.parse(rawBody)
          : {}
        : rawBody ?? {}

    return {
      request,
      payload,
    }
  }

  // 在线测试可能直接传入：
  // { "books": [...] }
  return {
    request,
    payload: request,
  }
}

export const handler = async (
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