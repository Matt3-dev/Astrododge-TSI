'use strict';
class MyGame extends Game {
    start() {
        this.renderDebug = false;
        this.activeSprites = [];
        this.queuedSprites = [];

        document.title = "Game DEMO";

        game.writeCookie("chk", 0);
        if (game.getCookie("chk") === undefined) this.disabledCookies = true;
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
    writeCookie(name = "value", value = "") {
        document.cookie = name + "=" + value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;";
    }
    getCookie(name) {
        return document.cookie.split("; ").find((row) => row.startsWith(name + "="))?.split("=")[1];
    }
    deleteCookie(name = "value") {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
    render() {
        this.camera.drawGrid(this.graphics);

        for (let i = 0; i < this.activeSprites.length; i++) {
            this.activeSprites[i].render();
        }
        this.graphics.drawText(`Mateusz Kubeczo i Rafal Hajdzik 2bTE`, new Point(16, 0), new TextProperties(0.25, "Arial", "bold", Colors.black, true, Colors.white, 0.005, "top", "right"));
    }
}