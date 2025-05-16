class AsteroidSprite {
    constructor(x, y, vx, vy, r, vr) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.s = 1;
        this.r = r;
        this.vr = vr;
        this.destroy = false;
        this.priority = 2;
        this.lifetime = 0;

        this.disintegrated = false;
        this.timeSinceDisintegration = 0;
        this.destroyAudio = new Audio('assets/sfx/destroyAsteroid.wav');

        this.team = Team.ASTEROID;
        this.model = new Model();
        this.outlinemodel = new Model();
        this.defaultHitbox = {};
        this.generate();
    }
    generate(maxdepth = 1, outlinesize = 0.05) {
        let colliders = [];
        let weights = [];
        let origin;
        let generateFills = base => {
            this.model.paths.push(new Path(
                new Color(0, 0, 0, 0.25),
                [
                    new Point(base.x - base.w / 2 - outlinesize - origin.x, base.y - base.h / 2 - outlinesize - origin.y),
                    new Point(base.x - base.w / 2 - outlinesize - origin.x, base.y + base.h / 2 + outlinesize - origin.y),
                    new Point(base.x + base.w / 2 + outlinesize - origin.x, base.y + base.h / 2 + outlinesize - origin.y),
                    new Point(base.x + base.w / 2 + outlinesize - origin.x, base.y - base.h / 2 - outlinesize - origin.y)
                ]
            ));
            this.model.paths.push(new Path(
                base.color,
                [
                    new Point(base.x - base.w / 2 - origin.x, base.y - base.h / 2 - origin.y),
                    new Point(base.x - base.w / 2 - origin.x, base.y + base.h / 2 - origin.y),
                    new Point(base.x + base.w / 2 - origin.x, base.y + base.h / 2 - origin.y),
                    new Point(base.x + base.w / 2 - origin.x, base.y - base.h / 2 - origin.y)
                ]
            ));
            this.outlinemodel.paths.push(new Path(
                Colors.black,
                [
                    new Point(base.x - base.w / 2 - origin.x, base.y - base.h / 2 - origin.y),
                    new Point(base.x - base.w / 2 - origin.x, base.y + base.h / 2 - origin.y),
                    new Point(base.x + base.w / 2 - origin.x, base.y + base.h / 2 - origin.y),
                    new Point(base.x + base.w / 2 - origin.x, base.y - base.h / 2 - origin.y)
                ]
            ));
            for (let i = 0; i < base.children.length; i++) {
                generateFills(base.children[i]);
            }
        }
        let generateColliders = base => {
            let a = base.x - base.w / 2 - origin.x;
            let b = base.y - base.h / 2 - origin.y;
            let c = base.x + base.w / 2 - origin.x;
            let d = base.y + base.h / 2 - origin.y;
            colliders.push(new CollisionTriangle(
                new Point(a, b), // a
                new Point(a, d), // b
                new Point(c, d)  // c
            ));
            colliders.push(new CollisionTriangle(
                new Point(a, b), // a
                new Point(c, d), // c
                new Point(c, b)  // d
            ));
            for (let i = 0; i < base.children.length; i++) {
                generateColliders(base.children[i]);
            }
        }
        let build = (base, depth) => {
            weights.push({
                x: base.x,
                y: base.y,
                area: base.w * base.h
            });
            if (depth > maxdepth) return;
            let its = Math.floor(Math.random() * 3) + 1.5;
            let ctns = [0, 0, 0, 0];
            for (let i = 0; i < its; i++) {
                let child = {};
                let side = Math.floor(Math.random() * 4);
                child.w = ((Math.random() * 2) / (depth + 1)) + 1;
                child.h = ((Math.random() * 2) / (depth + 1)) + 1;
                switch (side) {
                    case 0: { // up
                        if (base.w < 1.5) return;
                        if (ctns[0] > 1) { its--; continue; }
                        child.x = (Math.random() * (base.w - 0.2)) - base.w / 2 + 0.1;
                        child.y = (base.y - base.h / 2) + ((Math.random() - 0.5) * child.h / 3);
                        ctns[0]++;
                        break;
                    }
                    case 1: { // right
                        if (base.h < 1.5) return;
                        if (ctns[1] > 1) { its--; continue; }
                        child.x = (base.x - base.w / 2) + ((Math.random() - 0.5) * child.w / 3);
                        child.y = (Math.random() * (base.h - 0.2)) - base.h / 2 + 0.2;
                        ctns[1]++;
                        break;
                    }
                    case 2: { // down
                        if (base.w < 1.5) return;
                        if (ctns[2] > 1) { its--; continue; }
                        child.x = (Math.random() * (base.w - 0.2)) - base.w / 2 + 0.1;
                        child.y = (base.y + base.h / 2) + ((Math.random() - 0.5) * child.h / 3);
                        ctns[2]++;
                        break;
                    }
                    case 3: { // right
                        if (base.h < 1.5) return;
                        if (ctns[3] > 1) { its--; continue; }
                        child.x = (base.x + base.w / 2) + ((Math.random() - 0.5) * child.w / 3);
                        child.y = (Math.random() * (base.h - 0.2)) - base.h / 2 + 0.2;
                        ctns[3]++;
                        break;
                    }
                }
                child.color = new Color(Math.floor(Math.random() * 3) + 50, Math.floor(Math.random() * 3) + 50, Math.floor(Math.random() * 3) + 50);
                child.children = [];
                base.children.push(child);
            }
            for (let i = 0; i < base.children.length; i++) {
                build(base.children[i], depth + 1);
            }
        }
        let base = {
            x: 0,
            y: 0,
            w: (Math.random() * 2) + 1,
            h: (Math.random() * 2) + 1,
            color: new Color(Math.floor(Math.random() * 3) + 50, Math.floor(Math.random() * 3) + 50, Math.floor(Math.random() * 3) + 50),
            children: []
        };
        build(base, 1);
        {
            let sumx = 0;
            let sumy = 0;
            let suma = 0;
            for (let i = 0; i < weights.length; i++) {
                sumx += weights[i].x * weights[i].area;
                sumy += weights[i].y * weights[i].area;
                suma += weights[i].area;
            }
            origin = {
                x: sumx / suma,
                y: sumy / suma
            };
        }
        generateFills(base);
        generateColliders(base);
        this.defaultHitbox = new CompoundHitbox(colliders);
        base.origin = origin;
        base.outlinesize = outlinesize;
        this.basenode = base;
    }
    disintegrate(hitcoord = new Point(0, 0), hitvel = new Point(0, 0), hitstr = 0) {
        this.disintegrated = true;
        this.defaultHitbox.disabled = true;
        this.hitbox.disabled = true;
        this.destroyAudio.play();
        this.chunks = [];
        let origin = this.basenode.origin;
        let outlinesize = this.basenode.outlinesize;
        this.maxLifetimeAfterDisintegration = Math.random() * 5 + 7;
        let buildChunk = (color, p1, p2, p3) => {
            let base = {
                color: color,
                x: (p1.x + p2.x + p3.x) / 3,
                y: (p1.y + p2.y + p3.y) / 3
            }
            let chunk = {};
            let distFromCenter = Math.sqrt(Math.pow(base.x - origin.x, 2) + Math.pow(base.y - origin.y, 2));
            let dirFromCenter = Math.atan2(base.y - origin.y, base.x - origin.x) + this.r;
            let distFromHit = Math.sqrt(Math.pow(this.x - hitcoord.x, 2) + Math.pow(this.y - hitcoord.y, 2));
            let dirFromHit = Math.atan2(this.y - hitcoord.y, this.x - hitcoord.x);
            chunk.x = this.basenode.x + this.x;
            chunk.y = this.basenode.y + this.y;
            chunk.vx = this.vx;
            chunk.vy = this.vy;
            chunk.vx += Math.cos(dirFromCenter) * distFromCenter * 0.25;
            chunk.vy += Math.sin(dirFromCenter) * distFromCenter * 0.25;
            chunk.vx += 0.05 * hitvel.x;
            chunk.vy += 0.05 * hitvel.y;
            chunk.vx += Math.cos(dirFromHit) * distFromHit * hitstr;
            chunk.vy += Math.sin(dirFromHit) * distFromHit * hitstr;
            chunk.r = this.r;
            chunk.vr = 0.2 * (Math.random() - 0.5) + this.vr;
            chunk.model = new Model([
                new Path(
                    base.color,
                    [
                        new Point(p1.x - origin.x, p1.y - origin.y),
                        new Point(p2.x - origin.x, p2.y - origin.y),
                        new Point(p3.x - origin.x, p3.y - origin.y)
                    ])
            ]);
            chunk.outlinemodel = new Model([
                new Path(
                    new Color(0, 0, 0, 0.25),
                    [
                        new Point(p1.x + (p1.x > base.x ? 1 : -1) * outlinesize - origin.x, p1.y + (p1.y > base.y ? 1 : -1) * outlinesize - origin.y),
                        new Point(p2.x + (p2.x > base.x ? 1 : -1) * outlinesize - origin.x, p2.y + (p2.y > base.y ? 1 : -1) * outlinesize - origin.y),
                        new Point(p3.x + (p3.x > base.x ? 1 : -1) * outlinesize - origin.x, p3.y + (p3.y > base.y ? 1 : -1) * outlinesize - origin.y)
                    ])
            ]);
            chunk.lifetime = 0;
            chunk.maxLifetime = Math.random() * this.maxLifetimeAfterDisintegration / 2 + this.maxLifetimeAfterDisintegration / 2;
            chunk.startDisappearing = Math.random() * chunk.maxLifetime / 3 + chunk.maxLifetime / 4;
            chunk.transparency = 0;
            return chunk;
        }
        let build2Chunk = (base) => {
            if (Math.random() >= 0.5) {
                this.chunks.push(buildChunk(
                    base.color,
                    new Point(base.x - base.w / 2, base.y - base.h / 2),
                    new Point(base.x - base.w / 2, base.y + base.h / 2),
                    new Point(base.x + base.w / 2, base.y - base.h / 2)
                ));
                this.chunks.push(buildChunk(
                    base.color,
                    new Point(base.x - base.w / 2, base.y + base.h / 2),
                    new Point(base.x + base.w / 2, base.y + base.h / 2),
                    new Point(base.x + base.w / 2, base.y - base.h / 2)
                ));
            } else {
                this.chunks.push(buildChunk(
                    base.color,
                    new Point(base.x - base.w / 2, base.y - base.h / 2),
                    new Point(base.x + base.w / 2, base.y + base.h / 2),
                    new Point(base.x + base.w / 2, base.y - base.h / 2)
                ));
                this.chunks.push(buildChunk(
                    base.color,
                    new Point(base.x - base.w / 2, base.y + base.h / 2),
                    new Point(base.x - base.w / 2, base.y - base.h / 2),
                    new Point(base.x + base.w / 2, base.y + base.h / 2)
                ));
            }
            base.children.forEach((c) => {
                build2Chunk(c);
            });
        }
        build2Chunk(this.basenode);
        console.log(this.chunks[0]);
    }
    hitBy(sprite) {
        if (this.disintegrated) return;
        if (sprite.constructor.name == "PlayerShipSprite") {
            if (sprite.dashEffectTimer > 0) this.disintegrate(new Point(sprite.x, sprite.y), new Point(sprite.vx, sprite.vy), 0.75);
        }
    }
    update() {
        {
            let t;
            game.activeSprites.forEach((s) => {
                if (s instanceof PlayerShipSprite) t = s;
            });
            if (t ?? false) {
                if (Math.sqrt(Math.pow(t.x - this.x, 2), Math.pow(t.y - this.y, 2)) > 35) this.destroy = true;
            }
        }
        if (this.disintegrated) {
            this.timeSinceDisintegration += game.deltaTime;
            this.chunks.forEach((c) => {
                c.lifetime += game.deltaTime;
                c.x += c.vx * game.deltaTime;
                c.y += c.vy * game.deltaTime;
                c.r += c.vr * game.deltaTime;
                if (c.lifetime > c.startDisappearing) c.transparency = 1 - (c.maxLifetime - c.lifetime) / (c.maxLifetime - c.startDisappearing);
                c.model.paths[0].color.a = 1 - c.transparency;
                c.outlinemodel.paths[0].color.a = 0.25 * (1 - c.transparency);
            });
            if (this.timeSinceDisintegration > this.maxLifetimeAfterDisintegration) this.destroy = true;
        } else {
            this.x += this.vx * game.deltaTime;
            this.y += this.vy * game.deltaTime;
            this.r += this.vr * game.deltaTime;
            this.hitbox = this.defaultHitbox.scale(this.s, this.s).rotate(this.r).translate(this.x, this.y);
        }
    }
    render() {
        if (this.disintegrated) {
            this.chunks.forEach((c) => {
               game.graphics.drawModelOutlineCam(c.model, new OutlineProperties(0.1, new Color(0, 0, 0, 1 - Math.cbrt(c.transparency))), new Transform(new Point(c.x, c.y), new Point(0, 0), new Point(this.s, this.s), c.r), game.camera);
            });
            this.chunks.forEach((c) => {
                game.graphics.drawModelCam(c.outlinemodel, new Transform(new Point(c.x, c.y), new Point(0, 0), new Point(this.s, this.s), c.r), game.camera);
                game.graphics.drawModelCam(c.model, new Transform(new Point(c.x, c.y), new Point(0, 0), new Point(this.s, this.s), c.r), game.camera);
            });
        } else {
            game.graphics.drawModelOutlineCam(this.outlinemodel, new OutlineProperties(0.1, Colors.black), new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
            game.graphics.drawModelCam(this.model, new Transform(new Point(this.x, this.y), new Point(0, 0), new Point(this.s, this.s), this.r), game.camera);
        }
    }
}