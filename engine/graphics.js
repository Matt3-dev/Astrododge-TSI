class Graphics {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "50%";
        this.canvas.style.left = "50%";
        this.canvas.style.transform = "translate(-50%, -50%)";
        this.canvas.style.cursor = "none";
        this.debugPositions = false;

        let background = document.createElement("div");
        background.style.position = "absolute";
        background.style.top = "0%";
        background.style.left = "0%";
        background.style.width = "100%";
        background.style.height = "100%";
        background.style.background = "black";
        document.querySelector("body").appendChild(background);
        document.querySelector("body").appendChild(this.canvas);
    }
    updateGraphics() {
        let lastwidth = this.width;
        this.width = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth ||
            document.body.offsetWidt;
        this.height = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight ||
            document.body.offsetHeight;
        let awidth = this.width / 16;
        let aheight = this.height / 9;
        if (awidth > aheight) awidth = aheight;
        else if (aheight > awidth) aheight = awidth;
        this.width = awidth * 16;
        this.height = aheight * 9;
        this.contentScale = awidth;

        if (lastwidth == this.width) return;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    // c stands for canvas, i stands for image
    drawTexture(image, cx, cy, cw, ch, ix, iy, iw, ih) {
        this.ctx.save();
        this.ctx.translate(cx * this.contentScale + (cw * this.contentScale) / 2, cy * this.contentScale + (ch * this.contentScale) / 2);
        this.ctx.drawImage(image, ix, iy, iw, ih, -(cw * this.contentScale) / 2, -(ch * this.contentScale) / 2, cw * this.contentScale + 1, ch * this.contentScale + 1);
        this.ctx.restore();
    }
    drawText(text, pos, textProperties = new TextProperties(), shadowProperties = new ShadowProperties()) {
        this.ctx.save();
        this.ctx.shadowColor = shadowProperties.color;
        this.ctx.shadowBlur = shadowProperties.blur * this.contentScale;
        this.ctx.shadowOffsetX = shadowProperties.offx * this.contentScale;
        this.ctx.shadowOffsetY = shadowProperties.offy * this.contentScale;
        this.ctx.textBaseline = textProperties.textBaseline;
        this.ctx.textAlign = textProperties.textAlign;
        this.ctx.font = textProperties.fontStyle + ` ${textProperties.size * this.contentScale}px ` + textProperties.font;
        this.ctx.fillStyle = textProperties.color;
        this.ctx.fillText(text, pos.x * this.contentScale, pos.y * this.contentScale);
        if (!textProperties.outline) return;
        this.ctx.strokeStyle = textProperties.outlineColor.toCSS();
        this.ctx.lineWidth = textProperties.outlineWidth * this.contentScale;
        this.ctx.strokeText(text, pos.x * this.contentScale, pos.y * this.contentScale);
        this.ctx.restore();
    }
    drawTextFill(text, pos, textProperties = new TextProperties(), shadowProperties = new ShadowProperties()) {
        this.ctx.save();
        this.ctx.shadowColor = shadowProperties.color;
        this.ctx.shadowBlur = shadowProperties.blur * this.contentScale;
        this.ctx.shadowOffsetX = shadowProperties.offx * this.contentScale;
        this.ctx.shadowOffsetY = shadowProperties.offy * this.contentScale;
        this.ctx.textBaseline = textProperties.textBaseline;
        this.ctx.textAlign = textProperties.textAlign;
        this.ctx.font = textProperties.fontStyle + ` ${textProperties.size * this.contentScale}px ` + textProperties.font;
        this.ctx.fillStyle = textProperties.color.toCSS();
        this.ctx.fillText(text, pos.x * this.contentScale, pos.y * this.contentScale);
        this.ctx.restore();
    }
    drawTextOutline(text, pos, textProperties = new TextProperties(), shadowProperties = new ShadowProperties()) {
        this.ctx.save();
        this.ctx.shadowColor = shadowProperties.color;
        this.ctx.shadowBlur = shadowProperties.blur * this.contentScale;
        this.ctx.shadowOffsetX = shadowProperties.offx * this.contentScale;
        this.ctx.shadowOffsetY = shadowProperties.offy * this.contentScale;
        this.ctx.textBaseline = textProperties.textBaseline;
        this.ctx.textAlign = textProperties.textAlign;
        this.ctx.font = textProperties.fontStyle + ` ${textProperties.size * this.contentScale}px ` + textProperties.font;
        this.ctx.strokeStyle = textProperties.outlineColor.toCSS();
        this.ctx.lineWidth = textProperties.outlineWidth * this.contentScale;
        this.ctx.strokeText(text, pos.x * this.contentScale, pos.y * this.contentScale);
        this.ctx.restore();
    }
    __tracePath(path) {
        if (path === null) return;
        this.ctx.beginPath();
        if (path.points[0].constructor.name == "Point") this.ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 0; i < path.points.length; i++) {
            if (path.points[i].constructor.name == "Point") this.ctx.lineTo(path.points[i].x, path.points[i].y);
            else if (path.points[i].constructor.name == "Arc") this.ctx.arc(path.points[i].x, path.points[i].y, path.points[i].radius, path.points[i].bAngle, path.points[i].eAngle, false);
        }
        if (path.points[0].constructor.name == "Point") this.ctx.lineTo(path.points[0].x, path.points[0].y);
        this.ctx.closePath();
    }
    drawModel(model, transform) {
        this.ctx.save();
        this.ctx.lineWidth = 0;
        this.ctx.scale(this.contentScale, this.contentScale);
        this.ctx.translate(transform.x, transform.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.sx, transform.sy);
        this.ctx.translate(-transform.ox, -transform.oy);
        for (let i = 0; i < model.paths.length; i++) {
            this.__tracePath(model.paths[i]);
            this.ctx.fillStyle = model.paths[i].color.toCSS();
            this.ctx.fill();
        }
        this.ctx.closePath();
        if (this.debugPositions) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(-0.0125, -0.0125, 0.025, 0.025);
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(transform.ox - 0.0125, transform.oy - 0.0125, 0.025, 0.025);
        }
        this.ctx.restore();
    }
    drawModelCam(model, transform, camera) {
        this.ctx.save();
        this.ctx.lineWidth = 0;
        this.ctx.scale(this.contentScale, this.contentScale);
        this.ctx.scale(1 / camera.sx, 1 / camera.sy);
        this.ctx.translate(-(camera.posx - 8 * camera.sx), -(camera.posy - 4.5 * camera.sy));
        this.ctx.translate(transform.x, transform.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.sx, transform.sy);
        this.ctx.translate(-transform.ox, -transform.oy);
        for (let i = 0; i < model.paths.length; i++) {
            this.__tracePath(model.paths[i]);
            this.ctx.fillStyle = model.paths[i].color.toCSS();
            this.ctx.fill();
        }
        this.ctx.closePath();
        if (this.debugPositions) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(-0.0125, -0.0125, 0.025, 0.025);
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(transform.ox - 0.0125, transform.oy - 0.0125, 0.025, 0.025);
        }
        this.ctx.restore();
    }
    drawModelOutline(model, outlineProperties, transform) {
        this.ctx.save();
        this.ctx.lineWidth = 0;
        this.ctx.scale(this.contentScale, this.contentScale);
        this.ctx.translate(transform.x, transform.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.sx, transform.sy);
        this.ctx.translate(-transform.ox, -transform.oy);
        for (let i = 0; i < model.paths.length; i++) {
            this.__tracePath(model.paths[i]);
            this.ctx.strokeStyle = outlineProperties.style.toCSS();
            this.ctx.lineWidth = outlineProperties.width;
            this.ctx.lineCap = outlineProperties.cap;
            this.ctx.lineJoin = outlineProperties.join;
            this.ctx.stroke();
        }
        this.ctx.closePath();
        this.ctx.restore();
    }
    drawModelOutlineCam(model, outlineProperties, transform, camera) {
        this.ctx.save();
        this.ctx.lineWidth = 0;
        this.ctx.scale(this.contentScale, this.contentScale);
        this.ctx.scale(1 / camera.sx, 1 / camera.sy);
        this.ctx.translate(-(camera.posx - 8 * camera.sx), -(camera.posy - 4.5 * camera.sy));
        this.ctx.translate(transform.x, transform.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.sx, transform.sy);
        this.ctx.translate(-transform.ox, -transform.oy);
        for (let i = 0; i < model.paths.length; i++) {
            this.__tracePath(model.paths[i]);
            this.ctx.strokeStyle = outlineProperties.style.toCSS();
            this.ctx.lineWidth = outlineProperties.width;
            this.ctx.lineCap = outlineProperties.cap;
            this.ctx.lineJoin = outlineProperties.join;
            this.ctx.stroke();
        }
        this.ctx.closePath();
        this.ctx.restore();
    }
    drawCollider(hitbox, transform) {
        this.ctx.save();
        this.ctx.scale(this.contentScale, this.contentScale);
        this.ctx.translate(transform.x, transform.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.sx, transform.sy);
        this.ctx.translate(-transform.ox, -transform.oy);
        let draw = function (collider) {
            switch (collider.type) {
                case 0: {
                    this.ctx.moveTo(collider.x - 0.05, collider.y - 0.05);
                    this.ctx.lineTo(collider.x - 0.05, collider.y + 0.05);
                    this.ctx.lineTo(collider.x + 0.05, collider.y + 0.05);
                    this.ctx.lineTo(collider.x + 0.05, collider.y - 0.05);
                    this.ctx.lineTo(collider.x - 0.05, collider.y - 0.05);
                    break;
                }
                case 1: {
                    this.ctx.moveTo(collider.x, collider.y);
                    this.ctx.lineTo(collider.x, collider.y + hitbox.collider.h);
                    this.ctx.lineTo(collider.x + collider.w, hitbox.collider.y + hitbox.collider.h);
                    this.ctx.lineTo(collider.x + collider.w, hitbox.collider.y);
                    this.ctx.lineTo(collider.x, collider.y);
                    break;
                }
                case 2: {
                    this.ctx.moveTo(collider.a.x, collider.a.y);
                    this.ctx.lineTo(collider.b.x, collider.b.y);
                    this.ctx.lineTo(collider.c.x, collider.c.y);
                    this.ctx.lineTo(collider.a.x, collider.a.y);
                    break;
                }
                case 3: {
                    for (let i = 0; i < collider.colliders.length; i++) draw(collider.colliders[i]);
                    break;
                }
                case 4: {
                    this.ctx.arc(collider.x, collider.y, collider.r, 0, 2 * Math.PI);
                    break;
                }
            }
            this.ctx.stroke();
            this.ctx.closePath();
        }
        this.ctx.strokeStyle = hitbox.disabled ? "#ff0000" : "#0000ff";
        this.ctx.lineWidth = 0.05;
        draw(hitbox);
        this.ctx.closePath();
        this.ctx.restore();
    }
    drawColliderCam(hitbox, transform, camera) {
        this.ctx.save();
        this.ctx.scale(this.contentScale, this.contentScale);
        this.ctx.scale(1 / camera.sx, 1 / camera.sy);
        this.ctx.translate(-(camera.posx - 8 * camera.sx), -(camera.posy - 4.5 * camera.sy));
        this.ctx.translate(transform.x, transform.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.sx, transform.sy);
        this.ctx.translate(-transform.ox, -transform.oy);
        let draw = (collider, ctx) => {
            switch (collider.type) {
                case 0: {
                    ctx.beginPath();
                    ctx.moveTo(collider.x - 0.05, collider.y - 0.05);
                    ctx.lineTo(collider.x - 0.05, collider.y + 0.05);
                    ctx.lineTo(collider.x + 0.05, collider.y + 0.05);
                    ctx.lineTo(collider.x + 0.05, collider.y - 0.05);
                    ctx.lineTo(collider.x - 0.05, collider.y - 0.05);
                    ctx.stroke();
                    ctx.closePath();
                    break;
                }
                case 1: {
                    ctx.beginPath();
                    ctx.moveTo(collider.x, collider.y);
                    ctx.lineTo(collider.x, collider.y + hitbox.collider.h);
                    ctx.lineTo(collider.x + collider.w, hitbox.collider.y + hitbox.collider.h);
                    ctx.lineTo(collider.x + collider.w, hitbox.collider.y);
                    ctx.lineTo(collider.x, collider.y);
                    ctx.stroke();
                    ctx.closePath();
                    break;
                }
                case 2: {
                    ctx.beginPath();
                    ctx.moveTo(collider.a.x, collider.a.y);
                    ctx.lineTo(collider.b.x, collider.b.y);
                    ctx.lineTo(collider.c.x, collider.c.y);
                    ctx.lineTo(collider.a.x, collider.a.y);
                    ctx.stroke();
                    ctx.closePath();
                    break;
                }
                case 3: {
                    for (let i = 0; i < collider.colliders.length; i++) draw(collider.colliders[i], ctx);
                    break;
                }
                case 4: {
                    ctx.beginPath();
                    ctx.arc(collider.x, collider.y, collider.r, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    break;
                }
            }
        }
        if (hitbox.disabled) this.ctx.strokeStyle = "#ff0000";
        else this.ctx.strokeStyle = "#0000ff";
        this.ctx.lineWidth = 0.025;
        draw(hitbox, this.ctx);
        this.ctx.closePath();
        this.ctx.restore();
    }
    clearAll(color) {
        this.ctx.save();
        this.ctx.fillStyle = color.toCSS();
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }
}
class Transform {
    constructor(pos = new Point(0, 0), center = new Point(0, 0), scale2d = new Point(1, 1), rot = 0) {
        this.x = pos.x;
        this.y = pos.y;
        this.ox = center.x;
        this.oy = center.y;
        this.sx = scale2d.x;
        this.sy = scale2d.y;
        this.rotation = rot;
    }
}
class TextProperties {
    constructor(size = 1, font = "Arial", fontStyle = "", color = Colors.black, outline = false, outlineColor = "white", outlineWidth = 0.1, textBaseline = "alphabetic", textAlign = "left") {
        this.size = size;
        this.font = font;
        this.fontStyle = fontStyle;
        this.color = color;
        this.outline = outline;
        this.outlineColor = outlineColor;
        this.outlineWidth = outlineWidth;
        this.textBaseline = textBaseline;
        this.textAlign = textAlign;
    }
}
class ShadowProperties {
    constructor(offx = 0, offy = 0, blur = 0, color = "black") {
        this.offx = offx;
        this.offy = offy;
        this.blur = blur;
        this.color = color;
    }
}
class OutlineProperties {
    constructor(width = 0.05, style = "black", cap = "round", join = "round") {
        this.width = width;
        this.style = style;
        this.cap = cap;
        this.join = join;
    }
}