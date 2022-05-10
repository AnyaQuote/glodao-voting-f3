import Vue from "vue"
import Vuetify from "vuetify/lib/framework"

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    dark: true,
    themes: {
      dark: {
        primary: {
          base: "#de7b25",
          lighten1: "#FFF6E7"
        },
        accent: "#00CEFF",
        gray1: "#e0e0e0",
        background: "#210f01",
        cardBackground: "#1A1E30",
        cardSubBackground: "#210f01",
        subtitle: "#9298AB",
        linkText: "#20BBC9",
        orange: "#DE7B25",
        orange2: "FFC04E",
        orange3: "#FFC04E",
        orange4: "#FFB337",
        brown: "#714A28",
        darkbrown: "#714A28",
        silver: "#362A23",
        neutral10: "#AFB9CF",
        neutral20: "#947B6D"
      }
    }
  }
})
