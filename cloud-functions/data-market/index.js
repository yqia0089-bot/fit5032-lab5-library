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

/**
 * 解析 Alibaba Cloud Function Compute 请求。
 *
 * 支持：
 * 1. Buffer 格式的 HTTP Trigger 请求
 * 2. 字符串格式的请求
 * 3. 包含 body 的代理请求
 * 4. 在线测试直接传入的 JSON 对象
 */
const parseRequest = (event) => {
  const rawEvent = Buffer.isBuffer(event)
    ? event.toString('utf8')
    : event

  const request =
    typeof rawEvent === 'string'
      ? rawEvent.trim()
        ? JSON.parse(rawEvent)
        : {}
      : rawEvent ?? {}

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

  return {
    request,
    payload: request,
  }
}

/**
 * 兼容不同格式的 HTTP method 字段。
 */
const getHttpMethod = (request) => {
  const method =
    request.httpMethod ??
    request.requestContext?.http?.method ??
    request.method ??
    ''

  return String(method).toUpperCase()
}

/**
 * 清理并标准化 Firestore 书籍数据。
 */
const cleanBooks = (books) => {
  return books
    .filter(
      (book) =>
        book &&
        typeof book.name === 'string',
    )
    .map((book) => ({
      isbn:
        Number.isFinite(Number(book.isbn))
          ? Number(book.isbn)
          : null,
      name: book.name.trim(),
    }))
    .filter(
      (book) =>
        book.name.length > 0,
    )
}

/**
 * 根据书籍记录数量计算数据产品价格。
 */
const calculatePrice = (
  recordCount,
) => {
  const basePrice = 4.99
  const perRecord = 1.25

  return Number(
    (
      basePrice +
      recordCount * perRecord
    ).toFixed(2),
  )
}

/**
 * Alibaba Cloud Function Compute Handler
 *
 * Handler 配置：index.handler
 */
export const handler = async (
  event,
  context,
) => {
  try {
    const {
      request,
      payload,
    } = parseRequest(event)

    const httpMethod =
      getHttpMethod(request)

    // 处理浏览器的 CORS 预检请求
    if (httpMethod === 'OPTIONS') {
      return createResponse(200, {
        success: true,
      })
    }

    // GET 请求用于检查函数是否正常
    if (httpMethod === 'GET') {
      return createResponse(200, {
        success: true,
        function:
          'createBookDataProduct',
        instructions:
          'POST a Firestore books array to generate a data product quote.',
        example: {
          books: [
            {
              isbn: 9780451524935,
              name: '1984',
            },
          ],
        },
      })
    }

    // 只允许 POST 创建数据产品
    if (
      httpMethod &&
      httpMethod !== 'POST'
    ) {
      return createResponse(405, {
        success: false,
        error:
          `Method ${httpMethod} is not allowed.`,
      })
    }

    const inputBooks =
      Array.isArray(payload.books)
        ? payload.books
        : []

    const books =
      cleanBooks(inputBooks)

    if (books.length === 0) {
      return createResponse(400, {
        success: false,
        error:
          'No valid Firestore book records were provided.',
      })
    }

    const generatedAt =
      new Date().toISOString()

    const productId =
      `NML-DATA-${Date.now()}`

    const priceAUD =
      calculatePrice(books.length)

    const isbnValues = books
      .map((book) => book.isbn)
      .filter(Number.isFinite)

    const isbnRange =
      isbnValues.length > 0
        ? {
            minimum:
              Math.min(...isbnValues),
            maximum:
              Math.max(...isbnValues),
          }
        : null

    return createResponse(200, {
      success: true,
      product: {
        productId,
        title:
          'NoMash Library Firestore Book Dataset',
        description:
          'A curated catalogue generated from authenticated Firestore book records.',
        recordCount:
          books.length,
        fields: [
          'isbn',
          'name',
        ],
        price: {
          currency: 'AUD',
          amount: priceAUD,
          display:
            `A$${priceAUD.toFixed(2)}`,
        },
        license:
          'Single-project educational data licence',
        deliveryFormat:
          'JSON',
        isbnRange,
        preview:
          books.slice(0, 3),
        generatedAt,
      },
      message:
        'Firestore records were packaged as a sellable data product quote.',
      processedBy:
        'Alibaba Cloud Function Compute',
    })
  } catch (error) {
    console.error(
      'Data product function error:',
      error,
    )

    return createResponse(400, {
      success: false,
      error:
        error?.message ??
        'Invalid request body.',
    })
  }
}