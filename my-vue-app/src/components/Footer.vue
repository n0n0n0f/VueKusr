<template>
  <footer>
    <div class="container">
      <div class="footer-left">
        <p>&copy; 2024 Book Service</p>
      </div>
      <div class="footer-right">
        <ul>
          <li><router-link to="/">Каталог книг</router-link></li>
          <li><router-link to="/about">О нас</router-link></li>
          <li><router-link to="/profile">Профиль</router-link></li>
        </ul>
        <div class="social-media">
          <a href="https://facebook.com" target="_blank">Facebook</a>
          <a href="https://twitter.com" target="_blank">Twitter</a>
          <a href="https://instagram.com" target="_blank">Instagram</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
footer {
  background-color: #4CAF50;
  padding: 20px 0;
  color: white;
  position: relative;
  bottom: 0;
  width: 100%;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.footer-left {
  flex: 1;
}
.footer-right {
  flex: 1;
  text-align: right;
}
.footer-right ul {
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
}
.footer-right ul li {
  margin-left: 20px;
}
.footer-right ul li a {
  color: white;
  text-decoration: none;
}
.footer-right ul li a:hover {
  text-decoration: underline;
}
.social-media a {
  margin-left: 20px;
  color: white;
  text-decoration: none;
}
.social-media a:hover {
  text-decoration: underline;
}
</style>
