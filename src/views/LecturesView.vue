<template>
  <div class="knowledge-base">
    <div class="container">
      <div class="top-bar">
        <!-- Поиск -->
        <div class="search-bar">
          <i class="bi bi-search search-icon"></i>
          <input type="text" placeholder="Поиск статей..." class="search-input" />
        </div>

        <!-- Кнопка добавления статьи -->
        <button class="add-article-btn">
          <i class="bi bi-plus-lg"></i> Добавить статью
        </button>
      </div>

      <div class="articles-container">
        <!-- Фильтры -->
        <div class="filters">
          <button class="filter-btn active">Все статьи</button>
          <button class="filter-btn">Лабораторные</button>
          <button class="filter-btn">Лекции</button>
          <button class="filter-btn">ИИ технологии</button>
          <button class="filter-btn">3D моделирование</button>
        </div>

        <!-- Список статей -->
        <div class="articles-list">
          <article v-for="article in articles" :key="article.id" class="article-card">
            <div class="article-header">
              <router-link :to="`/knowledge-base/${article.id}`" class="article-title">
                {{ article.title }}
              </router-link>
              <div class="article-meta">
                <span class="meta-item">
                  <i class="bi bi-calendar"></i>
                  {{ article.date }}
                </span>
                <span class="meta-item">
                  <i class="bi bi-eye"></i>
                  {{ article.views }}
                </span>
                <span class="meta-item">
                  <i class="bi bi-chat"></i>
                  {{ article.comments }}
                </span>
              </div>
            </div>

            <div class="article-content">
              <p>{{ article.excerpt }}</p>
            </div>

            <div class="article-footer">
              <div class="tags">
                <span v-for="tag in article.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
              <div class="author">
                <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar">
                <span class="author-name">{{ article.author.name }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Пагинация -->
        <div class="pagination">
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <span class="page-dots">...</span>
          <button class="page-btn">10</button>
          <button class="page-btn next-btn">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      ]
    }
  }
}
</script>

<style scoped>
.knowledge-base {
  padding: 2rem 0;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f0f0f0;
}

.filter-btn.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.article-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
  margin-bottom: 0.5rem;
  display: block;
}

.article-title:hover {
  color: #4361ee;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.article-content {
  margin-bottom: 1.5rem;
  color: #333;
  line-height: 1.6;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f2f5;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #2c3e50;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.9rem;
  color: #2c3e50;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover {
  background: #f0f0f0;
}

.page-btn.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.page-dots {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
}

.next-btn {
  width: auto;
  padding: 0 1rem;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .author {
    align-self: flex-end;
  }
}
.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 30px;
  background: white;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #2c3e50;
  outline: none;
  box-shadow: 0 0 5px rgba(44, 62, 80, 0.2);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #7f8c8d;
  font-size: 1.2rem;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.add-article-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.add-article-btn:hover {
  background: #4361ee;
  transform: translateY(-2px);
}

</style>