class AsteroidSpawnerSprite {
    constructor() {
        this.destroy = false;
        this.priority = Infinity;
        this.lifetime = 0;

        this.timeSinceLastSpawn = 0;
    }
    update() {
        this.timeSinceLastSpawn += game.deltaTime;
        if (game.mouse.getMiddleButtonJustPressed()) this.timeSinceLastSpawn = 100.01;
        while (this.timeSinceLastSpawn > 5) {
            let t = {
                x: 0,
                y: 0,
                vx: 0,
                vy: 0
            };
            game.activeSprites.forEach((s) => {
                if (s instanceof PlayerShipSprite) t = s;
            });

            let angle = Math.random() * Math.PI * 2;
            let velocity = Math.random() * 0.25 + 0.75;
            let vx = Math.sin(angle) * velocity;
            let vy = -Math.cos(angle) * velocity;
            game.queueNewSprite(new AsteroidSprite(
                0, 0,
                vx, vy,
                Math.random() * Math.PI * 2 - Math.PI,
                Math.random() * 0.25
            ));
            this.timeSinceLastSpawn -= 5;
        }
    }
    render() {
        // empty, since this dont render
    }
}