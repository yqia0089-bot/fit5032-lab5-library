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

const calculatePrice = (recordCount) => {
  const basePrice = 4.99
  const perRecord = 1.25

  return Number(
    Math.max(
      basePrice,
      basePrice +
        recordCount * perRecord,
    ).toFixed(2),
  )
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
        function:
          'createBookDataProduct',
        instructions:
          'POST a Firestore books array to generate a data product quote.',
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

    const isbnValues =
      books
        .map((book) => book.isbn)
        .filter(Number.isFinite)

    return createResponse(200, {
      success: true,
      product: {
        productId,
        title:
          'NoMash Library Firestore Book Dataset',
        description:
          'A curated catalogue generated from authenticated Firestore book records.',
        recordCount: books.length,
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
        deliveryFormat: 'JSON',
        isbnRange:
          isbnValues.length > 0
            ? {
                minimum:
                  Math.min(...isbnValues),
                maximum:
                  Math.max(...isbnValues),
              }
            : null,
        preview: books.slice(0, 3),
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
        error.message ??
        'Invalid request body.',
    })
  }
}