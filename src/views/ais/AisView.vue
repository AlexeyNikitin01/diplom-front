<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

interface MaterialCard {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  defects: string[];
  mlTechniques: string[];
  lastUpdated: string;
}

export default defineComponent({
  name: 'MaterialsScienceAI',
  setup() {
    const searchQuery = ref('');
    const activeCategory = ref('Все');
    const currentPage = ref(1);
    const itemsPerPage = ref(8);

    const categories = [
      'Все',
      'Металлы',
      'Полимеры',
      'Композиты',
      'Керамика',
      'Наноматериалы'
    ];

    const materials = ref<MaterialCard[]>([
      {
        id: 1,
        title: 'Анализ дефектов стали',
        description: 'Компьютерное зрение для обнаружения трещин, коррозии и структурных дефектов в стальных конструкциях',
        image: 'https://avatars.dzeninfra.ru/get-zen_doc/1606228/pub_5dd618b0ac25f442f339f936_5dd62d2dbd6e064b370eef42/scale_1200',
        category: 'Металлы',
        defects: ['Трещины', 'Коррозия', 'Включения', 'Пористость'],
        mlTechniques: ['CNN', 'ResNet50', 'Сегментация U-Net'],
        lastUpdated: '2023-10-15'
      },
      {
        id: 2,
        title: 'Прогнозирование свойств алюминиевых сплавов',
        description: 'Нейронные сети для предсказания механических характеристик по химическому составу',
        image: 'https://mt-holding.ru/upload/iblock/0b2/dn3bio0mp84qrxmwno28nt03us281b6t.webp',
        category: 'Металлы',
        defects: [],
        mlTechniques: ['Регрессия', 'Random Forest', 'XGBoost'],
        lastUpdated: '2023-09-28'
      },
      {
        id: 3,
        title: 'Обнаружение дефектов в композитных материалах',
        description: 'Глубокое обучение для выявления расслоений и повреждений в углепластиках',
        image: 'https://i.pinimg.com/736x/09/b9/5a/09b95a2c8c84a47d59c138b409d4a545.jpg',
        category: 'Композиты',
        defects: ['Расслоения', 'Разрывы волокон', 'Деформации'],
        mlTechniques: ['YOLOv8', 'Трансформеры', 'GAN'],
        lastUpdated: '2023-11-02'
      },
      {
        id: 4,
        title: 'Классификация микроструктур',
        description: 'Автоматическая классификация микроструктур металлов с помощью компьютерного зрения',
        image: 'https://avatars.mds.yandex.net/i?id=1eccba3eb80bca05535ceb9c1e422601_l-5340383-images-thumbs&n=13',
        category: 'Металлы',
        defects: [],
        mlTechniques: ['Кластеризация', 'SVM', 'ViT'],
        lastUpdated: '2023-08-17'
      },
      {
        id: 5,
        title: 'Прогнозирование усталостных характеристик',
        description: 'ML модели для предсказания усталостной долговечности металлических деталей',
        image: 'https://example.com/fatigue-analysis.jpg',
        category: 'Металлы',
        defects: ['Усталостные трещины'],
        mlTechniques: ['LSTM', 'Временные ряды', 'CatBoost'],
        lastUpdated: '2023-10-30'
      },
      {
        id: 6,
        title: 'Анализ дефектов сварных швов',
        description: 'Автоматическое обнаружение дефектов сварки с помощью глубокого обучения',
        image: 'https://ac-bastion.ru/wp-content/uploads/b/7/5/b752b5511cb1b8b04accc81148b8bba2.jpeg',
        category: 'Металлы',
        defects: ['Поры', 'Непровары', 'Подрезы', 'Шлаковые включения'],
        mlTechniques: ['Mask R-CNN', 'EfficientNet', 'Градиентный бустинг'],
        lastUpdated: '2023-09-12'
      },
      {
        id: 7,
        title: 'Оптимизация состава полимеров',
        description: 'Генеративные модели для разработки новых полимерных композиций',
        image: 'https://avatars.mds.yandex.net/get-altay/11937297/2a0000018e1514874d579ee22d0639b29914/XXL_height',
        category: 'Полимеры',
        defects: [],
        mlTechniques: ['GAN', 'VAE', 'Reinforcement Learning'],
        lastUpdated: '2023-11-05'
      },
      {
        id: 8,
        title: 'Обнаружение дефектов литья',
        description: 'Компьютерное зрение для автоматического контроля качества отливок',
        image: 'https://101benzopila.ru/wp-content/uploads/f/8/2/f820e4b378b7e79d5eb5743f60273e45.jpeg',
        category: 'Металлы',
        defects: ['Раковины', 'Газовые поры', 'Наливы', 'Деформации'],
        mlTechniques: ['Faster R-CNN', 'DenseNet', 'Обучение с подкреплением'],
        lastUpdated: '2023-10-22'
      },
      {
        id: 9,
        title: 'Анализ коррозионных повреждений',
        description: 'Классификация типов коррозии и оценка степени повреждений с помощью ИИ',
        image: 'https://avatars.mds.yandex.net/i?id=0367726b062567438ec711bc76059896_sr-4234782-images-thumbs&n=13',
        category: 'Металлы',
        defects: ['Питтинговая коррозия', 'Щелевая коррозия', 'Межкристаллитная коррозия'],
        mlTechniques: ['Классификация изображений', 'Transfer Learning', 'Grad-CAM'],
        lastUpdated: '2023-09-18'
      },
      {
        id: 10,
        title: 'Прогнозирование свойств керамики',
        description: 'Нейросетевые модели для предсказания термической стойкости керамических материалов',
        image: 'https://fsd.videouroki.net/html/2017/05/01/v_5906e71f37d10/img4.jpg',
        category: 'Керамика',
        defects: ['Трещины', 'Деформации при спекании'],
        mlTechniques: ['Регрессионный анализ', 'Нейронные сети', 'Ансамбли'],
        lastUpdated: '2023-10-08'
      }
    ]);

    const filteredMaterials = computed(() => {
      let filtered = materials.value;

      // Фильтрация по категории
      if (activeCategory.value !== 'Все') {
        filtered = filtered.filter(m => m.category === activeCategory.value);
      }

      // Поиск по запросу
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(m =>
            m.title.toLowerCase().includes(query) ||
            m.description.toLowerCase().includes(query) ||
            m.category.toLowerCase().includes(query) ||
            m.defects.some(d => d.toLowerCase().includes(query)) ||
            m.mlTechniques.some(t => t.toLowerCase().includes(query)));
      }

      return filtered;
    });

    const totalPages = computed(() =>
        Math.ceil(filteredMaterials.value.length / itemsPerPage.value)
    );

    const paginatedMaterials = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredMaterials.value.slice(start, end);
    });

    const changePage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const setCategory = (category: string) => {
      activeCategory.value = category;
      currentPage.value = 1;
    };

    return {
      searchQuery,
      activeCategory,
      currentPage,
      categories,
      materials,
      filteredMaterials,
      totalPages,
      paginatedMaterials,
      changePage,
      setCategory
    };
  },
  methods: {
    viewAI(aiID: number) {
      this.$router.push(`/ais/${aiID}`);
    },
  }
});
</script>

