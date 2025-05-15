class GenericShipSprite {
    static exhaustParticleModel = new Model([
        new Path(Colors.orange, [
            new Arc(0, 0, 0, Math.PI * 2, 0.05)
        ])
    ]);
    constructor(x = 0, y = 0, team = Team.NONE) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.px = 0;
        this.py = 0;
        this.s = 1;
        this.r = 0;
        this.destroy = false;
        this.priority = 1;
        this.lifetime = 0;

        this.defaultHitbox = new CollisionTriangle(new Point(0.5, 0.5), new Point(-0.5, 0.5), new Point(0, -0.5));

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.destroyed = false;
        this.destroyAudio = new Audio('assets/sfx/destroyShip.wav');

        this.shield = 0;

        this.team = team;
        this.accelerating = false;
        this.accelerationForce = 7.5;
        this.frictionStrength = 0.33;
        this.accelerationAudio = new Audio('assets/sfx/thruster.wav');
        this.accelerationAudio.loop = true;

        this.exhaustParticles = [];
        this.exhaustParticleCooldown = 0;
        this.exhaustParticleTimeout = 0.025;
        this.exhaustParticleSpeed = 4;

        this.model = new Model([
            new Path(new Color(0x7F, 0x7F, 0x7F), [new Point(0, -0.5), new Point(-0.5, 0.5), new Point(0, 0.3)]),
            new Path(new Color(0x66, 0x66, 0x66), [new Point(0, -0.5), new Point(0, 0.3), new Point(0.5, 0.5)]),
            new Path(new Color(0x33, 0x33, 0x33), [new Point(-0.5, 0.5), new Point(0, 0.3), new Point(0, 0.42)]),
            new Path(new Color(0x44, 0x44, 0x44), [new Point(0, 0.3), new Point(0.5, 0.5), new Point(0, 0.42)]),
            new Path(getTeamColor(team), [new Point(0, -0.48), new Point(-0.15, -0.15), new Point(0, -0.2)]),
            new Path(getTeamColor(team).darken(0.2), [new Point(0, -0.48), new Point(0, -0.2), new Point(0.15, -0.15)]),
            new Path(new Color(0x33, 0x33, 0x33), [new Point(0.05, 0.35), new Point(0.35, 0.47), new Point(0.05, 0.47)]),
            new Path(new Color(0x66, 0x66, 0x66), [new Point(0.05, 0.35), new Point(0.35, 0.47), new Point(0.05, 0.42)]),
            new Path(new Color(0x44, 0x44, 0x44), [new Point(-0.05, 0.35), new Point(-0.35, 0.47), new Point(-0.05, 0.47)]),
            new Path(new Color(0x7F, 0x7F, 0x7F), [new Point(-0.05, 0.35), new Point(-0.35, 0.47), new Point(-0.05, 0.42)])
        ]);
    }
    destroyShip(hitcoord = new Point(0, 0), hitvel = new Point(0, 0), hitstr = 0) {
        this.destroyed = true;
        this.defaultHitbox.disabled = true;
        this.hitbox.disabled = true;
        this.accelerating = false;
        this.chunks = [];
        this.maxLifetimeAfterDisintegration = 4;
        this.timeSinceDisintegration = 0;
        this.destroyAudio.play();
        let calcCOM = (path) => {
            let sum = new Point(0, 0);
            path.forEach((point) => {
                sum.x += point.x;
                sum.y += point.y;
            });
            sum.x /= path.length;
            sum.y /= path.length;
            return sum;
        }
        this.model.paths.forEach((path) => {
            let center = calcCOM(path.points);
            let chunk = {};
            let distFromCenter = Math.sqrt(Math.pow(center.x, 2) + Math.pow(center.y, 2));
            let dirFromCenter = Math.atan2(center.y, center.x) + this.r + Math.random() * 0.4;
            let distFromHit = Math.sqrt(Math.pow(center.x + this.x - hitcoord.x, 2) + Math.pow(center.y + this.y - hitcoord.y, 2));
            let dirFromHit = Math.atan2(center.y + this.y - hitcoord.y, center.x + this.x - hitcoord.x) + Math.random() * 0.4;
            chunk.x = center.x * Math.cos(this.r) - center.y * Math.sin(this.r) + this.x;
            chunk.y = center.x * Math.sin(this.r) + center.y * Math.cos(this.r) + this.y;
            chunk.vx = this.vx;
            chunk.vy = this.vy;
            chunk.vx += Math.cos(dirFromCenter) * distFromCenter * 2;
            chunk.vy += Math.sin(dirFromCenter) * distFromCenter * 2;
            chunk.vx += 0.05 * hitvel.x;
            chunk.vy += 0.05 * hitvel.y;
            chunk.vx += Math.cos(dirFromHit) * distFromHit * hitstr;
            chunk.vy += Math.sin(dirFromHit) * distFromHit * hitstr;
            chunk.r = this.r;
            chunk.vr = 0.4 * (Math.random() - 0.5);
            chunk.model = new Model([path]);
            chunk.lifetime = 0;
            chunk.maxLifetime = Math.random() * this.maxLifetimeAfterDisintegration / 2 + this.maxLifetimeAfterDisintegration / 2;
            chunk.startDisappearing = Math.random() * chunk.maxLifetime / 3 + chunk.maxLifetime / 4;
            chunk.transparency = 0;
            this.chunks.push(chunk);
        });
        for (let i = 0; i < 30; i++) {
            let r = Math.random() * Math.PI * 2;
            let exhaustParticle = {};
            let side = (Math.random() >= 0.5) ? -0.2 : 0.2
            exhaustParticle.x = this.x + (side * Math.cos(r) + 0.35 * -Math.sin(r));
            exhaustParticle.y = this.y + (side * Math.sin(r) + 0.35 * Math.cos(r));
            exhaustParticle.vx = (this.vx * 0.5) + -Math.sin(r) * 2 * (Math.random() * 0.3 + 0.7);
            exhaustParticle.vy = (this.vy * 0.5) + Math.cos(r) * 2 * (Math.random() * 0.3 + 0.7);
            exhaustParticle.colorCoeffs = {
                r: 90,
                rt: 30,
                g: 70,
                gt: 2.25,
                b: 43,
                bt: 1.5,
                a: 0.5,
                at: 3
            };
            exhaustParticle.lifetime = Math.random() * 2;
            exhaustParticle.maxLifetime = Math.random() + 3;
            this.exhaustParticles.push(exhaustParticle);
            this.exhaustParticleCooldown -= this.exhaustParticleTimeout;
        }
    }
    updateExhaustParticles(accelerating) {
        for (let i = 0; i < this.exhaustParticles.length; i++) {
            this.exhaustParticles[i].x += this.exhaustParticles[i].vx * game.deltaTime;
            this.exhaustParticles[i].y += this.exhaustParticles[i].vy * game.deltaTime;
            this.exhaustParticles[i].lifetime += game.deltaTime;
            if (this.exhaustParticles[i].lifetime > this.exhaustParticles[i].maxLifetime) this.exhaustParticles.splice(i, 1);
        }
        if (accelerating) this.exhaustParticleCooldown += game.deltaTime;
        while (this.exhaustParticleCooldown > this.exhaustParticleTimeout) {
            let r = this.r + (Math.random() * 0.4) - 0.2;
            let exhaustParticle = {};
            let side = (Math.random() >= 0.5) ? -0.2 : 0.2
            exhaustParticle.x = this.x + (side * Math.cos(r) + 0.35 * -Math.sin(r));
            exhaustParticle.y = this.y + (side * Math.sin(r) + 0.35 * Math.cos(r));
            exhaustParticle.vx = (this.vx * 0.5) + -Math.sin(r) * this.exhaustParticleSpeed;
            exhaustParticle.vy = (this.vy * 0.5) + Math.cos(r) * this.exhaustParticleSpeed;
            exhaustParticle.colorCoeffs = {
                r: 255,
                rt: 10,
                g: 210,
                gt: 0.75,
                b: 130,
                bt: 0.5,
                a: 0.5,
                at: 1
            };
            exhaustParticle.lifetime = 0;
            exhaustParticle.maxLifetime = 1;
            this.exhaustParticles.push(exhaustParticle);
            this.exhaustParticleCooldown -= this.exhaustParticleTimeout;
        }
    }
    hitBy(sprite) {
        if (this.destroyed) return;
        if (sprite instanceof AsteroidSprite || sprite instanceof GenericShipSprite) {
            let dirFromHit = Math.atan2(sprite.y - this.y, sprite.x - this.x);
            this.vx = -Math.cos(dirFromHit) * 2 - this.vx / 3 + sprite.vx;
            this.vy = -Math.sin(dirFromHit) * 2 - this.vy / 3 + sprite.vy;
            this.health -= 50;
        }
        if (sprite.damage ?? false) {
            this.shield -= sprite.damage;
            if (this.shield < 0) {
                this.health += this.shield;
                this.shield = 0;
            }
        }
        if (this.health <= 0) {
            this.destroyShip(new Point(sprite.x, sprite.y), new Point(sprite.vx, sprite.vy), 0.25);
        }
    }
    update() {
        if (this.destroyed) {
            this.timeSinceDisintegration += game.deltaTime;
            this.chunks.forEach((c) => {
                c.lifetime += game.deltaTime;
                c.x += c.vx * game.deltaTime;
                c.y += c.vy * game.deltaTime;
                c.r += c.vr * game.deltaTime;
                if (c.lifetime > c.startDisappearing) c.transparency = 1 - (c.maxLifetime - c.lifetime) / (c.maxLifetime - c.startDisappearing);
                c.model.paths[0].color.a = 1 - c.transparency;
            });
            if (this.timeSinceDisintegration > this.maxLifetimeAfterDisintegration) this.destroy = true;
        } else {
            // movement
            this.vx *= Math.pow(this.frictionStrength, game.deltaTime);
            this.vy *= Math.pow(this.frictionStrength, game.deltaTime);
            this.x += this.vx * game.deltaTime;
            this.y += this.vy * game.deltaTime;
            // collisions
            this.hitbox = this.defaultHitbox.scale(this.s, this.s).rotate(this.r).translate(this.x, this.y);
            game.activeSprites.forEach((s) => {
                if (s === this) return;
                if ((s.team ?? false) && (s.hitbox ?? false)) {
                    if (this.hitbox.collidesWith(s.hitbox)) {
                        if (!(s.team & this.team)) {
                            this.hitBy(s);
                            s.hitBy(this);
                        }
                    }
                }
            });
        }
        if (this.accelerating) {
            if (!this.accelerationAudio.isPlaying) this.accelerationAudio.play();
        } else {
            this.accelerationAudio.pause();
        }
        this.updateExhaustParticles(this.accelerating);
    }
    render() {
        if (this.destroyed) {
            this.chunks.forEach((c) => {
                game.graphics.drawModelOutlineCam(c.model, new OutlineProperties(0.1, new Color(0, 0, 0, 1 - Math.cbrt(c.transparency))), new Transform(new Point(c.x, c.y), new Point(0, 0), new Point(this.s, this.s), c.r), game.camera);
            });
            this.chunks.forEach((c) => {
                game.graphics.drawModelCam(c.model, new Transform(new Point(c.x, c.y), new Point(0, 0), new Point(this.s, this.s), c.r), game.camera);
            });
            this.drawExhaustParticles();
        } else {
            game.graphics.drawModelOutlineCam(this.model, new OutlineProperties(0.1, Colors.black), new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
            if (this instanceof PlayerShipSprite) game.graphics.drawModelOutlineCam(this.model, new OutlineProperties(0.05, Colors.white), new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
            else game.graphics.drawModelOutlineCam(this.model, new OutlineProperties(0.05, getTeamColor(this.team).darken(0.5)), new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
            this.drawExhaustParticles();
            game.graphics.drawModelCam(this.model, new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
        }
    }
    drawExhaustParticles() {
        this.exhaustParticles.forEach((p) => {
            GenericShipSprite.exhaustParticleModel.paths[0].color.r = -p.colorCoeffs.r * (p.lifetime - p.colorCoeffs.rt);
            GenericShipSprite.exhaustParticleModel.paths[0].color.g = -p.colorCoeffs.g * (p.lifetime - p.colorCoeffs.gt);
            GenericShipSprite.exhaustParticleModel.paths[0].color.b = -p.colorCoeffs.b * (p.lifetime - p.colorCoeffs.bt);
            GenericShipSprite.exhaustParticleModel.paths[0].color.a = -p.colorCoeffs.a * (p.lifetime - p.colorCoeffs.at);
            let s = 0.5 + Math.cbrt(p.lifetime) * 5;
            game.graphics.drawModelCam(GenericShipSprite.exhaustParticleModel, new Transform(new Point(p.x, p.y), new Point(0, 0), new Point(s, s), 0), game.camera);
        });
    }
}