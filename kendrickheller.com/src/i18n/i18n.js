import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';

i18next.use(HttpApi).init({
  backend: {
    loadPath: 'https://rs.kendrickheller.com/i18n/{{lng}}/{{ns}}',
    crossDomain: false,
    withCredentials: false,
    overrideMimeType: false,
    reloadInterval: false,
    queryStringParams: { v: new Date().getTime() },
  },
  interpolation: { escapeValue: false },
  fallbackLng: localStorage.getItem('KENDRICKHELLER_I18N_LANGUAGE') ?? 'en',
  lng: localStorage.getItem('KENDRICKHELLER_I18N_LANGUAGE') ?? 'en',
  debug: false,
});

export default i18next;
