class Graphics {
    constructor() {
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
    }
    updateGraphics() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        let awidth = this.width / 16;
        let aheight = this.height / 9;
        if (awidth > aheight) awidth = aheight;
        else if (aheight > awidth) aheight = awidth;
        this.width = awidth * 16;
        this.height = aheight * 9;
        this.contentScale = awidth;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    clear(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}