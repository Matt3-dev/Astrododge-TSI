class ShipSpawnerSprite {
    constructor() {
        this.destroy = false;
        this.priority = Infinity;
        this.lifetime = 0;

        this.timeSinceLastSpawn = 0;
        this.distanceSinceLastSpawn = 0;
        this.spawnRate = 10;
        this.spawnDistance = 40;

        this.t = null;
    }
    update() {
        game.activeSprites.forEach((s) => {
            if (s instanceof PlayerShipSprite) this.t = s;
        });
        this.timeSinceLastSpawn += game.deltaTime;
        while (this.timeSinceLastSpawn > this.spawnRate && this.spawnRate > 0) {
            if (this.t ?? false) {
                let direction = Math.random() * Math.PI * 2;
                game.queueNewSprite(new AIShipSprite(
                    Math.sin(direction) * this.spawnDistance + this.t.x,
                    -Math.cos(direction) * this.spawnDistance + this.t.y,
                    Team.ENEMY
                ));
            }
            this.timeSinceLastSpawn -= this.spawnRate;
        }
    }
    render() {
        // empty, since this dont render
    }
}