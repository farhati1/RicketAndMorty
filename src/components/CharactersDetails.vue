<template>
  <div class="character-details">
    <div class="modal" v-if="character">
      <div class="modal-content">
        <span class="close-button" @click="closeModal">X</span>
        <h2>{{ character.name }}</h2>
        <p>Statut : {{ character.status }}</p>
        <p>Lieu : {{ character.location.name }}</p>
        <!-- Autres détails du personnage ici -->
        
        <!-- Boucle pour afficher la liste des épisodes -->
        <div v-for="episode in character.episodes" :key="episode.id">
          <h3>{{ episode.name }}</h3>
          <p>Numéro d'épisode : {{ episode.episode }}</p>
          <p>Date de diffusion : {{ episode.air_date }}</p>
          <!-- Affichez la liste des personnages présents dans l'épisode ici -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    characterId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      character: null, // Stocke les détails du personnage
    };
  },
  watch: {
    characterId: {
      immediate: true, // Pour gérer le changement initial de l'ID
      handler(newId) {
        if (newId) {
          this.loadCharacterDetails(newId);
        }
      },
    },
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },

    async loadCharacterDetails(characterId) {
    // Utilisez Axios pour récupérer les détails du personnage en fonction de characterId
    const characterResponse = await axios.get(`https://rickandmortyapi.com/api/character/${characterId}`);
    this.character = characterResponse.data;

    // Récupérez les détails de chaque épisode
    const episodeDetails = await Promise.all(
      this.character.episode.map(async (episodeUrl) => {
        const episodeResponse = await axios.get(episodeUrl);
        const episodeData = episodeResponse.data;

        // Récupérez les détails des personnages présents dans l'épisode
        episodeData.characters = await Promise.all(
          episodeData.characters.map(async (characterUrl) => {
            const characterResponse = await axios.get(characterUrl);
            return characterResponse.data;
          })
        );

        return episodeData;
      })
    );

    // Associez les détails des épisodes et des personnages au personnage
    this.character.episodes = episodeDetails;
    },
  },
  // ...
};
</script>
