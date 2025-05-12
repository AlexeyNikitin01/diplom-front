<template>
  <div class="airplane-viewer">
    <!-- 3D модель -->
    <div ref="canvasContainer" class="model-container"></div>

    <!-- Информация -->
    <div class="airplane-info">
      <!-- Легенда -->
      <div class="card legend-card">
        <h3>Легенда самолёта</h3>
        <ul>
          <li v-for="(material, index) in legend" :key="index">
            <span :style="{ backgroundColor: material.color }" class="color-box"></span>
            {{ material.name }} ({{ material.description }})
          </li>
        </ul>
      </div>

      <!-- Описание -->
      <div class="card description-card">
        <h2>{{ airplane.name }}</h2>
        <p><strong>Производитель:</strong> {{ airplane.manufacturer }}</p>
        <p><strong>Год:</strong> {{ airplane.year }}</p>
        <p class="airplane-description">{{ airplane.description }}</p>
        <div class="airplane-description" v-html="airplane.lecture_description"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from "axios";

export default {
  props: {
    modelId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      legend: [],
      airplane: {
        name: '',
        manufacturer: '',
        year: '',
        description: '',
        lecture_description: '',
      },
    };
  },
  async mounted() {
    await this.fetchModelData();
    this.initThreeJS();
  },
  methods: {
    async fetchModelData() {
      try {
        const response = await axios.get(`http://localhost:3344/labs/models/${this.$route.params.id}`, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
          }
        });
        const data = response.data;
        this.legend = data.materials;
        this.airplane = {
          name: data.name,
          manufacturer: data.manufacturer,
          year: data.year,
          description: data.description,
          lecture_description: data.lecture_description,
        };
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    },
    initThreeJS() {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      const camera = new THREE.PerspectiveCamera(75, this.$refs.canvasContainer.clientWidth / this.$refs.canvasContainer.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(this.$refs.canvasContainer.clientWidth, this.$refs.canvasContainer.clientHeight);
      this.$refs.canvasContainer.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      const loader = new GLTFLoader();
      loader.load(
          `/models/airplane_${this.$route.params.id}.glb`,
          (gltf) => {
            scene.add(gltf.scene);
          },
          undefined,
          (error) => {
            console.error('Ошибка загрузки модели:', error);
          }
      );

      camera.position.z = 5;
      const controls = new OrbitControls(camera, renderer.domElement);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    },
  },
};
</script>

<style scoped>
.airplane-viewer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

/* Модель */
.model-container {
  width: 100%;
  height: 50vh;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f0f0f0;
}

/* Блок с описанием и легендой */
.airplane-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

/* Общие стили карточек */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Легенда */
.legend-card h3 {
  margin-bottom: 16px;
  color: #2c3e50;
  text-align: center;
}

.legend-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legend-card li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  background-color: #f9f9f9;
  padding: 6px 10px;
  border-radius: 4px;
}

.color-box {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

/* Описание */
.description-card h2 {
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.description-card p {
  margin: 6px 0;
  color: #444;
}

.airplane-description {
  margin-top: 12px;
  line-height: 1.6;
  color: #666;
}
</style>
