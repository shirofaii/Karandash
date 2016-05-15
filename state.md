editor state
-------
#### info
* load map (url)
* save map ()
* show error ()
* hide error ()

```
info: {
    title: 'aaa'
    url: ''
    isLoading: false
    isSaving: false
    errors: ['message']
}
```

#### canvas
* setPen (tile)
* drawBegin (x, y)
* lineTo (x, y)
* rectTo (x, y)
* drawEnd ()

```
canvas: {
    pen: tile,
    penPosition: point
    isDrawing: false
    
    chunks: Map { [x, y]: chunk }
        chunk is 8x8 layered binary map [ Uint8(8*8) , ... ]
}
```

#### camera
center in pixels, zoom factor

* move camera (dx, dy, dz)

```
camera: {x: 0, y: 0, zoom: 1.0}
```

#### texts
```
texts: []
```
