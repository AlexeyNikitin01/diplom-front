<template>
  <div class="lectures-container">
    <!-- Existing articles section -->
    <div class="articles-section">
      <h2>Статьи и материалы</h2>
      <div class="articles-grid">
        <div v-for="article in articles" :key="article.id" class="article-card">
          <div class="article-header">
            <h3>{{ article.title }}</h3>
            <div class="article-meta">
              <span class="article-date">{{ article.date }}</span>
              <span class="article-views">{{ article.views }}</span>
              <span class="article-comments">{{ article.comments }} комментариев</span>
            </div>
          </div>
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-footer">
            <div class="article-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="article-author">
              <img :alt="article.author.name" :src="article.author.avatar" class="author-avatar">
              <span class="author-name">{{ article.author.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lectures-section">
      <h2>Лекции курсов</h2>
      <div v-if="loading" class="loading">Загрузка лекций...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="lectures-grid">
        <div
            v-for="lecture in lectures"
            :key="lecture.id"
            class="lecture-card"
            @click="goToLecture(lecture.id)"
        >
          <div class="lecture-header">
            <h3>{{ lecture.title }}</h3>
            <span class="lecture-module">Модуль {{ lecture.module_id }}</span>
          </div>
          <div class="lecture-content-preview">
            {{ lecture.lecture ? lecture.lecture.substring(0, 100) + '...' : 'Содержание лекции пока недоступно' }}
          </div>
          <button class="view-lecture-btn">Перейти к лекции →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      articles: [
        {
          id: 1,
          title: "Основы нейронных сетей: полное руководство для начинающих",
          excerpt: "В этой статье мы рассмотрим базовые принципы работы нейронных сетей, их архитектуру и применение в современных технологиях...",
          date: "15 мая 2023",
          views: "12.5K",
          comments: 42,
          tags: ["ИИ", "Машинное обучение", "Нейросети"],
          author: {
            name: "Алексей Петров",
            avatar: "https://i.pravatar.cc/40?img=1"
          }
        },
        {
          id: 2,
          title: "Создание 3D моделей в Blender: от новичка до профессионала",
          excerpt: "Подробное руководство по работе в Blender для создания качественных 3D моделей. Рассматриваем все этапы от моделирования до рендеринга...",
          date: "3 июня 2023",
          views: "8.2K",
          comments: 23,
          tags: ["3D моделирование", "Blender", "Графика"],
          author: {
            name: "Ирина Смирнова",
            avatar: "https://i.pravatar.cc/40?img=5"
          }
        },
        {
          id: 3,
          title: "Лабораторная работа: анализ данных с помощью Python",
          excerpt: "Практическое руководство по анализу данных с использованием библиотек Pandas и NumPy. Разбираем реальный кейс с открытыми данными...",
          date: "22 июня 2023",
          views: "5.7K",
          comments: 18,
          tags: ["Python", "Анализ данных", "Лабораторная"],
          author: {
            name: "Дмитрий Иванов",
            avatar: "https://i.pravatar.cc/40?img=10"
          }
        },
        {
          id: 4,
          title: "Генеративные модели в машинном обучении: GAN и VAE",
          excerpt: "Подробный разбор генеративных моделей, их архитектуры и практического применения для создания изображений, текстов и музыки...",
          date: "5 июля 2023",
          views: "9.3K",
          comments: 31,
          tags: ["ИИ", "Генеративные модели", "Deep Learning"],
          author: {
            name: "Алексей Петров",
            avatar: "https://i.pravatar.cc/40?img=1"
          }
        },
        {
          id: 5,
          title: "Оптимизация 3D моделей для игровых движков",
          excerpt: "Как подготовить 3D модели для использования в Unity и Unreal Engine. Рассматриваем техники оптимизации полигонов и текстур...",
          date: "18 июля 2023",
          views: "6.1K",
          comments: 15,
          tags: ["3D моделирование", "Игровые движки", "Оптимизация"],
          author: {
            name: "Ирина Смирнова",
            avatar: "https://i.pravatar.cc/40?img=5"
          }
        }
      ],
      lectures: [],
      loading: false,
      error: null,
      tokenExist: !localStorage.getItem("token"),
    }
  },
  async mounted() {
    await this.fetchLectures();
  },
  methods: {
    async fetchLectures() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:1818/course/lectures', {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token"),
          },
        });
        this.lectures = response.data;
      } catch (err) {
        this.error = 'Не удалось загрузить лекции. Пожалуйста, попробуйте позже.';
        console.error('Error fetching lectures:', err);
      } finally {
        this.loading = false;
      }
    },
    goToLecture(lectureId) {
      this.$router.push(`/knowledge-base/lectures/${lectureId}`);
    }
  }
}
</script>

<style scoped>
.lecture-card {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.lecture-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.lecture-content-preview {
  font-size: 14px;
  color: #555;
  margin: 10px 0;
  height: 60px;
  overflow: hidden;
}

.view-lecture-btn {
  display: block;
  width: 100%;
  padding: 8px 0;
  background: transparent;
  border: none;
  color: #3a7bd5;
  font-weight: 600;
  cursor: pointer;
  text-align: right;
  transition: color 0.3s ease;
}

.view-lecture-btn:hover {
  color: #2d62b0;
}
.lectures-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.articles-section, .lectures-section {
  margin-bottom: 40px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
}

.articles-grid, .lectures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-card, .lecture-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover, .lecture-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-header {
  margin-bottom: 15px;
}

.article-header h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #2c3e50;
}

.article-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #7f8c8d;
}

.article-excerpt {
  color: #34495e;
  font-size: 14px;
  margin-bottom: 15px;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #ecf0f1;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #2c3e50;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.author-name {
  font-size: 12px;
  color: #2c3e50;
}

.lecture-header {
  margin-bottom: 15px;
}

.lecture-header h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #2c3e50;
}

.lecture-module {
  font-size: 12px;
  color: #7f8c8d;
}

.lecture-content, .lecture-empty {
  font-size: 14px;
  color: #34495e;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.lecture-empty {
  color: #95a5a6;
  font-style: italic;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}

.error {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .articles-grid, .lectures-grid {
    grid-template-columns: 1fr;
  }
}
</style>