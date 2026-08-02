import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/KC PROJECT DOC/QA_Blueprint_Ekosistem_Plant_Lab.xlsx";
const outputDir = "D:/LuksuriReka2.0/.tmp/plant_lab_proposal/workbook_audit";

await fs.mkdir(outputDir, { recursive: true });

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const overview = await workbook.inspect({
  kind: "workbook,sheet,table,definedName,drawing",
  maxChars: 20000,
  tableMaxRows: 8,
  tableMaxCols: 12,
  tableMaxCellChars: 160,
});
await fs.writeFile(path.join(outputDir, "overview.ndjson"), overview.ndjson, "utf8");

const sheets = [];
for (let index = 0; index < workbook.worksheets.items.length; index += 1) {
  const sheet = workbook.worksheets.getItemAt(index);
  const used = sheet.getUsedRange();
  const values = used ? used.values : [];
  const formulas = used ? used.formulas : [];
  let nonEmptyCells = 0;
  for (const row of values ?? []) {
    for (const value of row ?? []) {
      if (value !== null && value !== undefined && value !== "") nonEmptyCells += 1;
    }
  }

  const sheetRecord = {
    index,
    name: sheet.name,
    rowCount: values?.length ?? 0,
    columnCount: values?.reduce((max, row) => Math.max(max, row?.length ?? 0), 0) ?? 0,
    nonEmptyCells,
    values,
    formulas,
  };
  sheets.push(sheetRecord);

  try {
    const render = await workbook.render({
      sheetName: sheet.name,
      autoCrop: "all",
      scale: 1.5,
      format: "png",
    });
    const safeName = `${String(index + 1).padStart(2, "0")}-${sheet.name.replace(/[\\/:*?"<>|]/g, "_")}.png`;
    await fs.writeFile(path.join(outputDir, safeName), new Uint8Array(await render.arrayBuffer()));
  } catch (error) {
    sheetRecord.renderError = String(error?.stack ?? error);
  }
}

await fs.writeFile(
  path.join(outputDir, "workbook-audit.json"),
  JSON.stringify({ inputPath, sheets }, null, 2),
  "utf8",
);

console.log(JSON.stringify({
  sheetCount: sheets.length,
  sheets: sheets.map(({ index, name, rowCount, columnCount, nonEmptyCells, renderError }) => ({
    index,
    name,
    rowCount,
    columnCount,
    nonEmptyCells,
    renderError: renderError ?? null,
  })),
}, null, 2));
