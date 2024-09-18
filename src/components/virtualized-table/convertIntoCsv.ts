import type { FilePickerRow } from "../file-picker";

export function convertIntoCsv(data: FilePickerRow[]) {
	if (!data[0]) {
		throw new Error("No data provided");
	}

	let headers = "";
	const keys = Object.keys(data[0]);

	// Create headers row
	for (let i = 0; i < keys.length; i++) {
		const header = keys[i];
		if (!header) break;

		const k = i < keys.length - 1 ? "," : "\n";
		headers += `${header}${k}`;
	}

	let rows = "";

	// Iterate over each row of data
	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		if (!row) break;

		const values = Object.values(row);

		for (let j = 0; j < values.length; j++) {
			let field = values[j];

			if (typeof field !== "string") {
				break;
			}

			const isNotLast = j < values.length - 1;

			// Escape double quotes by doubling them
			if (field.includes(`"`)) {
				field = field.replace(/"/g, `""`);
			}

			// Enclose fields with commas or double quotes in quotes
			if (field.includes(",") || field.includes(`"`)) {
				field = `"${field}"`;
			}

			rows += field + (isNotLast ? "," : "\n");
		}
	}

	return headers.concat(rows);
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	const testCases: { input: FilePickerRow[]; expected: string }[] = [
		{
			input: [
				{
					FirstName: "",
					LastName: '"Tester,2"',
					Street: "120 jefferson st.",
				},
			],
			expected: 'FirstName,LastName,Street\n,"""Tester,2""",120 jefferson st.',
		},
		{
			input: [
				{
					FirstName: 'Joan "the bone", Anne',
					LastName: '"Tester,2"',
					Street: "9th, at Terrace plc",
				},
			],
			expected:
				'FirstName,LastName,Street\n"Joan ""the bone"", Anne","""Tester,2""","9th, at Terrace plc"',
		},
		{
			input: [
				{
					FirstName: "",
					LastName: "Blankman",
					Street: "",
					Value: "200.9",
				},
				{
					FirstName: 'Joan "the bone", Anne',
					LastName: '"Tester,2"',
					Street: "9th, at Terrace plc",
					Value: "2000.19",
				},
			],
			expected:
				'FirstName,LastName,Street,Value\n,Blankman,,200.9\n"Joan ""the bone"", Anne","""Tester,2""","9th, at Terrace plc",2000.19',
		},
		{
			input: [
				{
					Year: "1997",
					Make: "Ford",
					Model: "E350",
					Description: "ac, abs, moon",
					Price: "3000.00",
				},
				{
					Year: "1999",
					Make: "Chevy",
					Model: 'Venture "Extended Edition"',
					Description: "",
					Price: "4900.00",
				},
				{
					Year: "1999",
					Make: "Chevy",
					Model: 'Venture "Extended Edition, Very Large"',
					Description: "",
					Price: "5000.00",
				},
				{
					Year: "1996",
					Make: "Jeep",
					Model: "Grand Cherokee",
					Description: "MUST SELL!\nair, moon roof, loaded",
					Price: "4799.00",
				},
			],
			expected:
				'Year,Make,Model,Description,Price\n1997,Ford,E350,"ac, abs, moon",3000.00\n1999,Chevy,"Venture ""Extended Edition""",,4900.00\n1999,Chevy,"Venture ""Extended Edition, Very Large""",,5000.00\n1996,Jeep,Grand Cherokee,"MUST SELL!\nair, moon roof, loaded",4799.00',
		},
		{
			input: [
				{
					Name: "John",
				},
				{
					Name: "Jack",
				},
				{
					Name: 'John "Da Man"',
				},
				{
					Name: "Stephen",
				},
				{
					Name: "",
				},
				{
					Name: 'Joan "the bone", Anne',
				},
			],
			expected:
				'Name\nJohn\nJack\n"John ""Da Man"""\nStephen\n\n"Joan ""the bone"", Anne"',
		},
	];

	for (const c of testCases) {
		const { expected, input } = c;
		it(`case ${JSON.stringify(input)}: `, () => {
			const result = convertIntoCsv(input);

			expect(result).toMatch(expected);
		});
	}
}
