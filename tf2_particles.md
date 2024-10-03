---
full-width: true
---

<wrapper full-width="full-width">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Create Table</title>
        <form  class="center">
            <br>
            <input type="checkbox" id="noText" name="noText" value="noText">
            <label for="noText"> Exclude "_text" entries </label><br>
            <input type="checkbox" id="noDX80" name="noDX80" value="noDX80" checked=true>
            <label for="noDX80"> Exclude dx80 entries </label><br>
            <input type="checkbox" id="noDX90" name="noDX90" value="noDX90">
            <label for="noDX90"> Exclude dx90 entries </label><br>
            <input type="checkbox" id="noDupes" name="noDupes" value="noDupes">        
            <label for="noDupes"> Exclude entries with duplicate names </label><br>
            <input type="checkbox" id="sortName" name="sortName" value="sortName" checked=true>
            <label for="sortName"> Sort by particle name </label><br>
            <br><input type="text" id="searchname" name="searchname"><br><br>
            <button onclick="generateTable()" class="center">Generate Table</button><br><br>
        </form>
    </head>

    <body>
        <div id="tableContainer"  class="center"></div>
        <script type="module">
            import { generateTable } from './tf2.js';
            window.generateTable = generateTable;
            generateTable();
        </script>
    </body>
</wrapper>