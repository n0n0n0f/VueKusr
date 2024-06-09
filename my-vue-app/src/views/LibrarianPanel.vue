<template>
  <div v-if="isLibrarian">
    <h1>Управление книгами</h1>
    <form @submit.prevent="addNewBook">
      <div>
        <label for="title">Название:</label>
        <input type="text" v-model="newBook.title" required>
      </div>
      <div>
        <label for="author">Автор:</label>
        <input type="text" v-model="newBook.author" required>
      </div>
      <div>
        <label for="genre">Жанр:</label>
        <input type="text" v-model="newBook.genre" required>
      </div>
      <div>
        <label for="description">Описание:</label>
        <textarea v-model="newBook.description" required></textarea>
      </div>
      <div>
        <label for="language">Язык:</label>
        <input type="text" v-model="newBook.language" required>
      </div>
      <div>
        <label for="isbn">ISBN:</label>
        <input type="text" v-model="newBook.isbn" required>
      </div>
      <div>
        <label for="imageUrl">URL обложки:</label>
        <input type="text" v-model="newBook.imageUrl" required>
      </div>
      <div>
        <label for="category">Категория:</label>
        <input type="text" v-model="newBook.category" required>
      </div>
      <button type="submit">Добавить книгу</button>
    </form>
    <h2>Список книг</h2>
    <ul>
      <li v-for="book in getBooks" :key="book.id">
        <p>{{ book.title }} - {{ book.author }}</p>
        <button @click="removeBook(book.id)">Удалить</button>
        <button @click="editBook(book)">Редактировать</button>
      </li>
    </ul>
    <div v-if="editingBook">
      <h3>Редактировать книгу</h3>
      <form @submit.prevent="updateExistingBook">
        <div>
          <label for="title">Название:</label>
          <input type="text" v-model="editingBook.title" required>
        </div>
        <div>
          <label for="author">Автор:</label>
          <input type="text" v-model="editingBook.author" required>
        </div>
        <div>
          <label for="genre">Жанр:</label>
          <input type="text" v-model="editingBook.genre" required>
        </div>
        <div>
          <label for="description">Описание:</label>
          <textarea v-model="editingBook.description" required></textarea>
        </div>
        <button type="submit">Сохранить изменения</button>
      </form>
    </div>
  </div>
  <div v-else>
    <p>У вас нет прав для доступа к этой странице.</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'BookManagement',
  data() {
    return {
      newBook: {
        title: '',
        author: '',
        genre: '',
        description: ''
      },
      editingBook: null
    };
  },
  computed: {
    ...mapGetters(['isLibrarian', 'getBooks'])
  },
  methods: {
    ...mapActions(['fetchBooks', 'addBook', 'updateBook', 'removeBook']),
    async addNewBook() {
      await this.addBook(this.newBook);
      this.newBook.title = '';
      this.newBook.author = '';
      this.newBook.genre = '';
      this.newBook.description = '';
      this.fetchBooks();
    },
    editBook(book) {
      this.editingBook = { ...book };
    },
    async updateExistingBook() {
      await this.updateBook(this.editingBook);
      this.editingBook = null;
      this.fetchBooks();
    },
    async removeBook(bookId) {
  try {
    await this.$store.dispatch('removeBook', bookId); // Вызов метода dispatch для удаления книги
    this.fetchBooks(); // Загрузка списка книг после успешного удаления
  } catch (error) {
    console.error('Error while removing book:', error);
  }
}

  },
  created() {
    this.fetchBooks();
  }
};
</script>

<style scoped>
/* Add styles as needed */
</style>
