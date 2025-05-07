<template>
  <div class="cabinet-container">
    <!-- Шапка личного кабинета -->
    <div class="profile-header">
      <div class="profile-avatar">
        <img :src="user.photo || 'https://via.placeholder.com/150'" alt="Аватар" class="avatar-img">
        <button class="edit-profile-btn" @click="showModal = true">
          <i class="fas fa-edit"></i> Редактировать профиль
        </button>
      </div>
      <div class="profile-info">
        <h1>{{ user.name }} {{ user.surname }}</h1>
        <p class="text-muted">{{ user.position }} в {{ user.place_work }}</p>
        <div class="profile-stats">
          <div class="stat-item">
            <i class="fas fa-flask"></i>
            <span>{{ completedLabsCount }} из {{ totalLabsCount }} лаб</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-certificate"></i>
            <span>{{ certificates.length }} сертификатов</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-graduation-cap"></i>
            <span>{{ completedCoursesCount }} из {{ totalCoursesCount }} курсов</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="cabinet-content">
      <!-- Прогресс обучения -->
      <div class="progress-section">
        <h2><i class="fas fa-chart-pie"></i> Прогресс обучения</h2>
        <div class="progress-cards">
          <div class="progress-card">
            <h3>Лабораторные работы</h3>
            <div class="progress-stats">
              <div class="progress-stat">
                <span class="stat-color completed"></span>
                <span>Завершено: {{ completedLabsCount }}</span>
              </div>
              <div class="progress-stat">
                <span class="stat-color in-progress"></span>
                <span>В процессе: {{ inProgressLabsCount }}</span>
              </div>
              <div class="progress-stat">
                <span class="stat-color not-started"></span>
                <span>Не начато: {{ notStartedLabsCount }}</span>
              </div>
            </div>
          </div>

          <div class="progress-card">
            <h3>Курсы</h3>
            <div class="progress-stats">
              <div class="progress-stat">
                <span class="stat-color completed"></span>
                <span>Завершено: {{ completedCoursesCount }}</span>
              </div>
              <div class="progress-stat">
                <span class="stat-color in-progress"></span>
                <span>В процессе: {{ inProgressCoursesCount }}</span>
              </div>
              <div class="progress-stat">
                <span class="stat-color not-started"></span>
                <span>Не начато: {{ notStartedCoursesCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Последние лабораторные работы -->
      <div class="labs-section">
        <h2><i class="fas fa-flask"></i> Последние лабораторные работы</h2>
        <div class="labs-grid">
          <div v-for="lab in recentLabs" :key="lab.id" class="lab-card" :class="lab.status">
            <div class="lab-header">
              <h3>{{ lab.title }}</h3>
              <span class="lab-status">{{ formatStatus(lab.status) }}</span>
            </div>
            <div class="lab-image">
              <img :src="lab.image" :alt="lab.title">
            </div>
            <div class="lab-meta">
              <span class="lab-date"><i class="far fa-calendar-alt"></i> {{ lab.completionDate }}</span>
              <span class="lab-score"><i class="fas fa-star"></i> Оценка: {{ lab.score }}/10</span>
            </div>
            <div v-if="lab.status !== 'completed'" class="progress-bar">
              <div class="progress-fill" :style="{ width: lab.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="labs-section">
        <h2><i class="fas fa-flask"></i> Последние курсы</h2>
        <div class="labs-grid">
          <div v-for="course in courses" :key="course.id" class="lab-card" :class="course.status">
            <div class="lab-header">
              <h3>{{ course.title }}</h3>
              <span class="lab-status">{{ formatStatus(course.status) }}</span>
            </div>
            <div class="lab-image">
              <img :src="course.image" :alt="course.title">
            </div>
            <div class="lab-meta">
              <span class="lab-date"><i class="far fa-calendar-alt"></i> {{ course.completionDate }}</span>
              <span class="lab-score"><i class="fas fa-star"></i> Оценка: {{ course.score }}/10</span>
            </div>
            <div v-if="course.status !== 'completed'" class="progress-bar">
              <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Сертификаты -->
      <div class="certificates-section">
        <h2><i class="fas fa-certificate"></i> Сертификаты</h2>
        <div class="certificates-grid">
          <div v-for="cert in certificates" :key="cert.id" class="certificate-card">
            <div class="certificate-image">
              <img :src="cert.image" :alt="cert.title">
            </div>
            <div class="certificate-info">
              <h3>{{ cert.title }}</h3>
              <p>Выдан: {{ cert.issueDate }}</p>
              <button class="view-cert-btn" @click="viewCertificate(cert)">
                <i class="fas fa-eye"></i> Просмотреть
              </button>
              <button class="download-cert-btn">
                <i class="fas fa-download"></i> Скачать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования профиля -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Редактирование профиля</h2>
          <button class="close-btn" @click="showModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="updateUser" class="modal-form">
          <div class="form-group avatar-upload">
            <div class="avatar-preview">
              <img :src="photoUrl || user.photo || 'https://via.placeholder.com/150'" alt="Аватар">
            </div>
            <label class="upload-btn">
              <input type="file" @change="onFileChange" accept="image/*">
              <i class="fas fa-camera"></i> Изменить фото
            </label>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Имя</label>
              <input type="text" v-model="user.name">
            </div>
            <div class="form-group">
              <label>Фамилия</label>
              <input type="text" v-model="user.surname">
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="user.email">
          </div>

          <div class="form-group">
            <label>Телефон</label>
            <input type="tel" v-model="user.phone">
          </div>

          <div class="form-group">
            <label>Место работы</label>
            <input type="text" v-model="user.place_work">
          </div>

          <div class="form-group">
            <label>Должность</label>
            <input type="text" v-model="user.position">
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="showModal = false">Отмена</button>
            <button type="submit" class="save-btn">Сохранить изменения</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import axios from 'axios'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'UserCabinet',
  data() {
    return {
      showModal: false,
      photoUrl: '',
      selectedFile: null,
      user: {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        login: 'materials_science_student',
        name: 'Иван',
        surname: 'Петров',
        email: 'ivan.petrov@example.com',
        phone: '+7 (912) 345-67-89',
        place_work: '',
        position: 'Студент',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        photo_64: ''
      },
      // Фейковые данные для демонстрации
      labs: [
        {
          id: 1,
          title: 'Определение твердости металлов',
          status: 'completed',
          completionDate: '15.10.2023',
          score: 9,
          progress: 100,
          image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 2,
          title: 'Микроструктурный анализ сталей',
          status: 'in-progress',
          completionDate: 'В процессе',
          score: null,
          progress: 65,
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 3,
          title: 'Исследование полимерных материалов',
          status: 'not-started',
          completionDate: 'Не начата',
          score: null,
          progress: 0,
          image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 4,
          title: 'Керамические материалы и их свойства',
          status: 'in-progress',
          completionDate: 'В процессе',
          score: null,
          progress: 30,
          image: 'https://images.unsplash.com/photo-1584735422188-7199a00030d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
        }
      ],
      courses: [
        { id: 1, title: 'Основы материаловедения', status: 'completed', image: 'https://avatars.mds.yandex.net/i?id=7ee0c435fd91f8c0a01cde1e305847b9_l-7760894-images-thumbs&n=13'},
        { id: 2, title: 'Металловедение', status: 'completed',image: 'https://avatars.mds.yandex.net/i?id=7ee0c435fd91f8c0a01cde1e305847b9_l-7760894-images-thumbs&n=13' },
        { id: 3, title: 'Полимерные материалы', status: 'in-progress',image: 'https://pic.rutubelist.ru/video/15/ee/15ee00b712e9a228a5e0dbb98d2f8e65.jpg' },
        { id: 4, title: 'Композиционные материалы', status: 'not-started',image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
        { id: 5, title: 'Коррозия и защита металлов', status: 'not-started',image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' }
      ],
      certificates: [
        {
          id: 1,
          title: 'Основы материаловедения',
          issueDate: '10.10.2023',
          image: 'https://avatars.mds.yandex.net/i?id=ac68c741e57bfd1115ce589a8e85e82212ff6659-5320579-images-thumbs&n=13'
        },
        {
          id: 2,
          title: 'Металловедение',
          issueDate: '25.10.2023',
          image: 'https://avatars.mds.yandex.net/i?id=ac68c741e57bfd1115ce589a8e85e82212ff6659-5320579-images-thumbs&n=13'
        }
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }
  },
  computed: {
    // Статистика по лабораторным работам
    completedLabsCount() {
      return this.labs.filter(lab => lab.status === 'completed').length
    },
    inProgressLabsCount() {
      return this.labs.filter(lab => lab.status === 'in-progress').length
    },
    notStartedLabsCount() {
      return this.labs.filter(lab => lab.status === 'not-started').length
    },
    totalLabsCount() {
      return this.labs.length
    },

    // Статистика по курсам
    completedCoursesCount() {
      return this.courses.filter(course => course.status === 'completed').length
    },
    inProgressCoursesCount() {
      return this.courses.filter(course => course.status === 'in-progress').length
    },
    notStartedCoursesCount() {
      return this.courses.filter(course => course.status === 'not-started').length
    },
    totalCoursesCount() {
      return this.courses.length
    },

    // Последние лабораторные работы (3 шт)
    recentLabs() {
      return [...this.labs].sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return -1
        if (a.status !== 'completed' && b.status === 'completed') return 1
        return 0
      }).slice(0, 3)
    },

    // Данные для круговых диаграмм
    labsChartData() {
      return {
        labels: ['Завершено', 'В процессе', 'Не начато'],
        datasets: [
          {
            backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
            data: [this.completedLabsCount, this.inProgressLabsCount, this.notStartedLabsCount]
          }
        ]
      }
    },
    coursesChartData() {
      return {
        labels: ['Завершено', 'В процессе', 'Не начато'],
        datasets: [
          {
            backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
            data: [this.completedCoursesCount, this.inProgressCoursesCount, this.notStartedCoursesCount]
          }
        ]
      }
    }
  },
  methods: {
    formatStatus(status) {
      const statusMap = {
        'completed': 'Завершено',
        'in-progress': 'В процессе',
        'not-started': 'Не начато'
      }
      return statusMap[status] || status
    },
    onFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.photoUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async updateUser() {
      try {
        // Здесь будет логика обновления данных пользователя
        console.log('Updating user:', this.user)

        if (this.selectedFile) {
          // Логика загрузки фото
          console.log('Uploading photo...')
          // Имитация загрузки
          await new Promise(resolve => setTimeout(resolve, 1000))
          this.user.photo = this.photoUrl
        }

        this.showModal = false
        alert('Профиль успешно обновлен!')
      } catch (error) {
        console.error('Error updating user:', error)
        alert('Ошибка при обновлении профиля')
      }
    },
    viewCertificate(cert) {
      alert(`Просмотр сертификата: ${cert.title}`)
    }
  }
}
</script>

<style scoped>
/* Основные стили */
.cabinet-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* Шапка профиля */
.profile-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  padding: 30px;
  border-radius: 10px;
  color: white;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.edit-profile-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.edit-profile-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.profile-info h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 600;
}

.profile-info p {
  margin: 5px 0 20px;
  font-size: 18px;
}

.profile-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
}

