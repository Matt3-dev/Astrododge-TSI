class Tilemap {
    constructor(image) {
        this.image = image;
    }
    constructTiles(tw, th) {
        this.tiles = [];
        this.tilescx = 0;
        this.tilescy = 0;
        this.tilesc = 0;
        console.log(`src${this.image.src} ix${this.image.width} iy${this.image.height}`)
        for (let y = 0; y < this.image.height; y += th) {
            this.tilescy++;
            this.tilescx = 0;
            for (let x = 0; x < this.image.width; x += tw) {
                let tile = {};
                tile.x = x / tw;
                tile.y = y / th;
                tile.tx = x;
                tile.ty = y;
                tile.tw = tw;
                tile.th = th;
                this.tiles.push(tile);
                this.tilescx++;
                this.tilesc++;
            }
        }
    }
    getTile(index) {
        return this.tiles[index];
    }
}