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
        this.legend = response.data.materials; // Легенда из материалов
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
.legend {
  width: 300px;
  padding: 20px;
  background: white;
  border-left: 1px solid #ddd;
}
.color-box {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border: 1px solid #ccc;
}
</style>
