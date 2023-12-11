import { defineNuxtPlugin } from "#app";
import VueGoogleMaps from "@fawmi/vue-google-maps";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyBLtF9LaqalS-VgqvjA8o8Jiwg24xRt9zA",
      libraries: "places", // This is required if you use the Autocomplete plugin
    },
    autobindAllEvents: true,
  });
});