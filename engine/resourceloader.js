class ResourceLoader {
    constructor(parent = null) {
        this.resources = [];
        this.onallloaded = () => { };
        this.parent = parent;
        this.addedAtLeastOne = false;
    }
    checkAllLoaded() {
        for (let i = 0; i < this.resources.length; i++) if (!this.resources[i].loaded) return false;
        return true;
    }
    startLoading(onallloaded) {
        this.onallloaded = onallloaded;
        if (!this.addedAtLeastOne) {
            if (this.parent ?? false) {
                this.parent[this.onallloaded]();
            } else {
                this.onallloaded();
            }
        } else {
            this.resources.forEach(resource => { resource.src = resource.futuresrcpath; });
        }
    }
    addResource(object, path, onload = () => { }) {
        this.addedAtLeastOne = true;
        object.loaded = false;
        object.futuresrcpath = path;
        object.onload = () => {
            object.loaded = true;
            onload();
            if (this.checkAllLoaded()) {
                if (this.parent ?? false) {
                    this.parent[this.onallloaded]();
                } else {
                    this.onallloaded();
                }
            }
        }
        this.resources.push(object);
    }
}