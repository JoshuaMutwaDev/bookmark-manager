const mainSection = document.getElementById('main-section');
const addBookmarkSection = document.getElementById('add-bookmark-section');
const viewBookmarksSection = document.getElementById('view-bookmarks-section');

function sectionToShow(section) {
  mainSection.classList.add('hidden');
  addBookmarkSection.classList.add('hidden');
  viewBookmarksSection.classList.add('hidden');
  section.classList.remove('hidden');
}

const showAddFormBtn = document.getElementById('show-add-form-btn');
const viewBookmarkBtn = document.getElementById('view-bookmark-btn');
const backBtn = document.querySelectorAll('.back-btn');

showAddFormBtn.addEventListener('click',(e) => {
  e.preventDefault();
  sectionToShow(addBookmarkSection)});
viewBookmarkBtn.addEventListener('click', (e) => {
  e.preventDefault();
  sectionToShow(viewBookmarksSection)});
backBtn.forEach(btn => btn.addEventListener('click', () => sectionToShow(mainSection)));

const addBookmarkForm = document.getElementById('add-bookmark-form');
const bookmarksList = document.getElementById('bookmarks-list');

let editingIndex = null; 

addBookmarkForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('bookmark-name').value;
  const url = document.getElementById('bookmark-url').value;
  const tags = document.getElementById('bookmark-tags').value
                .split(',').map(tag => tag.trim()).filter(tag => tag);

  if (!name || !url) {
    alert('Please fill in all required fields.');
    return;
  }

  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

  if (editingIndex === null) {
    bookmarks.push({ name, url, tags });
  } else {
    bookmarks[editingIndex] = { name, url, tags };
    editingIndex = null;
  }

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  addBookmarkForm.reset();
  sectionToShow(mainSection);
  displayBookmarks();
});

function displayBookmarks() {
  bookmarksList.innerHTML = '';
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

  if (bookmarks.length === 0) {
    bookmarksList.innerHTML = '<li>No bookmarks found.</li>';
    return;
  }

  bookmarks.forEach((bookmark, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="bk-name"><strong>${bookmark.name}</strong> - 
      <a href="${bookmark.url}" target="_blank">${bookmark.url}</a></div>
      ${bookmark.tags.length > 0 ? `<div class="tags">Tags: ${bookmark.tags.join(', ')}</div>` : ''}
      <div class="view-btns">
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;
    bookmarksList.appendChild(li);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.getAttribute('data-index');
      deleteBookmark(index);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.getAttribute('data-index');
      editBookmark(index);
    });
  });
}

function deleteBookmark(index) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarks.splice(index, 1);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  displayBookmarks();
}

function editBookmark(index) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  const bookmark = bookmarks[index];

  document.getElementById('bookmark-name').value = bookmark.name;
  document.getElementById('bookmark-url').value = bookmark.url;
  document.getElementById('bookmark-tags').value = bookmark.tags.join(', ');

  editingIndex = index; 
  sectionToShow(addBookmarkSection);
}

document.addEventListener('DOMContentLoaded', () => {
  sectionToShow(mainSection);
  displayBookmarks();
});











