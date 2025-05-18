class Game {
    constructor() {
        this.__currentTime = 0;
        this.__pausedTimeDifference = 0;
        this.__deltaTime = 0;
        this.__lastTime = 0;
        this.currentTime = 0;
        this.lastTime = 0;
        this.deltaTime = 0;

        this.renderDebug = false;

        this.framesSinceStart = 0;
    }
    __start() {
        this.start();
        let resLoader = new ResourceLoader(this);
        this.loadResources(resLoader);
        resLoader.startLoading("__doneLoading");
    }
    __doneLoading() {
        document.querySelector("#disclaimer").style.display = "none";
        this.graphics = new Graphics();
        this.graphics.updateGraphics();
        this.keyboard = new Keyboard();
        this.mouse = new Mouse();
        this.initializeObjects();
        requestAnimationFrame((time) => this.__update(time));
    }
    __update(time) {
        requestAnimationFrame(this.__update.bind(this));
        this.__currentTime = time / 1000;
        this.__deltaTime = (this.__currentTime - this.__lastTime);
        this.graphics.updateGraphics();
        this.graphics.ctx.clearRect(0, 0, this.graphics.width, this.graphics.height);
        if (this.graphics.width >= 960 && this.graphics.height >= 540) {
            this.currentTime = this.__currentTime - this.__pausedTimeDifference;
            this.deltaTime = (this.currentTime - this.lastTime);
            this.update();
            this.render();
            if (this.renderDebug) {
                this.graphics.drawText(`${this.currentTime.toFixed(1)}s`, new Point(0, 0), new TextProperties(0.25, "Arial", "bold", Colors.black, true, Colors.white, 0.005, "top", "left"));
                this.graphics.drawText(`${(this.deltaTime * 1000).toFixed(1)}ms`, new Point(0, 0.25), new TextProperties(0.25, "Arial", "bold", Colors.black, true, Colors.white, 0.005, "top", "left"));
                this.graphics.drawText(`F: ${this.framesSinceStart}`, new Point(0, 0.5), new TextProperties(0.25, "Arial", "bold", Colors.black, true, Colors.white, 0.005, "top", "left"));
                this.graphics.drawText(`VIEW: ${this.graphics.canvas.width}x${this.graphics.canvas.height}`, new Point(0, 0.75), new TextProperties(0.25, "Arial", "bold", Colors.black, true, Colors.white, 0.005, "top", "left"));
                this.graphics.drawText(`HITBOX: ${Stats.hitboxCompares}`, new Point(0, 1), new TextProperties(0.25, "Arial", "bold", Colors.black, true, Colors.white, 0.005, "top", "left"));
                this.graphics.drawText(`HAABB: ${Stats.hitboxAABBCompares}`, new Point(0, 1.25), new TextProperties(0.25, "Arial", "bold", Colors.black, true, Colors.white, 0.005, "top", "left"));
            }
            Stats.clearAll();
            this.lastTime = this.currentTime;
            this.mouse.updateMouse();
            this.keyboard.updateKeyboard();
        } else {
            this.graphics.clearAll(Colors.black);
            this.graphics.drawTextFill("Game is paused.", new Point(8, 4), new TextProperties(0.7, "Arial", "bold", Colors.white, false, Colors.black, 0, "middle", "center"));
            this.graphics.drawTextFill("Please resize the window to at least 960x540", new Point(8, 5), new TextProperties(0.7, "Arial", "bold", Colors.white, false, Colors.black, 0, "middle", "center"));
            this.__pausedTimeDifference += this.__deltaTime;
        }
        this.__lastTime = this.__currentTime;
        this.framesSinceStart++;
    }
}