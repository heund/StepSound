class AudioBookPlayer {
    constructor() {
        this.audioBooks = [];
        this.currentBookIndex = 1; // Alice is at index 1
        this.currentChapterIndex = 0;
        this.isPlaying = false;
        this.lastStepTime = Date.now();
        this.stepTimeout = 2000; // 2 seconds without steps will pause the audio
        this.checkStepInterval = null;
    }

    async loadAudioBooks() {
        try {
            const response = await fetch('audiobooks/manifest.json');
            const manifest = await response.json();
            this.audioBooks = manifest.books;
            this.initializeCurrentChapter();
        } catch (error) {
            console.error('Error loading audiobooks:', error);
        }
    }

    initializeCurrentChapter() {
        if (this.audioBooks.length === 0) return;
        
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }

        const currentBook = this.audioBooks[this.currentBookIndex];
        if (!currentBook.chapters) return;

        const currentChapter = currentBook.chapters[this.currentChapterIndex];
        this.audio = new Audio(currentChapter.path);
        
        // Set up ended event to play next chapter
        this.audio.addEventListener('ended', () => this.playNextChapter());
        
        // Set up error handling
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.playNextChapter();
        });

        // Set up timeupdate event to update library progress
        this.audio.addEventListener('timeupdate', () => {
            if (window.virtualLibrary) {
                window.virtualLibrary.updateLibrary();
            }
        });
    }

    playNextChapter() {
        const currentBook = this.audioBooks[this.currentBookIndex];
        if (!currentBook.chapters) return;

        this.currentChapterIndex++;
        if (this.currentChapterIndex >= currentBook.chapters.length) {
            this.currentChapterIndex = 0; // Loop back to first chapter
        }

        this.initializeCurrentChapter();
        if (this.isPlaying) {
            this.play();
        }
        
        // Update library view if available
        if (window.virtualLibrary) {
            window.virtualLibrary.updateLibrary();
        }
    }

    getCurrentChapterInfo() {
        const currentBook = this.audioBooks[this.currentBookIndex];
        if (!currentBook || !currentBook.chapters) return null;

        return {
            book: currentBook,
            chapter: currentBook.chapters[this.currentChapterIndex],
            chapterIndex: this.currentChapterIndex,
            totalChapters: currentBook.chapters.length
        };
    }

    onStep() {
        this.lastStepTime = Date.now();
        if (!this.isPlaying && this.audio) {
            this.play();
        }
    }

    play() {
        if (!this.audio) return;
        
        this.isPlaying = true;
        this.audio.play()
            .catch(error => console.error('Error playing audio:', error));
        
        // Start checking for step timeout
        if (!this.checkStepInterval) {
            this.checkStepInterval = setInterval(() => this.checkStepTimeout(), 500);
        }
        
        // Update library view if available
        if (window.virtualLibrary) {
            window.virtualLibrary.updateLibrary();
        }
    }

    pause() {
        if (!this.audio) return;
        
        this.isPlaying = false;
        this.audio.pause();
        
        // Update library view if available
        if (window.virtualLibrary) {
            window.virtualLibrary.updateLibrary();
        }
    }

    checkStepTimeout() {
        if (Date.now() - this.lastStepTime > this.stepTimeout) {
            this.pause();
        }
    }

    // Clean up resources
    destroy() {
        if (this.checkStepInterval) {
            clearInterval(this.checkStepInterval);
        }
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
    }
}

// Create and export the audio player instance
window.audioPlayer = new AudioBookPlayer();
