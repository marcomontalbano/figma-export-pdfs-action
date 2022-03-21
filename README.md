# Figma Export PDFs action

This action is able to export content from a Figma file as PDF. Then you can save the pdf as workflow artifact, upload it to a ftp server, or do whatever you want.

## Usage

```yml
- name: Figma Export PDFs
  id: figmaExportPdfs
  uses: marcomontalbano/figma-export-pdfs-action@1.0.0
  with:
    accessToken: ${{ secrets.FIGMA_ACCESS_TOKEN }}
    fileKey: rAJHsSg4SC5NqFIFib5NWz
    pageNames: ["Page 1", "Page 2"]

- name: Log
  run: echo "$outDir"
  env:
    outDir: ${{ steps.figmaExportPdfs.outputs.outDir }}
```

Checkout a working example [`dispatch.yaml`](.github/workflows/dispatch.yaml)

### Inputs

| Key           | Required | Description                               | Example                                    | Default |
|---------------|:--------:|-------------------------------------------|--------------------------------------------|:-------:|
| `accessToken` |  **yes** | Figma access token                        | xxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |         |
| `fileKey`     |  **yes** | Figma file key                            | rAJHsSg4SC5NqFIFib5NWz                     |         |
| `pageNames`   |    no    | List of pages to export. Default to *all* | ["Page 1", "Page 2"]                       |   [ ]   |


### Outputs

| Key      | Description                                | Example |
|----------|--------------------------------------------|---------|
| `outDir` | Output directory for all emitted pdf files | ./dist/ |

