# todovscode

**todovscode** is a VS Code extension for highlighting TODO, FIXME, and custom tags.

## Features

* **Highlighting**: Automatically highlights TODO, FIXME, and your own custom tags.
* **Configuration**: Customize your tags, choose a custom color for each tag.

## Configuration

Example configuration:

```json
{
  "todovscode.tags": [
    {
        "tag": "TODO",
        "background": "#ffeb3b4d",
        "foreground": "#ffc107cc",
        "isWholeLine": false
    },
    {
        "tag": "FIXME",
        "background": "#ff3b3b4d",
        "foreground": "#ff0707cc",
        "isWholeLine": false
    }    
  ]
}
```

* `tag` (string) - The text to highlight.
* `foreground` (string) - The text color (HEX).
* `background` (string) - The background color (HEX).
* `isWholeLine` (boolean) - Highlights the whole line if set to `true`.

## Examples

To customize your tags:
1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`).
2. Find **todovscode** extension.
3. Open **settings.json** and add your settings like this:

![](https://raw.githubusercontent.com/r6d0/todovscode/main/screenshots/custom_tag_example.gif)

Highlighting example:

![](https://raw.githubusercontent.com/r6d0/todovscode/main/screenshots/highlighting_example.gif)

## License

[Apache License 2.0](https://github.com/r6d0/todovscode/blob/main/LICENSE)
