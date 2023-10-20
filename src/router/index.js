import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Characters from "../components/Characters.vue";
import CharactersDetails from "../components/CharactersDetails.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/",
      component: Characters,
    },
   
  ],
});

export default router;
