export type TableHeaders = { values: string[]; isOriginal: boolean };
export type TableRows = Record<string, string>[];

export function mapHeadersToRows(
	data: string[][],
	firstRowAsHeaders: boolean,
	fromRow: number,
): { rows: TableRows; headers: TableHeaders } {
	if (!data[0]) {
		// checked above with zod
		throw Error();
	}

	const rows: TableRows = [];

	const placeholderHeaders = getPlaceholderHeaders(data[0].length);
	const headers: TableHeaders = firstRowAsHeaders
		? { isOriginal: true, values: data[0] }
		: { isOriginal: false, values: placeholderHeaders };

	const startingI = firstRowAsHeaders ? fromRow : fromRow - 1;
	// string from 1 because 0 is an array of headers
	for (let i = startingI; i < data.length; i++) {
		const row = data[i];
		if (!Array.isArray(row)) {
			break;
		}

		const obj: Record<string, string> = {};

		for (let j = 0; j < headers.values.length; j++) {
			const header = headers.values[j];
			const cell = row[j];
			if (typeof header === "string" && typeof cell === "string") {
				obj[header] = cell; // Assign the row value to the corresponding header key
			}
		}

		rows.push(obj); // Add the constructed object to the result array
	}

	return { rows, headers };
}

function getPlaceholderHeaders(rowLength: number) {
	return Array.from({ length: rowLength }, (_, i) => `Column${i + 1}`);
}
