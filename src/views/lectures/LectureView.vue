<script lang="ts">
import axios from "axios";
import {defineComponent} from "vue";

export default defineComponent({
  data() {
    return {
      lecture: {
        title: '',
        lecture: '',
        module_id: '',
      },
      loading: false,
      error: null as string | null,
    }
  },
  async created() {
    const lectureId = Array.isArray(this.$route.params.id)
        ? this.$route.params.id[0]
        : this.$route.params.id;
    await this.fetchLecture(lectureId);
  },
  methods: {
    async fetchLecture(lectureId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:1818/course/lectures/${lectureId}`, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token"),
          },
        });
        this.lecture = response.data;
      } catch (err) {
        this.error = 'Не удалось загрузить лекцию. Пожалуйста, попробуйте позже.';
        console.error('Error fetching lecture:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<template>
  <div class="lecture-container">
    <!-- Загрузка -->
    <div v-if="loading" class="lecture-loading">
      <div class="spinner"></div>
      <p>Загрузка лекции...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="lecture-error">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchLecture($route.params.id)">
        Попробовать снова
      </button>
    </div>

    <!-- Контент лекции -->
    <div v-else class="lecture-content">
      <div class="lecture-header">
        <div class="lecture-breadcrumbs">
          <router-link to="/courses">Курсы</router-link>
          /
          <router-link :to="`/modules/${lecture.module_id}`">Модуль {{ lecture.module_id }}</router-link>
          /
          <span>Лекция</span>
        </div>

        <h1 class="lecture-title">{{ lecture.title }}</h1>

        <div class="lecture-meta">
          <span class="module-badge">Модуль {{ lecture.module_id }}</span>
          <span class="lecture-duration">
            <i class="far fa-clock"></i> ~15 минут
          </span>
        </div>
      </div>

      <div class="lecture-body">
        <div class="lecture-text" v-html="lecture.lecture"></div>

        <div class="lecture-actions">
          <button class="action-btn prev-btn">
            <i class="fas fa-arrow-left"></i> Предыдущая
          </button>
          <button class="action-btn next-btn">
            Следующая <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lecture-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* Стили для состояния загрузки */
.lecture-loading {
  text-align: center;
  padding: 3rem;
  color: #3a7bd5;
}

.spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3a7bd5;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Стили для состояния ошибки */
.lecture-error {
  text-align: center;
  padding: 2rem;
  background: #ffebee;
  border-radius: 8px;
  color: #c62828;
}

.lecture-error i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #3a7bd5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #2d62b0;
}

/* Стили для контента лекции */
.lecture-header {
  margin-bottom: 2rem;
}

.lecture-breadcrumbs {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.lecture-breadcrumbs a {
  color: #3a7bd5;
  text-decoration: none;
}

.lecture-breadcrumbs a:hover {
  text-decoration: underline;
}

.lecture-title {
  font-size: 2rem;
  margin: 0 0 1rem;
  color: #2c3e50;
}

.lecture-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.module-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.lecture-duration {
  color: #666;
  font-size: 0.9rem;
}

.lecture-duration i {
  margin-right: 0.3rem;
}

/* Стили для основного текста лекции */
.lecture-body {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.lecture-text {
  line-height: 1.6;
  font-size: 1.1rem;
}

.lecture-text :deep(h2) {
  color: #2c3e50;
  margin: 1.5rem 0 1rem;
  font-size: 1.5rem;
}

.lecture-text :deep(h3) {
  color: #2c3e50;
  margin: 1.3rem 0 0.8rem;
  font-size: 1.3rem;
}

.lecture-text :deep(p) {
  margin: 0 0 1rem;
}

.lecture-text :deep(ul),
.lecture-text :deep(ol) {
  margin: 0 0 1rem 1rem;
  padding-left: 1.5rem;
}

.lecture-text :deep(blockquote) {
  border-left: 4px solid #3a7bd5;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #555;
  font-style: italic;
}

.lecture-text :deep(code) {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', Courier, monospace;
}

.lecture-text :deep(pre) {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin: 1rem 0;
}

/* Стили для кнопок навигации */
.lecture-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.prev-btn {
  background: #f5f5f5;
  color: #333;
}

.prev-btn:hover {
  background: #e0e0e0;
}

.next-btn {
  background: #3a7bd5;
  color: white;
}

.next-btn:hover {
  background: #2d62b0;
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  .lecture-container {
    padding: 1rem;
  }

  .lecture-title {
    font-size: 1.5rem;
  }

  .lecture-body {
    padding: 1rem;
  }

  .lecture-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
