class BookCarousel {
    constructor() {
        this.carouselView = document.getElementById('carousel-view');
        this.stepCounterView = document.getElementById('stepcounter-view');
        this.track = document.querySelector('.carousel-track');
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.currentIndex = 0;
        this.dragStartTime = 0;
        this.dragDistance = 0;

        this.setupCarousel();
        this.addEventListeners();
    }

    async setupCarousel() {
        try {
            const response = await fetch('audiobooks/manifest.json');
            const manifest = await response.json();
            
            manifest.books.forEach((book, index) => {
                const item = document.createElement('div');
                item.className = 'carousel-item';
                if (index === 1) { // Alice
                    item.classList.add('active');
                }

                const img = document.createElement('img');
                img.src = book.cover;
                img.alt = book.title;

                item.appendChild(img);
                this.track.appendChild(item);

                // Add click handler for all items
                item.addEventListener('click', (e) => {
                    if (!this.isDragging && this.dragDistance < 5) {
                        this.selectBook(index);
                    }
                });
            });
        } catch (error) {
            console.error('Error setting up carousel:', error);
        }
    }

    addEventListeners() {
        // Touch events
        this.track.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.dragStartTime = Date.now();
            this.dragDistance = 0;
            this.startDrag(e.touches[0].clientX);
        });
        this.track.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.dragDistance += Math.abs(e.touches[0].clientX - (this.startX + this.currentX));
            this.drag(e.touches[0].clientX);
        });
        this.track.addEventListener('touchend', () => this.endDrag());

        // Mouse events
        this.track.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.dragStartTime = Date.now();
            this.dragDistance = 0;
            this.startDrag(e.clientX);
        });
        this.track.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.dragDistance += Math.abs(e.clientX - (this.startX + this.currentX));
                this.drag(e.clientX);
            }
        });
        this.track.addEventListener('mouseup', () => this.endDrag());
        this.track.addEventListener('mouseleave', () => this.endDrag());
    }

    startDrag(x) {
        this.isDragging = true;
        this.startX = x - this.currentX;
        this.track.style.transition = 'none';
    }

    drag(x) {
        if (!this.isDragging) return;
        
        const newX = x - this.startX;
        const items = this.track.querySelectorAll('.carousel-item');
        const itemWidth = items[0].offsetWidth;
        const maxX = 0;
        const minX = -(items.length - 1) * (itemWidth + 20); // 20 is the gap

        if (newX > maxX) {
            this.currentX = maxX;
        } else if (newX < minX) {
            this.currentX = minX;
        } else {
            this.currentX = newX;
        }

        this.track.style.transform = `translateX(${this.currentX}px)`;
    }

    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.track.style.transition = 'transform 0.3s ease-out';
        
        // Snap to nearest item
        const items = this.track.querySelectorAll('.carousel-item');
        const itemWidth = items[0].offsetWidth + 20; // Including gap
        const nearestIndex = Math.round(-this.currentX / itemWidth);
        this.currentX = -nearestIndex * itemWidth;
        this.track.style.transform = `translateX(${this.currentX}px)`;
        this.currentIndex = nearestIndex;
    }

    selectBook(index) {
        if (index === 1) { // Alice
            this.carouselView.style.display = 'none';
            this.stepCounterView.style.display = 'block';
            if (window.audioPlayer) {
                window.audioPlayer.loadAudioBooks();
            }
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.carousel = new BookCarousel();
});
