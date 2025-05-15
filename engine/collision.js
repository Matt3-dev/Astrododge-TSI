class __AABB {
    constructor(pos1, pos2) {
        this.x1 = pos1.x;
        this.y1 = pos1.y;
        this.x2 = pos2.x;
        this.y2 = pos2.y;
    }
    collidesWith(aabb) {
        Stats.hitboxAABBCompares++;
        return !(this.x1 > aabb.x2 || this.x2 < aabb.x1 || this.y1 > aabb.y2 || this.y2 < aabb.y1);
    }
}
class CollisionPoint {
    constructor(point, disabled = false) {
        this.type = 0;
        this.x = point.x;
        this.y = point.y;
        this.disabled = disabled;
        this.aabb = new __AABB(point, point);
    }
    rotate(angle, origin = new Point(0, 0)) {
        let rotationmatrix = [
            Math.cos(angle), -Math.sin(angle),
            Math.sin(angle),  Math.cos(angle)
        ];
        let p = {
            x: this.x,
            y: this.y
        };
        let np = {
            x: this.x,
            y: this.y
        };
        np.x -= origin.x;
        np.y -= origin.y;
        np.x = p.x * rotationmatrix[0] + p.y * rotationmatrix[1];
        np.y = p.x * rotationmatrix[2] + p.y * rotationmatrix[3];
        np.x += origin.x * rotationmatrix[0] + origin.y * rotationmatrix[1];
        np.y += origin.x * rotationmatrix[2] + origin.y * rotationmatrix[3];
        return new CollisionPoint(np, this.disabled);
    }
    scale(x, y, origin = new Point(0, 0)) {
        let p = {
            x: this.x,
            y: this.y
        };
        let np = {
            x: this.x,
            y: this.y
        };
        np.x -= origin.x;
        np.y -= origin.y;
        np.x = p.x * x;
        np.y = p.y * y;
        np.x += origin.x * x;
        np.y += origin.y * y;
        return new CollisionPoint(np, this.disabled);
    }
    translate(x, y) {
        let p = {
            x: this.x,
            y: this.y
        };
        let np = {
            x: this.x,
            y: this.y
        };
        np.x = p.x + x;
        np.y = p.y + y;
        return new CollisionPoint(np, this.disabled);
    }
    collidesWith(collider) {
        if (this.disabled || collider.disabled) return false;
        switch (collider.type) {
            case 0: {
                Stats.hitboxCompares++;
                return (this.x == collider.x && this.y == collider.y);
            }
            case 1: {
                Stats.hitboxCompares++;
                return (this.x > collider.x) && (this.y > collider.y) && (this.x < collider.x + collider.w) && (this.y < collider.y + collider.w);
            }
            case 2: {
                return collider.collidesWith(this);
            }
            case 3: {
                return collider.collidesWith(this);
            }
            case 4: {
                return collider.collidesWith(this);
            }
        }
    }
}
class CollisionTriangle {
    constructor(a, b, c, disabled = false) {
        this.type = 2
        this.a = a;
        this.b = b;
        this.c = c;
        this.disabled = disabled;
        let minx = a.x, miny = a.y, maxx = a.x, maxy = a.y;
        let arr = [b, c];
        for (let i = 0; i < 2; i++) {
            if (arr[i].x < minx) minx = arr[i].x;
            if (arr[i].y < miny) miny = arr[i].y;
            if (arr[i].x > maxx) maxx = arr[i].x;
            if (arr[i].y > maxy) maxy = arr[i].y;
        }
        this.aabb = new __AABB(new Point(minx, miny), new Point(maxx, maxy));
    }
    rotate(angle, origin = new Point(0, 0)) {
        let rotationmatrix = [
            Math.cos(angle), -Math.sin(angle),
            Math.sin(angle),  Math.cos(angle)
        ];
        let arr  = [ new Point(this.a.x, this.a.y), new Point(this.b.x, this.b.y), new Point(this.c.x, this.c.y) ];
        let narr = [ new Point(this.a.x, this.a.y), new Point(this.b.x, this.b.y), new Point(this.c.x, this.c.y) ];
        for (let i = 0; i < 3; i++) {
            arr[i].x -= origin.x;
            arr[i].y -= origin.y;
        }
        for (let i = 0; i < 3; i++) {
            narr[i].x = arr[i].x * rotationmatrix[0] + arr[i].y * rotationmatrix[1];
            narr[i].y = arr[i].x * rotationmatrix[2] + arr[i].y * rotationmatrix[3];
        }
        for (let i = 0; i < 3; i++) {
            narr[i].x += origin.x * rotationmatrix[0] + origin.y * rotationmatrix[1];
            narr[i].y += origin.x * rotationmatrix[2] + origin.y * rotationmatrix[3];
        }
        return new CollisionTriangle(narr[0], narr[1], narr[2], this.disabled);
    }
    scale(x, y, origin = new Point(0, 0)) {
        let arr  = [ new Point(this.a.x, this.a.y), new Point(this.b.x, this.b.y), new Point(this.c.x, this.c.y) ];
        let narr = [ new Point(this.a.x, this.a.y), new Point(this.b.x, this.b.y), new Point(this.c.x, this.c.y) ];
        for (let i = 0; i < 3; i++) {
            arr[i].x -= origin.x;
            arr[i].y -= origin.y;
        }
        for (let i = 0; i < 3; i++) {
            narr[i].x = arr[i].x * x;
            narr[i].y = arr[i].y * y;
        }
        for (let i = 0; i < 3; i++) {
            narr[i].x += origin.x * x;
            narr[i].y += origin.y * y;
        }
        return new CollisionTriangle(narr[0], narr[1], narr[2], this.disabled);
    }
    translate(x, y) {
        let arr  = [ new Point(this.a.x, this.a.y), new Point(this.b.x, this.b.y), new Point(this.c.x, this.c.y) ];
        let narr = [ new Point(this.a.x, this.a.y), new Point(this.b.x, this.b.y), new Point(this.c.x, this.c.y) ];
        for (let i = 0; i < 3; i++) {
            narr[i].x = arr[i].x + x;
            narr[i].y = arr[i].y + y;
        }
        return new CollisionTriangle(narr[0], narr[1], narr[2], this.disabled);
    }
    collidesWith(collider) {
        if (this.disabled || collider.disabled) return false;
        switch (collider.type) {
            case 0: {
            if (!this.aabb.collidesWith(collider.aabb)) return false;
            Stats.hitboxCompares++;
            let areaOrig = Math.abs((this.b.x - this.a.x) * (this.c.y - this.a.y) - (this.c.x - this.a.x) * (this.b.y - this.a.y));
            let area1 =    Math.abs((this.a.x - collider.x) * (this.b.y - collider.y) - (this.b.x - collider.x) * (this.a.y - collider.y));
            let area2 =    Math.abs((this.b.x - collider.x) * (this.c.y - collider.y) - (this.c.x - collider.x) * (this.b.y - collider.y));
            let area3 =    Math.abs((this.c.x - collider.x) * (this.a.y - collider.y) - (this.a.x - collider.x) * (this.c.y - collider.y));
            if (area1 + area2 + area3 > areaOrig - areaOrig / 512 && area1 + area2 + area3 < areaOrig + areaOrig / 512) {
                return true;
            }
            return false;
        }
            case 1: {
            throw "Not implemented!";
        }
            case 2: {
            if (!this.aabb.collidesWith(collider.aabb)) return false;
            Stats.hitboxCompares++;
            // https://stackoverflow.com/questions/2778240/detection-of-triangle-collision-in-2d-space
            // check that all points of the other triangle are on the same side of the triangle after mapping to barycentric coordinates.
            // returns true if all points are outside on the same side
            let cross2 = function(points, triangle) {
                let pa = points.a;
                let pb = points.b;
                let pc = points.c;
                let p0 = triangle.a;
                let p1 = triangle.b;
                let p2 = triangle.c;
                let dXa = pa.x - p2.x;
                let dYa = pa.y - p2.y;
                let dXb = pb.x - p2.x;
                let dYb = pb.y - p2.y;
                let dXc = pc.x - p2.x;
                let dYc = pc.y - p2.y;
                let dX21 = p2.x - p1.x;
                let dY12 = p1.y - p2.y;
                let D = dY12 * (p0.x - p2.x) + dX21 * (p0.y - p2.y);
                let sa = dY12 * dXa + dX21 * dYa;
                let sb = dY12 * dXb + dX21 * dYb;
                let sc = dY12 * dXc + dX21 * dYc;
                let ta = (p2.y - p0.y) * dXa + (p0.x - p2.x) * dYa;
                let tb = (p2.y - p0.y) * dXb + (p0.x - p2.x) * dYb;
                let tc = (p2.y - p0.y) * dXc + (p0.x - p2.x) * dYc;
                if (D < 0) return ((sa >= 0 && sb >= 0 && sc >= 0) ||
                                   (ta >= 0 && tb >= 0 && tc >= 0) ||
                                   (sa+ta <= D && sb+tb <= D && sc+tc <= D));
                return ((sa <= 0 && sb <= 0 && sc <= 0) ||
                        (ta <= 0 && tb <= 0 && tc <= 0) ||
                        (sa+ta >= D && sb+tb >= D && sc+tc >= D));
            }
            return !(cross2(this, collider) || cross2(collider, this));
        }
            case 3: {
                return collider.collidesWith(this);
            }
            case 4: {
                return collider.collidesWith(this);
            }
        }
    }
}
class CollisionCircle          {
    constructor(center, r, disabled = false) {
        this.type = 4;
        this.x = center.x;
        this.y = center.y;
        this.r = r;
        this.disabled = disabled;
        this.aabb = new __AABB(new Point(center.x - r, center.y - r), new Point(center.x + r, center.y + r));
    }
    rotate(angle, origin = new Point(0, 0)) {
        let rotationmatrix = [
            Math.cos(angle), -Math.sin(angle),
            Math.sin(angle), Math.cos(angle)
        ];
        let x = this.x;
        let y = this.y;
        x -= origin.x;
        y -= origin.y;
        let nx = x * rotationmatrix[0] + y * rotationmatrix[1];
        let ny = x * rotationmatrix[2] + y * rotationmatrix[3];
        nx += origin.x * rotationmatrix[0] + origin.y * rotationmatrix[1];
        ny += origin.x * rotationmatrix[2] + origin.y * rotationmatrix[3];
        return new CollisionCircle(new Point(nx, ny), this.r, this.disabled);
    }
    scale(x, y, origin = new Point(0, 0)) {
        let factor = Math.max(x, y);
        let nx = (this.x - origin.x) * factor + origin.x;
        let ny = (this.y - origin.y) * factor + origin.y;
        let r = this.r * factor;
        return new CollisionCircle(new Point(nx, ny), r, this.disabled);
    }
    translate(x, y) {
        return new CollisionCircle(new Point(this.x + x, this.y + y), this.r, this.disabled);
    }
    collidesWith(collider) {
        if (this.disabled || collider.disabled) return false;
        switch (collider.type) {
            case 0: {
                Stats.hitboxCompares++;
                return (Math.pow(this.x - collider.x, 2) + Math.pow(this.y - collider.y, 2) < this.r * this.r);
            }
            case 1: {
            }
            case 2: {
                if (!this.aabb.collidesWith(collider.aabb)) return false;
                Stats.hitboxCompares++;
                let edgecheck = function(thi, a, b) {
                    let dabx = b.x - a.x;
                    let daby = b.y - a.y;
                    let dx = thi.x - a.x;
                    let dy = thi.y - a.y;
                    let ablsq = dabx * dabx + daby * daby;
                    if (ablsq == 0) return Math.hypot(px - ax, py - ay) <= r;

                    let t = Math.max(0, Math.min((dx * dx + dy * dy) / ablsq, 1));
                    let px = a.x + dabx * t;
                    let py = a.y + daby * t;
                    let pxm = px - thi.x;
                    let pym = py - thi.y;
                    let lsq = pxm * pxm + pym * pym;
                    return lsq <= thi.r * thi.r;
                }
                if (edgecheck(this, collider.a, collider.b)) return true;
                if (edgecheck(this, collider.b, collider.c)) return true;
                if (edgecheck(this, collider.c, collider.a)) return true;
                if (collider.collidesWith(new CollisionPoint(new Point(this.x, this.y)))) return true;
                return false;
            }
            case 3: {
                return collider.collidesWith(this);
            }
            case 4: {
                if (!this.aabb.collidesWith(collider.aabb)) return false;
                Stats.hitboxCompares++;
                let d = Math.hypot(this.x - collider.x, this.y - collider.y);
                return d < this.r + collider.r;
            }
        }
    }
}
class CompoundHitbox { 
    constructor(colliders, disabled = false) {
        this.type = 3;
        this.colliders = [];
        this.disabled = disabled;
        for (let i = 0; i < colliders.length; i++) this.colliders.push(colliders[i]);
    }
    rotate(angle, origin = new Point(0, 0)) {
        let ncoll = [];
        for (let i = 0; i < this.colliders.length; i++) {
            ncoll.push(this.colliders[i].rotate(angle, origin));
        }
        return new CompoundHitbox(ncoll, this.disabled);
    }
    scale(x, y, origin = new Point(0, 0)) {
        let ncoll = [];
        for (let i = 0; i < this.colliders.length; i++) {
            ncoll.push(this.colliders[i].scale(x, y, origin));
        }
        return new CompoundHitbox(ncoll, this.disabled);
    }
    translate(x, y) {
        let ncoll = [];
        for (let i = 0; i < this.colliders.length; i++) {
            ncoll.push(this.colliders[i].translate(x, y));
        }
        return new CompoundHitbox(ncoll, this.disabled);
    }
    collidesWith(collider) {
        if (this.disabled || collider.disabled) return false;
        for (let i = 0; i < this.colliders.length; i++) {
            if (this.colliders[i].collidesWith(collider)) { return true; }
        }
        return false;
    }
}