<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">
      GetAllBookAPI
    </h1>

    <div class="alert alert-success">
      The API returned
      <strong>{{ apiResponse.data.bookCount }}</strong>
      books.
    </div>

    <pre class="api-response">{{
      JSON.stringify(
        apiResponse,
        null,
        2,
      )
    }}</pre>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import authorsData from '../assets/json/authors.json'

defineOptions({
  name: 'GetAllBookAPIView',
})

const authors = computed(() => {
  if (Array.isArray(authorsData)) {
    return authorsData
  }

  if (Array.isArray(authorsData.authors)) {
    return authorsData.authors
  }

  return []
})

const getWorks = (author) => {
  if (Array.isArray(author.famousWorks)) {
    return author.famousWorks
  }

  if (Array.isArray(author.works)) {
    return author.works
  }

  return []
}

const books = computed(() => {
  return authors.value.flatMap(
    (author) => {
      const authorName =
        author.name ??
        author.author ??
        'Unknown author'

      return getWorks(author).map(
        (work, index) => {
          if (
            typeof work === 'object' &&
            work !== null
          ) {
            return {
              id:
                work.id ??
                `${authorName}-${index + 1}`,
              title:
                work.title ??
                work.name ??
                JSON.stringify(work),
              author: authorName,
            }
          }

          return {
            id: `${authorName}-${index + 1}`,
            title: String(work),
            author: authorName,
          }
        },
      )
    },
  )
})

const apiResponse = computed(() => {
  return {
    success: true,
    data: {
      bookCount: books.value.length,
      books: books.value,
    },
    endpoint: 'GetAllBookAPI',
    generatedBy:
      'NoMash Library local JSON API',
  }
})
</script>

<style scoped>
.api-response {
  max-height: 70vh;
  padding: 1rem;
  overflow: auto;
  color: #f8f9fa;
  background: #212529;
  border-radius: 0.5rem;
  white-space: pre-wrap;
}
</style>