class AsteroidSpawnerSprite {
    constructor() {
        this.destroy = false;
        this.priority = Infinity;
        this.lifetime = 0;

        this.timeSinceLastSpawn = 0;
        this.distanceSinceLastSpawn = 0;
        this.spawnRate = 0.5;
        this.spawnDistance = 30;

        this.t = null;
    }
    update() {
        let t;
        game.activeSprites.forEach((s) => {
            if (s instanceof PlayerShipSprite) {
                this.t = s; t = s;
            }
        });
        this.timeSinceLastSpawn += game.deltaTime;
        if (t ?? false) this.timeSinceLastSpawn += Math.sqrt(this.t.vx * this.t.vx + this.t.vy * this.t.vy) * game.deltaTime;
        while (this.timeSinceLastSpawn > this.spawnRate && this.spawnRate > 0) {
            if (this.t ?? false) {
                let angle = 4 + Math.random() * Math.PI * 0.3 - Math.PI * 0.15;
                let direction = Math.random() * Math.PI * 2;
                let velocity = Math.random() * 0.5 + 1.5;
                let vx = Math.sin(angle) * velocity;
                let vy = -Math.cos(angle) * velocity;
                game.queueNewSprite(new AsteroidSprite(
                    Math.sin(direction) * this.spawnDistance + this.t.x, -Math.cos(direction) * this.spawnDistance + this.t.y,
                    vx, vy,
                    Math.random() * Math.PI * 2 - Math.PI,
                    Math.random() * 0.1
                ));
            } else {
                let angle = Math.random() * Math.PI * 2;
                let velocity = Math.random() * 1 / this.spawnRate + 4 / this.spawnRate;
                let vx = Math.sin(angle) * velocity;
                let vy = -Math.cos(angle) * velocity;
                game.queueNewSprite(new AsteroidSprite(
                    0, 0,
                    vx, vy,
                    Math.random() * Math.PI * 2 - Math.PI,
                    Math.random() * 0.25
                ));
            }
            this.timeSinceLastSpawn -= this.spawnRate;
        }
    }
    render() {
        // empty, since this dont render
    }
}