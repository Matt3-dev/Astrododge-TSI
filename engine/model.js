class Model {
    constructor(paths = []) {
        this.paths = paths;
        this.maxDist = 0;
        this.paths.forEach((p) => {
            p.points.forEach((e) => {
                if (e.constructor.name == "Point") {
                    let dist = Math.sqrt(p.x * p.x + p.y * p.y);
                    if (this.maxDist < dist) this.maxDist = dist;
                }
                if (e.constructor.name == "Arc") {
                    let dist = Math.sqrt(p.x * p.x + p.y * p.y) + p.radius;
                    if (this.maxDist < dist) this.maxDist = dist;
                }
            });
        });
    }
}
class Path {
    constructor(color = "", points = []) {
        this.points = points;
        this.color = color;
    }
}
class Arc {
    constructor(x = 0, y = 0, bAngle = 0, eAngle = 0, radius = 0) {
        this.x = x;
        this.y = y;
        this.bAngle = bAngle;
        this.eAngle = eAngle;
        this.radius = radius;
    }
}
class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}