<template>
  <div class="home">
    <h1>Список книг</h1>
    <div v-if="books.length">
      <div v-for="book in books" :key="book.id" class="book-item">
        <router-link :to="{ name: 'BookDetail', params: { id: book.id } }" class="book-link">
          <img :src="book.imageUrl || 'default-cover.png'" alt="Обложка" class="book-cover">
          <h2>{{ book.title }}</h2>
          <p><strong>Автор:</strong> {{ book.author || 'Неизвестно' }}</p>
          <p><strong>Жанр:</strong> {{ book.genre || 'Неизвестно' }}</p>
        </router-link>
      </div>
    </div>
    <div v-else>
      <p>Книг нет</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapState(['books']),
  },
  methods: {
    ...mapActions(['fetchBooks']),
  },
  created() {
    this.fetchBooks();
  }
};
</script>

<style scoped>
.home {
  padding: 20px;
}
.book-item {
  margin-bottom: 20px;
}
.book-cover {
  width: 100px;
  height: 150px;
  object-fit: cover;
}
.book-link {
  text-decoration: none;
  color: inherit;
}
.book-link h2 {
  margin: 10px 0;
}
</style>
