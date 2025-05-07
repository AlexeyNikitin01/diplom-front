<template>
  <div class="models-container">
    <header class="models-header">
      <h1>3D Модели Самолетов</h1>
      <p class="subtitle">
        Изучайте детализированные 3D модели различных самолетов для обучения и анализа.
        Взаимодействуйте с моделями, чтобы изучить структуру, системы и компоненты воздушных судов.
      </p>

      <div class="search-container">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск моделей самолетов..."
            class="search-input"
            @input="filterModels"
        >
        <button class="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </header>

    <div class="filters">
      <div
          v-for="category in categories"
          :key="category"
          class="filter-chip"
          :class="{ 'active': activeFilter === category }"
          @click="setFilter(category)"
      >
        {{ category }}
      </div>
    </div>

    <div class="models-grid">
      <div
          v-for="model in filteredModels"
          :key="model.id"
          class="model-card"
          @click="navigateToModel(model)"
      >
        <div class="model-image-container">
          <img :src="model.thumbnail" :alt="model.name" class="model-image">
          <div class="model-overlay">
            <button class="view-button">Открыть модель</button>
          </div>
        </div>
        <div class="model-info">
          <h3>{{ model.name }}</h3>
          <p class="model-description">{{ model.shortDescription }}</p>
          <div class="model-meta">
            <span class="model-category">{{ model.category }}</span>
            <span class="model-complexity">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {{ model.complexity }}/5
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredModels.length === 0" class="no-results">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h3>Модели не найдены</h3>
      <p>Попробуйте изменить параметры поиска или фильтры</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AircraftModels',
  data() {
    return {
      searchQuery: '',
      activeFilter: 'Все',
      categories: ['Все', 'Пассажирские', 'Военные', 'Частные', 'Вертолеты', 'Исторические'],
      models: [
        {
          id: 1,
          name: 'Boeing 747-8',
          thumbnail: 'https://i.pinimg.com/originals/4f/da/d1/4fdad131631dc19faa6bcefcd13978a3.png',
          shortDescription: 'Знаменитый авиалайнер с детализированными двигателями и кабиной пилотов',
          category: 'Пассажирские',
          complexity: 4,
          modelUrl: '/models/boeing-747'
        },
        {
          id: 2,
          name: 'Airbus A380',
          thumbnail: 'https://p.turbosquid.com/ts-thumb/5u/GE9N7H/ez9BNWYk/airbusa380900genericrigged3dmodel013/jpg/1512990252/1920x1080/fit_q87/fdcd3ce907a9fe20f8b3ba79d7fd3e23ac2d38c7/airbusa380900genericrigged3dmodel013.jpg',
          shortDescription: 'Двухпалубный широкофюзеляжный самолет с полной моделью салона',
          category: 'Пассажирские',
          complexity: 5,
          modelUrl: '/models/a380'
        },
        {
          id: 3,
          name: 'Су-57',
          thumbnail: 'https://uagolos.com/wp-content/uploads/2023/10/80ee00967875f7d876bf9b23139d407f.jpg',
          shortDescription: 'Российский истребитель пятого поколения с системой вооружения',
          category: 'Военные',
          complexity: 4,
          modelUrl: '/models/su57'
        },
        {
          id: 4,
          name: 'Cessna 172',
          thumbnail: 'https://i.playground.ru/p/QYMNzmgdUPCIpzAZvN8g0w.png',
          shortDescription: 'Классический учебный самолет с интерактивными элементами управления',
          category: 'Частные',
          complexity: 2,
          modelUrl: '/models/cessna172'
        },
        {
          id: 5,
          name: 'Ми-8',
          thumbnail: 'https://avatars.mds.yandex.net/i?id=79c791d0b119f42978e3004f505a0f65_l-5287252-images-thumbs&n=13',
          shortDescription: 'Многоцелевой вертолет с детализированной системой роторов',
          category: 'Вертолеты',
          complexity: 3,
          modelUrl: '/models/mi8'
        },
        {
          id: 6,
          name: 'Ил-2',
          thumbnail: 'https://avatars.dzeninfra.ru/get-zen_doc/941737/pub_5fb74b8015eeab28639dd0f1_5fb76d3cb543ac7480d396d0/scale_1200',
          shortDescription: 'Легендарный штурмовик ВОВ с детализированным вооружением',
          category: 'Исторические',
          complexity: 3,
          modelUrl: '/models/il2'
        }
      ]
    }
  },
  computed: {
    filteredModels() {
      let filtered = this.models;

      // Фильтр по категории
      if (this.activeFilter !== 'Все') {
        filtered = filtered.filter(model => model.category === this.activeFilter);
      }

      // Поиск
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(model =>
            model.name.toLowerCase().includes(query) ||
            model.shortDescription.toLowerCase().includes(query) ||
            model.category.toLowerCase().includes(query)
        );
      }

      return filtered;
    }
  },
  methods: {
    setFilter(category) {
      this.activeFilter = category;
    },
    navigateToModel(model) {
      // В реальном приложении используйте Vue Router:
      // this.$router.push(model.modelUrl);
      console.log(`Переход к ${model.modelUrl}`);
    },
    filterModels() {
      // Поиск обрабатывается реактивно через computed-свойство
    }
  }
}
</script>

<style scoped>
/* Стили остаются такими же, как в предыдущем примере */
.models-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.models-header {
  text-align: center;
  margin-bottom: 2rem;
}

.models-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.search-container {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 1rem;
  padding-right: 3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 2px 15px rgba(52, 152, 219, 0.2);
}

.search-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c8d;
}

.filters {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-chip {
  padding: 0.5rem 1rem;
  background: #f1f1f1;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background: #e0e0e0;
}

.filter-chip.active {
  background: #3498db;
  color: white;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.model-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.model-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.model-image-container {
  position: relative;
  padding-top: 60%; /* 3:2 aspect ratio */
  overflow: hidden;
}

.model-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.model-card:hover .model-image {
  transform: scale(1.05);
}

.model-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.model-card:hover .model-overlay {
  opacity: 1;
}

.view-button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  background: white;
  transform: scale(1.05);
}

.model-info {
  padding: 1.25rem;
}

.model-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #2c3e50;
}

.model-description {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.model-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-category {
  font-size: 0.8rem;
  background: #f1f1f1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: #555;
}

.model-complexity {
  font-size: 0.8rem;
  color: #f39c12;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.no-results svg {
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.no-results h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .models-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>