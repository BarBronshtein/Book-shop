'use strict';

const STORAGE_KEY = 'bookDB';
const BOOK_PER_PAGE = 5;
var gBooks;
var gFilterBy = {
  txt: '',
  maxPrice: 50,
  minRate: 0,
};
const gSortBy = {
  status: '',
  direction: 1,
};

_createBooks();

var gPages = {
  curPage: 0,
  numPages: gBooks.length / BOOK_PER_PAGE,
  firstPageId: 0,
};

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY);

  // If there are no books in localeStorage create new Books
  if (!books || !books.length) {
    books = [];
    for (let i = 0; i < 35; i++) {
      const book = _createBook();
      books.push(book);
    }
  }

  gBooks = books;
  saveToStorage(STORAGE_KEY, gBooks);
}

function _createBook(name = '', price = 0) {
  return {
    id: makeId(),
    name: name || makeLorem(3),
    price: price || getRandFloat(5, 20),
    imgUrl: 'https:source.unsplash.com/250x450/?book',
    rate: getRandIntInc(0, 10),
    txt: makeLorem(50),
  };
}

function getBooks() {
  // Fillters array by price and book rate and text
  const books = gBooks.filter(
    book =>
      +gFilterBy.maxPrice >= +book.price &&
      +book.rate >= +gFilterBy.minRate &&
      book.name.includes(gFilterBy.txt)
  );
  // Recalculating number of pages on list after each filter
  _updateNumPages(books);
  // Returning only the current page books
  return books.slice(gPages.firstPageId, gPages.firstPageId + BOOK_PER_PAGE);
}

function getPages() {
  return gPages;
}

function _sortBooks(books) {
  books.sort((a, b) =>
    gSortBy.status === 'name'
      ? a.name.localeCompare(b.name) * gSortBy.direction
      : (a.price - b.price) * gSortBy.direction
  );
}

function _updateNumPages(books) {
  gPages.numPages = Math.ceil(books.length / BOOK_PER_PAGE);
}

function addBook(name, price) {
  const book = _createBook(name, price);
  gBooks.push(book);
  saveToStorage(STORAGE_KEY, gBooks);
}

function deleteBook(bookId) {
  const idx = gBooks.findIndex(book => book.id === bookId);
  gBooks.splice(idx, 1);
  saveToStorage(STORAGE_KEY, gBooks);
}

function updateBook(bookId, price) {
  const book = gBooks.find(book => book.id === bookId);
  book.price = price;
  saveToStorage(STORAGE_KEY, gBooks);
}

function readBook(bookId) {
  return gBooks.find(book => book.id === bookId);
}

function addRate(bookId, operator) {
  const minLimit = 0;
  const maxLimit = 10;
  const book = gBooks.find(book => book.id === bookId);
  operator === '+' ? book.rate++ : book.rate--;
  // If rate exceeded limit adjust rate back to fit limit
  book.rate < minLimit ? book.rate++ : '';
  book.rate > maxLimit ? book.rate-- : '';
  saveToStorage(STORAGE_KEY, gBooks);
  return book;
}

function setBookFilter(filterBy = {}) {
  if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice;
  if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate;
  if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt;
  if (filterBy.bookId !== undefined) gFilterBy.bookId = filterBy.bookId;

  return gFilterBy;
}

function setSortBy(status) {
  if (status === gSortBy.status) gSortBy.direction = -gSortBy.direction;
  else gSortBy.direction = 1;
  gSortBy.status = status;
  // Sorting gBooks after filter
  _sortBooks(gBooks);
}

function moveTo(page) {
  gPages.curPage = page;
  gPages.firstPageId = gPages.curPage * BOOK_PER_PAGE;
}
