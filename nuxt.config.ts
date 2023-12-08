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
        type: 'text/javascript'
        
      }
    ]

    }
  },
  
})
