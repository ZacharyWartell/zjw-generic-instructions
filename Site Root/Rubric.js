/**
\author Zachary Wartell
\copyright Copyright 2015. Zachary Wartell.
\license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 - http://creativecommons.org/licenses/by-nc-sa/4.0/

\brief Build RubricTable HTMLTable in document by extracting exercise point information from span.Grade_Points HTMLElement's in the document.
 */
class RubricItem
{
    constructor()
    {
        this.points = 10;
        this.name = "";
        this.shortDescription = "";
        this.longDescription = "";
        this.parentTag = "";
    }
}
class Rubric
{
    constructor()
    {
        this.items = [];
    }
}
var _Rubric = new Rubric();

export function main() {

    if (false)
    {
        /*
         *  Collect all span.Grade_Points DOM Elements and their associated data- attributes
         */
        let elements = document.querySelectorAll('span.Grade_Points');
        _Rubric.items.length = 0;
        for (let e of elements) {
            let ri = new RubricItem();
            ri.parentTag = e.parentElement.tagName;
            ri.points = e.dataset.points;
            _Rubric.items.push(ri);
            switch (e.parentElement.tagName) {
                case 'SECTION':
                    let header = e.parentElement.querySelector(":scope > h1,h2,h3,h4,h5");
                    ri.name = header.innerText;
                    break;
                case 'LI':
                    const span = e.nextElementSibling;
                    ri.parentTag = "Exercise:";
                    if (span !== null && span.tagName === "SPAN") // by convention this contains the exercise's unique displayed name
                        ri.name = span.innerText;
                    break;
            }
        }

        /*
         *  Fill out <table id='RubricTable'> with the collected grade points
         */
        let RubricTable = document.getElementById("RubricTable");
        let total = 0;
        const tbody = RubricTable.querySelector(':scope tbody');
        const totalRow = tbody.querySelector(":scope > tr:nth-last-child(2)");
        // remove any previous entries (need in case of content reload)
        if (totalRow !== null)
            for (let el=totalRow.previousElementSibling; el !== null; el = el.previousElementSibling)
                tbody.removeChild(el);
        // add entries based on collected grade points
        for (let ri of _Rubric.items) {
            const row = document.createElement("tr");
            //tbody.appendChild(row);
            tbody.insertBefore(row, totalRow);
            row.outerHTML =
                `
                  <tr>
                        <td style="${ri.parentTag === "Exercise:" ? "text-align : right;" : "text-align : left;"}"> ${ri.parentTag} </td>
                        <td>${ri.name}</td>
                        <td>${ri.shortDescription}</td>
                        <td style="${ri.parentTag === "Exercise:" ? "text-align : left;" : "text-align : center;"}">${ri.points}</td>
                  </tr>
                  `;
            total += parseInt(ri.points);
        }
        const ttd = document.getElementById("Total");
        ttd.nextElementSibling.innerText = total.toString();
    }
    else
    {
        /*
           * construct <tbody> for <table> (#RubricTable) using instructions array and add
           * various <input> HTML elements to certain <table> columns
           */
        let rubric = document.querySelector("#RubricTable > tbody");
        let prevSection = "";
        const REGEX = /Symbol\(([^)]*)\)/; // for removing Symbol sub-string
        let ri=0;
        for (let instruction of instructions.instructions)
            {
            let row = document.createElement("tr");
            row.setAttribute("data-ri",ri.toString());
            if (instruction.section === prevSection)
                row.innerHTML =
                    `<td class="Empty"></td>
                 <td>${instruction.number}</td>
				 <td>${instruction.category.toString().replace(REGEX, '$1')}</td>
				 <td><a href="#${instruction.id}">${instruction.short}</a></td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales"></td>
                 <td></td>
                 <td></td>
                 <td><input type="text"></td>`;
            else
                row.innerHTML =
                    `<td>${instruction.section}</td>
				 <td>${instruction.number}</td>
				 <td>${instruction.category.toString().replace(REGEX, '$1')}</td>
				 <td><a href="#${instruction.id}">${instruction.short}</a></td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales"></td>
                 <td></td>
                 <td></td>
                 <td><input type="text"></td>`;
            prevSection = instruction.section;
            row.querySelector('input[type="text"]').addEventListener('input',
                (e) =>
                {
                    const itemID=e.srcElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('a').getAttribute('href');
                    const rowIndex=parseInt(e.srcElement.parentElement.parentElement.getAttribute("data-ri"));
                    console.log(itemID.slice(1) + ":" + rowIndex + ":" + e);
                    console.log(instructions.instructions[rowIndex]);
                    instructions.instructions[rowIndex].comment = e.srcElement.valueOf().value;
                });
            rubric.append(row);
            ri++;
            }
        }

}