<template>
  <div class="materials-science-container">
    <header class="header">
      <h1>Материаловедение с использованием ИИ</h1>
      <p class="subtitle">
        Применение машинного обучения, нейронных сетей и компьютерного зрения
        для анализа материалов, обнаружения дефектов и прогнозирования свойств
      </p>

      <div class="search-controls">
        <div class="search-bar">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по материалам, дефектам или методам..."
              class="search-input"
          >
          <button class="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div class="category-filters">
          <button
              v-for="category in categories"
              :key="category"
              class="category-button"
              :class="{ 'active': activeCategory === category }"
              @click="setCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </header>

    <div class="materials-grid">
      <div
          v-for="material in paginatedMaterials"
          :key="material.id"
          class="material-card"
      >
        <div class="card-image-container">
          <img :src="material.image" :alt="material.title" class="card-image">
        </div>

        <div class="card-content d-flex flex-column">
          <h3>{{ material.title }}</h3>
          <p class="card-description">{{ material.description }}</p>

          <div class="card-details">
            <div class="detail-section" v-if="material.defects.length > 0">
              <h4>Обнаружение дефектов:</h4>
              <div class="defects-list">
                <span v-for="defect in material.defects" :key="defect" class="defect-tag">
                  {{ defect }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Методы ИИ:</h4>
              <div class="ml-techniques">
                <span v-for="tech in material.mlTechniques" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </div>

            <div class="meta-info">
              <span class="category">{{ material.category }}</span>
              <span class="updated">Обновлено: {{ material.lastUpdated }}</span>
            </div>

          </div>
          <button class="btn btn-primary btn-block mt-auto" @click="viewAI(material.id)">
            <i class="fas fa-info-circle mr-2"></i>Подробнее
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredMaterials.length === 0" class="no-results">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h3>Материалы не найдены</h3>
      <p>Попробуйте изменить параметры поиска или выберите другую категорию</p>
    </div>

    <div v-if="filteredMaterials.length > 0" class="pagination-controls">
      <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
      >
        &lt; Назад
      </button>

      <div class="page-numbers">
        <button
            v-for="page in totalPages"
            :key="page"
            class="page-button"
            :class="{ 'active': page === currentPage }"
            @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
      >
        Вперед &gt;
      </button>
    </div>

    <div v-if="filteredMaterials.length > 0" class="results-info">
      Показано {{ paginatedMaterials.length }} из {{ filteredMaterials.length }} материалов
    </div>
  </div>
</template>

<style scoped>
.materials-science-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.header h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #555;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.search-controls {
  max-width: 900px;
  margin: 0 auto;
}

.search-bar {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem;
  padding-right: 3rem;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 2px 12px rgba(66, 133, 244, 0.2);
}

.search-button {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.category-button {
  padding: 0.5rem 1.2rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  color: #444;
}

.category-button:hover {
  background-color: #e0e0e0;
}

.category-button.active {
  background-color: #4285f4;
  color: white;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.material-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.material-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.card-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.material-card:hover .card-image {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(234, 67, 53, 0.9);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 79%; /* Важно, если карточка в сетке или имеет ограничение по высоте */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.card-content h3 {
  margin: 0 0 0.8rem;
  color: #2c3e50;
  font-size: 1.2rem;
}

.card-description {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.2rem;
}

.card-details {
  margin-top: 1rem;
}

.detail-section {
  margin-bottom: 1rem;
}

.detail-section h4 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: #4285f4;
}

.defects-list, .ml-techniques {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.defect-tag {
  background-color: #fce8e6;
  color: #d93025;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.tech-tag {
  background-color: #e8f0fe;
  color: #1a73e8;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #666;
}

.category {
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-results svg {
  margin-bottom: 1rem;
  color: #999;
}

.no-results h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.pagination-button {
  padding: 0.6rem 1.2rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-button:hover {
  background-color: #f5f5f5;
}

.page-button.active {
  background-color: #4285f4;
  color: white;
  border-color: #4285f4;
}

.results-info {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .materials-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .pagination-controls {
    flex-wrap: wrap;
  }
}
</style>