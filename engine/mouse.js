class Mouse {
    constructor(element) {
        this.x = 0;
        this.y = 0;
        this.leftdown = 0;
        this.rightdown = 0;
        this.middledown = 0;
        this.scrollX = 0;
        this.scrollY = 0;
        this.scrollZ = 0;
        this.nscrollX = 0;
        this.nscrollY = 0;
        this.nscrollZ = 0;
        document.addEventListener("mousemove", e => {
            e.preventDefault();
            this.x = e.clientX;
            this.y = e.clientY;
        });
        document.addEventListener("mousedown", e => {
            e.preventDefault();
            switch (e.button) {
                case 0: this.leftdown = 2; break;
                case 1: this.middledown = 2; break;
                case 2: this.rightdown = 2; break;
            }
        });
        document.addEventListener("mouseup", e => {
            e.preventDefault();
            switch (e.button) {
                case 0: this.leftdown = 0; break;
                case 1: this.middledown = 0; break;
                case 2: this.rightdown = 0; break;
            }
        });
        document.addEventListener("wheel", e => {
            // e.preventDefault();
            if (e.deltaMode == 0) {
                this.nscrollX = e.deltaX;
                this.nscrollY = e.deltaY;
            } 
        });
        document.addEventListener("contextmenu", e => {
            e.preventDefault();
        });
    }
    updateMouse() {
        if (this.leftdown > 1) this.leftdown = 1;
        if (this.middledown > 1) this.middledown = 1;
        if (this.rightdown > 1) this.rightdown = 1;
        this.scrollX = this.nscrollX;
        this.scrollY = this.nscrollY;
        this.scrollZ = this.nscrollZ;
        this.nscrollX = 0;
        this.nscrollY = 0;
        this.nscrollZ = 0;
    }
    getMousePosition() {
        return new Point(this.x, this.y);
    }
    getMousePositionRelative(graphics, scaled = true, locked = false) {
        let padx = (window.innerWidth - graphics.width) / 2;
        let pady = (window.innerHeight - graphics.height) / 2;

        let relx = this.x - padx;
        let rely = this.y - pady;
        if (locked) {
            if (relx < 0) relx = 0;
            if (relx > graphics.width) relx = graphics.width;
            if (rely < 0) rely = 0;
            if (rely > graphics.height) rely = graphics.height;
        }
        relx = Math.floor(relx);
        rely = Math.floor(rely);
        if (scaled) {
            relx /= graphics.contentScale;
            rely /= graphics.contentScale;
        }
        return new Point(relx, rely);
    }
    getLeftButtonPressed() {
        return this.leftdown ? 1 : 0;
    }
    getRightButtonPressed() {
        return this.rightdown ? 1 : 0;
    }
    getMiddleButtonPressed() {
        return this.middledown ? 1 : 0;
    }
    getLeftButtonJustPressed() {
        return this.leftdown == 2 ? 1 : 0;
    }
    getRightButtonJustPressed() {
        return this.rightdown == 2 ? 1 : 0;
    }
    getMiddleButtonJustPressed() {
        return this.middledown == 2 ? 1 : 0;
    }
    getScrollDirections() {
        let ret = {};
        ret.x = this.scrollX;
        ret.y = this.scrollY;
        ret.z = this.scrollZ;
        return ret;
    }
    getScrollX() {
        return this.scrollX;
    }
    getScrollY() {
        return this.scrollY;
    }
    getScrollZ() {
        return this.scrollZ;
    }
    getScrollDirectionsRelative(graphics, scaled) {
        if (!scaled) return getScrollDirections();
        let ret = {};
        ret.x = this.scrollX / graphics.contentScale;
        ret.y = this.scrollY / graphics.contentScale;
        ret.z = this.scrollZ / graphics.contentScale;
        return ret;
    }
    getScrollXRelative(graphics, scaled) {
        if (!scaled) return this.scrollX;
        return this.scrollX / graphics.contentScale;
    }
    getScrollYRelative(graphics, scaled) {
        if (!scaled) return this.scrollY;
        return this.scrollY / graphics.contentScale;
    }
    getScrollZRelative(graphics, scaled) {
        if (!scaled) return this.scrollZ;
        return this.scrollZ / graphics.contentScale;
    }
}