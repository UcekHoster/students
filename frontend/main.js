const particles = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    const particlesLength = Math.floor(window.innerWidth / 10)
    for (let i = 0; i < particlesLength; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    particles.forEach((p, index) => {
        p.update()
        p.draw()
        p.checkParticles(particles.slice(index))
    })
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height))
        this.vel = createVector(random(-2, 2), random(-2, 2))
        this.size = 5
    }
}

update() {
    this.pos.add(this.vel);
    this.edge();
}

draw() {
    noStroke();
    fill(rgba(255, 255, 255, 0.5))
    circle(this.pos.x, this.pos.y, this.size)
}

edges() {
    if (this.pos.x < 0 || this.pos.x > width) {
        this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
        this.vel.y *= -1
    }
}

checkParticles(particles) {
    particles.forEach(particle => {
        const d = dist(this.pos.x, this.pos.y, particles.pos.x, particles.pos.y)

        if (d < 120) {
            stroke(rgba(255, 255, 255, 0.5))
            line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y)
        }
    })
}