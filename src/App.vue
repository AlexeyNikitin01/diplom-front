<template >
  <div class="container-fluid" style="background-color: #f8f9fa; height: 100vh;">
    <NavBar />
  <main>
    <RouterView />
  </main>
  </div>
  
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavBar from './components/NavBar.vue';

@Options({
  components: {
    NavBar,
  },
})
export default class App extends Vue {}
</script>

<style lang="css" src="./app.css" />