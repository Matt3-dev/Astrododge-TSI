class AIShipSprite extends GenericShipSprite  {
    constructor(x = 0, y = 0, team = Team.NONE) {
        super(x, y, team);

        this.maxHealth = 80;
        this.health = this.maxHealth;

        this.firingSpeed = 1.5;
        this.firingCooldown = this.firingSpeed;

        this.lastKnownTarget = {
            x: 0,
            y: 0
        }
    }
    hitBy(sprite) {
        super.hitBy(sprite);
        if (sprite.constructor.name == "PlayerShipSprite") {
            if (sprite.dashEffectTimer > 0) this.destroyShip(new Point(sprite.x, sprite.y), new Point(sprite.vx, sprite.vy), 0.75);
        }
    }
    update() {
        this.accelerating = false;
        if (!this.destroyed) {
            this.target = {
                d: Infinity,
                s: null
            };
            this.friend = {
                d: Infinity,
                s: null
            };
            this.asteroid = {
                d: 4.5,
                s: null
            };
            game.activeSprites.forEach((s) => {
                if (s === this) return;
                if (s instanceof GenericShipSprite && !(this.team & s.team)) {
                    let d = Math.sqrt(Math.pow(this.x - s.x, 2) + Math.pow(this.y - s.y, 2));
                    if (d < this.target.d && !s.destroyed) {
                        this.target.d = d;
                        this.target.s = s;
                    }
                }
                if (s instanceof GenericShipSprite && (this.team & s.team)) {
                    let d = Math.sqrt(Math.pow(this.x - s.x, 2) + Math.pow(this.y - s.y, 2));
                    if (d < this.friend.d && !s.destroyed) {
                        this.friend.d = d;
                        this.friend.s = s;
                    }
                }
                if (s instanceof PlayerShipSprite && (this.team & s.team)) {
                    let d = Math.sqrt(Math.pow(this.x - s.x, 2) + Math.pow(this.y - s.y, 2));
                    if (!s.destroyed) {
                        this.friend.d = d;
                        this.friend.s = s;
                    }
                }
                if (s instanceof AsteroidSprite) {
                    let d = Math.sqrt(Math.pow(this.x - s.x, 2) + Math.pow(this.y - s.y, 2));
                    if (d < this.asteroid.d && !s.destroyed) {
                        this.asteroid.d = d;
                        this.asteroid.s = s;
                    }
                }
            });
            if (this.target.s) {
                this.lastKnownTarget.x = this.target.s.x;
                this.lastKnownTarget.y = this.target.s.y;
                this.lastKnownTarget.d = this.target.d;
                if (this.target.d > 10) this.r = Math.atan2(this.target.s.y - this.y, this.target.s.x - this.x) + Math.PI / 2;
                else this.r = Math.atan2(this.target.s.y + (this.target.s.vy * this.target.d / 9.7) - this.y,
                    this.target.s.x + (this.target.s.vx * this.target.d / 9.7) - this.x) + Math.PI / 2;
                if (this.target.d > 6) {
                    this.accelerating = true;
                    if (this.target.d < 10) this.firingCooldown -= game.deltaTime / 2;
                    let acc = this.accelerationForce;
                    if (this.target.d > 12) acc *= 1.5;
                } else if (this.target.d < 3.5) {
                    this.r -= Math.PI;
                    this.accelerating = true;
                } else {
                    this.firingCooldown -= game.deltaTime;
                }
                if (this.firingCooldown <= 0) {
                    this.firingCooldown = this.firingSpeed;
                    game.queueNewSprite(new SimpleBulletSprite(this.team, 40, this.x, this.y, 10, this.r + Math.random() * 0.2 - 0.1, this.vx, this.vy));
                }
            } else if (this.friend.s) {
                this.lastKnownTarget.x = this.friend.s.x;
                this.lastKnownTarget.y = this.friend.s.y;
                this.lastKnownTarget.d = this.friend.d;
                if (this.friend.d > 1.5) this.r = Math.atan2(this.friend.s.y - this.y, this.friend.s.x - this.x) + Math.PI / 2;
                if (this.friend.d > 5) this.accelerating = true;
            } else {
                let d = Math.sqrt(Math.pow(this.x - game.camera.posx, 2) + Math.pow(this.y - game.camera.posy, 2));
                if (d > 20) this.destroy = true;
                this.r = Math.atan2(this.lastKnownTarget.y - this.y, this.lastKnownTarget.x - this.x) - Math.PI / 2
                this.accelerating = true;
            }
            if (this.asteroid.s) {
                let ar = Math.atan2(this.asteroid.s.y - this.y, this.asteroid.s.x - this.x) + Math.PI / 2;
                if (!this.accelerating) { ar -= Math.PI }
                if (this.r > ar) this.r = Math.max(this.r, ar + Math.PI / 2); 
                else if (this.r < ar) this.r = Math.min(this.r, ar - Math.PI / 2); 
                this.accelerating = true;
            }
            if (this.accelerating) {
                this.vx += Math.sin(this.r) * this.accelerationForce * game.deltaTime;
                this.vy += -Math.cos(this.r) * this.accelerationForce * game.deltaTime;
            }
        }

        super.update();
    }
    render() {
        super.render();
        if (this.destroyed) return;
        let healthPercent = this.health / this.maxHealth;
        let barColor = new Color(510 * (1 - healthPercent), 510 * healthPercent, 0, 1);
        let barBGModel = new Model([
            new Path(Colors.black, [new Point(-0.5, 0), new Point(0.5, 0)])
        ]);
        let barModel = new Model([
            new Path(barColor, [new Point(-healthPercent / 2, 0), new Point(healthPercent / 2, 0)])
        ]);
        game.graphics.drawModelOutlineCam(barBGModel, new OutlineProperties(0.14, Colors.black, "butt", "butt"), new Transform(new Point(this.x, this.y + 0.7), new Point(0, 0), new Point(1, 1), 0), game.camera);
        game.graphics.drawModelOutlineCam(barBGModel, new OutlineProperties(0.075, Colors.gray, "butt", "butt"), new Transform(new Point(this.x, this.y + 0.7), new Point(0, 0), new Point(1, 1), 0), game.camera);
        game.graphics.drawModelOutlineCam(barModel, new OutlineProperties(0.075, barColor, "butt", "butt"), new Transform(new Point(this.x, this.y + 0.7), new Point(0, 0), new Point(1, 1), 0), game.camera);
    }
}