/**
 * \author Zachary Wartell
 * \copyright Copyright 2015. Zachary Wartell.
 * \license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * http://creativecommons.org/licenses/by-nc-sa/4.0/
 */
/**
 **
 **  EXPORTED FUNCTIONS, CLASSES, ETC.
 **
 */
/*
 * @type {Readonly<{READ: symbol, TODO: symbol, OVERVIEW: symbol, GENERAL: symbol, QUESTION: symbol}>}
 */
var Category;
(function (Category) {
    Category["QUESTION"] = "QUESTION";
    Category["GENERAL"] = "GENERAL";
    Category["READ"] = "READ";
    Category["TODO"] = "TODO";
    Category["OVERVIEW"] = "OVERVIEW";
})(Category || (Category = {}));
export const CategoryToString = [
    "QUESTION",
    "GENERAL",
    "READ",
    "TODO",
    "OVERVIEW"
];
/*
const Category = Object.freeze({
    QUESTION: Symbol("Question"),
    GENERAL: Symbol("General"),
    READ: Symbol("Read"),
    TODO: Symbol("Todo"),
    OVERVIEW: Symbol("Overview")
})
*/
function getCategoryFromClass(element, returnNull) {
    if (element.className.includes("Instruction_Question"))
        return Category.QUESTION;
    if (element.className.includes("Instruction_Read"))
        return Category.READ;
    if (element.className.includes("Instruction_Todo"))
        return Category.TODO;
    if (element.className.includes("Instruction_Overview"))
        return Category.OVERVIEW;
    if (element.className.includes("Instruction_General"))
        return Category.GENERAL;
    if (returnNull)
        return null;
    else
        return Category.GENERAL;
}
export class OptionSet {
    constructor(n) {
        this.name = n;
        this.options = [];
    }
}
/*class Category
    {
        constructor(e)
        {
            this.value=e;
        }
        static QUESTION = 0;
        static GENERAL = 1;
        static READ = 2;
           static TODO = 3;
    };*/
