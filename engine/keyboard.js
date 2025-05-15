class Keyboard {
    constructor() {
        this.pressedKeyCodes = [];
        this.pressedKeys = [];
        this.justPressedKeyCodes = [];
        this.justPressedKeys = [];
        document.addEventListener("keydown", e => {
            if (!this.pressedKeyCodes.includes(e.keyCode) && !this.justPressedKeyCodes.includes(e.keyCode)) this.justPressedKeyCodes.push(e.keyCode);
            if (!this.pressedKeys.includes(e.key) && !this.justPressedKeys.includes(e.keyCode)) this.justPressedKeys.push(e.key);
        });
        document.addEventListener("keyup", e => {
            if (this.pressedKeyCodes.includes(e.keyCode)) {
                let idx = this.pressedKeyCodes.indexOf(e.keyCode);
                this.pressedKeyCodes.splice(idx, 1);
            }
            if (this.justPressedKeyCodes.includes(e.keyCode)) {
                let idx = this.justPressedKeyCodes.indexOf(e.keyCode);
                this.justPressedKeyCodes.splice(idx, 1);
            }
            if (this.pressedKeys.includes(e.key)) {
                let idx = this.pressedKeys.indexOf(e.key);
                this.pressedKeys.splice(idx, 1);
            }
            if (this.justPressedKeys.includes(e.key)) {
                let idx = this.justPressedKeys.indexOf(e.key);
                this.justPressedKeys.splice(idx, 1);
            }
        });
    }
    isKeyCodePressed(keyCode) {
        if (this.pressedKeyCodes.indexOf(keyCode) > -1 || this.justPressedKeyCodes.indexOf(keyCode) > -1) return true;
        return false;
    }
    isKeyCodeJustPressed(keyCode) {
        if (this.justPressedKeyCodes.indexOf(keyCode) > -1) return true;
        return false;
    }
    isKeyPressed(key) {
        if (this.pressedKeys.indexOf(key) > -1 || this.justPressedKeys.indexOf(key) > -1) return true;
        return false;
    }
    isKeyJustPressed(key) {
        if (this.justPressedKeys.indexOf(key) > -1) return true;
        return false;
    }
    updateKeyboard() {
        this.justPressedKeyCodes.forEach(keyCode => this.pressedKeyCodes.push(keyCode));
        this.justPressedKeys.forEach(key => this.pressedKeys.push(key));
        this.justPressedKeyCodes = [];
        this.justPressedKeys = [];
    }
}