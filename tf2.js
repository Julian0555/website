import myJson from './particles.json' with {type: 'json'};

export function generateTable() {
	// Create a <table> element and a <tbody> element
	if (document.getElementById("bigboytable") != null) document.getElementById("bigboytable").remove();
	const table = document.createElement("table");
	table.id = "bigboytable";
	const tableBody = document.createElement("tbody");

	// Define the number of rows and columns
	const keys = Object.keys(myJson);
	const newkeys = [];
	const cols = 3;

	var row = document.createElement("tr");
	cell = document.createElement("th");
	cell.appendChild(document.createTextNode("Particle System Definition"));
	row.appendChild(cell);
	var cell = document.createElement("th");
	cell.appendChild(document.createTextNode("Particle System Definition File"));
	row.appendChild(cell);
	cell = document.createElement("th");
	cell.appendChild(document.createTextNode("Full Path"));
	row.appendChild(cell);
	tableBody.appendChild(row);

	if (document.getElementById("sortName").checked) keys.sort((a, b) => myJson[a].definition.localeCompare(myJson[b].definition));
	// Create all cells
	keys.forEach(key => {
		if (document.getElementById("noDX80").checked && key.toLowerCase().includes("dx80")) return;
		if (document.getElementById("noDX90").checked && key.toLowerCase().includes("dx90")) return;
		var entry = myJson[key];
		if (document.getElementById("noDupes").checked && newkeys.includes(entry.definition)) return;
		// Create a table row
		const row = document.createElement("tr");

		for (let j = 0; j < cols; j++) {
			// Create a <td> element and a text node, make the text
			// node the contents of the <td>, and put the <td> at
			// the end of the table row
			const cell = document.createElement("td");
			if (j == 0) var cellText = document.createTextNode(entry.definition);
			if (j == 1) var cellText = document.createTextNode(entry.pcf);
			if (j == 2) var cellText = document.createTextNode(entry.fullpath);
			cell.appendChild(cellText);
			row.appendChild(cell);
		}

		// Add the row to the end of the table body
		tableBody.appendChild(row);
		newkeys.push(entry.definition);
	})

	console.log(newkeys.length);
	// Put the <tbody> in the <table>
	table.appendChild(tableBody);

	// Append the <table> to the <div> with id "tableContainer"
	document.getElementById("tableContainer").appendChild(table);

	// Set the border attribute of the table
	table.setAttribute("border", "2");
}