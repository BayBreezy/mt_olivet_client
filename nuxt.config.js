import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s",
    title: "Mt. Olivet Center",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "nuxt-helmet",
    "nuxt-webfontloader",
    "nuxt-socket-io",
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/dayjs",
    "@nuxtjs/strapi",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa"
  ],
  // Strapi configuration
  strapi: {
    url: process.env.STRAPI_URL,
    expires: "2d",
    key: "MTO",
    cookie: {
      maxAge: 172800,
      path: "/"
    }
  },
  // WebFont config
  webfontloader: {
    google: {
      families: [
        "Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
      ]
    }
  },
  // Socket io Configuration
  io: {
    // module options
    sockets: [
      {
        url: process.env.STRAPI_URL,
        default: true
      }
    ]
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en"
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    defaultAssets: {
      font: {
        family: "Poppins"
      }
    },
    theme: {
      light: true,
      themes: {
        light: {
          primary: "#2DA87C",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        dark: {
          primary: "#2DA87C",
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  env: {
    STRAPI_URL: process.env.STRAPI_URL
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
