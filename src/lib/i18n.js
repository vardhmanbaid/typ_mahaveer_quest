import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import hiTranslations from '@/locales/hi.json'

i18n.use(initReactI18next).init({
  resources: {
    hi: { translation: hiTranslations },
  },
  lng: 'hi',
  fallbackLng: 'hi',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
