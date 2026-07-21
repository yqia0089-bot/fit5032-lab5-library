<template>
  <section class="mt-5">
    <div
      class="
        d-flex
        justify-content-between
        align-items-center
        mb-3
      "
    >
      <h2 class="mb-0">
        Books with ISBN Greater Than 1000
      </h2>

      <button
        type="button"
        class="btn btn-outline-primary"
        @click="loadBooks"
      >
        Refresh
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="alert alert-danger"
    >
      {{ errorMessage }}
    </div>

    <div
      v-if="loading"
      class="alert alert-info"
    >
      Loading books...
    </div>

    <div
      v-else-if="books.length === 0"
      class="alert alert-secondary"
    >
      No matching books were found.
    </div>

    <div
      v-else
      class="table-responsive"
    >
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Book Name</th>
            <th>Document ID</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="book in books"
            :key="book.id"
          >
            <td>{{ book.isbn }}</td>
            <td>{{ book.name }}</td>
            <td>
              <code>{{ book.id }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import {
  onMounted,
  ref,
  watch,
} from 'vue'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../Firebase/init'

defineOptions({
  name: 'BookList',
})

const props = defineProps({
  refreshToken: {
    type: Number,
    default: 0,
  },
})

const books = ref([])
const loading = ref(false)
const errorMessage = ref('')

const loadBooks = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(5),
    )

    const querySnapshot =
      await getDocs(booksQuery)

    books.value =
      querySnapshot.docs.map(
        (bookDocument) => ({
          id: bookDocument.id,
          ...bookDocument.data(),
        }),
      )

    console.log(
      'Firestore query result:',
      books.value,
    )
  } catch (error) {
    errorMessage.value =
      `${error.code}: ${error.message}`

    console.error(
      'Firestore query error:',
      error,
    )
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBooks()
})

watch(
  () => props.refreshToken,
  () => {
    loadBooks()
  },
)
</script>