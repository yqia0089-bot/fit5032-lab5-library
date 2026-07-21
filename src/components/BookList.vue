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
      v-if="successMessage"
      class="alert alert-success"
    >
      {{ successMessage }}
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
      <table class="table table-bordered align-middle">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Book Name</th>
            <th>Document ID</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="book in books"
            :key="book.id"
          >
            <template
              v-if="editingId === book.id"
            >
              <td>
                <input
                  v-model.number="editIsbn"
                  type="number"
                  class="form-control"
                  min="1"
                />
              </td>

              <td>
                <input
                  v-model.trim="editName"
                  type="text"
                  class="form-control"
                />
              </td>

              <td>
                <code>{{ book.id }}</code>
              </td>

              <td>
                <button
                  type="button"
                  class="btn btn-success btn-sm me-2"
                  @click="saveEdit"
                >
                  Save
                </button>

                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
              </td>
            </template>

            <template v-else>
              <td>{{ book.isbn }}</td>
              <td>{{ book.name }}</td>

              <td>
                <code>{{ book.id }}</code>
              </td>

              <td>
                <button
                  type="button"
                  class="btn btn-warning btn-sm me-2"
                  @click="startEdit(book)"
                >
                  Update
                </button>

                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="removeBook(book)"
                >
                  Delete
                </button>
              </td>
            </template>
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
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
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
const successMessage = ref('')

const editingId = ref(null)
const editIsbn = ref(null)
const editName = ref('')

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

const startEdit = (book) => {
  successMessage.value = ''
  errorMessage.value = ''

  editingId.value = book.id
  editIsbn.value = book.isbn
  editName.value = book.name
}

const cancelEdit = () => {
  editingId.value = null
  editIsbn.value = null
  editName.value = ''
}

const saveEdit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (
    !editingId.value ||
    !Number.isFinite(editIsbn.value) ||
    editIsbn.value <= 0 ||
    !editName.value
  ) {
    errorMessage.value =
      'A valid ISBN and book name are required.'

    return
  }

  try {
    const bookReference = doc(
      db,
      'books',
      editingId.value,
    )

    await updateDoc(
      bookReference,
      {
        isbn: editIsbn.value,
        name: editName.value,
      },
    )

    successMessage.value =
      'Book updated successfully.'

    cancelEdit()
    await loadBooks()
  } catch (error) {
    errorMessage.value =
      `${error.code}: ${error.message}`

    console.error(
      'Firestore update error:',
      error,
    )
  }
}

const removeBook = async (book) => {
  successMessage.value = ''
  errorMessage.value = ''

  const confirmed = window.confirm(
    `Delete "${book.name}"?`,
  )

  if (!confirmed) {
    return
  }

  try {
    const bookReference = doc(
      db,
      'books',
      book.id,
    )

    await deleteDoc(bookReference)

    successMessage.value =
      'Book deleted successfully.'

    await loadBooks()
  } catch (error) {
    errorMessage.value =
      `${error.code}: ${error.message}`

    console.error(
      'Firestore delete error:',
      error,
    )
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