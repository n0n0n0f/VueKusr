<template>
  <footer>
    <div class="container">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
      <ul>
        <li><a href="#" class="footer-link">Terms of Service</a></li>
        <li><a href="#" class="footer-link">Privacy Policy</a></li>
        <li><a href="#" class="footer-link">Contact Us</a></li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
footer {
  background-color: #333;
  color: #fff;
  padding: 20px 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.container p {
  margin-bottom: 10px;
}

.container ul {
  list-style: none;
  padding: 0;
}

.container ul li {
  display: inline-block;
  margin-right: 20px;
}

.container ul li:last-child {
  margin-right: 0;
}

.container ul li a {
  color: #fff;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
