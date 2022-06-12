'use strict';

function onInit() {
  renderQueryParamsByFilter();
  renderBooks();
}

function renderBooks() {
  const books = getBooks();
  // Rendering pages
  renderPages();
  const { firstPageId } = getPages();
  // Rendreing books
  let html = `<tr>
  <th data-trans="bookId">Id</th>
  <th data-trans="title" data-status="name" onclick="onSetSort(this.dataset.status)" class="my-btn btn-sort-by-name text-center">Title</th>
  <th data-trans="price" data-status="price" onclick="onSetSort(this.dataset.status)" class="my-btn btn-sort-by-price">Price</th>
  <th data-trans="actions" class="text-center" colspan="3">Actions</th></tr>`;
  books.forEach(
    (book, i) =>
      (html += `<tr><td>${i + (firstPageId + 1)}</td><td>${book.name}</td><td>${
        gCurrLang === 'he' ? (+book.price * 3).toFixed(2) : book.price
      } <span data-trans="currency">$</span></td>
      <td><button data-trans="read" class="btn btn-actions" onclick=onReadBook(event,'${
        book.id
      }')>Read</button></td><td><button data-trans="update" class="btn btn-actions" onclick=onUpdateBook('${
        book.id
      }','${
        book.price
      }')>Update</button></td><td><button data-trans="delete" class="btn btn-actions" onclick=onDeleteBook('${
        book.id
      }')>Delete</button></td></tr>`)
  );
  document.querySelector('.book-container').innerHTML = html;
  doTrans();
}

function renderPages() {
  const { numPages, curPage } = getPages();

  let html = '';
  // Rendering pages

  // // Page 1, and there are other pages
  // if (curPage === 0 && numPages > 1) {
  //   // html += addNumPages(numPages, curPage);
  //   // html += `<button class="btn" onclick="onMoveToPage(this)">>></button>`;
  // }

  // // Last page
  // if (curPage === numPages && numPages > 1) {
  //   // html = '<button class="btn" onclick="onMoveToPage(this)"><<</button>';
  //   // html += addNumPages(numPages, curPage);
  // }

  // Other page
  // if (curPage < numPages && curPage > 0) {
  //   // html = '<button class="btn" onclick="onMoveToPage(this)"><<</button>';
  //   // html += addNumPages(numPages, curPage);
  //   // html += `<button class="btn" onclick="onMoveToPage(this)">>></button>`;
  // }

  if (curPage)
    html = '<button class="btn" onclick="onMoveToPage(this)"><<</button>';

  html += addNumPages(numPages, curPage);

  if (curPage + 1 !== numPages)
    html += `<button class="btn" onclick="onMoveToPage(this)">>></button>`;

  // No More than 1 pages
  if (!numPages) html = '';

  document.querySelector('.pages').innerHTML = html;
}

function addNumPages(numPages, curPage) {
  let html = '';
  for (let i = 0; i < numPages; i++) {
    html += `<button class="btn ${
      curPage === i ? 'active' : ''
    }" onclick="onMoveToPage(this)">${i + 1}</button>`;
  }
  return html;
}

function onAddBook(ev) {
  ev.preventDefault();
  const bookName = document.querySelector('[name=input-name]').value;
  const bookPrice = +document.querySelector('[name=input-price]').value;
  addBook(bookName, bookPrice);
  renderBooks();
  closeForm();
}

function onDeleteBook(bookId) {
  deleteBook(bookId);
  renderBooks();
}
// TODO: Change prompt msg to modal display
function onUpdateBook(bookId, bookPrice) {
  const curLang = getCurLang();
  let promptMsg = '';
  if (curLang === 'en') promptMsg = 'Enter New Price';
  else {
    promptMsg = 'הכנס מחיר חדש';
    bookPrice *= 3;
  }

  const newPrice =
    curLang === 'he'
      ? +prompt(promptMsg, bookPrice) / 3
      : +prompt(promptMsg, bookPrice);
  if (!newPrice) return;
  updateBook(bookId, newPrice);
  renderBooks();
}

function renderQueryParamsByFilter() {
  const queryStringParams = new URLSearchParams(window.location.search);
  // From the url sets filterBy object and filters the books
  const filterBy = {
    minRate: +queryStringParams.get('minRate') || 0,
    maxPrice: +queryStringParams.get('maxPrice') || 50,
    txt: queryStringParams.get('txt') || '',
  };
  if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.txt) return;
  document.querySelector('.filter-rate-range').value = filterBy.minRate;
  document.querySelector('.filter-price-range').value = filterBy.maxPrice;
  document.querySelector('[name=filter-txt]').value = filterBy.txt;
  setBookFilter(filterBy);
}

function onReadBook(ev, bookId) {
  // Click on body closes the description modal using stopPropagation to stop it
  ev.stopPropagation();
  const book = readBook(bookId);
  const elText = document.querySelector('.desc');
  const elName = document.querySelector('.book-name');
  const elRate = document.querySelector('.rate');
  // Filling modal content with the book properties
  elText.textContent = book.txt;
  elName.textContent = book.name;

  var strHTML = ` 
  <button class="btn" onclick="onAddRate(event,'${bookId}')">+</button>
  <span class="rate-count">${book.rate}</span>
  <button class="btn" onclick="onAddRate(event,'${bookId}','-')">-</button>`;

  elRate.innerHTML = strHTML;

  openModal();
}

function onAddRate(ev, bookId, operator = '+') {
  ev.stopPropagation();
  const book = addRate(bookId, operator);

  if (!book) return;
  document.querySelector('.rate-count').textContent = book.rate;
}

function openModal() {
  document.querySelector('.modal-desc').classList.remove('hidden');
}

function closeModal() {
  document.querySelector('.modal-desc').classList.add('hidden');
  setBookFilter({ bookId: '' });
}

function onSetFilterBy(filterBy) {
  filterBy = setBookFilter(filterBy);
  renderBooks();
  // Adds querystring to the url
  const queryStringParams = `?minRate=${filterBy.minRate}&maxPrice=${filterBy.maxPrice}&txt=${filterBy.txt}`;
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

function onSetLang(val) {
  setLang(val);
  if (val === 'he') document.body.classList.add('rtl');
  else document.body.classList.remove('rtl');
  renderBooks();
}

function doTrans() {
  var els = document.querySelectorAll('[data-trans]');
  els.forEach(el => {
    var transKey = el.dataset.trans;
    var txt = getTrans(transKey);

    if (el.localName === 'input' && el.placeholder) {
      el.placeholder = txt;
    } else el.textContent = txt;
  });
}

function onSetSort(status) {
  setSortBy(status);
  renderBooks();
}

function onMoveToPage(el) {
  var curPage = getPages().curPage;
  // If pressed on cur page exit
  if (el.classList.contains('active')) return;
  // If left button clicked go one page back
  if (el.textContent === '<<') curPage--;
  // If right button clicked go one page forward
  else if (el.textContent === '>>') curPage++;
  // Substract one beacuse our list starts from index 0
  else curPage = el.textContent - 1;
  moveTo(curPage);
  renderBooks();
}

function onToggleForm() {
  document.querySelector('.book-add').classList.toggle('hidden');
}
// Adjust to support updating and adding new book
function closeForm() {
  document.querySelector('.book-add').classList.add('hidden');
}
