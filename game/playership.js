class PlayerShipSprite extends GenericShipSprite {
    constructor(x = 0, y = 0) {
        super(x, y, Team.PLAYER);

        this.priority = 0.9;

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.hitAudio = new Audio('assets/sfx/playerHit.wav');

        this.maxShield = 50;
        this.shield = this.maxShield / 2;

        this.reciprocalDashSpeed = 0.3;
        this.dashForce = 1.2;
        this.dashCooldown = 4;
        this.timeSinceLastDash = this.dashCooldown;
        this.lastFrameTimeSinceLastDash = this.timeSinceLastDash;
        this.setDashEffectTimer = 0.5;
        this.dashEffectTimer = 0;
        this.dashShadowCooldown = 0.15;
        this.timeSinceLastDashShadow = 0;
        this.dashShadows = [];
        this.dashAudio = new Audio('assets/sfx/dash.wav');
        this.dashCooldownAudio = new Audio('assets/sfx/dashCooldown.wav');

        this.maxBulletCount = 4;
        this.bulletCount = this.maxBulletCount;
        this.bulletRefillSpeed = 1.5;
        this.bulletRefillTimer = 0;
        this.bulletRefillAudio = new Audio('assets/sfx/reload.wav');

        this.setImmunity = 2;
        this.immunityTimer = 5;

        this.crosshair = new CrosshairGui();
        this.gui = new InGameGui(this);
        game.queueNewSprite(this.crosshair);
        game.queueNewSprite(this.gui);
    }
    destroyShip(hitcoord = new Point(0, 0), hitvel = new Point(0, 0), hitstr = 0) {
        this.crosshair.destroy = true;
        this.gui.parentDestroyed = true;
        game.queueNewSprite(new DestroyedGui(this.lifetime));
        super.destroyShip(hitcoord, hitvel, hitstr);
    }
    dash() {
        if (this.timeSinceLastDash < this.dashCooldown) return;
        this.dashAudio.play();
        this.vx = Math.sin(this.r) * this.accelerationForce * this.dashForce + this.reciprocalDashSpeed * this.vx;
        this.vy = -Math.cos(this.r) * this.accelerationForce * this.dashForce + this.reciprocalDashSpeed * this.vy;
        this.timeSinceLastDash = 0;
        this.dashEffectTimer = this.setDashEffectTimer;
        this.timeSinceLastDashShadow = this.dashShadowCooldown;
        for (let i = 0; i < 10; i++) {
            let r = this.r + (Math.random() * 0.4) - 0.2;
            let exhaustParticle = {};
            let side = (Math.random() >= 0.5) ? -0.2 : 0.2
            exhaustParticle.x = this.x + (side * Math.cos(r) + 0.35 * -Math.sin(r));
            exhaustParticle.y = this.y + (side * Math.sin(r) + 0.35 * Math.cos(r));
            exhaustParticle.vx = (this.vx * 0.5) + -Math.sin(r) * this.exhaustParticleSpeed * 1.2;
            exhaustParticle.vy = (this.vy * 0.5) + Math.cos(r) * this.exhaustParticleSpeed * 1.2;
            exhaustParticle.colorCoeffs = {
                r: 130,
                rt: 0.5,
                g: 210,
                gt: 1.5,
                b: 255,
                bt: 10,
                a: 0.25,
                at: 1
            };
            exhaustParticle.lifetime = 0;
            exhaustParticle.maxLifetime = 2;
            this.exhaustParticles.push(exhaustParticle);
            this.exhaustParticleCooldown -= this.exhaustParticleTimeout;
        }
    }
    updateDashShadows() {
        for (let i = 0; i < this.dashShadows.length; i++) {
            this.dashShadows[i].lifetime += game.deltaTime;
            if (this.dashShadows[i].lifetime > this.dashShadows[i].maxLifetime) this.dashShadows.splice(i, 1);
        }
        if (this.dashEffectTimer > 0) {
            this.timeSinceLastDashShadow += game.deltaTime;
            while (this.timeSinceLastDashShadow > this.dashShadowCooldown) {
                let dashShadow = { };
                dashShadow.x = this.x;
                dashShadow.y = this.y;
                dashShadow.s = this.s;
                dashShadow.r = this.r;
                dashShadow.lifetime = 0;
                this.dashShadows.push(dashShadow);
                this.timeSinceLastDashShadow -= this.dashShadowCooldown;
            }
            this.dashEffectTimer -= game.deltaTime;
        }
    }
    hitBy(sprite) {
        if (this.dashEffectTimer > 0 && (sprite instanceof AsteroidSprite || sprite instanceof GenericShipSprite)) {
            this.vx *= 0.5;
            this.vy *= 0.5;
        } else if (this.immunityTimer > 0) {
        } else {
            this.hitAudio.play();
            super.hitBy(sprite);
            this.gui.gotHit();
            this.immunityTimer = this.setImmunity;
        }
    }
    update() {
        if (this.destroyed) {
            game.camera.setTargetScale(1.5, 1.5);
            this.updateDashShadows();
            super.update();
            return;
        }
        // rotate to mouse
        this.pointer = game.camera.transformMousePosition(game.mouse.getMousePositionRelative(game.graphics, true, true));
        this.px = this.pointer.x;
        this.py = this.pointer.y;
        let dx = this.px - this.x;
        let dy = this.py - this.y;
        let dv = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) > 0.5) this.r = Math.atan2(dy, dx) + Math.PI / 2;

        // forward
        this.accelerating = false;
        if (game.keyboard.isKeyCodePressed(32)) {
            this.vx += Math.sin(this.r) * this.accelerationForce * game.deltaTime;
            this.vy += -Math.cos(this.r) * this.accelerationForce * game.deltaTime;
            this.accelerating = true;
        }
        // dash
        this.timeSinceLastDash += game.deltaTime;
        if (game.keyboard.isKeyCodeJustPressed(87)) this.dash();
        // spawn projectile
        if (game.mouse.getLeftButtonJustPressed() && this.bulletCount > 0) {
            this.bulletCount--;
            game.queueNewSprite(new SimpleBulletSprite(this.team, 40, this.x, this.y, 10, this.r, this.vx, this.vy));
        }
        if (this.bulletCount < this.maxBulletCount) {
            this.bulletRefillTimer += game.deltaTime;
            if (this.bulletRefillTimer > this.bulletRefillSpeed) {
                this.bulletCount++;
                this.bulletRefillTimer -= this.bulletRefillSpeed;
                this.bulletRefillAudio.play();
            }
        } else {
            this.bulletRefillTimer = 0;
        }

        if (this.shield < this.maxShield) {
            this.shield += game.deltaTime * 2;
            if (this.shield > this.maxShield) this.shield = this.maxShield;
        }

        if (this.timeSinceLastDash >= this.dashCooldown && this.lastFrameTimeSinceLastDash < this.dashCooldown) {
            this.dashCooldownAudio.play();
        }
        this.lastFrameTimeSinceLastDash = this.timeSinceLastDash;

        if (this.immunityTimer > 0) {
            this.immunityTimer -= game.deltaTime;
            if (this.imunityTimer < 0) this.immunityTimer = 0;
        }

        // vfx
        game.camera.setTargetPosition(this.x + 0.4 * dx, this.y + 0.4 * dy);
        game.camera.setTargetScale(1 + dv * 0.05, 1 + dv * 0.05);
        this.updateDashShadows();
        super.update();
    }
    render() {
        this.dashShadows.forEach((p) => {
            let a = -2 * (p.lifetime - 0.5);
            this.model.paths.forEach((path) => {
                path.color.a = a;
            });
            game.graphics.drawModelCam(this.model, new Transform(new Point(p.x, p.y), new Point(0, 0), new Point(p.s, p.s), p.r), game.camera);
            this.model.paths.forEach((path) => {
                path.color.a = 1;
            });
        });

        if (this.immunityTimer > 0) game.graphics.drawModelOutlineCam(this.model, new OutlineProperties(0.2, new Color(255, 255, 255, Math.abs(Math.sin(this.immunityTimer * Math.PI)))), new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
        super.render(!this.visibleByImmunity);
    }
}