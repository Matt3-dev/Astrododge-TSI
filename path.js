class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Path {
    constructor(color, points) {
        this.points = points;
        this.color = color;
    }
    draw(ctx, position, scale, fill) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.moveTo(this.points[0].x * scale.x + position.x,  this.points[0].y * scale.y + position.y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x * scale.x + position.x, this.points[i].y * scale.y + position.y);
        }
        ctx.closePath();
        if (fill) ctx.fill();
        ctx.restore();
    }
}