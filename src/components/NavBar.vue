<template>
  <nav class="modern-navbar">
    <div class="navbar-container">
      <!-- Логотип с современным дизайном -->
      <router-link to="/" class="brand-logo">
        <img src="../assets/logo.png" alt="EduLab" class="logo-img">
        <span class="logo-text">Diplom</span>
      </router-link>

      <!-- Основное меню с подменю -->
      <div class="nav-menu">
        <ul class="nav-links">
          <li class="nav-item">
            <router-link to="/" class="nav-link" exact-active-class="active">
              <i class="bi bi-house-door-fill"></i>
              <span>Главная</span>
            </router-link>
          </li>

          <li class="nav-item no-wrap">
            <router-link to="/about" class="nav-link" exact-active-class="active">
              <i class="bi bi-info-circle-fill"></i>
              <span>О нас</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/courses" class="nav-link" exact-active-class="active">
              <i class="bi bi-book-half"></i>
              <span>Курсы</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/knowledge-base" class="nav-link" exact-active-class="active">
              <i class="bi bi-database"></i>
              <span>Знания</span>
            </router-link>
          </li>

          <li class="nav-item dropdown" @mouseenter="showLabDropdown" @mouseleave="hideLabDropdown">
            <a class="nav-link " style="text-decoration: none;">
              <i class="bi bi-easel-fill"></i>
              <span>Лаборатория</span>
              <i class="bi bi-chevron-down dropdown-arrow"></i>
            </a>
            <ul class="dropdown-menu" :class="{show: isLabDropdownVisible}">
              <li>
                <router-link to="/labs" class="dropdown-item">
                  <i class="bi bi-code-square"></i>
                  <span>Лабораторные</span>
                </router-link>
              </li>
              <li>
                <router-link to="/ai" class="dropdown-item">
                  <i class="bi bi-robot"></i>
                  <span>ИИ технологии</span>
                </router-link>
              </li>
              <li>
                <router-link to="/3d" class="dropdown-item">
                  <i class="bi bi-box-seam"></i>
                  <span>3D моделирование</span>
                </router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link to="/contacts" class="nav-link" exact-active-class="active">
              <i class="bi bi-telephone-fill"></i>
              <span>Контакты</span>
            </router-link>
          </li>
        </ul>

        <!-- Блок авторизации (сохранен оригинальный функционал) -->
        <div class="auth-section" v-if="tokenExist">
          <a href="auth" class="btn login-btn">
            <i class="bi bi-box-arrow-in-right"></i>
            <span>Войти</span>
          </a>
          <a href="register" class="btn register-btn">
            <i class="bi bi-person-plus"></i>
            <span>Регистрация</span>
          </a>
        </div>

        <div class="user-section" v-if="!tokenExist">
          <a href="cabinet" class="btn user-btn">
            <i class="bi bi-person-circle"></i>
            <span>{{ username }}</span>
          </a>
          <button class="btn logout-btn" @click="exitFun">
            <i class="bi bi-box-arrow-right"></i>
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

interface State {
  tokenExist: boolean,
  userUUID: string | null,
  username: string,
  isLabDropdownVisible: boolean
}

export default defineComponent({
  data(): State {
    return {
      tokenExist: !localStorage.getItem("token"),
      userUUID: localStorage.getItem("userUUID"),
      username: "",
      isLabDropdownVisible: false
    };
  },
  async mounted() {
    try {
      const response = await axios.post('http://localhost:18080/user/get-user', {
        user_uuid: this.userUUID
      }, {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      });
      this.username = response.data.user.login
    } catch (error) {
      console.error('Error get user navbar:', error);
      this.exitFun();
    }
  },
  methods: {
    exitFun() {
      localStorage.removeItem("token");
      localStorage.removeItem("userUUID");
      this.tokenExist = !localStorage.getItem("token");
      this.userUUID = localStorage.getItem("userUUID");
      this.username = "";
      if (window.location.href !== 'http://localhost:8080/register') {
        this.$router.push('/auth');
      }
    },
    showLabDropdown() {
      this.isLabDropdownVisible = true;
    },
    hideLabDropdown() {
      this.isLabDropdownVisible = false;
    }
  }
});
</script>

<style scoped>
.modern-navbar {
  --primary-color: #4361ee;
  --secondary-color: #3f37c9;
  --accent-color: #4895ef;
  --danger-color: #f72585;
  --dark-color: #2b2d42;
  --light-color: #f8f9fa;
  --gray-color: #adb5bd;
  --nav-height: 70px;

  background: white;
  height: var(--nav-height);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1000;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-img {
  height: 40px;
  transition: transform 0.3s ease;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.brand-logo:hover .logo-img {
  transform: rotate(-10deg);
}

.nav-menu {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-links {
  display: flex;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.no-wrap {
  white-space: nowrap;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dark-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0 1.2rem;
  height: 100%;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link i {
  font-size: 1.1rem;
  color: var(--primary-color);
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link:hover::after {
  width: 70%;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 15px;
  left: 15%;
  width: 0;
  height: 3px;
  background: var(--primary-color);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.nav-link.active {
  color: var(--primary-color);
  font-weight: 600;
}

.nav-link.active::after {
  width: 70%;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  color: var(--gray-color);
}

.nav-item.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
  color: var(--primary-color);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 0 0 8px 8px;
  padding: 0.5rem 0;
  min-width: 220px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 100;
  list-style: none;
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.7rem 1.5rem;
  color: var(--dark-color);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-item i {
  font-size: 1rem;
  width: 20px;
  text-align: center;
  color: var(--primary-color);
}

.dropdown-item:hover {
  background: rgba(67, 97, 238, 0.05);
  color: var(--primary-color);
  padding-left: 1.7rem;
}

.auth-section {
  display: flex;
  gap: 1rem;
  margin-left: 2rem;
}

.user-section {
  display: flex;
  gap: 1rem;
  margin-left: 2rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.login-btn {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.login-btn:hover {
  background: rgba(67, 97, 238, 0.1);
}

.register-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
}

.user-btn {
  background: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
}

.user-btn:hover {
  background: rgba(67, 97, 238, 0.2);
}

.logout-btn {
  background: rgba(247, 37, 133, 0.1);
  color: var(--danger-color);
}

.logout-btn:hover {
  background: rgba(247, 37, 133, 0.2);
}

@media (max-width: 1200px) {
  .navbar-container {
    padding: 0 1.5rem;
  }

  .nav-link {
    padding: 0 1rem;
  }
}

@media (max-width: 992px) {
  .nav-menu {
    position: fixed;
    top: var(--nav-height);
    right: -100%;
    width: 300px;
    height: calc(100vh - var(--nav-height));
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    transition: right 0.4s ease;
    overflow-y: auto;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    right: 0;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    height: auto;
  }

  .nav-item {
    height: auto;
    width: 100%;
  }

  .nav-link {
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .nav-link::after {
    display: none;
  }

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: transparent;
    padding: 0;
    margin-top: 0.5rem;
    display: none;
    width: 100%;
  }

  .nav-item.dropdown:hover .dropdown-menu,
  .nav-item.dropdown:focus-within .dropdown-menu {
    display: block;
  }

  .dropdown-item {
    padding-left: 2rem;
  }

  .auth-section, .user-section {
    margin-left: 0;
    margin-top: 1.5rem;
    width: 100%;
  }

  .auth-section {
    flex-direction: column;
  }

  .mobile-menu-toggle {
    display: flex;
  }
}
</style>