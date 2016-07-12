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
        chunk Uint8 array of tiles
    }
```

#### camera
center in pixels

* move camera (dx, dy)

```
camera: Record {x: 0, y: 0}
```

#### toolbox

* select tool

```
toolbox: Record {
    currentTool: 'tilePainter',
    tilePainter: Record {
        tile: 'wall'
    },
    shapePlacer: Record {
        type: 'tree',
        variant: 'g1,1'
    },
    textEditor: Record {
        font: 'Arial',
        size: 12,
        align: 'left'
    }
}
```
