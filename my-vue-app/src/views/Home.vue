<template>
  <div class="home">
    <h1>Список книг</h1>
    <div>
      <button @click="toggleFilter" class="filter-toggle">
        {{ showFilter ? "Скрыть фильтры" : "Показать фильтры" }}
      </button>
      <div v-if="showFilter" class="filter-options">
        <label for="sort">Сортировать по:</label>
        <select v-model="sortType" id="sort">
          <option value="default">По умолчанию</option>
          <option value="genre">По жанру</option>
          <option value="author">По автору</option>
        </select>
        <select v-model="sortOrder" id="order">
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
        <label for="genre">Выбрать жанр:</label>
        <select v-model="selectedGenre" id="genre">
          <option value="">Все</option>
          <option v-for="genre in genres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
        <label for="author">Выбрать автора:</label>
        <select v-model="selectedAuthor" id="author">
          <option value="">Все</option>
          <option v-for="author in authors" :key="author" :value="author">
            {{ author }}
          </option>
        </select>
      </div>
    </div>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Поиск книг..."
      class="search-input"
    />
    <div v-if="filteredBooks.length" class="book-grid">
      <div v-for="book in sortedBooks" :key="book.id" class="book-item">
        <router-link
          :to="{ name: 'BookDetail', params: { id: book.id } }"
          class="book-link"
        >
          <img
            :src="book.imageUrl || 'default-cover.png'"
            alt="Обложка"
            class="book-cover"
          />
          <div class="book-info">
            <h2>{{ book.title }}</h2>
            <p><strong>Автор:</strong> {{ book.author || "Неизвестно" }}</p>
            <p><strong>Жанр:</strong> {{ book.genre || "Неизвестно" }}</p>
          </div>
        </router-link>
      </div>
    </div>
    <div v-else>
      <p class="no-books">Книг нет</p>
    </div>
    <div class="decorative-line"></div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}

.filter-toggle {
  background-color: #e57373;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
}

.filter-options {
  margin-top: 10px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.decorative-line {
  border-top: 1px dashed #ccc;
  margin-top: 40px;
  margin-bottom: 20px;
}

.book-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
}

.book-item {
  width: calc(25% - 20px);
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

.book-info {
  padding: 10px;
}

.book-link {
  text-decoration: none;
  color: inherit;
}

.book-link h2 {
  margin: 0;
}

.no-books {
  margin-top: 20px;
}
</style>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      searchQuery: "",
      sortType: "default",
      sortOrder: "asc",
      selectedGenre: "",
      selectedAuthor: "",
      showFilter: false,
    };
  },
  computed: {
    ...mapState(["books"]),
    genres() {
      const uniqueGenres = new Set();
      this.books.forEach((book) => {
        if (book.genre) uniqueGenres.add(book.genre);
      });
      return Array.from(uniqueGenres);
    },
    authors() {
      const uniqueAuthors = new Set();
      this.books.forEach((book) => {
        if (book.author) uniqueAuthors.add(book.author);
      });
      return Array.from(uniqueAuthors);
    },
    filteredBooks() {
      let filtered = [...this.books];
      if (this.selectedGenre) {
        filtered = filtered.filter((book) =>
          book.genre.startsWith(this.selectedGenre)
        );
      }
      if (this.selectedAuthor) {
        filtered = filtered.filter((book) =>
          book.author.startsWith(this.selectedAuthor)
        );
      }
      const query = this.searchQuery.toLowerCase().trim();
      if (query) {
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().startsWith(query) ||
            book.author.toLowerCase().startsWith(query) ||
            book.genre.toLowerCase().startsWith(query)
        );
      }
      return filtered;
    },
    sortedBooks() {
      const sorted = [...this.filteredBooks];
      if (this.sortType === "genre") {
        sorted.sort((a, b) => {
          const order = this.sortOrder === "asc" ? 1 : -1;
          return order * a.genre.localeCompare(b.genre);
        });
      } else if (this.sortType === "author") {
        sorted.sort((a, b) => {
          const order = this.sortOrder === "asc" ? 1 : -1;
          return order * a.author.localeCompare(b.author);
        });
      }
      return sorted;
    },
  },
  methods: {
    ...mapActions(["fetchBooks"]),
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
  },
  created() {
    this.fetchBooks();
  },
};
</script>
