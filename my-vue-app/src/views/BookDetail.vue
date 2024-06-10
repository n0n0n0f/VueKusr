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
        <button v-if="canDeleteReview(review)" @click="deleteReviewAction(review.id)">Удалить</button>
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

    <h2>Бронирование</h2>
    <div v-if="isAuthenticated">
      <button @click="reserveBook" :disabled="book.category !== 1">Забронировать книгу</button>
      <p v-if="reservationMessage">{{ reservationMessage }}</p>
      <p v-if="book.category !== 1">Эту книгу нельзя забронировать.</p>
    </div>
    <div v-else>
      <p>Пожалуйста, войдите в систему, чтобы забронировать книгу.</p>
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
    return { newReview: '', reservationMessage: '' };
  },
  computed: {
    ...mapState(['books']),
    ...mapGetters(['isAuthenticated', 'isLibrarian', 'getUser', 'reservedBooks']),
    book() {
      const bookId = parseInt(this.$route.params.id);
      if (!bookId || isNaN(bookId)) {
        console.error('Invalid book ID:', this.$route.params.id);
        return null;
      }
      return this.books.find(book => book.id === bookId);
    },
    reviews() { return this.book ? this.book.reviews || [] : []; },
  },
  methods: {
    ...mapActions(['fetchBooks', 'fetchReviews', 'addReview', 'deleteReview', 'reserveBook']),
    async submitReview() {
      if (this.newReview.trim() && this.book) {
        await this.addReview({ bookId: this.book.id, content: this.newReview });
        this.newReview = '';
        await this.loadReviews();
      }
    },
    async deleteReviewAction(reviewId) {
      if (this.book) {
        await this.deleteReview({ bookId: this.book.id, reviewId });
        await this.loadReviews();
      }
    },
    async loadReviews() { if (this.book) await this.fetchReviews(this.book.id); },
    canDeleteReview(review) { return this.isLibrarian && review.user_role !== 'librarian'; },
    async reserveBook() {
      if (this.book && this.book.category === 1) {
        try {
          const userId = this.getUser.id;
          const bookId = this.book.id;
          const alreadyReserved = this.reservedBooks.some(reservation => reservation.book_id === bookId && reservation.user_id === userId);
          if (alreadyReserved) this.reservationMessage = 'Вы уже забронировали эту книгу.';
          else {
            await this.$store.dispatch('reserveBook', { bookId });
            this.reservationMessage = 'Запрос на бронирование отправлен библиотекарю.';
          }
        } catch (error) {
          this.reservationMessage = 'Ошибка при отправке запроса на бронирование.';
          console.error('Error reserving book:', error);
        }
      } else this.reservationMessage = 'Эту книгу нельзя забронировать.';
    }
  },
  async created() { if (!this.book) await this.fetchBooks(); await this.loadReviews(); },
  watch: { book(newBook) { if (newBook) this.loadReviews(); } }
};
</script>

<style scoped>
.book-cover { width: 200px; height: 300px; object-fit: cover; }
</style>
