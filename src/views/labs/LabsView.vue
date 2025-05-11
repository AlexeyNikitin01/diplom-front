<template>
  <div class="labs-container">
    <div class="controls">
      <div class="search-section">
        <input
            v-model="searchQuery"
            placeholder="Поиск лабораторных..."
            class="search-input"
            @input="applyFilters"
        >
        <button class="search-btn">
          <i class="fas fa-search"></i>
        </button>
      </div>

      <div class="filter-section">
        <div class="filter-group">
          <label>Статус:</label>
          <select v-model="statusFilter" @change="applyFilters" class="filter-select">
            <option value="all">Все</option>
            <option value="completed">Завершено</option>
            <option value="in-progress">В процессе</option>
            <option value="not-started">Не начато</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Сложность:</label>
          <select v-model="difficultyFilter" @change="applyFilters" class="filter-select">
            <option value="all">Все</option>
            <option value="easy">Легкая</option>
            <option value="medium">Средняя</option>
            <option value="hard">Сложная</option>
          </select>
        </div>

        <div class="filter-group tags-filter">
          <label>Темы:</label>
          <div class="tags-container">
            <span
                v-for="tag in allTags"
                :key="tag"
                class="tag"
                :class="{ 'active': selectedTags.includes(tag) }"
                @click="toggleTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">{{ filteredLabs.length }}</div>
        <div class="stat-label">Всего работ</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ completedCount }}</div>
        <div class="stat-label">Завершено</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ inProgressCount }}</div>
        <div class="stat-label">В процессе</div>
      </div>
    </div>

    <div class="labs-grid">
      <div
          v-for="lab in filteredLabs"
          :key="lab.id"
          class="lab-card"
          :class="{
          'completed': lab.status === 'completed',
          'in-progress': lab.status === 'in-progress',
          'not-started': lab.status === 'not-started'
        }"
          @click="selectLab(lab)"
      >
        <div class="card-header">
          <h3 class="lab-title">{{ lab.title }}</h3>
          <span class="difficulty-badge" :class="lab.difficulty">
            {{ getDifficultyText(lab.difficulty) }}
          </span>
        </div>

        <div class="lab-image-container">
          <img :src="lab.image" :alt="lab.title" class="lab-image">
        </div>

        <div class="lab-description">{{ lab.description }}</div>

        <div class="tags-container">
          <span v-for="tag in lab.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="card-footer">
          <div class="status-indicator">
            <span class="status-dot"></span>
            {{ formatStatus(lab.status) }}
          </div>
          <div class="due-date" v-if="lab.dueDate">
            <i class="far fa-calendar-alt"></i>
            {{ formatDate(lab.dueDate) }}
          </div>
        </div>

        <div class="progress-bar" v-if="lab.status !== 'completed'">
          <div
              class="progress-fill"
              :style="{ width: lab.progress + '%' }"
          ></div>
        </div>

        <div class="card-body d-flex flex-column">
          <h5 class="card-title font-weight-bold">{{ lab.name }}</h5>
          <p class="card-text text-muted mb-3 flex-grow-1">{{ lab.description || 'Описание отсутствует' }}</p>
          <button class="btn btn-primary btn-block mt-auto" @click="viewLab(lab.id)">
            <i class="fas fa-info-circle mr-2"></i>Подробнее
          </button>
        </div>

      </div>
    </div>

    <div v-if="selectedLab" class="lab-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>

        <h2 class="modal-title">{{ selectedLab.title }}</h2>

        <div class="modal-meta">
          <span class="difficulty-badge" :class="selectedLab.difficulty">
            {{ getDifficultyText(selectedLab.difficulty) }}
          </span>
          <span class="status-indicator">
            <span class="status-dot"></span>
            {{ formatStatus(selectedLab.status) }}
          </span>
          <span class="due-date" v-if="selectedLab.dueDate">
            <i class="far fa-calendar-alt"></i>
            Срок: {{ formatDate(selectedLab.dueDate) }}
          </span>
        </div>

        <div class="modal-image-container">
          <img :src="selectedLab.image" :alt="selectedLab.title" class="modal-image">
        </div>

        <div class="modal-description">
          <h3>Описание работы</h3>
          <p>{{ selectedLab.description }}</p>
        </div>

        <div class="modal-objectives">
          <h3>Цели работы</h3>
          <ul>
            <li v-for="(objective, index) in selectedLab.objectives" :key="index">
              {{ objective }}
            </li>
          </ul>
        </div>

        <div class="modal-equipment">
          <h3>Оборудование и материалы</h3>
          <ul>
            <li v-for="(item, index) in selectedLab.equipment" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="modal-tags">
          <h3>Темы</h3>
          <div class="tags-container">
            <span v-for="tag in selectedLab.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button
              v-if="selectedLab.status !== 'completed'"
              class="action-btn complete-btn"
              @click="updateLabStatus(selectedLab.id, 'completed')"
          >
            Отметить как завершенную
          </button>
          <button
              v-if="selectedLab.status === 'not-started'"
              class="action-btn start-btn"
              @click="updateLabStatus(selectedLab.id, 'in-progress')"
          >
            Начать лабораторную
          </button>
          <button class="action-btn materials-btn">
            <i class="fas fa-book"></i> Методические материалы
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaterialsScienceLabs',
  data() {
    return {
      searchQuery: '',
      statusFilter: 'all',
      difficultyFilter: 'all',
      selectedTags: [],
      selectedLab: null,
      labs: [
        {
          id: 1,
          title: 'Определение твердости металлов',
          description: 'Исследование методов измерения твердости металлов по Бринеллю, Роквеллу и Виккерсу.',
          status: 'completed',
          difficulty: 'medium',
          tags: ['металлы', 'твердость', 'механические свойства'],
          dueDate: '2023-10-15',
          progress: 100,
          image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          objectives: [
            'Изучить принципы измерения твердости',
            'Освоить методики проведения испытаний',
            'Сравнить результаты разных методов'
          ],
          equipment: [
            'Твердомер Бринелля',
            'Твердомер Роквелла',
            'Микротвердомер Виккерса',
            'Образцы металлов'
          ]
        },
        {
          id: 2,
          title: 'Микроструктурный анализ сталей',
          description: 'Изучение микроструктуры углеродистых сталей в равновесном состоянии после различных видов термической обработки.',
          status: 'in-progress',
          difficulty: 'hard',
          tags: ['стали', 'микроструктура', 'термообработка'],
          dueDate: '2023-11-10',
          progress: 65,
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          objectives: [
            'Изучить влияние содержания углерода на структуру сталей',
            'Анализировать изменения микроструктуры после отжига и закалки',
            'Освоить методику приготовления микрошлифов'
          ],
          equipment: [
            'Металлографический микроскоп',
            'Шлифовальный станок',
            'Образцы сталей с разным содержанием углерода',
            'Травящие реактивы'
          ]
        },
        {
          id: 3,
          title: 'Исследование полимерных материалов',
          description: 'Определение физико-механических характеристик полимерных материалов и изучение их структуры.',
          status: 'not-started',
          difficulty: 'medium',
          tags: ['полимеры', 'пластмассы', 'механические испытания'],
          dueDate: '2023-11-25',
          progress: 0,
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          objectives: [
            'Изучить классификацию полимерных материалов',
            'Определить прочностные характеристики образцов',
            'Исследовать термомеханические свойства'
          ],
          equipment: [
            'Разрывная машина',
            'Прибор для определения ударной вязкости',
            'Термокамера',
            'Образцы полимеров'
          ]
        },
        {
          id: 4,
          title: 'Керамические материалы и их свойства',
          description: 'Исследование физико-химических свойств керамических материалов и методов их испытания.',
          status: 'in-progress',
          difficulty: 'medium',
          tags: ['керамика', 'хрупкие материалы', 'прочность'],
          dueDate: '2023-11-18',
          progress: 30,
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          objectives: [
            'Изучить особенности строения керамических материалов',
            'Определить прочность на сжатие',
            'Исследовать термическую стойкость'
          ],
          equipment: [
            'Пресс для испытания на сжатие',
            'Печь для термоциклирования',
            'Микроскоп для анализа структуры',
            'Образцы керамики'
          ]
        },
        {
          id: 5,
          title: 'Композиционные материалы',
          description: 'Изучение структуры и свойств композиционных материалов с металлической и полимерной матрицей.',
          status: 'not-started',
          difficulty: 'hard',
          tags: ['композиты', 'армированные материалы', 'механические свойства'],
          dueDate: '2023-12-05',
          progress: 0,
          image: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          objectives: [
            'Изучить классификацию композиционных материалов',
            'Сравнить свойства материалов с разным типом армирования',
            'Исследовать анизотропию свойств'
          ],
          equipment: [
            'Установка для испытания на растяжение',
            'Прибор для определения ударной вязкости',
            'Микроскоп для анализа структуры',
            'Набор образцов композитов'
          ]
        },
        {
          id: 6,
          title: 'Коррозия металлов',
          description: 'Исследование процессов коррозии металлов в различных средах и методов защиты от коррозии.',
          status: 'completed',
          difficulty: 'easy',
          tags: ['коррозия', 'металлы', 'защитные покрытия'],
          dueDate: '2023-10-30',
          progress: 100,
          image: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          objectives: [
            'Изучить виды коррозионных разрушений',
            'Провести ускоренные коррозионные испытания',
            'Исследовать эффективность защитных покрытий'
          ],
          equipment: [
            'Коррозионная камера',
            'Весы аналитические',
            'Микроскоп для анализа поверхности',
            'Набор образцов с покрытиями'
          ]
        },
        {
          id: 7,
          title: 'Кристаллическая структура металлов',
          description: 'Изучение кристаллического строения металлов и дефектов кристаллической решетки.',
          status: 'not-started',
          difficulty: 'hard',
          tags: ['металлы', 'кристаллическая структура', 'микроскопия'],
          dueDate: '2023-12-15',
          progress: 0,
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          objectives: [
            'Изучить типы кристаллических решеток',
            'Исследовать дефекты кристаллического строения',
            'Освоить методы рентгеноструктурного анализа'
          ],
          equipment: [
            'Рентгеновский дифрактометр',
            'Электронный микроскоп',
            'Набор образцов металлов',
            'Программное обеспечение для анализа'
          ]
        },
        {
          id: 8,
          title: 'Термическая обработка сплавов',
          description: 'Исследование влияния режимов термической обработки на свойства металлических сплавов.',
          status: 'in-progress',
          difficulty: 'medium',
          tags: ['сплавы', 'термообработка', 'механические свойства'],
          dueDate: '2023-11-28',
          progress: 40,
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          objectives: [
            'Изучить виды термической обработки',
            'Провести отжиг, закалку и отпуск образцов',
            'Оценить изменение механических свойств'
          ],
          equipment: [
            'Муфельная печь',
            'Термостат',
            'Твердомер',
            'Образцы сталей и цветных сплавов'
          ]
        }
      ]
    }
  },
  computed: {
    allTags() {
      const tags = new Set()
      this.labs.forEach(lab => {
        lab.tags.forEach(tag => tags.add(tag))
      })
      return Array.from(tags)
    },
    filteredLabs() {
      return this.labs.filter(lab => {
        // Поисковый запрос
        const matchesSearch = lab.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            lab.description.toLowerCase().includes(this.searchQuery.toLowerCase())

        // Фильтр по статусу
        const matchesStatus = this.statusFilter === 'all' || lab.status === this.statusFilter

        // Фильтр по сложности
        const matchesDifficulty = this.difficultyFilter === 'all' || lab.difficulty === this.difficultyFilter

        // Фильтр по тегам
        const matchesTags = this.selectedTags.length === 0 ||
            this.selectedTags.some(tag => lab.tags.includes(tag))

        return matchesSearch && matchesStatus && matchesDifficulty && matchesTags
      })
    },
    completedCount() {
      return this.labs.filter(lab => lab.status === 'completed').length
    },
    inProgressCount() {
      return this.labs.filter(lab => lab.status === 'in-progress').length
    }
  },
  methods: {
    applyFilters() {
      // Метод вызывается при изменении фильтров
      // Вычисляемое свойство filteredLabs обновится автоматически
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index === -1) {
        this.selectedTags.push(tag)
      } else {
        this.selectedTags.splice(index, 1)
      }
      this.applyFilters()
    },
    selectLab(lab) {
      this.selectedLab = { ...lab }
    },
    closeModal() {
      this.selectedLab = null
    },
    updateLabStatus(id, status) {
      const lab = this.labs.find(l => l.id === id)
      if (lab) {
        lab.status = status
        if (status === 'completed') {
          lab.progress = 100
        } else if (status === 'in-progress' && lab.progress === 0) {
          lab.progress = 10
        }
        this.closeModal()
      }
    },
    formatStatus(status) {
      const statusMap = {
        'completed': 'Завершено',
        'in-progress': 'В процессе',
        'not-started': 'Не начато'
      }
      return statusMap[status] || status
    },
    getDifficultyText(difficulty) {
      const difficultyMap = {
        'easy': 'Легкая',
        'medium': 'Средняя',
        'hard': 'Сложная'
      }
      return difficultyMap[difficulty] || difficulty
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('ru-RU', options)
    },
    viewLab(labID) {
      this.$router.push(`/labs/${labID}`);
    },
  }
}
</script>

