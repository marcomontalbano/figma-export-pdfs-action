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
  uses: marcomontalbano/figma-export-pdfs-action@v1.0.0
  with:
    accessToken: ${{ secrets.FIGMA_ACCESS_TOKEN }}
    fileKey: rAJHsSg4SC5NqFIFib5NWz
    ids: ["17:786","6:786"]

- name: Log
  echo "pdfs: $pdfs"
  echo "outDir: $outDir"
  env:
    pdfs: ${{ steps.figmaExportPdfs.outputs.pdfs }}
    outDir: ${{ steps.figmaExportPdfs.outputs.outDir }}
```

Checkout a working example [`dispatch.yaml`](.github/workflows/dispatch.yaml) and [`from-figma.yaml`](.github/workflows/from-figma.yaml)

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
>     "filepath": "./dist/figma-export-cover.pdf"
>   }
> ]
> ```
