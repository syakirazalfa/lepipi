document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'BOOKSHELF_APP';
    let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    function saveBooks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }

    function renderBooks(bookList = books) {
        const incompleteBookshelf = document.getElementById('incompleteBookshelf');
        const completeBookshelf = document.getElementById('completeBookshelf');
        
        incompleteBookshelf.innerHTML = '';
        completeBookshelf.innerHTML = '';
        
        bookList.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.setAttribute('data-bookid', book.id);
            bookElement.setAttribute('data-testid', 'bookItem');
            bookElement.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div class="book-actions">
                    <button data-testid="bookItemIsCompleteButton" onclick="toggleBookStatus(${book.id})">
                        ${book.isComplete ? 'Belum Selesai' : 'Selesai'}
                    </button>
                    <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus</button>
                </div>
            `;
            
            if (book.isComplete) {
                completeBookshelf.appendChild(bookElement);
            } else {
                incompleteBookshelf.appendChild(bookElement);
            }
        });
    }

    document.getElementById('bookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const year = document.getElementById('year').value.trim();
        const isComplete = document.getElementById('isComplete').checked;
        
        if (!title || !author || !year) {
            alert('Harap isi semua field!');
            return;
        }
        
        const newBook = {
            id: Date.now(),
            title,
            author,
            year: parseInt(year),
            isComplete
        };
        
        books.push(newBook);
        saveBooks();
        renderBooks();
        this.reset();
    });

    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        
        if (query === '') {
            renderBooks();
            return;
        }
        
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        
        renderBooks(filteredBooks);
    });

    window.toggleBookStatus = function(id) {
        books = books.map(book => {
            return book.id === id ? {...book, isComplete: !book.isComplete} : book;
        });
        saveBooks();
        renderBooks();
    };

    window.deleteBook = function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
            books = books.filter(book => book.id !== id);
            saveBooks();
            renderBooks();
        }
    };

    renderBooks();
});

const toggleBtn = document.getElementById('toggleDarkMode');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Ganti teks/tampilan tombol sesuai mode
    if (document.body.classList.contains('dark-mode')) {
        toggleBtn.textContent = '☀️ Light Mode';
    } else {
        toggleBtn.textContent = '🌙 Dark Mode';
    }
});
