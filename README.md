# Figma Export PDFs action

This action is able to export content from a Figma file as PDF.
Then you can save the pdf as workflow artifact, upload it to an ftp server, or do whatever you want.

## Figma file structure

In order to export a pdf from a Figma file, it have to be structured in a specific way.

```sh
page
|
├── group # this is a pdf
│   ├── frame # page 1
│   ├── frame # page 2
│   └── frame # page 3
|
└── group # this is another pdf
    ├── frame # page 1
    └── frame # page 2
```

A pdf page have to be a `figma frame`, and pages have to be grouped with a `figma group`.
You can take a look at [this example](https://www.figma.com/file/VQxKo2pnaksjE7Vql999Qv/figma-export-pdfs-action?node-id=138%3A28).


## Usage

```yml
- name: Figma Export PDFs
  id: figmaExportPdfs
  uses: marcomontalbano/figma-export-pdfs-action@v1.2.2
  with:
    accessToken: ${{ secrets.FIGMA_ACCESS_TOKEN }}
    fileKey: VQxKo2pnaksjE7Vql999Qv
    ids: ["120:3","138:28"]

- name: Log
  echo "pdfs: $pdfs"
  echo "outDir: $outDir"
  env:
    pdfs: ${{ steps.figmaExportPdfs.outputs.pdfs }}
    outDir: ${{ steps.figmaExportPdfs.outputs.outDir }}
```

Checkout a working example [`dispatch.yaml`](.github/workflows/dispatch.yaml).

### Inputs

| Key           | Required | Description                               | Example                                    | Default |
|---------------|:--------:|-------------------------------------------|--------------------------------------------|:-------:|
| `accessToken` |  **yes** | Figma access token                        | xxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |         |
| `fileKey`     |  **yes** | Figma file key                            | rAJHsSg4SC5NqFIFib5NWz                     |         |
| `ids`         |    no    | List of ids to export. Default to *all*   | ["17:786", "6:786"]                        |   [ ]   |


### Outputs

| Key      | Description                                | Example |
|----------|--------------------------------------------|---------|
| `pdfs`   | List of exported pdfs                      | *       |
| `outDir` | Output directory for all emitted pdf files | ./dist/ |

> **\*** For example a `pdfs` could looks like the following:
> 
> ```json
> [
>   {
>     "id": "6:786",
>     "name": "figma-export-cover",
>     "basename": "figma-export-cover.pdf",
>     "filepath": "./dist/figma-export-cover.pdf",
>     "cover": "./dist/figma-export-cover.jpg"
>   }
> ]
> ```


## Export PDFs directly from Figma

What do you think about exporting Figma content as PDF to an FTP Server, just clicking a button from Figma? Would it be cool, isn't it?

Take a look at this [workflow](.github/workflows/from-figma.yaml) and find out how this is totally feasible. Just clone the workflow and setup [this Figma plugin](https://github.com/marcomontalbano/figma-plugin-run-github-actions-workflows) 😉

![Demo](https://raw.githubusercontent.com/marcomontalbano/figma-plugin-run-github-actions-workflows/main/cover.gif)