.stat-item i {
  font-size: 16px;
}

/* Секции */
.cabinet-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.progress-section, .labs-section, .certificates-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.progress-section h2, .labs-section h2, .certificates-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #3a7bd5;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-section h2 i, .labs-section h2 i, .certificates-section h2 i {
  font-size: 24px;
}

/* Прогресс */
.progress-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.progress-card {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  background: #f9f9f9;
  text-align: center;
}

.progress-card h3 {
  margin-top: 0;
  color: #555;
}

.chart-container {
  height: 200px;
  margin: 20px auto;
  position: relative;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.progress-stat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-color {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.stat-color.completed {
  background: #4CAF50;
}

.stat-color.in-progress {
  background: #FF9800;
}

.stat-color.not-started {
  background: #F44336;
}

/* Лабораторные работы */
.labs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.lab-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
}

.lab-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f5f5;
}

.lab-header h3 {
  margin: 0;
  font-size: 16px;
}

.lab-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.lab-card.completed .lab-status {
  background: #e8f5e9;
  color: #2e7d32;
}

.lab-card.in-progress .lab-status {
  background: #fff8e1;
  color: #ff8f00;
}

.lab-card.not-started .lab-status {
  background: #ffebee;
  color: #c62828;
}

.lab-image {
  height: 150px;
  overflow: hidden;
}

