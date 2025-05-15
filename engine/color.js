class Color {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toCSS() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    darken(amount) {
        this.r = Math.max(0, this.r * (1 - amount));
        this.g = Math.max(0, this.g * (1 - amount));
        this.b = Math.max(0, this.b * (1 - amount));
        return this;
    }
}
class Colors {
    static white = new Color(255, 255, 255);
    static gray = new Color(128, 128, 128);
    static grey = new Color(128, 128, 128);
    static black = new Color(0, 0, 0);
    static red = new Color(255, 0, 0);
    static green = new Color(0, 255, 0);
    static blue = new Color(0, 0, 255);
    static yellow = new Color(255, 255, 0);
    static magenta = new Color(255, 0, 255);
    static cyan = new Color(0, 255, 255);
    static orange = new Color(255, 128, 0);
    static purple = new Color(128, 0, 255);
    static brown = new Color(128, 64, 0);
    static gold = new Color(255, 192, 0);
    static silver = new Color(192, 192, 192);
    static transparent = new Color(0, 0, 0, 0);
    static clear = new Color(0, 0, 0, 0);
}