class VisualManager {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.setup();
    }

    setup() {
        const container = document.getElementById('motionVisual');
        container.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    addParticle(intensity) {
        const particle = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: Math.min(intensity * 2, 20),
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            velocity: {
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10
            },
            life: 1
        };
        this.particles.push(particle);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            p.life -= 0.02;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color.replace(')', `, ${p.life})`);
            this.ctx.fill();

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

const visualManager = new VisualManager();
