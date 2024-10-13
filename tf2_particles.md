---
layout: none
full-width: true
---

<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Table</title>
</head>

<body class="container">
    <form >
        <br>
        <input type="checkbox" id="noDX80" name="noDX80" value="noDX80" checked=true>
        <label for="noDX80"> Exclude dx80 entries </label><br>
        <input type="checkbox" id="noDX90" name="noDX90" value="noDX90">
        <label for="noDX90"> Exclude dx90 entries </label><br>
        <input type="checkbox" id="noDupes" name="noDupes" value="noDupes">        
        <label for="noDupes"> Exclude entries with duplicate names </label><br>
        <input type="checkbox" id="sortName" name="sortName" value="sortName" checked=true>
        <label for="sortName"> Sort by particle name </label><br>
        <br><input type="text" id="searchname" name="searchname"><br><br>
        <!-- <button type="button" id="generateTableButton">Generate Table</button><br><br> -->
        <meh id="totaltext">Hiii</meh>
    </form>
    <div id="tableContainer"></div>
    <script type="module" async>
        import { fetchJSONData, generateTable } from './tf2.js';
        window.fetchJSONData = fetchJSONData;
        window.generateTable = generateTable;
        fetchJSONData();
        /*document.getElementById("generateTableButton").addEventListener("click", function(event) {
            event.preventDefault();  // Prevents page reload
            generateTable();         // Calls the function to generate the table
        });*/
        document.getElementById("searchname").addEventListener("input", function(event) {
            event.preventDefault();  // Prevents page reload
            generateTable();         // Calls the function to generate the table
        });
        document.getElementById("searchname").addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
        document.getElementById("noDX80").addEventListener("click", function(event) { generateTable(); });
        document.getElementById("noDX90").addEventListener("click", function(event) { generateTable(); });
        document.getElementById("noDupes").addEventListener("click", function(event) { generateTable(); });
        document.getElementById("sortName").addEventListener("click", function(event) { generateTable(); });
    </script>
</body>

<style>
    .container {
        max-width: 100%; /* Increase this value to make the page wider */
        margin: 0 auto; /* Centers the container */
        padding: 0 20px; /* Adjust padding if needed */
    }
</style>