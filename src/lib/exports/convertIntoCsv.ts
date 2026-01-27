export function convertIntoCsv(headers: string[], rows: string[][]) {
  let headersStringified = "";

  // Create headersStringified row
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (!header) break;

    const k = i < headers.length - 1 ? "," : "\n";
    headersStringified += `${header}${k}`;
  }

  let rowsStringified = "";

  // Iterate over each row of data
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (!row) break;

    for (let j = 0; j < row.length; j++) {
      let field = row[j];

      if (typeof field !== "string") {
        break;
      }

      const isNotLast = j < row.length - 1;

      // Escape double quotes by doubling them
      if (field.includes(`"`)) {
        field = field.replace(/"/g, `""`);
      }

      // Enclose fields with commas or double quotes in quotes
      if (field.includes(",") || field.includes(`"`)) {
        field = `"${field}"`;
      }

      rowsStringified += field + (isNotLast ? "," : "\n");
    }
  }

  return headersStringified.concat(rowsStringified);
}
