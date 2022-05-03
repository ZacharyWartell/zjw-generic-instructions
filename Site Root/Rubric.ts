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
// enum Category
// {
//     QUESTION,
//     GENERAL,
//     READ,
//     TODO,
//     OVERVIEW
// }
//
// export const CategoryToString =
//     [
//         "QUESTION",
//         "GENERAL",
//         "READ",
//         "TODO",
//         "OVERVIEW"
//     ];

const Category = Object.freeze({
    QUESTION: Symbol("Question"),
    GENERAL: Symbol("General"),
    READ: Symbol("Read"),
    TODO: Symbol("Todo"),
    OVERVIEW: Symbol("Overview")
})


export function getCategoryFromClass(element, returnNull) {
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



export class OptionSet
{
    name : string;
    options : Array<any>;
    constructor(n)
    {
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

    section : string;
    number : string;
    id : string;
    points : number;
    marks : number;
    comment : string;
    short : string;
    category : typeof Category;

    constructor(s : string, n : string  , sh : string , c, points : number=0) {
        this.section = s;
        this.number = n;
        this.short = sh;
        this.category = c;
        this.id = "Section_"+(s + "_Item_" + n).replace(/\./g,'_');
        this.points = points;
        this.marks = 0;
        this.comment="";
    }
}

export class Instructions
{
    instructions : Array<Instruction>;
    optionSets : Array<OptionSet>;

    constructor()
    {
        this.instructions = [];
        this.optionSets = [];
    }

    push(i)
    {
        console.assert (i instanceof Instruction);  // \todo rewrite all in TypeScript
        this.instructions.push(i);
    }


    /**
     * @brief collectInstructions extracts all the instructions embedded in the HTML document <section> "section"
     */
    private collectInstructions(section : HTMLElement, sectionLabel : string)
    {
        let l1c : number = 1, l2c : number = 1, l3c : number = 1;

        const temp : string = "self"+Date.now().toString();
        section.id = temp;
        let olList = section.querySelectorAll(":scope > ol.Instruction");
        //section.id = "";
        if (olList !== null && olList.length !== 0) {
            for (let ol of olList) {
                let li1List = ol.querySelectorAll(":scope > li");
                let category = getCategoryFromClass(ol, false);

                l1c = 1;
                li1List.forEach(
                    (n1)=>
                    {
                        const li1 : HTMLElement = <HTMLElement>n1;
                        let tmp, cat = (tmp = getCategoryFromClass(li1, true)) !== null ? tmp : category;

                        const gp : HTMLElement = li1.querySelector(":scope > span.Grade_Points");
                        let points : number = 0;
                        if (gp !== null)
                            points = parseInt(gp.dataset.points);

                        this.push(new Instruction(sectionLabel, itemString(l1c),
                            li1.innerText.trimStart().slice(0, 10) + " ...", cat, points));
                        li1.id = this.instructions[this.instructions.length-1].id;
                        let ol1 = li1.querySelector(":scope > ol");
                        if (ol1 !== null) {
                            let category1 = getCategoryFromClass(ol1, false);

                            let li2List = ol1.querySelectorAll(":scope > li"); // only children, no nested descendants
                            l2c = 1;
                            for (let nli2 of li2List) {
                                const li2 : HTMLOListElement = <HTMLOListElement>nli2;
                                let tmp, cat = (tmp = getCategoryFromClass(li2, true)) !== null ? tmp : category1;

                                const gp : HTMLElement = li2.querySelector(":scope > span.Grade_Points");
                                let points : number = 0;
                                if (gp !== null)
                                    points = parseInt(gp.dataset.points);

                                this.instructions.push(new Instruction(sectionLabel, itemString(l1c ,l2c),
                                    li2.innerText.trimStart().slice(0, 10) + " ...",  cat,points));
                                li2.id = this.instructions[this.instructions.length-1].id;
                                let ol2 = li2.querySelector(":scope > ol");
                                if (ol2 !== null) {
                                    let category2 = getCategoryFromClass(ol2, false);

                                    let li3List = ol2.querySelectorAll(":scope > li"); // only children, no nested descendants
                                    l3c = 1;
                                    for (let nli3 of li3List) {
                                        const li3 : HTMLOListElement = <HTMLOListElement>nli3;
                                        let tmp, cat = (tmp = getCategoryFromClass(li3, true)) !== null ? tmp : category2;
                                        const gp : HTMLElement = li3.querySelector(":scope > span.Grade_Points");
                                        let points : number = 0;
                                        if (gp !== null)
                                            points = parseInt(gp.dataset.points);

                                        this.instructions.push(new Instruction(sectionLabel, itemString(l1c , l2c ,l3c),
                                            li3.innerText.trimStart().slice(0, 10) + " ...", cat,points));
                                        li3.id = this.instructions[this.instructions.length-1].id;
                                        l3c++;
                                    }
                                }
                                l2c++;
                            }
                        }
                        l1c++;
                    }
                );
            }
        }
    }

    /**
     *
     - Lost track of history of this relative to Rubric.js.  I suspect Rubric.js is 'old' since it is not .ts code.
     **/
    createRubric()
    {
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
    //console.log("instructions.length:"+instructions.length);

    /*
     * construct <tbody> for <table> (#RubricTable) using instructions.array and add
     * various <input> HTML elements to certain <table> columns
     */
    let rubric = document.querySelector("#RubricTable > tbody");
    let prevSection = "";
    let total=0;
    const REGEX = /Symbol\(([^)]*)\)/; // for removing Symbol sub-string
    let ri=0;
    for (let instruction of this.instructions) {
        let row = document.createElement("tr");
        row.setAttribute("data-ri",ri.toString());
        if (instruction.section === prevSection)
            row.innerHTML =
                `<td class="Empty"></td>
                 <td>${instruction.number}</td>
				 <td>${instruction.category.toString().replace(REGEX, '$1')}</td>
				 <td><a href="#${instruction.id}" onclick="document.getElementById('${instruction.id}').scrollIntoView();">${instruction.short}</a></td>
				 <td>${instruction.points == 0 ? "" : instruction.points.toString()}</td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales"></td>                 
                 <td><input type="number" min="0" max="100"></td>
                 <td><input type="text"></td>`;
        else
            row.innerHTML =
                `<td>${instruction.section}</td>
				 <td>${instruction.number}</td>
				 <td>${instruction.category.toString().replace(REGEX, '$1')}</td>
				 <td><a href="#${instruction.id}" onclick="document.getElementById('${instruction.id}').scrollIntoView();">${instruction.short}</a></td>                 
                 <td>${instruction.points == 0 ? "" : instruction.points.toString()}</td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales"></td>
                 <td><input type="number" min="0" max="100"></td>
                 <td><input type="text"></td>`;
        prevSection = instruction.section;
        total += instruction.points;
        rubric.append(row);
        row.querySelector('input[type="checkbox"]').addEventListener('change',
            (e : InputEvent ) =>
            {
                const rowIndex=parseInt((<HTMLElement>e.srcElement).parentElement.parentElement.getAttribute("data-ri"));
                if ((<HTMLInputElement>e.currentTarget).checked)
                    this.instructions[rowIndex].marks = this.instructions[rowIndex].points;
                else
                    this.instructions[rowIndex].marks = 0;
                (<HTMLInputElement>(<HTMLInputElement>e.currentTarget).parentElement.nextElementSibling.firstChild).value = this.instructions[rowIndex].marks.toString();
            });
        row.querySelector('input[type="text"]').addEventListener('input',
            (e : InputEvent ) =>
            {
                const itemID=(<HTMLElement>e.currentTarget).parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('a').getAttribute('href');
                const rowIndex=parseInt((<HTMLElement>e.srcElement).parentElement.parentElement.getAttribute("data-ri"));
                console.log(itemID.slice(1) + ":" + rowIndex + ":" + e);
                console.log(this.instructions[rowIndex]);
                this.instructions[rowIndex].comment = (<HTMLInputElement>e.currentTarget).value;
            });
        row.querySelector('input[type="number"]').addEventListener('change',
            (e : InputEvent ) =>
            {
                const rowIndex=parseInt((<HTMLElement>e.srcElement).parentElement.parentElement.getAttribute("data-ri"));
                console.log(this.instructions[rowIndex]);
                this.instructions[rowIndex].marks = parseInt((<HTMLInputElement>e.currentTarget).value);
            });
        ri++;
    }
    let ttd = document.getElementById("Total");
    (<HTMLElement>ttd.nextElementSibling).innerText = total.toString();

    }
}
export const instructions = new Instructions();

export function itemString(...args: number[])
{
    const aCode = "a".charCodeAt(0);
    switch(arguments.length)
    {
        case 1:
            return args[0].toString();
        case 2:
            return args[0].toString() + "." + String.fromCharCode(aCode+args[1]-1);
        case 3:
            return args[0].toString() + "." + String.fromCharCode(aCode+args[1]-1) + "." + roman_lower(args[2]);
    }
}

/**
 **
 **  INTERNAL FUNCTIONS
 **
 */
const ROMAN_VALUE = Uint16Array.from(
[
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

const ROMAN_SYMBOL =
    [
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

function roman_lower (n) : string
{
    let str = "";
    for (let i = 0;i<13;i++)
    {
        const v = ROMAN_VALUE[i];
        let q = Math.floor(n / v);
        n -= q * v;
        str += ROMAN_SYMBOL[i].repeat(q);
    }
    return str;
}
