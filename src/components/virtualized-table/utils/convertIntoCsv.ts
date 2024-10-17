export function convertIntoCsv(headers: string[], rows: string[][]) {
	let headersStringified = "";

	// Create headersStringified row
	for (let i = 0; i < headers.length; i++) {
		const header = headers[i];
		if (!header) break;

		const k = i < headers.length - 1 ? "," : "\n";
		headersStringified += `${header}${k}`;
	}

	// console.log({ keys, headersStringified });
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

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	const testCases: {
		input: Parameters<typeof convertIntoCsv>;
		expected: string;
	}[] = [
		{
			input: [
				["FirstName", "LastName", "Street"],
				[["", '"Tester,2"', "120 jefferson st."]],
			],
			expected: 'FirstName,LastName,Street\n,"""Tester,2""",120 jefferson st.',
		},
		{
			input: [
				["FirstName", "LastName", "Street"],
				[['Joan "the bone", Anne', '"Tester,2"', "9th, at Terrace plc"]],
			],
			expected:
				'FirstName,LastName,Street\n"Joan ""the bone"", Anne","""Tester,2""","9th, at Terrace plc"',
		},
		{
			input: [
				["FirstName", "LastName", "Street", "Value"],
				[
					["", "Blankman", "", "200.9"],
					[
						'Joan "the bone", Anne',
						'"Tester,2"',
						"9th, at Terrace plc",
						"2000.19",
					],
				],
			],
			expected:
				'FirstName,LastName,Street,Value\n,Blankman,,200.9\n"Joan ""the bone"", Anne","""Tester,2""","9th, at Terrace plc",2000.19',
		},
		{
			input: [
				["Year", "Make", "Model", "Description", "Price"],
				[
					["1997", "Ford", "E350", "ac, abs, moon", "3000.00"],
					["1999", "Chevy", 'Venture "Extended Edition"', "", "4900.00"],
					[
						"1999",
						"Chevy",
						'Venture "Extended Edition, Very Large"',
						"",
						"5000.00",
					],
					[
						"1996",
						"Jeep",
						"Grand Cherokee",
						"MUST SELL!\nair, moon roof, loaded",
						"4799.00",
					],
				],
			],
			expected:
				'Year,Make,Model,Description,Price\n1997,Ford,E350,"ac, abs, moon",3000.00\n1999,Chevy,"Venture ""Extended Edition""",,4900.00\n1999,Chevy,"Venture ""Extended Edition, Very Large""",,5000.00\n1996,Jeep,Grand Cherokee,"MUST SELL!\nair, moon roof, loaded",4799.00',
		},
		{
			input: [
				["Name"],
				[
					["John"],
					["Jack"],
					['John "Da Man"'],
					["Stephen"],
					[""],
					['Joan "the bone", Anne'],
				],
			],
			expected:
				'Name\nJohn\nJack\n"John ""Da Man"""\nStephen\n\n"Joan ""the bone"", Anne"',
		},
		{
			input: [["Name", "Value"], []],
			expected: "Name,Value",
		},
		{
			input: [[], [["Tester", "Tester2"]]],
			expected: "Tester,Tester2",
		},
	];

	for (const c of testCases) {
		const { expected, input } = c;
		it(`case ${JSON.stringify(input)}: `, () => {
			const result = convertIntoCsv(input[0], input[1]);

			expect(result).toMatch(expected);
		});
	}
}
