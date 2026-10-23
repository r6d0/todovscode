# todovscode

**todovscode** is a VS Code extension for highlighting TODO, FIXME, and custom tags.

![GitHub License](https://img.shields.io/github/license/r6d0/todovscode)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/r6d0/todovscode/node.js.yml)
![](https://raw.githubusercontent.com/r6d0/todovscode/main/screenshots/badge-lines.svg)
![](https://raw.githubusercontent.com/r6d0/todovscode/main/screenshots/badge-statements.svg)
![](https://raw.githubusercontent.com/r6d0/todovscode/main/screenshots/badge-branches.svg)
![](https://raw.githubusercontent.com/r6d0/todovscode/main/screenshots/badge-functions.svg)


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
        "foreground": "#ffc107cc"
    },
    {
        "tag": "FIXME",
        "foreground": "#ff0707cc"
    }    
  ]
}
```

* `tag` (string) - The text to highlight.
* `foreground` (string) - The text color (HEX).

## Examples

To customize your tags:
1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`).
2. Find **todovscode** extension.
3. Open **settings.json** and add your settings like this:

![](https://raw.githubusercontent.com/r6d0/todovscode/main/screenshots/custom_tag_example_v3.gif)

Highlighting example:

![](https://raw.githubusercontent.com/r6d0/todovscode/main/screenshots/highlighting_example_v3.gif)

## Source Code

[todovscode](https://github.com/r6d0/todovscode)

## License

[Apache License 2.0](https://github.com/r6d0/todovscode/blob/main/LICENSE)
