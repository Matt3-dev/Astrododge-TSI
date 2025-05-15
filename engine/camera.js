class Camera {
    constructor(acc, dam) {
        this.accel = acc;
        this.dampen = (1 - dam) / 10000;
        this.posx = 0;
        this.posy = 0;
        this.tarx = 0;
        this.tary = 0;
        this.accx = 0;
        this.accy = 0;
        this.velx = 0;
        this.vely = 0;

        this.sx = 1;
        this.sy = 1;
        this.tarsx = 1;
        this.tarsy = 1;
        this.accsx = 0;
        this.accsy = 0;
        this.velsx = 0;
        this.velsy = 0;

        this.rot = 0;
    }
    getTransformScale() {
        let ret = {};
        ret.x = this.sx;
        ret.y = this.sy;
        return ret;
    }
    setPosition(x, y) {
        this.posx = x;
        this.posy = y;
        this.tarx = x;
        this.tary = y;
        this.accx = 0;
        this.accy = 0;
        this.velx = 0;
        this.vely = 0;
    }
    getPosition() {
        let ret = {};
        ret.x = this.posx
        ret.y = this.posy
        return ret;
    }
    setScale(x, y) {
        this.sx = x;
        this.sy = y;
        this.tarsx = x;
        this.tarsy = y;
        this.accsx = 0;
        this.accsy = 0;
        this.velsx = 0;
        this.velsy = 0;
    }
    getScale(x, y) {
        let ret = {};
        ret.x = this.sx
        ret.y = this.sy
        return ret;
    }
    setTargetPosition(x, y) {
        this.tarx = x;
        this.tary = y;
    }
    getTargetPosition() {
        let ret = {};
        ret.x = this.tarx
        ret.y = this.tary
        return ret;
    }
    setTargetScale(x, y) {
        this.tarsx = x;
        this.tarsy = y;
    }
    getTargetScale() {
        let ret = {};
        ret.x = this.tarsx
        ret.y = this.tarsy
        return ret;
    }
    resetVelocity() {
        this.velx = 0;
        this.vely = 0;
        this.velsx = 0;
        this.velsy = 0;
    }
    stopMovement() {
        this.tarx = this.posx;
        this.tary = this.posy;
        this.accx = 0;
        this.accy = 0;
        this.velx = 0;
        this.vely = 0;

        this.tarsx = this.sx;
        this.tarsy = this.sy;
        this.accsx = 0;
        this.accsy = 0;
        this.velsx = 0;
        this.velsy = 0;
    }
    setConstants(acc, dam) {
        this.accel = acc;
        this.dampen = (1 - dam) / 10000;
    }
    updateCamera(delta) {
        this.accx = (this.tarx - this.posx) * this.accel;
        this.accy = (this.tary - this.posy) * this.accel;
        this.velx += this.accx * delta;
        this.vely += this.accy * delta;
        this.velx *= Math.pow(this.dampen, delta);
        this.vely *= Math.pow(this.dampen, delta);
        this.posx = this.posx + this.velx;
        this.posy = this.posy + this.vely;

        this.accsx = (this.tarsx - this.sx) * this.accel;
        this.accsy = (this.tarsy - this.sy) * this.accel;
        this.velsx += this.accsx * delta;
        this.velsy += this.accsy * delta;
        this.velsx *= Math.pow(this.dampen, delta);
        this.velsy *= Math.pow(this.dampen, delta);
        this.sx = this.sx + this.velsx;
        this.sy = this.sy + this.velsy;
        this.effRadius = Math.sqrt(64 * this.sx * this.sx + 20.25 * this.sy * this.sy);
    }
    transformMousePosition(mousePos) {
        let ret = {};
        ret.x = (mousePos.x - 8) * this.sx + this.posx;
        ret.y = (mousePos.y - 4.5) * this.sy + this.posy;
        return ret;
    }
    drawGrid(graphics) {
        let box = new Model([
            new Path(new Color(0x66, 0x66, 0x66), [new Point(0, 0), new Point(0.03, 0), new Point(0, 0.03)]),
            new Path(new Color(0x66, 0x66, 0x66), [new Point(0.03, 0.03), new Point(0, 0.03), new Point(0.03, 0)])
        ]);
        for (let i = Math.floor(this.posx - 8 * this.sx); i <= Math.floor(this.posx + 8 * this.sx); i++) {
            for (let j = Math.floor(this.posy - 4.5 * this.sy); j <= Math.floor(this.posy + 4.5 * this.sy); j++) {
                graphics.drawModelCam(box, new Transform(new Point(i, j), new Point(0, 0), new Point(1.0, 1.0), 0), this);
            }
        }
    }
}