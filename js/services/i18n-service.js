'use strict';

var gTrans = {
  welcome: {
    en: 'Welcome To My Book Store',
    he: 'ברוכים הבאים לחנות הספרים שלי',
  },
  filter: { en: 'Filter', he: 'סנן' },
  title: { en: 'Title', he: 'שם הספר' },
  bookId: { en: 'Id', he: `מ'ס ספר` },
  price: { en: 'price', he: 'מחיר' },
  actions: { en: 'actions', he: 'פעולות' },
  'input-price': { en: 'price 4-50', he: 'מחיר 4-50' },
  'btn-add': { en: 'add', he: 'הוסף' },
  'input-name': { en: 'Enter Book Name', he: 'הכנס שם ספר' },
  'filter-search': { en: 'Search book...', he: 'חפש ספר...' },
  'label-search': { en: 'Search By Name:', he: 'חפש לפי שם' },
  'label-price': { en: 'Max Price:', he: ' מחיר מקסימלי:' },
  'label-rate': { en: 'Min Rate:', he: ' דירוג מינימלי:' },
  'add-book': { en: 'Create new book', he: 'צור ספר חדש' },
  read: { en: 'Read', he: 'קרא' },
  update: { en: 'Update', he: 'עדכן' },
  delete: { en: 'Delete', he: 'מחק' },
  currency: { en: '$', he: '₪' },
};

var gCurrLang = 'en';

function getTrans(transKey) {
  var keyTrans = gTrans[transKey];
  if (!keyTrans) return 'UNKNOWN';

  var txt = keyTrans[gCurrLang];
  if (!txt) txt = keyTrans.en;

  return txt;
}

function setLang(lang) {
  gCurrLang = lang;
}

function formatNumOlder(num) {
  return num.toLocaleString('es');
}

function formatNum(num) {
  return new Intl.NumberFormat(gCurrLang).format(num);
}

function formatCurrency(num) {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(num);
}

function formatDate(time) {
  var options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Intl.DateTimeFormat(gCurrLang, options).format(time);
}

function kmToMiles(km) {
  return km / 1.609;
}

function getCurLang() {
  return gCurrLang;
}
