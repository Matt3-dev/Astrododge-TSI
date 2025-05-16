'use strict';
class MyGame extends Game {
    constructor() {
        super();
        this.renderDebug = true;
        this.activeSprites = [];
        this.queuedSprites = [];
    }
    loadResources(resLoader) {
    }
    initializeObjects() {
        this.camera = new Camera(1, 0.998);
        this.graphics.drawDebug = true;

        this.queueNewSprite(new PlayerShipSprite());
        this.queueNewSprite(new AsteroidSpawnerSprite());
        this.queueNewSprite(new ShipSpawnerSprite());
    }
    update() {
        this.camera.updateCamera(this.deltaTime);
        if (this.mouse.getRightButtonPressed()) this.deltaTime /= 10;
        this.activeSprites = this.activeSprites.concat(this.queuedSprites);
        this.queuedSprites = [];
        this.activeSprites.sort((a, b) => { return b.priority - a.priority; });
        for (let i = 0; i < this.activeSprites.length;) {
            if (this.activeSprites[i].destroy) {
                this.activeSprites.splice(i, 1);
            } else {
                this.activeSprites[i].update();
                this.activeSprites[i].lifetime += this.deltaTime;
                i++;
            }
        }
    }
    queueNewSprite(sprite) {
        this.queuedSprites.push(sprite);
    }
    render() {
        this.camera.drawGrid(this.graphics);

        for (let i = 0; i < this.activeSprites.length; i++) {
            this.activeSprites[i].render();
        }
        this.graphics.drawText(`E: ${this.activeSprites.length}`, new Point(16, 0), new TextProperties(0.25, "Arial", "bold", Colors.black, true, Colors.white, 0.005, "top", "right"));
    }
}