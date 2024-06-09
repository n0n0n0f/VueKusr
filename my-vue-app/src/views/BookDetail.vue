<template>
    <div v-if="book">
      <h1>{{ book.title }}</h1>
      <img :src="book.imageUrl || 'default-cover.png'" alt="Обложка" class="book-cover">
      <p><strong>Автор:</strong> {{ book.author || 'Неизвестно' }}</p>
      <p><strong>Жанр:</strong> {{ book.genre || 'Неизвестно' }}</p>
      <p>{{ book.description }}</p>
      <h2>Отзывы</h2>
      <ul>
        <li v-for="review in reviews" :key="review.id">
          <p><strong>{{ review.user_name }}:</strong> {{ review.content }}</p>
        </li>
      </ul>
      <h3>Добавить отзыв</h3>
      <div v-if="isAuthenticated">
        <form @submit.prevent="submitReview">
          <textarea v-model="newReview" placeholder="Напишите ваш отзыв"></textarea>
          <button type="submit">Отправить</button>
        </form>
      </div>
      <div v-else>
        <p>Пожалуйста, войдите в систему, чтобы оставить отзыв.</p>
      </div>
    </div>
    <div v-else>
      <p>Загрузка...</p>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'BookDetail',
    data() {
      return {
        newReview: '',
      };
    },
    computed: {
      ...mapState(['books']),
      ...mapGetters(['isAuthenticated']),
      book() {
        const bookId = parseInt(this.$route.params.id);
        if (!bookId || isNaN(bookId)) {
          console.error('Invalid book ID:', this.$route.params.id);
          return null;
        }
        return this.books.find(book => book.id === bookId);
      },
      reviews() {
        return this.book ? this.book.reviews || [] : [];
      }
    },
    methods: {
      ...mapActions(['fetchBooks', 'fetchReviews', 'addReview']),
      async submitReview() {
        if (this.newReview.trim() && this.book) {
          await this.addReview({ bookId: this.book.id, content: this.newReview });
          this.newReview = '';
          await this.loadReviews();
        }
      },
      async loadReviews() {
        if (this.book) {
          await this.fetchReviews(this.book.id);
        }
      }
    },
    async created() {
      if (!this.book) {
        await this.fetchBooks();
      }
      await this.loadReviews();
    },
    watch: {
      book(newBook) {
        if (newBook) {
          this.loadReviews();
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .book-cover {
    width: 200px;
    height: 300px;
    object-fit: cover;
  }
  </style>
  