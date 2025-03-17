let graphics = new Graphics();
let keyboard = new Keyboard();
let ship = new Model([
    new Path('black',   [new Point(0.5, 0), new Point(0, 1), new Point(0.5, 0.93), new Point(1, 1)]),
    new Path('black',   [new Point(0.465, 0.83), new Point(0.15, 0.965), new Point(0.465, 0.965)]),
    new Path('black',   [new Point(0.535, 0.83), new Point(0.85, 0.965), new Point(0.535, 0.965)]),
    new Path('gray',    [new Point(0.5, 0.03), new Point(0.025, 0.98), new Point(0.5, 0.785), new Point(0.975, 0.98)]),
    new Path('#666666', [new Point(0.5, 0.03), new Point(0.5, 0.785), new Point(0.975, 0.98)]),
    new Path('#333333', [new Point(0.025, 0.98), new Point(0.5, 0.785), new Point(0.975, 0.98), new Point(0.5, 0.915)]),
    new Path('#444444', [new Point(0.5, 0.785), new Point(0.975, 0.98), new Point(0.5, 0.915)]),
    new Path('#99ddff', [new Point(0.5, 0.06), new Point(0.35, 0.36), new Point(0.5, 0.3), new Point(0.65, 0.36)]),
    new Path('#77bbdd', [new Point(0.5, 0.06), new Point(0.5, 0.3), new Point(0.65, 0.36)]),
    new Path('#333333', [new Point(0.55, 0.83), new Point(0.85, 0.95), new Point(0.55, 0.95)]),
    new Path('#666666', [new Point(0.55, 0.83), new Point(0.85, 0.95), new Point(0.55, 0.9)]),
    new Path('#444444', [new Point(0.45, 0.83), new Point(0.15, 0.95), new Point(0.45, 0.95)]),
    new Path('gray',    [new Point(0.45, 0.83), new Point(0.15, 0.95), new Point(0.45, 0.9)])
]);

function update() {
    graphics.updateGraphics();
    graphics.clear("black");
    ship.draw(graphics, new Point(6, 2.5), new Point(4, 4));
    requestAnimationFrame(update);
}
requestAnimationFrame(update);