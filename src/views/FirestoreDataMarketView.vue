<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-9">
        <h1 class="text-center mb-3">
          Library Data Marketplace
        </h1>

        <p class="text-center text-muted">
          Package authenticated Firestore book
          records as a JSON data product.
        </p>

        <button
          type="button"
          class="btn btn-success w-100"
          :disabled="loading"
          @click="createDataProduct"
        >
          {{
            loading
              ? 'Preparing Data Product...'
              : 'Create Firestore Data Product Quote'
          }}
        </button>

        <div
          v-if="errorMessage"
          class="alert alert-danger mt-4"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="product"
          class="card shadow mt-4"
        >
          <div class="card-header bg-dark text-white">
            Data Product Ready
          </div>

          <div class="card-body">
            <div class="row g-4">
              <div class="col-12 col-md-8">
                <h2 class="h4">
                  {{ product.title }}
                </h2>

                <p>
                  {{ product.description }}
                </p>

                <dl class="row">
                  <dt class="col-sm-5">
                    Product ID
                  </dt>

                  <dd class="col-sm-7">
                    <code>
                      {{ product.productId }}
                    </code>
                  </dd>

                  <dt class="col-sm-5">
                    Records
                  </dt>

                  <dd class="col-sm-7">
                    {{ product.recordCount }}
                  </dd>

                  <dt class="col-sm-5">
                    Fields
                  </dt>

                  <dd class="col-sm-7">
                    {{ product.fields.join(', ') }}
                  </dd>

                  <dt class="col-sm-5">
                    Delivery
                  </dt>

                  <dd class="col-sm-7">
                    {{ product.deliveryFormat }}
                  </dd>

                  <dt class="col-sm-5">
                    Licence
                  </dt>

                  <dd class="col-sm-7">
                    {{ product.license }}
                  </dd>
                </dl>
              </div>

              <div class="col-12 col-md-4">
                <div class="price-card text-center">
                  <p class="mb-1 text-muted">
                    Dataset quote
                  </p>

                  <p class="display-6 mb-2">
                    {{ product.price.display }}
                  </p>

                  <span class="badge text-bg-success">
                    Ready for JSON delivery
                  </span>
                </div>
              </div>
            </div>

            <hr />

            <h3 class="h5">
              Data Preview
            </h3>

            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>ISBN</th>
                    <th>Book Name</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="book in product.preview"
                    :key="`${book.isbn}-${book.name}`"
                  >
                    <td>{{ book.isbn }}</td>
                    <td>{{ book.name }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p class="mb-0 text-muted">
              Generated:
              {{ formatDate(product.generatedAt) }}
            </p>
          </div>
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
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore'
import {
  onAuthStateChanged,
} from 'firebase/auth'
import {
  auth,
  db,
} from '../Firebase/init'

defineOptions({
  name: 'FirestoreDataMarketView',
})

const functionUrl =
  import.meta.env
    .VITE_DATA_MARKET_FUNCTION_URL

const product = ref(null)
const rawResponse = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const getCurrentFirebaseUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
    )
  })
}

const loadFirestoreBooks = async () => {
  const booksQuery = query(
    collection(db, 'books'),
    orderBy('isbn', 'asc'),
    limit(50),
  )

  const snapshot =
    await getDocs(booksQuery)

  return snapshot.docs.map(
    (bookDocument) => {
      const data =
        bookDocument.data()

      return {
        isbn: Number(data.isbn),
        name: String(data.name ?? ''),
      }
    },
  )
}

const createDataProduct = async () => {
  product.value = null
  rawResponse.value = null
  errorMessage.value = ''

  if (!functionUrl) {
    errorMessage.value =
      'Data market function URL is missing from .env.local.'

    return
  }

  loading.value = true

  try {
    const currentUser =
      await getCurrentFirebaseUser()

    if (!currentUser) {
      throw new Error(
        'Please sign in before reading Firestore data.',
      )
    }

    const books =
      await loadFirestoreBooks()

    if (books.length === 0) {
      throw new Error(
        'No Firestore books are available to package.',
      )
    }

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
    product.value =
      response.data.product
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error ??
      error.message ??
      'Unable to create the data product.'

    console.error(
      'Firestore data market error:',
      error,
    )
  } finally {
    loading.value = false
  }
}

const formatDate = (value) => {
  return new Date(value).toLocaleString()
}
</script>

<style scoped>
.price-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
}

.response-box {
  max-height: 45vh;
  padding: 1rem;
  overflow: auto;
  color: #f8f9fa;
  background: #212529;
  border-radius: 0.5rem;
}
</style>