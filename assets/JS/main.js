// Book constructor
class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}

// Store class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(title) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Handle UI
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.pages}</td>
    <td>${book.isRead}</td>
    <td><button class="delete">X</button></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".form-container");
    const form = document.querySelector("#book-form");
    container.appendChild(div, form);

    // remove alert after 3seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static clearInputFields() {
    document.querySelector(".book-title").value = "";
    document.querySelector(".book-author").value = "";
    document.querySelector(".book-pages").value = "";
    document.querySelector(".book-isRead").value = "";
  }
}

// Event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: add a book
document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();
  // Get form values
  const title = document.querySelector(".book-title").value;
  const author = document.querySelector(".book-author").value;
  const pages = document.querySelector(".book-pages").value;
  const isRead = document.querySelector(".book-isRead").value;

  //   Validation
  if (!title || !author || !pages) {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    //   Instantiate book
    const book = new Book(title, author, pages, isRead);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show alert upon adding a new book
    UI.showAlert("Book added", "success");

    //   Clear search fields
    UI.clearInputFields();
  }
});

// Event: remove a book
document.querySelector("#book-list").addEventListener("click", e => {
  // Remove book from UI
  UI.deleteBook(e.target);
  //   Remove book from store upon deletion
  Store.removeBook(
    e.target.parentElement.parentElement.firstElementChild.textContent
  );
  //   Show alert upon book removal
  UI.showAlert("Book removed", "success");
});