export class Instruction {
    constructor(s = "", n = "", sh = "", c = Category.GENERAL, points = 0) {
        this.section = s;
        this.number = n;
        this.short = sh;
        this.category = c;
        this.id = "Section_" + (s + "_Item_" + n).replace(/\./g, '_');
        this.points = points;
        this.marks = 0;
        this.comment = "";
    }
    assign(jsonObject) {
        for (let p in jsonObject)
            if (p in this)
                this[p] = jsonObject[p];
    }
}
export class Instructions {
    constructor() {
        this.instructions = [];
        this.optionSets = [];
    }
    push(i) {
        console.assert(i instanceof Instruction); // \todo rewrite all in TypeScript
        this.instructions.push(i);
    }
    totalMarksUpdate() {
        let tm = 0; // 'totalMarks'
        for (let i of this.instructions)
            tm += i.marks;
        document.getElementById("TotalMarks").innerText = tm.toString();
    }
    /**
     * @brief collectInstructions extracts all the instructions embedded in the HTML document <section> "section"
     */
    collectInstructions(section, sectionLabel) {
        let l1c = 1, l2c = 1, l3c = 1;
        const temp = "self" + Date.now().toString();
        section.id = temp;
        let olList = section.querySelectorAll(":scope > ol.Instruction");
        //section.id = "";
        if (olList !== null && olList.length !== 0) {
            for (let ol of olList) {
                let li1List = ol.querySelectorAll(":scope > li");
                let category = getCategoryFromClass(ol, false);
                l1c = 1;
                li1List.forEach((n1) => {
                    const li1 = n1;
                    let tmp, cat = (tmp = getCategoryFromClass(li1, true)) !== null ? tmp : category;
                    const gp = li1.querySelector(":scope > span.Grade_Points");
                    let points = 0;
                    if (gp !== null)
                        points = parseInt(gp.dataset.points);
                    this.push(new Instruction(sectionLabel, itemString(l1c), li1.innerText.trimStart().slice(0, 10) + " ...", cat, points));
                    li1.id = this.instructions[this.instructions.length - 1].id;
                    let ol1 = li1.querySelector(":scope > ol");
                    if (ol1 !== null) {
                        let category1 = getCategoryFromClass(ol1, false);
                        let li2List = ol1.querySelectorAll(":scope > li"); // only children, no nested descendants
                        l2c = 1;
                        for (let nli2 of li2List) {
                            const li2 = nli2;
                            let tmp, cat = (tmp = getCategoryFromClass(li2, true)) !== null ? tmp : category1;
                            const gp = li2.querySelector(":scope > span.Grade_Points");
                            let points = 0;
                            if (gp !== null)
                                points = parseInt(gp.dataset.points);
                            this.instructions.push(new Instruction(sectionLabel, itemString(l1c, l2c), li2.innerText.trimStart().slice(0, 10) + " ...", cat, points));
                            li2.id = this.instructions[this.instructions.length - 1].id;
                            let ol2 = li2.querySelector(":scope > ol");
                            if (ol2 !== null) {
                                let category2 = getCategoryFromClass(ol2, false);
                                let li3List = ol2.querySelectorAll(":scope > li"); // only children, no nested descendants
                                l3c = 1;
                                for (let nli3 of li3List) {
                                    const li3 = nli3;
                                    let tmp, cat = (tmp = getCategoryFromClass(li3, true)) !== null ? tmp : category2;
                                    const gp = li3.querySelector(":scope > span.Grade_Points");
                                    let points = 0;
                                    if (gp !== null)
                                        points = parseInt(gp.dataset.points);
                                    this.instructions.push(new Instruction(sectionLabel, itemString(l1c, l2c, l3c), li3.innerText.trimStart().slice(0, 10) + " ...", cat, points));
                                    li3.id = this.instructions[this.instructions.length - 1].id;
                                    l3c++;
                                }
                            }
                            l2c++;
                        }
                    }
                    l1c++;
                });
            }
        }
    }
    /**
     *
     - Lost track of history of this relative to Rubric.js.  I suspect Rubric.js is 'old' since it is not .ts code.
     **/
    extractRubric() {
        // Note this traversal assumes every <h1>, <h2> etc. is immediately preceded by a <section> element
        let h1List = document.querySelectorAll("section > h1");
        let h1c, h2c, h3c;
        h1c = 1;
        for (let h1 of h1List) {
            console.assert(h1.parentElement.tagName === "SECTION");
            this.collectInstructions(h1.parentElement, h1c.toString());
            let parent = h1.parentElement;
            let selfIndex = [].slice.call(parent.children).indexOf(h1) + 1;
            let h2List = parent.querySelectorAll(":nth-child(" + selfIndex + ") ~ section > h2");
            if (h2List !== null && h2List.length !== 0) {
                h2c = 1;
                for (let h2 of h2List) {
                    console.assert(h2.parentElement.tagName === "SECTION");
                    this.collectInstructions(h2.parentElement, h1c.toString() + "." + h2c.toString());
                    let parent = h2.parentElement;
                    let selfIndex = [].slice.call(parent.children).indexOf(h2) + 1;
                    let h3List = parent.querySelectorAll(":nth-child(" + selfIndex + ") ~ section > h3");
                    if (h3List !== null && h3List.length !== 0) {
                        h3c = 1;
                        for (let h3 of h3List) {
                            console.assert(h3.parentElement.tagName === "SECTION");
                            this.collectInstructions(h3.parentElement, h1c.toString() + "." + h2c.toString() + "." + h3c.toString());
                            h3c++;
                        }
                    }
                    h2c++;
                }
            }
            if (h1.className !== "nocount")
                h1c++;
        }
        console.log(this.instructions);
        this.displayRubric();
    }
    //console.log("instructions.length:"+instructions.length);
    displayRubric(displayMarks = false) {
        /*
         * construct <tbody> for <table> (#RubricTable) using instructions.array and add
         * various <input> HTML elements to certain <table> columns
         */
        let rubric = document.querySelector("#RubricTable > tbody");
        let prevSection = "";
        let total = 0;
        const REGEX = /Symbol\(([^)]*)\)/; // for removing Symbol sub-string
        let ri = 0;
        rubric.innerHTML = "";
        for (let instruction of this.instructions) {
            let row = document.createElement("tr");
            row.setAttribute("data-ri", ri.toString());
            if (instruction.section === prevSection)
                row.innerHTML =
                    `<td class="Empty"></td>
                 <td>${instruction.number}</td>
				 <td>${instruction.category.toString().replace(REGEX, '$1')}</td>
				 <td><a href="#${instruction.id}" onclick="document.getElementById('${instruction.id}').scrollIntoView();">${instruction.short}</a></td>
				 <td>${instruction.points == 0 ? "" : instruction.points.toString()}</td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales" ${instruction.points != 0 && instruction.marks == instruction.points ? 'checked="true"' : ''}"></td>                 
                 <td><input type="number" min="0" max="100" value=${displayMarks && instruction.points != 0 ? instruction.marks : ""}></td>
                 <td><input type="text" value="${instruction.comment}"></td>`;
            else
                row.innerHTML =
                    `<td>${instruction.section}</td>
				 <td>${instruction.number}</td>
				 <td>${instruction.category.toString().replace(REGEX, '$1')}</td>
				 <td><a href="#${instruction.id}" onclick="document.getElementById('${instruction.id}').scrollIntoView();">${instruction.short}</a></td>                 
                 <td>${instruction.points == 0 ? "" : instruction.points.toString()}</td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales" ${instruction.points != 0 && instruction.marks == instruction.points ? 'checked="true"' : ''}"></td>
                 <td><input type="number" min="0" max="100" value=${displayMarks && instruction.points != 0 ? instruction.marks : ""}></td>
                 <td><input type="text" value="${instruction.comment}"></td>`;
            prevSection = instruction.section;
            total += instruction.points;
            rubric.append(row);
            row.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                const rowIndex = parseInt(e.srcElement.parentElement.parentElement.getAttribute("data-ri"));
                if (e.currentTarget.checked)
                    this.instructions[rowIndex].marks = this.instructions[rowIndex].points;
                else
                    this.instructions[rowIndex].marks = 0;
                e.currentTarget.parentElement.nextElementSibling.firstChild.value = this.instructions[rowIndex].marks.toString();
                this.totalMarksUpdate();
            });
            row.querySelector('input[type="text"]').addEventListener('input', (e) => {
                const itemID = e.currentTarget.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('a').getAttribute('href');
                const rowIndex = parseInt(e.srcElement.parentElement.parentElement.getAttribute("data-ri"));
                console.log(itemID.slice(1) + ":" + rowIndex + ":" + e);
                console.log(this.instructions[rowIndex]);
                this.instructions[rowIndex].comment = e.currentTarget.value;
            });
            row.querySelector('input[type="number"]').addEventListener('change', (e) => {
                const rowIndex = parseInt(e.srcElement.parentElement.parentElement.getAttribute("data-ri"));
                console.log(this.instructions[rowIndex]);
                this.instructions[rowIndex].marks = parseInt(e.currentTarget.value);
                this.totalMarksUpdate();
            });
            ri++;
        }
        // update display of total points
        let ttd = document.getElementById("Total");
        ttd.nextElementSibling.innerText = total.toString();
        this.totalMarksUpdate();
    }
}
export const instructions = new Instructions();
/**
 **
 **  INTERNAL FUNCTIONS
 **
 */
function itemString(...args) {
    const aCode = "a".charCodeAt(0);
    switch (arguments.length) {
        case 1:
            return args[0].toString();
        case 2:
            return args[0].toString() + "." + String.fromCharCode(aCode + args[1] - 1);
        case 3:
            return args[0].toString() + "." + String.fromCharCode(aCode + args[1] - 1) + "." + roman_lower(args[2]);
    }
}
const ROMAN_VALUE = Uint16Array.from([
    1000,
    900,
    500,
    400,
    100,
    90,
    50,
    40,
    10,
    9,
    5,
    4,
    1
]);
const ROMAN_SYMBOL = [
    "m",
    "cm",
    "d",
    "cd",
    "c",
    "xc",
    "l",
    "xl",
    "x",
    "ix",
    "v",
    "iv",
    "i"
];
function roman_lower(n) {
    let str = "";
    for (let i = 0; i < 13; i++) {
        const v = ROMAN_VALUE[i];
        let q = Math.floor(n / v);
        n -= q * v;
        str += ROMAN_SYMBOL[i].repeat(q);
    }
    return str;
}
//# sourceMappingURL=Rubric.js.map