<style scoped>
/* Базовые стили */
.labs-container {
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  background-color: #f5f7fa;
}

/* Секция управления */
.controls {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.search-section {
  display: flex;
  margin-bottom: 25px;
}

.search-input {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid #e0e0e0;
  border-radius: 8px 0 0 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.search-input:focus {
  outline: none;
  border-color: #3a7bd5;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(58, 123, 213, 0.2);
}

.search-btn {
  padding: 0 22px;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: linear-gradient(to right, #3366b8, #00c2e6);
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.filter-group label {
  margin-bottom: 10px;
  font-weight: 600;
  color: #555;
  font-size: 15px;
}

.filter-select {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
}

.filter-select:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 2px rgba(58, 123, 213, 0.2);
  background: #fff;
}

.tags-filter {
  flex: 1;
  min-width: 100%;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 8px 14px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #555;
}

.tag:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.tag.active {
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  color: white;
  box-shadow: 0 2px 8px rgba(58, 123, 213, 0.3);
}

/* Статистика */
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #3a7bd5;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 15px;
  color: #777;
}

/* Сетка лабораторных работ */
.labs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.lab-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
}

.lab-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.lab-card.completed {
  border-top: 4px solid #4caf50;
}

.lab-card.in-progress {
  border-top: 4px solid #ff9800;
}

.lab-card.not-started {
  border-top: 4px solid #f44336;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding: 20px 20px 0 20px;
}

.lab-title {
  margin: 0;
  font-size: 19px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.difficulty-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  margin-left: 10px;
}

.difficulty-badge.easy {
  background: #e8f5e9;
  color: #2e7d32;
}

.difficulty-badge.medium {
  background: #fff8e1;
  color: #ff8f00;
}

.difficulty-badge.hard {
  background: #ffebee;
  color: #c62828;
}

.lab-image-container {
  height: 180px;
  overflow: hidden;
  position: relative;
}

.lab-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.lab-card:hover .lab-image {
  transform: scale(1.05);
}

.lab-description {
  color: #666;
  font-size: 15px;
  line-height: 1.5;
  margin: 0 20px 15px 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 70px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding: 15px 20px;
  font-size: 14px;
  color: #777;
  background-color: #f9f9f9;
}

.status-indicator {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.completed .status-dot {
  background: #4caf50;
}

.in-progress .status-dot {
  background: #ff9800;
}

.not-started .status-dot {
  background: #f44336;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: #f0f0f0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #3a7bd5, #00d2ff);
  transition: width 0.5s ease;
}

.completed .progress-fill {
  background: #4caf50;
}

.in-progress .progress-fill {
  background: #ff9800;
}

/* Модальное окно */
.lab-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  transition: color 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  color: #333;
  background-color: #f0f0f0;
}

.modal-title {
  margin: 30px 30px 15px 30px;
  color: #222;
  font-size: 26px;
  font-weight: 700;
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0 30px 25px 30px;
  flex-wrap: wrap;
}

.modal-image-container {
  height: 350px;
  overflow: hidden;
  margin: 0 30px 25px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-description, .modal-objectives, .modal-equipment, .modal-tags {
  margin: 0 30px 25px 30px;
}

.modal-description h3, .modal-objectives h3, .modal-equipment h3, .modal-tags h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #3a7bd5;
  font-size: 20px;
  font-weight: 600;
}

.modal-description p {
  line-height: 1.7;
  color: #555;
  font-size: 16px;
}

.modal-objectives ul, .modal-equipment ul {
  padding-left: 20px;
  color: #555;
  line-height: 1.7;
}

.modal-objectives li, .modal-equipment li {
  margin-bottom: 8px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin: 30px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.complete-btn {
  background: linear-gradient(to right, #4caf50, #66bb6a);
  color: white;
}

.complete-btn:hover {
  background: linear-gradient(to right, #43a047, #5cb860);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.start-btn {
  background: linear-gradient(to right, #ff9800, #ffa726);
  color: white;
}

.start-btn:hover {
  background: linear-gradient(to right, #fb8c00, #ff9e22);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.materials-btn {
  background: #f0f0f0;
  color: #555;
}

.materials-btn:hover {
  background: #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Адаптация под мобильные устройства */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    gap: 20px;
  }

  .filter-group {
    min-width: 100%;
  }

  .stats {
    flex-direction: column;
    gap: 15px;
  }

  .labs-grid {
    grid-template-columns: 1fr;
  }

  .modal-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .modal-image-container {
    height: 250px;
    margin-left: 15px;
    margin-right: 15px;
  }

  .modal-description, .modal-objectives, .modal-equipment, .modal-tags {
    margin-left: 15px;
    margin-right: 15px;
  }

  .modal-actions {
    margin: 20px 15px;
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>