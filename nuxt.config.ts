// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],

  app: {
    head: {
      title: "Map Test",
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-width, initial-scale=1'},

      ],
      link: [

      ],
      script: [
        {
        src: "https://code.jquery.com/jquery-3.7.1.js",
        type: 'text/javascript',
      },
      // {
      //   src: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2dASx5Zo68GSyZuPjUs-4SBLYGsn4OPQ&libraries=places&callback=initAutocomplete&libraries=places&v=weekly",
      //   type: 'text/javascript',
      // }
    ]

    }
  },
})
