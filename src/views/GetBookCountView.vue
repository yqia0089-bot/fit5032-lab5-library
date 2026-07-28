<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <h1 class="text-center mb-4">
          Book Counter
        </h1>

        <p class="text-center text-muted">
          The local JSON book data is sent to a
          cloud function for counting.
        </p>

        <button
          type="button"
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="getBookCount"
        >
          {{
            loading
              ? 'Counting...'
              : 'Get Book Count'
          }}
        </button>

        <div
          v-if="count !== null"
          class="alert alert-success mt-4"
        >
          <h2 class="h4">
            Total number of books:
            {{ count }}
          </h2>

          <p class="mb-1">
            {{ responseMessage }}
          </p>

          <p class="mb-0">
            <strong>Processed by:</strong>
            {{ processedBy }}
          </p>
        </div>

        <div
          v-if="errorMessage"
          class="alert alert-danger mt-4"
        >
          {{ errorMessage }}
        </div>

        <pre
          v-if="rawResponse"
          class="response-box mt-4"
        >{{
          JSON.stringify(
            rawResponse,
            null,
            2,
          )
        }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import authorsData from '../assets/json/authors.json'

defineOptions({
  name: 'GetBookCountView',
})

const functionUrl =
  import.meta.env
    .VITE_COUNT_BOOKS_FUNCTION_URL

const count = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const responseMessage = ref('')
const processedBy = ref('')
const rawResponse = ref(null)

const getAuthors = () => {
  if (Array.isArray(authorsData)) {
    return authorsData
  }

  if (Array.isArray(authorsData.authors)) {
    return authorsData.authors
  }

  return []
}

const getWorks = (author) => {
  if (Array.isArray(author.famousWorks)) {
    return author.famousWorks
  }

  if (Array.isArray(author.works)) {
    return author.works
  }

  return []
}

const buildBooksPayload = () => {
  return getAuthors().flatMap(
    (author) => {
      const authorName =
        author.name ??
        author.author ??
        'Unknown author'

      return getWorks(author).map(
        (work) => ({
          title:
            typeof work === 'object'
              ? (
                  work.title ??
                  work.name ??
                  JSON.stringify(work)
                )
              : String(work),
          author: authorName,
        }),
      )
    },
  )
}

const getBookCount = async () => {
  count.value = null
  rawResponse.value = null
  errorMessage.value = ''
  responseMessage.value = ''
  processedBy.value = ''

  if (!functionUrl) {
    errorMessage.value =
      'Cloud function URL is missing from .env.local.'

    return
  }

  loading.value = true

  try {
    const books =
      buildBooksPayload()

    const response = await axios.post(
      functionUrl,
      {
        books,
      },
      {
        headers: {
          'Content-Type':
            'application/json',
        },
      },
    )

    rawResponse.value = response.data
    count.value = response.data.count
    responseMessage.value =
      response.data.message
    processedBy.value =
      response.data.processedBy
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error ??
      error.message ??
      'Unable to call the cloud function.'

    console.error(
      'Book count function error:',
      error,
    )
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.response-box {
  padding: 1rem;
  overflow-x: auto;
  color: #f8f9fa;
  background: #212529;
  border-radius: 0.5rem;
}
</style>