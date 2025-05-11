<template>
  <div class="airplane-viewer">
    <div ref="canvasContainer" class="model-container"></div>

    <div class="legend">
      <h3>Легенда самолёта</h3>
      <ul>
        <li v-for="(material, index) in legend" :key="index">
          <span class="color-box" :style="{ backgroundColor: material.color }"></span>
          {{ material.name }} ({{ material.description }})
        </li>
      </ul>
    </div>

    <div class="description-card">
      <h2>{{ airplane.name }}</h2>
      <p><strong>Производитель:</strong> {{ airplane.manufacturer }}</p>
      <p><strong>Год:</strong> {{ airplane.year }}</p>
      <p class="airplane-description">{{ airplane.description }}</p>
      <p class="airplane-description" v-html="airplane.lecture_description"></p>
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
  async mounted() {
    await this.fetchModelData();
    this.initThreeJS();
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

      // Освещение
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Загрузка модели (файл лежит в public/models/)
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
  height: 100vh;
}
.model-container {
  flex: 1;
  background: #f0f0f0;
}
.color-box {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border: 1px solid #ccc;
}
.airplane-viewer {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.description-card {
  background-color: #f7f9fb;
  border-left: 5px solid #4a90e2;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.description-card h2 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #333;
}

.description-card p {
  margin: 4px 0;
  color: #555;
}

.airplane-description {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}

.model-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.legend {
  margin-top: 16px;
}

.legend h3 {
  margin-bottom: 10px;
  color: #444;
}

.legend ul {
  list-style: none;
  padding: 0;
}

.legend li {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.color-box {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

</style>
