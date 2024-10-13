//import myJson from './particles.json' with {type: 'json'};
var particles;

export function fetchJSONData() {
	fetch("./particles.json")
		.then((res) => {
			if (!res.ok) {
				throw new Error
					(`HTTP error! Status: ${res.status}`);
			}
			return res.json();
		})
		.then((data) =>
			setJson(data))
		.catch((error) =>
			console.error("Unable to fetch data:", error));
}

function setJson(data) {
	particles = data;
	generateTable();
	//console.log(myJson);
}

export function generateTable() {
	// Create a <table> element and a <tbody> element
	if (document.getElementById("bigboytable") != null) document.getElementById("bigboytable").remove();
	const table = document.createElement("table");
	table.id = "bigboytable";
	const tableBody = document.createElement("tbody");

	// Define the number of rows and columns
	const keys = Object.keys(particles);
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

	const nodx80 = document.getElementById("noDX80").checked;
	const nodx90 = document.getElementById("noDX90").checked;
	const nodupes = document.getElementById("noDupes").checked;
	const searchname = document.getElementById("searchname").value.toLowerCase().trim();

	if (document.getElementById("sortName").checked) keys.sort((a, b) => particles[a].definition.localeCompare(particles[b].definition));
	// Create all cells
	keys.forEach(key => {
		if (nodx80 && key.toLowerCase().includes("dx80")) return;
		if (nodx90 && key.toLowerCase().includes("dx90")) return;
		var entry = particles[key];
		if (nodupes && newkeys.includes(entry.definition)) return;
		if (searchname != "" && !key.toLowerCase().includes(searchname)) return;
		// Create a table row
		const row = document.createElement("tr");

		for (let j = 0; j < cols; j++) {
			// Create a <td> element and a text node, make the text
			// node the contents of the <td>, and put the <td> at
			// the end of the table row
			const cell = document.createElement("td");
			if (j == 0) var cellText = document.createTextNode(entry.definition);
			else if (j == 1) var cellText = document.createTextNode(entry.pcf);
			else var cellText = document.createTextNode(entry.fullpath);
			cell.appendChild(cellText);
			row.appendChild(cell);
		}

		// Add the row to the end of the table body
		tableBody.appendChild(row);
		newkeys.push(entry.definition);
	})

	document.getElementById("totaltext").innerText = "Number of Entries: " + newkeys.length;
	// Put the <tbody> in the <table>
	table.appendChild(tableBody);

	// Append the <table> to the <div> with id "tableContainer"
	document.getElementById("tableContainer").appendChild(table);

	// Set the border attribute of the table
	table.setAttribute("border", "2");
}