.lab-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.lab-card:hover .lab-image img {
  transform: scale(1.05);
}

.lab-meta {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  font-size: 12px;
  color: #777;
  background: #f9f9f9;
}

.lab-meta i {
  margin-right: 5px;
}

.progress-bar {
  height: 5px;
  background: #f0f0f0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
}

.lab-card.completed .progress-fill {
  background: #4CAF50;
}

.lab-card.in-progress .progress-fill {
  background: #FF9800;
}

/* Сертификаты */
.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.certificate-card {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.certificate-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.certificate-image {
  width: 120px;
  background: #f5f5f5;
}

.certificate-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.certificate-info {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.certificate-info h3 {
  margin: 0 0 5px;
  font-size: 16px;
}

.certificate-info p {
  margin: 0 0 10px;
  font-size: 14px;
  color: #777;
}

.certificate-info button {
  margin-top: 10px;
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.view-cert-btn {
  background: #3a7bd5;
  color: white;
}

.view-cert-btn:hover {
  background: #2d62b0;
}

.download-cert-btn {
  background: #f0f0f0;
  color: #333;
}

.download-cert-btn:hover {
  background: #e0e0e0;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #3a7bd5;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #333;
}

.modal-form {
  padding: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 2px rgba(58, 123, 213, 0.2);
}

.avatar-upload {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #eee;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  display: inline-block;
  padding: 8px 15px;
  background: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.upload-btn:hover {
  background: #e0e0e0;
}

.upload-btn input {
  display: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f0f0f0;
  color: #333;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #3a7bd5;
  color: white;
}

.save-btn:hover {
  background: #2d62b0;
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .profile-stats {
    flex-direction: column;
    gap: 10px;
  }

  .progress-cards {
    flex-direction: column;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .labs-grid, .certificates-grid {
    grid-template-columns: 1fr;
  }

  .certificate-card {
    flex-direction: column;
  }

  .certificate-image {
    width: 100%;
    height: 120px;
  }
}
</style>