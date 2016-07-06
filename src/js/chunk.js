var imm = require('immutable');
import {sideInTiles, tileInPixels, sideInPixels} from './const.js'

/* chunked bitmap
    all bitmap splitted to NxN chunks, and only edited chunks saved in state as pairs of <coord, chunk>
    Reasons to use chunks:
    * canvas part of state and must be immutable. Its quite expensive in one-solid-bitmap case to make copy on each change for even pretty small bitmap
    * probably more memory efficient
    * canvas size very big, limited by (sint15 * sideInTiles)
*/

class ChunkedBitmap {
    on(canvas) {
        this.state = canvas.chunks
        if(this.defaultTile !== canvas.defaultBackgroundTile) {
            this.defaultTile = canvas.defaultBackgroundTile
            this.defaultChunk = this.newChunk()
        }
        return this
    }
    
    // x, y: canvas coords
    chunkAt(x, y) {
        var result = this.state.get(ChunkedBitmap.encodeXY(x, y))
        if(!result) return this.defaultChunk
        
        return result
    }
    
    // x, y: canvas coords
    getTile(x, y) {
        var chunk = this.chunkAt(x, y)
        var cx = x % sideInTiles
        var cy = y % sideInTiles
        if(cx < 0) cx += sideInTiles
        if(cy < 0) cy += sideInTiles
        
        return chunk[cy*sideInTiles + cx]
    }
    
    // x, y: canvas coords
    setTile(x, y, tile) {
        var chunk = this.chunkAt(x, y)
        // cx, cy: chunk coords
        var cx = x % sideInTiles
        var cy = y % sideInTiles
        
        if(cx < 0) cx += sideInTiles
        if(cy < 0) cy += sideInTiles
        
        // its common to set tile on each mouse event, so avoid unnesessary mutations
        if(!chunk || chunk[cy*sideInTiles + cx] !== tile) {
            // copy chunk binary data, state must be immutable
            var editable = this.newArray(chunk)
            editable[cy*sideInTiles + cx] = tile
            
            this.applyChunk(x, y, editable)
        }
    }
    
    newArray(from) {
        if(from) {
            return Uint8Array.from(from)
        } else {
            return this.newChunk()
        }
    }
    
    newChunk() {
        var result = new Uint8Array(sideInTiles*sideInTiles)
        result.fill(this.defaultTile)
        return result
    }
    
    // set changed (or new) background into the state
    // x, y: canvas coords
    applyChunk(x, y, bitmap) {  
        this.state = this.state.set(ChunkedBitmap.encodeXY(x, y), bitmap)
    }
    
    line(x0, y0, x1, y1, tile) {
        var dx = Math.abs(x1 - x0)
        var dy = -Math.abs(y1 - y0)
        var sx = x0 < x1 ? 1 : -1;
        var sy = y0 < y1 ? 1 : -1;
        var err = dx + dy;
        
        while (true) {
            if(x0 === x1 && y0 === y1) break;
            var e2 = 2 * err;
            if (e2 > dy) {
                err += dy
                x0 += sx
            } else if (e2 < dx) {
                err += dx
                y0 += sy
            }
            this.setTile(x0, y0, tile);
        }
    }
    
    /*
        Encode x and y into 31 unsigned int
        Used as hash for chunks map
        [<unused bit><x: 15 bits><y: 15 bits>]
        x and y should be in range -16383 16384
        NB: x, y in canvas coords, but encoded value in chunks space
    */
    static encodeXY(x, y) {
        return ((Math.floor(x / sideInTiles) + 16383) << 15) + Math.floor(y / sideInTiles) + 16383
    }
    
    static decodeXY(i) {
        return {x: (i >>> 15) - 16383, y: (i & 0x00007fff) - 16383}
    }
    
    /*
        in: coords in pixels
        out: point with tile coords
    */
    static getChunkCoordsForPoint(x, y) {
        return {x: Math.floor(x / sideInPixels), y: Math.floor(y / sideInPixels)}
    }
}

module.exports = ChunkedBitmap