<template>
  <div class="bg-gray-800 min-h-screen text-gray-200">
    <h2 class="text-2xl font-semibold mb-4">Liste des personnages :</h2>
    <ul>
      <li v-for="character in characters" :key="character.id">
        <div @click="openModal(character)" class="cursor-pointer mb-4">
          <div class="flex items-center bg-gray-600 p-4 rounded-lg">
            <img
              :src="character.image"
              :alt="character.name"
              class="w-16 h-16 rounded-full"
            />
            <div class="ml-4">
              <h3 class="text-xl font-semibold">{{ character.name }}</h3>
              <p>Statut : {{ character.status }}</p>
              <p>Lieu : {{ character.location.name }}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Fenêtre modale pour afficher les détails -->
    <div
      v-if="modalVisible"
      class="fixed top-0 left-0 w-full h-full flex items-center justify-center"
    >
      <div
        class="bg-gray-700 p-6 rounded shadow-lg relative w-5/6 h-4/6 overflow-y-auto"
      >
        <span
          @click="closeModal"
          class="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-gray-800 text-2xl"
          >&times;</span
        >
        <h2 class="text-2xl font-semibold text-white">
          {{ selectedCharacter.name }}
        </h2>
        <p>Statut : {{ selectedCharacter.status }}</p>
        <p>Lieu : {{ selectedCharacter.location.name }}</p>
        <h3 class="text-xl mt-4 text-white">Épisodes</h3>
        <ul>
          <li v-for="episode in episodes" :key="episode.id" class="mb-4">
            <div class="bg-gray-600 p-4 rounded-lg">
              <strong class="text-lg text-white">{{ episode.name }}</strong>
              <p class="mb-1 text-white">
                Numéro d'épisode : {{ episode.episode }}
              </p>
              <p class="text-white">
                Date de diffusion : {{ episode.air_date }}
              </p>
              <h4 class="text-lg mt-2 text-white">Personnages présents :</h4>
              <ul class="flex flex-wrap">
                <li
                  v-for="character in episode.charactersData"
                  :key="character.id"
                  class="mr-4 mb-2"
                >
                  <div class="text-center">
                    <img
                      :src="getCharacterImageUrl(character.id)"
                      :alt="character.name"
                      class="w-16 h-16 rounded-full"
                    />
                    <p class="text-sm text-white">{{ character.name }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      characters: [],
      modalVisible: false,
      selectedCharacter: null,
      episodes: [],
    };
  },
  methods: {
    fetchCharacters() {
      const apiUrl = "https://rickandmortyapi.com/api/character";
      axios
        .get(apiUrl, {
          params: {
            gender: "female",
            species: "human",
          },
        })
        .then((response) => {
          this.characters = response.data.results;
        })
        .catch((error) => {
          console.error("Erreur lors de la requête API :", error);
        });
    },
    async fetchCharacterEpisodes(character) {
      this.episodes = [];
      const episodeURLs = character.episode;

      for (const episodeURL of episodeURLs) {
        try {
          const response = await axios.get(episodeURL);
          const episode = response.data;

          // Récupérez les données des personnages associés à l'épisode
          const characterData = [];
          for (const characterURL of episode.characters) {
            const characterResponse = await axios.get(characterURL);
            characterData.push(characterResponse.data);
          }

          episode.charactersData = characterData; // Ajoutez les données de personnage à l'épisode
          this.episodes.push(episode);
        } catch (error) {
          console.error("Erreur lors de la récupération des épisodes :", error);
        }
      }
    },
    getCharacterImageUrl(characterId) {
      return `https://rickandmortyapi.com/api/character/avatar/${characterId}.jpeg`;
    },
    openModal(character) {
      this.selectedCharacter = character;
      this.modalVisible = true;
      this.fetchCharacterEpisodes(character);
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedCharacter = null;
    },
  },
  created() {
    this.fetchCharacters();
  },
};
</script>
