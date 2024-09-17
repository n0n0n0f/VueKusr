import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    books: [],
    reservedBooks: [],
    librarians: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    setBooks(state, books) {
      state.books = books;
    },
    setReservedBooks(state, books) {
      state.reservedBooks = books;
    },
    setLibrarians(state, librarians) {
      state.librarians = librarians;
    },
    updateUser(state, updatedUser) {
      state.user = { ...state.user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(state.user));
      console.log('Мутация updateUser выполнена. Новые данные пользователя:', JSON.parse(JSON.stringify(state.user)));
    },
    addReviewToBook(state, { bookId, review }) {
      const book = state.books.find(book => book.id === bookId);
      if (!book) {
        console.error('Book not found:', bookId);
        return;
      }
      if (!book.reviews) {
        book.reviews = [];
      }
      book.reviews.push(review);
    },
    setReviews(state, { bookId, reviews }) {
      const book = state.books.find(book => book.id === bookId);
      if (book) {
        book.reviews = reviews.filter(review => review.content && review.content.trim() !== '');
      }
    },
    addBook(state, book) {
      state.books.push(book);
    },
    updateBook(state, updatedBook) {
      const index = state.books.findIndex(book => book.id === updatedBook.id);
      if (index !== -1) {
        state.books.splice(index, 1, updatedBook);
      }
    },
    removeBook(state, bookId) {
      state.books = state.books.filter(book => book.id !== bookId);
    },
    addLibrarian(state, librarian) {
      state.librarians.push(librarian);
    },
    removeLibrarian(state, librarianId) {
      state.librarians = state.librarians.filter(librarian => librarian.id !== librarianId);
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('https://443e3cc17ad7db7e.mokky.dev/auth', credentials);
        commit('setUser', response.data);
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    async reserveBook({ commit, state }, { bookId }) {
      try {
        const userId = state.user.id;
        const requestData = {
          user_id: userId,
          book_id: bookId
        };
        const response = await axios.post('https://443e3cc17ad7db7e.mokky.dev/bookings?_relations=users,books', requestData, {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        console.log('Reservation successful:', response.data);
        const reservedBook = await axios.get(`https://443e3cc17ad7db7e.mokky.dev/books/${bookId}`);
        commit('setReservedBooks', [...state.reservedBooks, reservedBook.data]);
      } catch (error) {
        console.error('Book reservation failed:', error);
        throw error;
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await axios.post('https://443e3cc17ad7db7e.mokky.dev/register', userData);
        commit('setUser', response.data);
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
    async fetchUser({ commit, state }) {
      try {
        if (state.user && state.user.token) {
          const response = await axios.get('https://443e3cc17ad7db7e.mokky.dev/auth_me', {
            headers: {
              Authorization: `Bearer ${state.user.token}`
            }
          });
          commit('setUser', response.data);
        }
      } catch (error) {
        console.error('Fetching user data failed:', error);
      }
    },
    logout({ commit }) {
      commit('logout');
    },
    async fetchBooks({ commit }) {
      try {
        const response = await axios.get('https://443e3cc17ad7db7e.mokky.dev/books');
        console.log('Данные книг с сервера:', response.data);
        commit('setBooks', response.data);
      } catch (error) {
        console.error('Fetching books failed:', error);
      }
    },
    async updateProfile({ commit, state }, userProfile) {
      try {
        console.log('Отправка данных профиля на сервер:', userProfile);
        const response = await axios.patch(`https://443e3cc17ad7db7e.mokky.dev/users/${state.user.id}`, userProfile, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.user.token}`
          }
        });
        console.log('Ответ от сервера:', response.data);
        commit('updateUser', response.data);
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    },
    async deleteReview({ commit, state, dispatch }, { bookId, reviewId }) {
      try {
        await axios.delete(`https://443e3cc17ad7db7e.mokky.dev/reviews/${reviewId}`, {
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          }});
        await dispatch('fetchReviews', bookId);
      } catch (error) {
        console.error('Removing review failed:', error);
      }
    },
    async fetchReviews({ commit }, bookId) {
      try {
        const response = await axios.get(`https://443e3cc17ad7db7e.mokky.dev/reviews?book_id=${bookId}`);
        commit('setReviews', { bookId, reviews: response.data });
        return response.data;
      } catch (error) {
        console.error('Fetching reviews failed:', error);
      }
    },
    async addReview({ commit, state }, { bookId, content, rating }) {
      if (content.trim() === '') {
        console.error('Review content is empty');
        return;
      }
      try {
        const response = await axios.post('https://443e3cc17ad7db7e.mokky.dev/reviews', {
          book_id: bookId,
          user_id: state.user.id,
          content: content,
          rating: rating, 
          user_name: state.user.name
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.user.token}`
          }
        });
        commit('addReviewToBook', { bookId, review: response.data });
        return response.data;
      } catch (error) {
        console.error('Adding review failed:', error);
      }
    },
    async addBook({ commit, state }, bookData) {
      try {
        const response = await axios.post('https://443e3cc17ad7db7e.mokky.dev/books', bookData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.user.token}`
          }
        });
        commit('addBook', response.data);
      } catch (error) {
        console.error('Adding book failed:', error);
      }
    },
    async updateBook({ commit, state }, bookData) {
      try {
        const response = await axios.patch(`https://443e3cc17ad7db7e.mokky.dev/books/${bookData.id}`, bookData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.user.token}`
          }
        });
        commit('updateBook', response.data);
      } catch (error) {
        console.error('Updating book failed:', error);
      }
    },
    async removeBook({ commit, state }, bookId) {
      try {
        await axios.delete(`https://443e3cc17ad7db7e.mokky.dev/books/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          }
        });
        commit('removeBook', bookId);
      } catch (error) {
        console.error('Removing book failed:', error);
      }
    },
    async fetchLibrarians({ commit, state }) {
      try {
        const response = await axios.get('https://443e3cc17ad7db7e.mokky.dev/users?role=1', {
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          }
        });
        commit('setLibrarians', response.data);
      } catch (error) {
        console.error('Fetching librarians failed:', error);
      }
    },
    async addLibrarian({ commit, state }, librarianData) {
      try {
        const response = await axios.post('https://443e3cc17ad7db7e.mokky.dev/users', { ...librarianData, role: 1 }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.user.token}`
          }
        });
        commit('addLibrarian', response.data);
      } catch (error) {
        console.error('Adding librarian failed:', error);
      }
    },
    async deleteLibrarian({ commit, state }, librarianId) {
      try {
        await axios.delete(`https://443e3cc17ad7db7e.mokky.dev/users/${librarianId}`, {
          headers: {
            'Authorization': `Bearer ${state.user.token}`
          }
        });
        commit('removeLibrarian', librarianId);
      } catch (error) {
        console.error('Removing librarian failed:', error);
      }
    },
    async fetchReservedBooks({ commit, state }) {
      try {
        const response = await axios.get('https://443e3cc17ad7db7e.mokky.dev/bookings?_relations=users,books', {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        commit('setReservedBooks', response.data);
      } catch (error) {
        console.error('Fetching reserved books failed:', error);
        // Обработка ошибки - можно выводить сообщение пользователю
        commit('setReservedBooks', []); // Устанавливаем пустой массив, чтобы не вызывало ошибок
      }},
  },
  getters: {
    isAuthenticated: state => !!state.user,
    getUser: state => state.user,
    getBooks: state => state.books,
    isSystemAdmin: state => state.user && state.user.role === 0,
    isLibrarian: state => state.user && state.user.role === 1,
    getLibrarians: state => state.librarians,
    reservedBooks: state => state.reservedBooks 
  }
});

export default store;

