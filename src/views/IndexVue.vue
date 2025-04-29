<template>
  <div class="education-platform">
    <!-- Новостной раздел -->
    <section class="news-section">
      <div class="container">
        <h2 class="section-title">Последние новости</h2>
        <div class="news-grid">
          <article v-for="newsItem in news" :key="newsItem.id" class="news-card">
            <div class="news-image" :style="{ backgroundImage: `url(${newsItem.image})` }"></div>
            <div class="news-content">
              <span class="news-category">{{ newsItem.category }}</span>
              <h3 class="news-title">{{ newsItem.title }}</h3>
              <p class="news-excerpt">{{ newsItem.excerpt }}</p>
              <div class="news-meta">
                <span class="news-date">{{ newsItem.date }}</span>
                <router-link to="/news" class="read-more">Читать далее →</router-link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Раздел курсов -->
    <section class="courses-section">
      <div class="container">
        <h2 class="section-title">Рекомендуемые курсы</h2>
        <div class="courses-grid">
          <div v-for="course in courses" :key="course.id" class="course-card">
            <div class="course-badge">{{ course.level }}</div>
            <div class="course-image" :style="{ backgroundImage: `url(${course.image})` }"></div>
            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>
              <div class="course-stats">
                <span><i class="bi bi-clock"></i> {{ course.duration }}</span>
                <span><i class="bi bi-people"></i> {{ course.students }}</span>
              </div>
              <div class="course-footer">
                <span class="course-price">{{ course.price }}</span>
                <button class="enroll-btn">Записаться</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Контактная информация -->
    <section class="contacts-section">
      <div class="container">
        <h2 class="section-title">Контакты</h2>
        <div class="contacts-grid">
          <div class="contact-card">
            <i class="bi bi-geo-alt-fill contact-icon"></i>
            <h3>Адрес</h3>
            <p>г. Москва, ул. Авиаконструкторов, д. 15</p>
            <p>Корпус материаловедения, каб. 304</p>
          </div>
          <div class="contact-card">
            <i class="bi bi-telephone-fill contact-icon"></i>
            <h3>Телефоны</h3>
            <p>+7 (495) 123-45-67 (приемная)</p>
            <p>+7 (495) 765-43-21 (учебный отдел)</p>
          </div>
          <div class="contact-card">
            <i class="bi bi-envelope-fill contact-icon"></i>
            <h3>Email</h3>
            <p>info@aviamaterials.edu</p>
            <p>admission@edu</p>
          </div>
          <div class="contact-card">
            <i class="bi bi-clock-fill contact-icon"></i>
            <h3>Часы работы</h3>
            <p>Пн-Пт: 9:00 - 18:00</p>
            <p>Сб: 10:00 - 15:00</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      news: [
        {
          id: 1,
          title: "Новые композитные материалы для авиации",
          excerpt: "Ученые представили революционный композитный материал, который на 30% легче и прочнее существующих аналогов...",
          category: "Материаловедение",
          date: "15 мая 2023",
          image: "https://images.unsplash.com/photo-1581093196277-1c8d47a119d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 2,
          title: "Современные методы контроля качества в авиастроении",
          excerpt: "На конференции в Москве обсуждались новые методы неразрушающего контроля для авиационных материалов...",
          category: "Авиация",
          date: "3 июня 2023",
          image: "https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 3,
          title: "Разработка пожаробезопасных материалов для авиакосмической отрасли",
          excerpt: "Новая технология огнезащиты материалов может значительно повысить безопасность авиаперевозок...",
          category: "Исследования",
          date: "22 июня 2023",
          image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ],
      courses: [
        {
          id: 1,
          title: "Основы авиационного материаловедения",
          description: "Изучение свойств и характеристик материалов, используемых в авиастроении",
          level: "Начальный",
          duration: "8 недель",
          students: "245 студентов",
          image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 2,
          title: "Композитные материалы в авиации",
          description: "Современные композиты и технологии их производства для аэрокосмической отрасли",
          level: "Продвинутый",
          duration: "12 недель",
          students: "178 студентов",
          image: "https://images.unsplash.com/photo-1581093057305-25a1a4f56c3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 3,
          title: "Коррозия и защита авиационных материалов",
          description: "Методы защиты металлических конструкций от коррозии в авиационной технике",
          level: "Средний",
          duration: "6 недель",
          students: "312 студентов",
          image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    }
  }
}
</script>

<style scoped>
.education-platform {
  font-family: 'Segoe UI', Roboto, sans-serif;
  color: #2b2d42;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: #4361ee;
}

/* Стили для новостей */
.news-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.news-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.news-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.news-content {
  padding: 1.5rem;
}

.news-category {
  display: inline-block;
  background: #4361ee;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.news-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.news-excerpt {
  color: #4a4a4a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.read-more {
  color: #4361ee;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}

/* Стили для курсов */
.courses-section {
  padding: 4rem 0;
  background: white;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.course-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  z-index: 1;
}

.course-image {
  height: 180px;
  background-size: cover;
  background-position: center;
}

.course-content {
  padding: 1.5rem;
}

.course-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.course-description {
  color: #4a4a4a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.course-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.course-stats i {
  margin-right: 5px;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.course-price {
  font-weight: 700;
  font-size: 1.2rem;
  color: #2b2d42;
}

.enroll-btn {
  background: #4361ee;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.enroll-btn:hover {
  background: #3a56d4;
}

/* Стили для контактов */
.contacts-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.contact-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.contact-card:hover {
  transform: translateY(-5px);
}

.contact-icon {
  font-size: 2rem;
  color: #4361ee;
  margin-bottom: 1rem;
}

.contact-card h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2b2d42;
}

.contact-card p {
  color: #4a4a4a;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.8rem;
  }

  .news-grid, .courses-grid, .contacts-grid {
    grid-template-columns: 1fr;
  }
}

</style>