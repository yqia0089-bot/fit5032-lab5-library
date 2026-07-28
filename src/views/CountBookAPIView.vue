<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">
      Author and Book API
    </h1>

    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6">
        <div class="card text-center h-100">
          <div class="card-body">
            <h2 class="h5">
              Number of Authors
            </h2>

            <p class="display-5 mb-0">
              {{ apiResponse.data.authorsCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="card text-center h-100">
          <div class="card-body">
            <h2 class="h5">
              Number of Books
            </h2>

            <p class="display-5 mb-0">
              {{ apiResponse.data.totalBooks }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <h2 class="h4">
      API Response
    </h2>

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
  name: 'CountBookAPIView',
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

const authorsCount = computed(() => {
  return authors.value.length
})

const totalBooks = computed(() => {
  return authors.value.reduce(
    (total, author) => {
      return total + getWorks(author).length
    },
    0,
  )
})

const apiResponse = computed(() => {
  return {
    success: true,
    data: {
      authorsCount: authorsCount.value,
      totalBooks: totalBooks.value,
      authors: authors.value.map(
        (author) => ({
          name:
            author.name ??
            author.author ??
            'Unknown author',
          bookCount:
            getWorks(author).length,
        }),
      ),
    },
    generatedBy:
      'NoMash Library local JSON API',
  }
})
</script>

<style scoped>
.api-response {
  padding: 1rem;
  overflow-x: auto;
  color: #f8f9fa;
  background: #212529;
  border-radius: 0.5rem;
  white-space: pre-wrap;
}
</style>