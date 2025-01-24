class VirtualLibrary {
    constructor() {
        this.modal = document.querySelector('.library-modal');
        this.booksGrid = document.querySelector('.books-grid');
        this.libraryButton = document.querySelector('.library-button');
        this.closeButton = document.querySelector('.close-library');
        
        this.setupEventListeners();
        this.updateLibrary();
    }
    
    setupEventListeners() {
        this.libraryButton.addEventListener('click', () => this.openLibrary());
        this.closeButton.addEventListener('click', () => this.closeLibrary());
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLibrary();
        });
    }
    
    openLibrary() {
        this.modal.style.display = 'block';
        this.updateLibrary(); // Refresh the library view
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    closeLibrary() {
        this.modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    updateLibrary() {
        if (!window.audioPlayer || !window.audioPlayer.audioBooks) return;
        
        this.booksGrid.innerHTML = ''; // Clear existing books
        
        window.audioPlayer.audioBooks.forEach((book, index) => {
            const card = this.createBookCard(book, index);
            this.booksGrid.appendChild(card);
        });
    }
    
    createBookCard(book, index) {
        const card = document.createElement('div');
        card.className = 'book-card';
        if (index === window.audioPlayer.currentBookIndex) {
            card.classList.add('playing');
        }
        
        // Add book cover
        const cover = document.createElement('img');
        cover.className = 'book-cover';
        cover.src = book.cover;
        cover.alt = `${book.title} cover`;
        
        // Add book info overlay
        const info = document.createElement('div');
        info.className = 'book-info';
        
        const title = document.createElement('div');
        title.className = 'book-title';
        title.textContent = book.title;
        
        const author = document.createElement('div');
        author.className = 'book-author';
        author.textContent = book.author;
        
        info.appendChild(title);
        info.appendChild(author);
        
        // Add chapter info and progress for Alice
        if (book.chapters) {
            const chapterInfo = window.audioPlayer.getCurrentChapterInfo();
            if (chapterInfo) {
                const chapterText = document.createElement('div');
                chapterText.className = 'chapter-info';
                chapterText.style.color = '#00ff00';
                chapterText.style.fontSize = '12px';
                chapterText.style.marginTop = '10px';
                chapterText.style.fontFamily = "'Space Mono', monospace";
                chapterText.textContent = `Chapter ${chapterInfo.chapterIndex + 1} of ${chapterInfo.totalChapters}`;
                info.appendChild(chapterText);
                
                const progress = document.createElement('div');
                progress.className = 'book-progress';
                
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                
                // Calculate and set progress
                if (window.audioPlayer.audio && index === window.audioPlayer.currentBookIndex) {
                    const percent = (window.audioPlayer.audio.currentTime / window.audioPlayer.audio.duration) * 100;
                    progressBar.style.width = `${percent}%`;
                }
                
                progress.appendChild(progressBar);
                info.appendChild(progress);
            }
        }
        
        card.appendChild(cover);
        card.appendChild(info);
        
        // Handle mockup books
        if (book.isMockup) {
            card.style.cursor = 'not-allowed';
            card.title = 'Coming Soon';
            
            const unavailableOverlay = document.createElement('div');
            unavailableOverlay.style.position = 'absolute';
            unavailableOverlay.style.top = '0';
            unavailableOverlay.style.left = '0';
            unavailableOverlay.style.width = '100%';
            unavailableOverlay.style.height = '100%';
            unavailableOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            unavailableOverlay.style.display = 'flex';
            unavailableOverlay.style.alignItems = 'center';
            unavailableOverlay.style.justifyContent = 'center';
            unavailableOverlay.style.color = 'white';
            unavailableOverlay.style.fontFamily = "'Space Mono', monospace";
            unavailableOverlay.style.fontSize = '14px';
            unavailableOverlay.style.textTransform = 'uppercase';
            unavailableOverlay.style.letterSpacing = '2px';
            unavailableOverlay.textContent = 'Coming Soon';
            
            card.appendChild(unavailableOverlay);
        }
        
        return card;
    }
}

// Initialize the virtual library
window.virtualLibrary = new VirtualLibrary();
