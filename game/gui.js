class InGameGui {
    constructor(parent) {
        this.destroy = false;
        this.priority = -2;
        this.lifetime = 0;

        this.parent = parent;
        this.parentDestroyed = false;
        this.timeSinceParentDestroyed = 0;

        this.ingameguil1 = new Model([
            new Path(new Color(128, 128, 128), [
                new Point(-0.5, -0.5), new Point(-0.5, 9.5), new Point(16.5, 9.5), new Point(16.5, -0.5), new Point(-0.5, -0.5),
                new Point(0.1, 0.1), new Point(15.9, 0.1), new Point(15.9, 8.9), new Point(0.1, 8.9), new Point(0.1, 0.1)
            ])
        ]);
        this.ingameguil2 = new Model([
            new Path(new Color(128, 128, 128, 0.5), [
                new Point(11.7, 8.9), new Point(11.5, 8.2), new Point(4.5, 8.2), new Point(4.3, 8.9)
            ])
        ]);
        this.ingameguil3 = new Model([
            new Path(new Color(128, 128, 128, 0.5), [
                new Point(11.7, 0.1), new Point(11.5, 0.8), new Point(4.5, 0.8), new Point(4.3, 0.1)
            ])
        ]);

        this.barSpacing = 0.0375;
        this.totalBarLength = 3.15;
        this.barOutlineModel = new Model([
            new Path(Colors.black, [new Point(0, 0), new Point(this.totalBarLength, 0)])
        ]);
        this.hpModel = new Model([
            new Path(new Color(255, 0, 0), [new Point(0, 0.075), new Point(0.1, -0.025), new Point(0.05, -0.075), new Point(0, -0.025), new Point(-0.05, -0.075), new Point(-0.1, -0.025)])
        ]);
        this.dashModel = new Model([
            new Path(new Color(0, 64, 255), [new Point(-0.025, 0.075), new Point(0.1, 0), new Point(-0.025, -0.075)]),
            new Path(new Color(0, 128, 255), [new Point(-0.1, 0.075), new Point(0.025, 0), new Point(-0.1, -0.075)])
        ]);
        this.bulletModel = new Model([
            new Path(new Color(160, 160, 160), [new Arc(0, 0, 0, Math.PI * 2, 0.10)]),
            new Path(new Color(0xff, 0xff, 0xff, 0.6), [new Arc(0, 0, 0, Math.PI * 2, 0.05)])
        ]);
        this.shieldModel = new Model([
            new Path(new Color(80, 255, 80), [new Point(0, 0.09), new Point(0.1, -0.05), new Point(0.05, -0.09), new Point(-0.05, -0.09), new Point(-0.1, -0.05)])
        ]);

        this.hitTimer = 0;
        this.hitOverlay = new Model([
            new Path(new Color(255, 0, 0, 0.5),
                [new Point(-0.5, -0.5), new Point(-0.5, 9.5), new Point(16.5, 9.5), new Point(16.5, -0.5), new Point(-0.5, -0.5),
                new Point(1, 1), new Point(15, 1), new Point(15, 8), new Point(1, 8), new Point(1, 1)
                ])
        ]);

        this.scanLineWidth = 0.4;
        this.scanLineModel = new Model([
            new Path(new Color(255, 255, 255, 0.2), [new Point(0, 0), new Point(16, 0)])
        ]);
    }
    gotHit() {
        this.hitTimer = 0.5;
    }
    update() {
        if (this.parentDestroyed) {
            this.timeSinceParentDestroyed += game.deltaTime / 2;
            if (this.timeSinceParentDestroyed > 2) {
                this.destroy = true;
            }
        }
        if (this.hitTimer > 0) {
            this.hitTimer -= game.deltaTime;
        }
    }
    render() {
        let tSPDsq = this.timeSinceParentDestroyed * this.timeSinceParentDestroyed;
        for (let i = 0; i < 9 / this.scanLineWidth / 2; i++) {
            game.graphics.drawModelOutline(this.scanLineModel, new OutlineProperties(this.scanLineWidth, new Color(255, 255, 255, 0.02 - tSPDsq / 100)), new Transform(new Point(0, i * this.scanLineWidth * 2 + ((this.lifetime * 0.4) % this.scanLineWidth) * 2), new Point(0, 0), new Point(1, 1), 0));
        }

        if (this.lifetime < 7) {
            game.graphics.drawTextFill("Time you survived", new Point(8, 1), new TextProperties(0.25, "Arial", "bold", new Color(255, 255, 255, -0.5 * (this.lifetime - 7)), false, Colors.black, 0.01, "middle", "center"));
            game.graphics.drawTextFill("Accelerate using [space]", new Point(8, 8), new TextProperties(0.25, "Arial", "bold", new Color(255, 255, 255, -0.5 * (this.lifetime - 7)), false, Colors.black, 0.01, "middle", "center"));
            game.graphics.drawTextFill("Your health", new Point(4.4, 8.4), new TextProperties(0.25, "Arial", "bold", new Color(255, 255, 255, -0.5 * (this.lifetime - 7)), false, Colors.black, 0.01, "middle", "right"));
            game.graphics.drawTextFill("Dash using [w]", new Point(4.3, 8.7), new TextProperties(0.25, "Arial", "bold", new Color(255, 255, 255, -0.5 * (this.lifetime - 7)), false, Colors.black, 0.01, "middle", "right"));
            game.graphics.drawTextFill("Your EMF shield", new Point(11.6, 8.4), new TextProperties(0.25, "Arial", "bold", new Color(255, 255, 255, -0.5 * (this.lifetime - 7)), false, Colors.black, 0.01, "middle", "left"));
            game.graphics.drawTextFill("Shoot using [LMB]", new Point(11.7, 8.7), new TextProperties(0.25, "Arial", "bold", new Color(255, 255, 255, -0.5 * (this.lifetime - 7)), false, Colors.black, 0.01, "middle", "left"));
        }

        game.graphics.drawModelOutline(this.ingameguil1, new OutlineProperties(0.1, Colors.black), new Transform(new Point(-16 * tSPDsq / 8, -9 * tSPDsq / 8), new Point(0, 0), new Point(1 + tSPDsq / 4, 1 + tSPDsq / 4), 0));
        game.graphics.drawModel(this.ingameguil1, new Transform(new Point(-16 * tSPDsq / 8, -9 * tSPDsq / 8), new Point(0, 0), new Point(1 + tSPDsq / 4, 1 + tSPDsq / 4), 0));
        game.graphics.drawModel(this.ingameguil2, new Transform(new Point(0, 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModel(this.ingameguil3, new Transform(new Point(0, -9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawTextOutline(`${this.parent.lifetime.toFixed(2)}s`, new Point(8, 0.5 - 9 * tSPDsq / 8), new TextProperties(0.5, "Arial", "bold", Colors.red, true, Colors.black, 0.05, "middle", "center"));
        game.graphics.drawTextFill(`${this.parent.lifetime.toFixed(2)}s`, new Point(8, 0.5 - 9 * tSPDsq / 8), new TextProperties(0.5, "Arial", "bold", Colors.white, false, Colors.white, 0.01, "middle", "center"));

        game.graphics.drawModelOutline(this.hpModel, new OutlineProperties(0.075, Colors.black), new Transform(new Point(4.65, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModel(this.hpModel, new Transform(new Point(4.65, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModelOutline(this.barOutlineModel, new OutlineProperties(0.25, Colors.black, "butt", "butt"), new Transform(new Point(4.8, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        {
            let spaces = (this.parent.maxHealth / 50) - 1;
            let totalLen = this.totalBarLength - ((Math.ceil(spaces) + 2) * this.barSpacing);
            let accountedLen = totalLen * (this.parent.health / this.parent.maxHealth);
            let partialLen = totalLen / (spaces + 1);
            for (let i = 0; i <= spaces + 1; i++) {
                let begin = i * (partialLen + this.barSpacing) + this.barSpacing;
                let totalEnd = begin + Math.min(partialLen, totalLen);
                let accountedEnd = begin + Math.max(Math.min(partialLen, accountedLen), 0);
                totalLen -= partialLen;
                accountedLen -= partialLen;
                let model = new Model([
                    new Path(Colors.black, [new Point(begin, 0), new Point(totalEnd, 0)])
                ]);
                game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(128, 0, 0), "butt", "butt"), new Transform(new Point(4.8, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
                model = new Model([
                    new Path(Colors.black, [new Point(begin, 0), new Point(accountedEnd, 0)])
                ]);
                game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(255, 0, 0), "butt", "butt"), new Transform(new Point(4.8, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
            }
        }

        game.graphics.drawModelOutline(this.shieldModel, new OutlineProperties(0.075, Colors.black), new Transform(new Point(8.1, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModel(this.shieldModel, new Transform(new Point(8.1, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModelOutline(this.barOutlineModel, new OutlineProperties(0.25, Colors.black, "butt", "butt"), new Transform(new Point(8.25, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        {
            let spaces = (this.parent.maxShield / 40) - 1;
            let totalLen = this.totalBarLength - ((Math.ceil(spaces) + 2) * this.barSpacing);
            let accountedLen = totalLen * (this.parent.shield / this.parent.maxShield);
            let partialLen = totalLen / (spaces + 1);
            for (let i = 0; i <= spaces + 1; i++) {
                let begin = i * (partialLen + this.barSpacing) + this.barSpacing;
                let totalEnd = begin + Math.min(partialLen, totalLen);
                let accountedEnd = begin + Math.max(Math.min(partialLen, accountedLen), 0);
                totalLen -= partialLen;
                accountedLen -= partialLen;
                let model = new Model([
                    new Path(Colors.black, [new Point(begin, 0), new Point(totalEnd, 0)])
                ]);
                game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(40, 128, 40), "butt", "butt"), new Transform(new Point(8.25, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
                model = new Model([
                    new Path(Colors.black, [new Point(begin, 0), new Point(accountedEnd, 0)])
                ]);
                game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(80, 255, 80), "butt", "butt"), new Transform(new Point(8.25, 8.4 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
            }
        }

        game.graphics.drawModelOutline(this.dashModel, new OutlineProperties(0.075, Colors.black), new Transform(new Point(4.65, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModel(this.dashModel, new Transform(new Point(4.65, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModelOutline(this.barOutlineModel, new OutlineProperties(0.25, Colors.black, "butt", "butt"), new Transform(new Point(4.8, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        {
            let totalLen = this.totalBarLength - 2 * this.barSpacing;
            let accountedLen = totalLen * Math.min(this.parent.timeSinceLastDash / this.parent.dashCooldown, 1);
            let model = new Model([
                new Path(Colors.black, [new Point(this.barSpacing, 0), new Point(this.barSpacing + totalLen, 0)])
            ]);
            game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(0, 64, 128), "butt", "butt"), new Transform(new Point(4.8, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
            model = new Model([
                new Path(Colors.black, [new Point(this.barSpacing, 0), new Point(this.barSpacing + accountedLen, 0)])
            ]);
            game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(0, 128, 255), "butt", "butt"), new Transform(new Point(4.8, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        }

        game.graphics.drawModelOutline(this.bulletModel, new OutlineProperties(0.075, Colors.black), new Transform(new Point(8.1, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModel(this.bulletModel, new Transform(new Point(8.1, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModelOutline(this.barOutlineModel, new OutlineProperties(0.25, Colors.black, "butt", "butt"), new Transform(new Point(8.25, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
        {
            let spaces = (this.parent.maxBulletCount) - 1;
            let totalLen = this.totalBarLength - ((Math.ceil(spaces) + 2) * this.barSpacing);
            let cooldownLen = totalLen * ((this.parent.bulletCount + this.parent.bulletRefillTimer / this.parent.bulletRefillSpeed) / this.parent.maxBulletCount);
            let accountedLen = totalLen * (this.parent.bulletCount / this.parent.maxBulletCount);
            let partialLen = totalLen / (spaces + 1);
            for (let i = 0; i <= spaces; i++) {
                let begin = i * (partialLen + this.barSpacing) + this.barSpacing;
                let totalEnd = begin + Math.min(partialLen, totalLen);
                let cooldownEnd = begin + Math.max(Math.min(partialLen, cooldownLen), 0);
                let accountedEnd = begin + Math.max(Math.min(partialLen, accountedLen), 0);
                totalLen -= partialLen;
                cooldownLen -= partialLen;
                accountedLen -= partialLen;
                let model = new Model([
                    new Path(Colors.black, [new Point(begin, 0), new Point(totalEnd, 0)])
                ]);
                game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(64, 64, 64), "butt", "butt"), new Transform(new Point(8.25, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
                model = new Model([
                    new Path(Colors.black, [new Point(begin, 0), new Point(cooldownEnd, 0)])
                ]);
                game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(128, 128, 128), "butt", "butt"), new Transform(new Point(8.25, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
                model = new Model([
                    new Path(Colors.black, [new Point(begin, 0), new Point(accountedEnd, 0)])
                ]);
                game.graphics.drawModelOutline(model, new OutlineProperties(0.25 - this.barSpacing * 2, new Color(255, 255, 255), "butt", "butt"), new Transform(new Point(8.25, 8.7 + 9 * tSPDsq / 8), new Point(0, 0), new Point(1, 1), 0));
            }
        }

        if (this.hitTimer > 0) {
            this.hitOverlay.paths[0].color.a = this.hitTimer;
            game.graphics.drawModel(this.hitOverlay, new Transform(new Point(0, 0), new Point(0, 0), new Point(1, 1), 0));
        }
    }
}
class CrosshairGui {
    constructor() {
        this.destroy = false;
        this.priority = -1;
        this.lifetime = 0;

        this.crosshairpart = new Model([
            new Path(new Color(0xff, 0x33, 0x33), [new Point(0, -0.05), new Point(-0.044, -0.22), new Point(0.044, -0.22)])
        ]);
    }
    update() { }
    render() {
        let pointer = game.camera.transformMousePosition(game.mouse.getMousePositionRelative(game.graphics, true, true));
        game.graphics.drawModelOutlineCam(this.crosshairpart, new OutlineProperties(0.05, Colors.black), new Transform(pointer, new Point(0, 0), new Point(1, 1), 0 + this.lifetime), game.camera);
        game.graphics.drawModelOutlineCam(this.crosshairpart, new OutlineProperties(0.05, Colors.black), new Transform(pointer, new Point(0, 0), new Point(1, 1), Math.PI / 2 + this.lifetime), game.camera);
        game.graphics.drawModelOutlineCam(this.crosshairpart, new OutlineProperties(0.05, Colors.black), new Transform(pointer, new Point(0, 0), new Point(1, 1), Math.PI + this.lifetime), game.camera);
        game.graphics.drawModelOutlineCam(this.crosshairpart, new OutlineProperties(0.05, Colors.black), new Transform(pointer, new Point(0, 0), new Point(1, 1), 3 * Math.PI / 2 + this.lifetime), game.camera);
        game.graphics.drawModelCam(this.crosshairpart, new Transform(pointer, new Point(0, 0), new Point(1, 1), 0 + this.lifetime), game.camera);
        game.graphics.drawModelCam(this.crosshairpart, new Transform(pointer, new Point(0, 0), new Point(1, 1), Math.PI / 2 + this.lifetime), game.camera);
        game.graphics.drawModelCam(this.crosshairpart, new Transform(pointer, new Point(0, 0), new Point(1, 1), Math.PI + this.lifetime), game.camera);
        game.graphics.drawModelCam(this.crosshairpart, new Transform(pointer, new Point(0, 0), new Point(1, 1), 3 * Math.PI / 2 + this.lifetime), game.camera);
    }
}
class DestroyedGui {
    constructor(time = 0) {
        this.destroy = false;
        this.priority = -1;
        this.lifetime = 0;

        this.timeSurvived = time;
        this.bestTime = 0;
        this.isBest = false;
        this.savesCookies = false;

        this.modeltop = new Model([
            new Path(new Color(128, 128, 128, 1), [
                new Point(11.7, 0.3), new Point(11.5, 1), new Point(4.5, 1), new Point(4.3, 0.3)
            ])
        ]);
        this.modelbottom = new Model([
            new Path(new Color(128, 128, 128, 1), [
                new Point(11.7, 8.7), new Point(11.5, 8), new Point(4.5, 8), new Point(4.3, 8.7)
            ])
        ]);

        if (!game.disabledCookies) {
            let bestCookie = game.getCookie("besttime");
            this.bestTime = parseFloat(bestCookie);
            this.savesCookies = true;
            if (this.timeSurvived > this.bestTime) {
                this.bestTime = this.timeSurvived;
                this.isBest = true;
                game.writeCookie("besttime", this.bestTime.toFixed(1));
            }
        }
    }
    update() {
        this.animTime = Math.pow(4 - Math.min(4, this.lifetime), 2);
    }
    render() {
        game.graphics.drawModelOutline(this.modeltop, new OutlineProperties(0.1, Colors.black), new Transform(new Point(0, 0 - 9 * this.animTime / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModel(this.modeltop, new Transform(new Point(0, 0 - 9 * this.animTime / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModelOutline(this.modelbottom, new OutlineProperties(0.1, Colors.black), new Transform(new Point(0, 9 * this.animTime / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawModel(this.modelbottom, new Transform(new Point(0, 9 * this.animTime / 8), new Point(0, 0), new Point(1, 1), 0));
        game.graphics.drawTextOutline(`You got destroyed after ${this.timeSurvived.toFixed(1)}s`, new Point(8, 0.7 - 9 * this.animTime / 8), new TextProperties(0.45, "Arial", "bold", Colors.red, true, Colors.black, 0.05, "middle", "center"));
        game.graphics.drawTextFill(`You got destroyed after ${this.timeSurvived.toFixed(1)}s`, new Point(8, 0.7 - 9 * this.animTime / 8), new TextProperties(0.45, "Arial", "bold", Colors.white, false, Colors.white, 0.01, "middle", "center"));
        if (!game.disabledCookies) {
            game.graphics.drawTextOutline(`Best time: ${this.bestTime.toFixed(1)}s`, new Point(8, 8.4 + 9 * this.animTime / 8), new TextProperties(0.45, "Arial", "bold", Colors.red, true, Colors.black, 0.05, "middle", "center"));
            game.graphics.drawTextFill(`Best time: ${this.bestTime.toFixed(1)}s`, new Point(8, 8.4 + 9 * this.animTime / 8), new TextProperties(0.45, "Arial", "bold", Colors.white, false, Colors.white, 0.01, "middle", "center"));
        } else {
            game.graphics.drawTextOutline(`Cookies are disabled;\nis this running offline?`, new Point(8, 8.4 + 9 * this.animTime / 8), new TextProperties(0.3, "Arial", "bold", Colors.red, true, Colors.black, 0.05, "middle", "center"));
            game.graphics.drawTextFill(`Cookies are disabled;\nis this running offline?`, new Point(8, 8.4 + 9 * this.animTime / 8), new TextProperties(0.3, "Arial", "bold", Colors.white, false, Colors.white, 0.01, "middle", "center"));
        }
        if (this.isBest) game.graphics.drawTextOutline(`(new best!)`, new Point(11, 8.7 + 9 * this.animTime / 8), new TextProperties(0.25, "Arial", "bold", Colors.red, true, Colors.black, 0.05, "middle", "center"));
        if (this.isBest) game.graphics.drawTextFill(`(new best!)`, new Point(11, 8.7 + 9 * this.animTime / 8), new TextProperties(0.25, "Arial", "bold", Colors.red, false, Colors.white, 0.01, "middle", "center"));
    }
}