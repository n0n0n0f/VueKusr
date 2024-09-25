<template>
  <div class="profile" v-if="user">
    <h1>Профиль пользователя</h1>
    <div class="user-info">
      <img :src="user.avatar || 'default-avatar.png'" alt="Avatar" class="avatar">
      <div v-if="isEditing" class="edit-profile">
        <div>
          <label>Логин:</label>
          <input v-model="editUser.name" type="text">
        </div>
        <div>
          <label>Почта:</label>
          <input v-model="editUser.email" type="email">
        </div>
        <div>
          <label>Новый пароль:</label>
          <input v-model="editUser.password" type="password">
        </div>
        <div>
          <label>Телефон:</label>
          <input v-model="editUser.phone" type="text">
        </div>
        <button @click="saveProfile" class="submit-button">Сохранить</button>
        <button @click="cancelEdit" class="cancel-button">Отмена</button>
      </div>
      <div v-else>
        <p><strong>Логин:</strong> {{ user.name }}</p>
        <p><strong>Почта:</strong> {{ user.email }}</p>
        <p><strong>Телефон:</strong> {{ user.phone }}</p>
        <button @click="editProfile" class="edit-button">Изменить данные</button>
      </div>
    </div>
    <div class="reserved-books">
      <h2>Забронированные книги</h2>
      <ul>
        <li v-for="reservation in userReservedBooks" :key="reservation.id">
          <div>
            <h3>{{ reservation.book.title }}</h3>
            <p><strong>Пользователь:</strong> {{ reservation.user.name }}</p>
            <p><strong>Почта:</strong> {{ reservation.user.email }}</p>
            <p><strong>Телефон:</strong> {{ reservation.user.phone }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="decorative-line"></div> <!-- New decorative line -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      isEditing: false,
      editUser: {
        name: '',
        email: '',
        password: '',
        phone: '',
      }
    };
  },
  computed: {
    ...mapState(['user', 'reservedBooks']),
    userReservedBooks() {
      return this.reservedBooks.filter(reservation => reservation.user && reservation.user.id === this.user.id);
    }
  },
  methods: {
    ...mapActions(['fetchReservedBooks']),
    editProfile() {
      this.isEditing = true;
      this.editUser = { ...this.user };
    },
    cancelEdit() {
      this.isEditing = false;
      this.editUser = { name: '', email: '', password: '', phone: '' };
    },
    async saveProfile() {
      try {
        if (this.editUser.name && this.editUser.email && this.editUser.password && this.editUser.phone) {
          const userProfile = {
            name: this.editUser.name,
            email: this.editUser.email,
            password: this.editUser.password,
            phone: this.editUser.phone,
          };

          console.log('Отправка данных профиля на сервер:', userProfile);

          await this.$store.dispatch('updateProfile', userProfile);
          console.log('Данные о пользователе после обновления профиля:', this.$store.state.user);

          this.isEditing = false;
        } else {
          console.error('All fields are required.');
        }
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    }
  },
  async created() {
    await this.$store.dispatch('fetchUser');
    await this.fetchReservedBooks();
  }
};
</script>

<style scoped>
.profile {
  padding: 20px;
}

.user-info {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 20px;
}

.edit-profile {
  border: 1px solid #ccc;
  padding: 20px;
}

.edit-profile div {
  margin-bottom: 10px;
}

.edit-button,
.submit-button,
.cancel-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.edit-button:hover,
.submit-button:hover,
.cancel-button:hover {
  background-color: #0d8eff;
}

.reserved-books {
  border: 1px solid #ccc;
  padding: 20px;
}

.reserved-books h2 {
  margin-top: 0;
}

.reserved-books ul {
  list-style: none;
  padding: 0;
}

.reserved-books li {
  margin-bottom: 20px;
}

.reserved-books li h3 {
  margin-top: 0;
}

.decorative-line {
  border-top: 1px dashed #ccc;
  margin-top: 40px; 
  margin-bottom: 20px; 
}

</style>
