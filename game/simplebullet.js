class SimpleBulletSprite {
    constructor(team = Team.NONE, damage = 0, x, y, v = 0, r = 0, cvx = 0, cvy = 0) {
        this.x = x;
        this.y = y;
        this.vx = Math.sin(r) * v + cvx;
        this.vy = -Math.cos(r) * v + cvy;
        this.s = 1;
        this.r = r;
        this.destroy = false;
        this.priority = 1.5;
        this.lifetime = 0;

        this.beenHit = false;
        this.timeSinceHit = 0;
        this.damage = damage;
        this.team = team;
        this.teammodel = new Model([
            new Path(getTeamColor(this.team), [new Arc(0, 0, 0, Math.PI * 2, 0.10)])
        ]);
        this.centermodel = new Model([
            new Path(new Color(0xff, 0xff, 0xff, 0.5), [new Arc(0, 0, 0, Math.PI * 2, 0.05)])
        ]);
        this.defaultHitbox = new CompoundHitbox([
            new CollisionCircle(new Point(0, 0), 0.1)
        ]);
        this.shootSfx = new Audio('assets/sfx/bulletShoot.wav');
        this.hitSfx = new Audio('assets/sfx/bulletHit.wav');
        this.shootSfx.play();
    }
    hitBy(sprite) {
        this.damage = null;
        this.defaultHitbox.disabled = true;
        this.hitbox.disabled = true;
        this.beenHit = true;
        this.timeSinceHit = 0;
        this.priority = 0.5;
        this.hitSfx.play();
    }
    update() {
        if (this.beenHit) {
            this.timeSinceHit += game.deltaTime;
            this.s = 1 + Math.cbrt(this.timeSinceHit) * 4;
            this.teammodel.paths[0].color.a = 1 - this.timeSinceHit * 2;
            this.centermodel.paths[0].color.a = 0.5 * (1 - this.timeSinceHit * 2);
            this.x += this.vx * game.deltaTime * 0.1;
            this.y += this.vy * game.deltaTime * 0.1;
            if (this.timeSinceHit > 0.5) this.destroy = true;
        } else {
            this.x += this.vx * game.deltaTime;
            this.y += this.vy * game.deltaTime;
            this.hitbox = this.defaultHitbox.scale(this.s, this.s).rotate(this.r).translate(this.x, this.y);
            game.activeSprites.forEach((s) => {
                if (s === this) return;
                if (s.constructor.name == this.constructor.name) return;
                if ((s.team ?? false) && (s.hitbox ?? false)) {
                    if (this.hitbox.collidesWith(s.hitbox)) {
                        if (!(s.team & this.team)) {
                            s.hitBy(this);
                            this.hitBy(null);
                        }
                    }
                }
            });
            if (this.lifetime > 3) this.destroy = true;
        }
    }
    render() {
        game.graphics.drawModelOutlineCam(this.teammodel, new OutlineProperties(0.1 / this.s, new Color(0, 0, 0, 1 - this.timeSinceHit * 3)), new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
        game.graphics.drawModelCam(this.teammodel, new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
        game.graphics.drawModelCam(this.centermodel, new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
    }
}