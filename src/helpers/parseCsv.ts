export const parseCsv = (csvString: string) => {
	const rows = csvString.split('\n');
	const header = rows[0].split(',');
	const data = rows.slice(1).map((rowString) => {
		const values = rowString.split(',');
		return header.reduce((obj: { [key: string]: string }, header, index) => {
			obj[header] = values[index];
			return obj;
		}, {});
	});

	return data;
};
