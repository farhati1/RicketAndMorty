<script setup>
import { RouterView } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";
import Characters from "./components/Characters.vue";

</script>

<template>
  <header class="bg-gray-800 text-white">
    <div class="container mx-auto">
      <div class="flex items-center">
        
        <Characters />
       
      </div>
    </div>
  </header>

  <RouterView />
</template>


<style>
@import "@/assets/app.css";
</style>
