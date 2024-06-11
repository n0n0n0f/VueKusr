<template>
  <div class="book-detail">
    <div v-if="book" class="book-info-container">
      <h1 class="book-title">{{ book.title }}</h1>
      <img :src="book.imageUrl || 'default-cover.png'" alt="Обложка" class="book-cover">
      <div class="book-details">
        <p><strong>Автор:</strong> {{ book.author || 'Неизвестно' }}</p>
        <p><strong>Жанр:</strong> {{ book.genre || 'Неизвестно' }}</p>
        <p class="book-description">{{ book.description }}</p>
      </div>

      <h2 class="section-title">Отзывы</h2>
      <ul class="reviews-list">
        <li v-for="review in reviews" :key="review.id" class="review-item">
          <p><strong>{{ review.user_name }}:</strong> {{ review.content }}</p>
          <p><strong>Оценка:</strong> {{ review.rating || 'Нет оценки' }}</p>
          <button v-if="canDeleteReview(review)" @click="deleteReviewAction(review.id)" class="delete-button">Удалить</button>
        </li>
      </ul>

      <h2 class="section-title" v-if="!isLibrarian && !isSystemAdmin">Добавить отзыв</h2>
      <div v-if="isAuthenticated && !isLibrarian && !isSystemAdmin" class="add-review-form">
        <form @submit.prevent="submitReview" class="review-form">
          <textarea v-model="newReview.content" placeholder="Напишите ваш отзыв" class="review-textarea"></textarea>
          <label for="rating" class="rating-label">Оценка:</label>
          <select v-model="newReview.rating" id="rating" class="rating-select">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button type="submit" class="submit-button">Отправить</button>
        </form>
      </div>
      <div v-else-if="!isAuthenticated">
        <p>Пожалуйста, войдите в систему, чтобы оставить отзыв.</p>
      </div>

      <h2 class="section-title" v-if="!isLibrarian && !isSystemAdmin">Бронирование</h2>
      <div v-if="isAuthenticated && !isLibrarian && !isSystemAdmin" class="reservation">
        <button @click="reserveBook" :disabled="book.category !== 1" class="reserve-button">Забронировать книгу</button>
        <p v-if="reservationMessage" class="reservation-message">{{ reservationMessage }}</p>
        <p v-if="book.category !== 1" class="reservation-message">Эту книгу нельзя забронировать.</p>
      </div>
      <div v-else-if="!isAuthenticated">
        <p>Пожалуйста, войдите в систему, чтобы забронировать книгу.</p>
      </div>
    </div>
    <div v-else>
      <p>Загрузка...</p>
    </div>
  </div>
</template>


<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'BookDetail',
  data() {
    return { 
      newReview: { content: '', rating: 1 },
      reservationMessage: '' 
    };
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
      if (this.newReview.content.trim() && this.book) {
        await this.addReview({ bookId: this.book.id, content: this.newReview.content, rating: this.newReview.rating });
        this.newReview = { content: '', rating: 1 };
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
.book-detail {
  padding: 20px;
}

.book-info-container {
  max-width: 800px;
  margin: 0 auto;
}

.book-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.book-cover {
  width: 200px;
  height: 300px;
  object-fit: cover;
  margin-bottom: 10px;
}

.book-details p {
  margin-bottom: 5px;
}

.book-description {
  margin-top: 10px;
}

.section-title {
  font-size: 20px;
  margin-top: 20px;
}

.reviews-list {
  list-style: none;
  padding: 0;
}

.review-item {
  margin-bottom: 20px;
}

.delete-button {
  background-color: #e57373;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.add-review-form {
  margin-top: 20px;
}

.review-form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}

.review-textarea {
  height: 100px;
  margin-bottom: 10px;
  resize: vertical;
}

.rating-label {
  margin-bottom: 5px;
}

.rating-select {
  margin-bottom: 10px;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.reservation {
  margin-top: 20px;
}

.reserve-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.reservation-message {
  margin-top: 10px;
}
</style>