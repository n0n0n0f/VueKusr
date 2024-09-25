<template>
  <div v-if="isLibrarian" class="book-management">
    <h1 class="title">Управление книгами</h1>
    <form @submit.prevent="addNewBook" class="book-form">
      <div class="form-group">
        <label for="title" class="label">Название:</label>
        <input
          type="text"
          v-model="newBook.title"
          required
          class="input-field"
        />
      </div>
      <div class="form-group">
        <label for="author" class="label">Автор:</label>
        <input
          type="text"
          v-model="newBook.author"
          required
          class="input-field"
        />
      </div>
      <div class="form-group">
        <label for="genre" class="label">Жанр:</label>
        <input
          type="text"
          v-model="newBook.genre"
          required
          class="input-field"
        />
      </div>
      <div class="form-group">
        <label for="description" class="label">Описание:</label>
        <textarea
          v-model="newBook.description"
          required
          class="input-field"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="language" class="label">Язык:</label>
        <input
          type="text"
          v-model="newBook.language"
          required
          class="input-field"
        />
      </div>
      <div class="form-group">
        <label for="isbn" class="label">ISBN:</label>
        <input
          type="text"
          v-model="newBook.isbn"
          required
          class="input-field"
        />
      </div>
      <div class="form-group">
        <label for="imageUrl" class="label">URL обложки:</label>
        <input
          type="text"
          v-model="newBook.imageUrl"
          required
          class="input-field"
        />
      </div>
      <div class="form-group">
        <label for="category" class="label">Категория:</label>
        <input
          type="text"
          v-model="newBook.category"
          required
          class="input-field"
        />
      </div>
      <button type="submit" class="btn add-btn">Добавить книгу</button>
    </form>
    <h2 class="subtitle">Список книг</h2>
    <ul class="book-list">
      <li v-for="book in getBooks" :key="book.id" class="book-item">
        <p class="book-info">{{ book.title }} - {{ book.author }}</p>
        <div class="action-buttons">
          <button @click="removeBook(book.id)" class="btn delete-btn">
            Удалить
          </button>
          <button @click="editBook(book)" class="btn edit-btn">
            Редактировать
          </button>
        </div>
      </li>
    </ul>
    <div v-if="editingBook" class="edit-book">
      <h3 class="edit-title">Редактировать книгу</h3>
      <form @submit.prevent="updateExistingBook" class="book-form">
        <div class="form-group">
          <label for="title" class="label">Название:</label>
          <input
            type="text"
            v-model="editingBook.title"
            required
            class="input-field"
          />
        </div>
        <div class="form-group">
          <label for="author" class="label">Автор:</label>
          <input
            type="text"
            v-model="editingBook.author"
            required
            class="input-field"
          />
        </div>
        <div class="form-group">
          <label for="genre" class="label">Жанр:</label>
          <input
            type="text"
            v-model="editingBook.genre"
            required
            class="input-field"
          />
        </div>
        <div class="form-group">
          <label for="description" class="label">Описание:</label>
          <textarea
            v-model="editingBook.description"
            required
            class="input-field"
          ></textarea>
        </div>
        <button type="submit" class="btn save-btn">Сохранить изменения</button>
      </form>
    </div>
  </div>
  <div v-else>
    <p class="no-access-msg">У вас нет прав для доступа к этой странице.</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "BookManagement",
  data() {
    return {
      newBook: {
        title: "",
        author: "",
        genre: "",
        description: "",
        language: "",
        isbn: "",
        imageUrl: "",
        category: "",
      },
      editingBook: null,
    };
  },
  computed: {
    ...mapGetters(["isLibrarian", "getBooks"]),
  },
  methods: {
    ...mapActions(["fetchBooks", "addBook", "updateBook", "removeBook"]),
    async addNewBook() {
      await this.addBook(this.newBook);
      this.resetNewBook();
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
        await this.removeBook(bookId);
        this.fetchBooks();
      } catch (error) {
        console.error("Error while removing book:", error);
      }
    },
    resetNewBook() {
      this.newBook = {
        title: "",
        author: "",
        genre: "",
        description: "",
        language: "",
        isbn: "",
        imageUrl: "",
        category: "",
      };
    },
  },
  created() {
    this.fetchBooks();
  },
};
</script>
<style scoped>
.book-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea.input-field {
  min-height: 100px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.add-btn {
  background-color: #4caf50;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.edit-btn {
  background-color: #2196f3;
  color: white;
}

.save-btn {
  background-color: #ffc107;
  color: #333;
}

.book-list {
  list-style-type: none;
  padding: 0;
}

.book-item {
  margin-bottom: 10px;
}

.book-info {
  margin: 0;
  display: inline-block;
}

.action-buttons {
  display: inline-block;
  margin-left: 10px;
}

.edit-book {
  margin-top: 20px;
}

.edit-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.no-access-msg {
  color: #f44336;
}
</style>
