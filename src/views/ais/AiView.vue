<template>
  <div class="ai-lecture-container">
    <!-- Блок с лекцией -->
    <section class="lecture-section">
      <h1 class="lecture-title">{{ lecture.title }}</h1>
      <div class="lecture-meta">
        <span class="author">Автор: {{ lecture.author }}</span>
        <span class="date">Дата публикации: {{ formatDate(lecture.created_at) }}</span>
      </div>
      <div class="lecture-content" v-html="lecture.content"></div>
    </section>

    <!-- Блок анализа дефектов -->
    <section class="ai-analysis-section">
      <h2 class="section-title">Анализ дефектов стали с помощью ИИ</h2>
      <p class="section-description">
        Загрузите изображение стального образца для анализа возможных дефектов
      </p>

      <div class="upload-container">
        <div
            class="upload-area"
            @dragover.prevent="dragover"
            @drop.prevent="drop"
            :class="{'dragover': isDragging}"
        >
          <input
              id="steelImage"
              type="file"
              accept="image/*"
              hidden
              @change="handleFileUpload"
          >
          <label for="steelImage" class="upload-label">
            <div v-if="!imagePreview" class="upload-placeholder">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Перетащите сюда изображение или нажмите для выбора</p>
            </div>
            <img v-else :src="imagePreview" alt="Предпросмотр" class="image-preview">
          </label>
        </div>

        <button
            class="analyze-btn"
            @click="analyzeImage"
            :disabled="!uploadedImage || isAnalyzing"
        >
          <span v-if="!isAnalyzing">Анализировать изображение</span>
          <span v-else>Анализ...</span>
        </button>
      </div>
      
      <div class="image-container text-center">
        <img src="/images/resp.jpg" alt="Самолёт" />
      </div>

      <!-- Результаты анализа -->
      <div v-if="analysisResults" class="results-section">
        <h3 class="results-title">Результаты анализа</h3>

        <div class="confidence-indicator">
          <div class="confidence-value">
            Достоверность анализа: {{ analysisResults.confidence_score.toFixed(1) }}%
          </div>
          <div class="confidence-bar">
            <div
                class="confidence-progress"
                :style="{width: analysisResults.confidence_score + '%'}"
            ></div>
          </div>
        </div>

        <div class="defects-list">
          <div
              v-for="(defect, index) in analysisResults.defects"
              :key="index"
              class="defect-card"
              :class="getDefectSeverityClass(defect.severity)"
          >
            <div class="defect-header">
              <h4 class="defect-type">{{ defect.type }}</h4>
              <span class="defect-probability">{{ defect.probability.toFixed(1) }}%</span>
            </div>
            <div class="defect-description">{{ defect.description }}</div>
            <div class="defect-causes" v-if="defect.common_causes">
              <strong>Возможные причины:</strong> {{ defect.common_causes }}
            </div>
          </div>
        </div>

        <div class="recommendations">
          <h4 class="recommendations-title">Рекомендации</h4>
          <p>{{ analysisResults.recommendations }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      lecture: {
        id: null,
        title: '',
        author: '',
        content: '',
        created_at: null
      },
      uploadedImage: null,
      imagePreview: null,
      isDragging: false,
      isAnalyzing: false,
      analysisResults: null
    };
  },
  async created() {
    await this.loadLecture();
  },
  methods: {
    async loadLecture() {
      try {
        const lectureId = this.$route.params.id;
        const response = await axios.get(`http://localhost:3344/labs/ais/${lectureId}`, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
        this.lecture = response.data;
      } catch (error) {
        console.error('Ошибка загрузки лекции:', error);
        this.$notify({
          type: 'error',
          title: 'Ошибка',
          text: 'Не удалось загрузить лекцию'
        });
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.processImage(file);
    },
    dragover() {
      this.isDragging = true;
    },
    drop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      this.processImage(file);
    },
    processImage(file) {
      if (!file.type.match('image.*')) {
        this.$notify({
          type: 'error',
          title: 'Ошибка',
          text: 'Пожалуйста, загрузите файл изображения'
        });
        return;
      }

      this.uploadedImage = file;
      this.analysisResults = null;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async analyzeImage() {
      if (!this.uploadedImage) return;

      this.isAnalyzing = true;

      const formData = new FormData();
      formData.append('image', this.uploadedImage);
      formData.append('lecture_id', this.lecture.id);

      try {
        const response = await axios.post('http://localhost:3344/labs/ais/analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });

        this.analysisResults = response.data;
      } catch (error) {
        console.error('Ошибка анализа:', error);
        this.$notify({
          type: 'error',
          title: 'Ошибка анализа',
          text: 'Не удалось проанализировать изображение'
        });
      } finally {
        this.isAnalyzing = false;
      }
    },
    getDefectSeverityClass(severity) {
      return {
        'low-severity': severity === 'low',
        'medium-severity': severity === 'medium',
        'high-severity': severity === 'high'
      };
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
  }
};
</script>

<style scoped>
.ai-lecture-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.lecture-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.lecture-title {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.lecture-meta {
  display: flex;
  justify-content: space-between;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.lecture-content {
  line-height: 1.6;
  color: #34495e;
}

.lecture-content >>> h2 {
  color: #2c3e50;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.lecture-content >>> p {
  margin-bottom: 1rem;
}

.lecture-content >>> ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.lecture-content >>> li {
  margin-bottom: 0.5rem;
}

.ai-analysis-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.section-description {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.upload-container {
  margin-bottom: 2rem;
}

.upload-area {
  border: 2px dashed #3498db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.upload-area.dragover {
  background-color: #f0f8ff;
  border-color: #2980b9;
}

.upload-label {
  display: block;
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 2.5rem;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.upload-placeholder p {
  color: #7f8c8d;
  margin: 0;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  margin-top: 1rem;
}

.analyze-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.analyze-btn:hover {
  background-color: #2980b9;
}

.analyze-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.results-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  animation: fadeIn 0.5s ease;
}

.results-title {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.confidence-indicator {
  margin-bottom: 1.5rem;
}

.confidence-value {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.confidence-bar {
  height: 10px;
  background-color: #ecf0f1;
  border-radius: 5px;
  overflow: hidden;
}

.confidence-progress {
  height: 100%;
  background-color: #2ecc71;
  transition: width 0.5s ease;
}

.defects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.defect-card {
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.defect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.defect-type {
  margin: 0;
  font-size: 1.1rem;
}

.defect-probability {
  font-weight: bold;
}

.defect-description {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.defect-causes {
  font-size: 0.85rem;
  color: #7f8c8d;
  padding-top: 0.5rem;
  border-top: 1px dashed #eee;
}

.low-severity {
  border-left: 4px solid #2ecc71;
}

.medium-severity {
  border-left: 4px solid #f39c12;
}

.high-severity {
  border-left: 4px solid #e74c3c;
}

.recommendations {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.recommendations-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .ai-lecture-container {
    padding: 1rem;
  }

  .lecture-section,
  .ai-analysis-section {
    padding: 1.5rem;
  }

  .defects-list {
    grid-template-columns: 1fr;
  }
}
</style>