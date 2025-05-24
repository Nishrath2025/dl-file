const firebaseConfig = {
  apiKey: "AIzaSyC36kiqu1qDeBk0a7c5MiL9HBHVp5HOdMs",
  authDomain: "librarysystem-de3a8.firebaseapp.com",
  databaseURL: "https://librarysystem-de3a8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "librarysystem-de3a8",
  storageBucket: "librarysystem-de3a8.appspot.com",
  messagingSenderId: "110117295384",
  appId: "1:110117295384:web:38692e998b9f06b895ba6d",
  measurementId: "G-2F9Z73VVCG"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function getCurrentDateTime() {
  return new Date().toLocaleString();
}

function addBook() {
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  if (title && author) {
    db.ref('books').push({ title, author, date: getCurrentDateTime() });
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
  }
}

function addNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  if (title && content) {
    db.ref('notes').push({ title, content, date: getCurrentDateTime() });
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
  }
}

function deleteItem(refPath, key) {
  db.ref(`${refPath}/${key}`).remove();
}

function editBook(key, book) {
  const newTitle = prompt("Edit Book Title:", book.title);
  const newAuthor = prompt("Edit Author:", book.author);
  if (newTitle && newAuthor) {
    db.ref(`books/${key}`).update({ title: newTitle, author: newAuthor, date: getCurrentDateTime() });
  }
}

function editNote(key, note) {
  const newTitle = prompt("Edit Note Title:", note.title);
  const newContent = prompt("Edit Note Content:", note.content);
  if (newTitle && newContent) {
    db.ref(`notes/${key}`).update({ title: newTitle, content: newContent, date: getCurrentDateTime() });
  }
}

db.ref('books').on('value', (snapshot) => {
  const list = document.getElementById('bookList');
  list.innerHTML = '';
  snapshot.forEach(child => {
    const key = child.key;
    const { title, author, date } = child.val();
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${title} by ${author}<br><small>${date}</small></span>
      <div>
        <button class="edit" onclick='editBook("${key}", ${JSON.stringify({title, author})})'>Edit</button>
        <button onclick='deleteItem("books","${key}")'>Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
});

db.ref('notes').on('value', (snapshot) => {
  const list = document.getElementById('noteList');
  list.innerHTML = '';
  snapshot.forEach(child => {
    const key = child.key;
    const { title, content, date } = child.val();
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${title}</strong>: ${content}<br><small>${date}</small></span>
      <div>
        <button class="edit" onclick='editNote("${key}", ${JSON.stringify({title, content})})'>Edit</button>
        <button onclick='deleteItem("notes","${key}")'>Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
});

function filterBooks() {
  const search = document.getElementById('bookSearch').value.toLowerCase();
  const items = document.querySelectorAll('#bookList li');
  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(search) ? '' : 'none';
  });
}

function filterNotes() {
  const search = document.getElementById('noteSearch').value.toLowerCase();
  const items = document.querySelectorAll('#noteList li');
  items.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(search) ? '' : 'none';
  });
}

function showSlide(type) {
  document.getElementById('booksSlide').style.display = type === 'books' ? 'flex' : 'none';
  document.getElementById('notesSlide').style.display = type === 'notes' ? 'flex' : 'none';
  document.getElementById('tabBooks').classList.toggle('active', type === 'books');
  document.getElementById('tabNotes').classList.toggle('active', type === 'notes');
}
