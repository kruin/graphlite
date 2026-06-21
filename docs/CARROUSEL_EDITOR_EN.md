# Carrousel editor: saving, writing, and module folder

The carrousel is a standalone folder in the project zip:

```text
carrousel/
  index.html
  index-en.html
  editor.html
  slides.json
  slides/
```

## Buttons

| button | function | opens a folder chooser? |
|---|---|---|
| Choose module folder | grants the browser write access to the extracted `carrousel/` folder once | yes |
| Save locally | saves editor state in browser storage; also writes files if the module folder has already been chosen | no |
| Write to folder | writes directly to the chosen module folder | no |
| Download module zip | exports a complete module zip for return/import | no |

## Important

The browser is not allowed to automatically select the current folder of `editor.html`. The displayed `editor.html` location is only a reference. Write access exists only after `Choose module folder`.

After that, `Write to folder` should not open a file or folder chooser. If no module folder has been chosen yet, it only reports that `Choose module folder` is required first.


## v4526 - complete slide settings

`Save locally` now stores all editable settings per slide explicitly:

- order
- title and text
- Dutch/English title and text
- filename
- image / imageData
- `visible: true` or `visible: false`

Old storage is only imported as legacy data. New storage uses a separate key so older broken visibility states do not keep overwriting the current editor state.
