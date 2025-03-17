class Keyboard {
    constructor() {
        this.pressedKeyCodes = [];
        this.pressedKeys = [];
        document.addEventListener("keydown", e => {
            if (!this.pressedKeyCodes.includes(e.keyCode)) this.pressedKeyCodes.push(e.keyCode);
            if (!this.pressedKeyCodes.includes(e.key)) this.pressedKeyCodes.push(e.key);
        });
        document.addEventListener("keyup", e => {
            if (this.pressedKeyCodes.includes(e.keyCode)) {
                let idx = this.pressedKeyCodes.indexOf(e.keyCode);
                this.pressedKeyCodes.splice(idx, 1);
            }
            if (this.pressedKeys.includes(e.key)) {
                let idx = this.pressedKeys.indexOf(e.key);
                this.pressedKeys.splice(idx, 1);
            }
        });
    }
    isKeyCodePressed(keyCode) {
        if (this.pressedKeyCodes.indexOf(keyCode) >= -1) return true;
        return false;
    }
    isKeyPressed(key) {
        if (this.pressedKeys.indexOf(key) >= -1) return true;
        return false;
    }
}