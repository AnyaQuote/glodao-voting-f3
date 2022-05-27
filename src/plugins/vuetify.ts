import { localData } from '@/stores/local-data'
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import settingsSvg from '../assets/icons/settings.svg'

Vue.use(Vuetify)

export default new Vuetify({
  iconfont: 'fa',
  icons: {
    iconfont: 'fa',
    values: {
      // settings: settingsSvg,
    },
  },
  theme: {
    dark: !localData.lightmode,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: {
          base: '#000000',
        },
        success: {
          base: '#5FCD5B',
          lighten1: '#dff5de',
        },
        secondary: '#424242',
        twitter: '#039BE5',
        accent: '#0EB2E5',
        error: '#F44336',
        info: '#2196F3',
        warning: '#FFC107',
        grey1: '#72687A',
        grey2: '#8197BB',
        subtitle: '#969696',
        red1: '#FF0000',
        background: {
          base: '#E5E5E5',
        },
        bluePrimary: {
          base: '#0276F0',
          lighten1: '#E6F1FE',
          lighten2: '#55ACE3',
        },
        neutral0: {
          base: '#06032B',
        },
        neutral10: {
          base: '#5F6267',
        },
        neutral15: {
          base: '#F9FBFD',
        },
        neutral20: {
          base: '#E5E5E5',
          lighten1: '#F9F9F9',
        },
        neutral100: {
          base: '#FFFFFF',
        },
        purple: '#6955E3',
        violet: '#252D72',
        green: {
          base: '#1e8c0b',
          lighten1: '#6CE08D',
          lighten2: '#1EB965',
        },
        red: {
          base: '#E35E55',
        },
        blue: {
          base: '#0276F0',
          lighten1: '#F0F7FF',
        },
        grey: {
          base: '#F9F9F9',
          lighten1: '#E5E5E5',
          lighten2: '#C4C4C4',
        },
        mint: {
          base: '#00E5FF',
        },
        orange: {
          base: '#FF7A00',
          lighten1: '#ffe0c2',
        },
        'app-blue': {
          base: '#0276F0',
          lighten1: '#F0F7FF',
        },
        'app-grey': {
          base: '#D9D9D9',
        },

        'blue-2': '#F0F7FF',
        'blue-diversity': '#0276F0',
        'neutral-100': '#FFFFFF',
        'neutral-20': '#E5E5E5',
        'neutral-15': '#F9FBFD',
        'neutral-10': '#5F6267',
        'neutral-0': '#06032B',
        'app-orange': {
          base: '#FF7A00',
          lighten1: '#F9AF40',
          lighten2: '#FFE0C2',
        },
        'app-red': {
          base: '#E35E55',
          lighten1: '#FFE0C2',
          lighten2: '#FFF4F3',
        },
        'app-green': {
          base: '#1E8C0B',
          lighten1: '#1EB965',
          lighten2: '#DFFADA',
        },
        'app-inverted': '#FFFFFF',
      },
      dark: {
        primary: {
          base: '#FFFFFF',
        },
        success: {
          base: '#5FCD5B',
        },
        twitter: '#039BE5',
        lightGray: '#969696',
        grey1: '#B9B9B1',
        grey2: '#8197BB',
        subtitle: '#969696',
        red1: '#F6616A',
        background: {
          base: '#181718',
        },
        bluePrimary: {
          base: '#00E5FF',
          lighten1: '#143973',
          lighten2: '#55ACE3',
        },
        neutral0: {
          base: '#06032B',
        },
        neutral20: {
          base: '#30415C',
          lighten1: '#F9F9F9',
        },
        neutral10: {
          base: '#B6B9BE',
        },
        neutral15: {
          base: '#00102A',
        },
        neutral100: {
          base: '#092249',
        },
        purple: '#6955E3',
        violet: '#252D72',
        green: {
          base: '#1e8c0b',
          lighten1: '#6CE08D',
          lighten2: '#1EB965',
        },
        red: {
          base: '#E35E55',
        },
        blue: {
          base: '#0276F0',
        },
        grey: {
          base: '#F9F9F9',
          lighten1: '#E5E5E5',
          lighten2: '#C4C4C4',
        },
        mint: {
          base: '#00E5FF',
        },
        orange: {
          base: '#FF7A00',
          lighten1: '#ffe0c2',
        },
        'app-blue': {
          base: '#0276F0',
          lighten1: '#F0F7FF',
        },
        'app-grey': {
          base: '#D9D9D9',
        },
        'blue-2': '#143973',
        'blue-diversity': '#00E5FF',
        'neutral-100': '#092249',
        'neutral-20': '#30415C',
        'neutral-15': '#00102A',
        'neutral-10': '#B6B9BE',
        'neutral-0': '#FFFFFF',
        'app-orange': {
          base: '#FF7A00',
          lighten1: '#F9AF40',
          lighten2: '#FFE0C2',
        },
        'app-red': {
          base: '#E35E55',
          lighten1: '#FFE0C2',
          lighten2: '#FFF4F3',
        },
        'app-green': {
          base: '#1E8C0B',
          lighten1: '#1EB965',
          lighten2: '#DFFADA',
        },
        'app-inverted': '#000000',
      },
    },
  },
})
