class Model {
    constructor(paths) {
        this.paths = paths;
    }
    draw(graphics, position, scale) {
        for (let i = 0; i < this.paths.length; i++) {
            this.paths[i].draw(graphics.ctx, new Point(position.x * graphics.contentScale, position.y * graphics.contentScale), new Point(scale.x * graphics.contentScale, scale.y * graphics.contentScale), true);
        }
    }
}