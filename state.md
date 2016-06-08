editor state
-------
#### info
* load map (url)
* save map ()
* show error (error)
* hide error ()

```
info: Record {
    title: 'aaa'
    url: ''
    isLoading: false
    isSaving: false
    errors: List ['message']
}
```

#### canvas
* setPen (tile)
* drawBegin (x, y)
* lineTo (x, y)
* drawEnd ()

```
canvas: Record {
    pen: tile
    penPosition: point
    isDrawing: false
    defaultBackgroundTile: tile
    chunks: Map { [x, y]: chunk }
        [x, y] represented as 31-bit unsigned number where
            [<unused bit (0)><x: 15 bits><y: 15 bits>]
            x and y should be in range -16383 16384
        chunk: {
            background: uint8 array
            nbitmap: uint8 array
        }
        background
            is long Uint8 array contained NxN bitmap Uint8(N*N) of tiles (256 types of land)
        nbitmap
            contains compilation of all neighbours for each tile, its simplifies visual rendering for walls
            format uint8, each bit represent neighbour side from top on clockwise  [t tr r rb b bl l lt]
            
    }
```

#### camera
center in pixels, zoom factor

* move camera (dx, dy)
* zoom (zoom)

```
camera: Record {x: 0, y: 0, zoom: 1.0}
```

#### texts
```
texts: []
```
