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
enum Category {
    /* Instruction instance is associated with a a HTML <section> */
    SECTION = "SECTION",
    /* Instruction instance is associated with a  HTML <li> that has a child instructional <ol> tree */
    COMPOSITE = "COMPOSITE",
    /* Instruction instance is associated with a question HTML <li> */
    QUESTION = "QUESTION",
    /* Instruction instance is associated with a reading HTML <li> */
    READ = "READ",
    /* Instruction instance is associated with a todo HTML <li> */
    TODO = "TODO",
    /* Instruction instance is associated with a reminder HTML <li>. A Reminder Instructino has point fraction = 0 */
    REMINDER = "REMINDER",
    /* [considered for deprecation] Instruction instance is associated with a question HTML <li> */
    GENERAL = "GENERAL",
    OVERVIEW = "OVERVIEW",
    NON_RUBRIC = "NON_RUBRIC"
}

/*
export const CategoryToString =
    [
        "QUESTION",
        "GENERAL",
        "READ",
        "TODO",
        "OVERVIEW",
        "NON_RUBRIC",
        "REMINDER",
        "cOMPOSITE"
    ];
*/

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
    if (element.className.includes("Instruction_NonRubric"))
        return Category.NON_RUBRIC;
    if (element.className.includes("Instruction_Reminder"))
        return Category.REMINDER;
    if (element.className.includes("Instruction_Section"))
        return Category.SECTION;
    if (element.className.includes("Instruction_Composite"))
        return Category.COMPOSITE;

    if (returnNull)
        return null;
    else
        return Category.COMPOSITE;
}



/**
 * \brief [status: thought stage] some tutorials assignments have different options for students with different levels of past experiences
 */
export class OptionSet {
    name: string;
    options: Array<any>;
    constructor(n) {
        this.name = n;
        this.options = [];
    }
}


/**
 * \brief Section corresponding to a <section> in the document
 */
export class Section
{    
    name: string;  // name of section
    sectionNumber : string;   // full section number 
    numeral : string; // number within current level, could be Arabic or Roman number, upper or lower case
    number: number;  // number within current level
    level : number;  // depth of nesting in <section> tree
    id: string;      // HTML id attribute of <section>

    parent : Section;          // parent Section
    children : Array<Section>; // child Section    

    instruction : Instruction;  // associated Instruction

    constructor(name : string, parent : Section, number : number)
    {
        this.name = name;

        this.parent = parent;
        this.children = new Array<Section>();
        this.level = 1;
        if (parent !== null)
        {
            parent.children.push (this);
            this.sectionNumber = parent.sectionNumber + "." + number.toFixed(0);
            for (let p = parent; p !== null; p = p.parent)            
                this.level++;
        }
        else        
            this.sectionNumber =  number.toFixed(0);            

        // \todo [refactor] calculate id in this constructor instead
        this.id = "Section_"+this.sectionNumber;        

        Section.sections.push(this);
    }
    
    static buildList(section : Section , ul : HTMLUListElement)
    {
        const li : HTMLLIElement = document.createElement("li");            
        li.innerHTML = `${section.sectionNumber} <a href="#${section.id}">${section.name}</a>`;
        ul.appendChild(li);    
        if (section.children.length !== 0)
        {
            const ul : HTMLUListElement = document.createElement("ul");                    
            li.appendChild(ul);              
                                              
            ul.classList.add("side_nav_bar");
            for(let s of section.children)
                Section.buildList(s,ul);
        }
    }

    static displayTableOfContents()
    {
        const snb : HTMLDivElement = <HTMLDivElement>document.getElementById("side-nav-bar");
        const ul : HTMLUListElement = document.createElement("ul");        
        snb.appendChild(ul);
        ul.classList.add("side_nav_bar");
        for (let s of Section.sections)        
            Section.buildList(s,ul);
    }
    /**
     * array of all Section objects
     */
    static sections : Array<Section>;
} 

Section.sections = new Array<Section>();

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

/**
 * \brief Instruction is a instruction (or task) in assignment.  Instructions are hhierarchical composites of other sub Instructions and of different
 * Category's. 
 */    
export class Instruction {

    section: string;        // \todo [refactor] replace with class Section object

    number: string;         
    id: string;             // HTML id attribute for hyperlinking

    pointFraction: number;  // percentage of parent instruction's total points that this instruction item is worth
    points: number;         // actual points this Instructions's task is worth out of assignment total points.
    marks: number;          // how many points student received for this task
    comment: string;
    short: string;
    category: Category;

    subSteps: Array<Instruction>;   // sub Instructions (children)
    parent: Instruction;            // parent Instruction

    constructor(s: string = "", n: string = "", sh: string = "", c: Category = Category.GENERAL, pointFraction: number = 0, parent: Instruction = null) {
        this.section = s;
        this.number = n;
        this.short = sh;
        this.category = c;
        this.id = "Section_" + (s + "_Item_" + n).replace(/\./g, '_');
        this.pointFraction = pointFraction;
        this.points = 0;
        this.marks = 0;
        this.comment = "";
        this.parent = parent;
        this.subSteps = new Array<Instruction>();
        if (this.parent !== null)
            this.parent.subSteps.push(this);
    }
    assign(jsonObject: Object) {
        for (let p in Object)
            if (p in this)
                this[p] = jsonObject[p]
    }

    static replacer(key: any, value: any) {
        if (key === 'parent')
            return instructions.instructions.indexOf(value);
        if (key === 'subSteps') {
            const subSets: Array<number> = new Array<number>;
            for (let s of value)
                subSets.push(instructions.instructions.indexOf(s));
            return subSets;
        }
        return value;
    }
}

export class BreadCrumb
{
    target : HTMLElement ;

    constructor( target : HTMLElement )
    {
        this.target = target;
    }

    static onclick(anchor : HTMLAnchorElement )
    {   
        anchor.id = "BC_" + Date.now().toString();              
        
        //const url = new URL(window.location);        
        //window.history.pushState(null,url.toString()+"#"+anchor.id);
        anchor.setAttribute("anchor",anchor.id);
        window.history.pushState({},"",window.location.pathname+"#"+anchor.id);                        
        console.log("BreadCrumb.onclick:", anchor, "state" , window.history.state);
        const target : HTMLElement = document.getElementById(anchor.getAttribute("href").split('#')[1]);
        target.scrollIntoView(true);
        BreadCrumbs.singleton.array.push(new BreadCrumb(anchor));
        BreadCrumbs.singleton.array.push(new BreadCrumb(anchor));
        BreadCrumbs.singleton.cursor += 2;
    }    
}
export class BreadCrumbs
{
    array : Array<BreadCrumb>;
    cursor : number;

    constructor()
    {
        this.array = new Array<BreadCrumb>();
        this.cursor = 0;
    }

    static singleton : BreadCrumbs;
}

BreadCrumbs.singleton = new BreadCrumbs();

export class Instructions {
    instructions: Array<Instruction>;
    optionSets: Array<OptionSet>;

    totalPoints: number;
    constructor() {
        this.instructions = [];
        this.optionSets = [];
        this.totalPoints = 100;
    }

    push(i: Instruction) {
        this.instructions.push(i);
    }


    /**
     * @brief collectInstructions extracts all the instructions embedded in the HTML document <section> "section"
     */
    private collectInstructions(section: Section, sectionElement : HTMLElement, sectionLabel: string, parent: Instruction) {
        let l1c = 1, l2c = 1, l3c = 1;

        /*
        **  Create Instruction for <section> 'section'
        */
        const h : HTMLHeadingElement = <HTMLHeadingElement>(sectionElement.querySelector(":scope > h" + section.level.toFixed(0)));                

        /*
        **  Collection <li> Instructions in <section> 'section'
        */        
        let olList = sectionElement.querySelectorAll(":scope > ol.Instruction, :scope > ul.Instruction");
        //section.id = "";
        if (olList !== null && olList.length !== 0) {
            /*
            **  Collection level 1 <li> Instructions
            */
            for (let ol of olList) {
                let li1List = ol.querySelectorAll(":scope > li");
                let category = getCategoryFromClass(<HTMLElement>ol, false);

                l1c = 1;
                const equalFraction1: number = 1.0 / li1List.length * 100;
                /*
                **  Collection level 2 <li> Instructions
                */
                for (let li1_ of li1List) {
                    let li1: HTMLElement = <HTMLElement>li1_;
                    let tmp, cat = (tmp = getCategoryFromClass(li1, true)) !== null ? tmp : category;

                    if (tmp === Category.NON_RUBRIC)
                        continue;
                    this.instructions.push(new Instruction(sectionLabel, itemString(l1c),
                        li1.innerText.trimStart().slice(0, 10) + " ...", cat, 'pointFraction' in li1.dataset ? parseInt(li1.dataset.pointFraction) : equalFraction1, parent));
                    const parent1 = this.instructions[instructions.instructions.length - 1];
                    li1.id = this.instructions[this.instructions.length - 1].id;

                    let ol1: HTMLElement = li1.querySelector(":scope > ol");
                    /*
                    **  Collection level 3 <li> Instructions
                    */
                    if (ol1 !== null) { //&& ol1.length !== 0) {
                        let category1 = getCategoryFromClass(ol1, false);

                        let li2List = ol1.querySelectorAll(":scope > li"); // only children, no nested descendants
                        l2c = 1;
                        const equalFraction2: number = 1.0 / li2List.length * 100;
                        for (let li2_ of li2List) {
                            const li2: HTMLElement = <HTMLElement>li2_;
                            let tmp, cat = (tmp = getCategoryFromClass(li2, true)) !== null ? tmp : category1;

                            this.instructions.push(new Instruction(sectionLabel, itemString(l1c, l2c),
                                li2.innerText.trimStart().slice(0, 10) + " ...", cat, 'pointFraction' in li2.dataset ? parseInt(li2.dataset.pointFraction) : equalFraction2, parent1));
                            const parent2 = this.instructions[instructions.instructions.length - 1];
                            li2.id = this.instructions[this.instructions.length - 1].id;
                            let ol2: HTMLOListElement = <HTMLOListElement>li2.querySelector(":scope > ol");
                            if (ol2 !== null) {// && ol2.length !== 0) {
                                /*
                                **  Collection level 3 <li> Instructions
                                */
                                let category2 = getCategoryFromClass(ol2, false);

                                let li3List = ol2.querySelectorAll(":scope > li"); // only children, no nested descendants
                                l3c = 1;
                                const equalFraction3: number = 1.0 / li3List.length * 100;
                                for (let li3_ of li3List) {
                                    const li3: HTMLOListElement = <HTMLOListElement>li3_;
                                    let tmp, cat = (tmp = getCategoryFromClass(li3, true)) !== null ? tmp : category2;

                                    this.instructions.push(new Instruction(sectionLabel, itemString(l1c, l2c, l3c),
                                        li3.innerText.trimStart().slice(0, 10) + " ...", cat, 'pointFraction' in li3.dataset ? parseInt(li3.dataset.pointFraction) : equalFraction3, parent2));
                                    li3.id = this.instructions[this.instructions.length - 1].id;
                                    l3c++;
                                }
                            }
                            l2c++;
                        }
                    }
                    l1c++;
                }
            }
        }


        // remove section if it contains no <ol class=Instruction>
        //if (nInstructions === instructions.instructions.length)
            //instructions.instructions.pop();
    }

    /**
     *
     - Lost track of history of this relative to Rubric.js.  I suspect Rubric.js is 'old' since it is not .ts code.
     **/
    extractSectionsAndRubric(parent : Section, sectionElement : HTMLElement, level : number) {        
        /**
         *   <section> <h1>
         */
        let hList = sectionElement.querySelectorAll(":scope section > h" + level.toFixed(0));  // headingList
        if (hList !== null && hList.length !== 0)
        {
            let hc = 1; // 'headingCount'
            let ISectionParent1 = null;                    
            for (let h of hList) 
            {
                const sectionElement: HTMLElement = h.parentElement;
                const sectionName : string = (<HTMLElement>h).innerText;            
                console.log(`h${level}: `, sectionName );
                console.assert(sectionElement.tagName === "SECTION");
    
                const section : Section = new Section(sectionName ,parent,hc);
                sectionElement.setAttribute("id",section.id);
    
                if (sectionElement.classList.contains("Instruction_Section"))
                {   
                    ISectionParent1 = new Instruction(section.sectionNumber,"",sectionName.trimStart().slice(0, 10) + " ...", Category.SECTION,'pointFraction' in sectionElement.dataset ? parseInt(sectionElement.dataset.pointFraction) : 0);             
                    this.instructions.push (ISectionParent1);
                }
                this.collectInstructions(section,sectionElement, section.sectionNumber, ISectionParent1);
                this.extractSectionsAndRubric(section,sectionElement,section.level+1);
    
                if (h.className !== "nocount")
                    hc++;    
            }
        }
    }


    extractSectionsAndRubricAll() 
    {        
        this.extractSectionsAndRubric(null,document.body,1);
        /**
         *  compute points from fraction hierarchy
         */
        for (let instruction of this.instructions) {
            instruction.points = this.totalPoints;
            for (let p = instruction; p != null; p = p.parent)
                instruction.points *= p.pointFraction / 100;
        }        
        console.log(this.instructions);
        console.log(Section.sections);
        this.displayRubric();        
    }
    //console.log("instructions.length:"+instructions.length);

    displayRubric() {
        /*
         * construct <tbody> for <table> (#RubricTable) using instructions array and add
         * various <input> HTML elements to certain <table> columns
         */
        let rubric: HTMLTableSectionElement = document.querySelector("#RubricTable > tbody");
        let prevSection: string = "";
        const REGEX = /Symbol\(([^)]*)\)/; // for removing Symbol sub-string
        let ri = 0;
        for (let instruction of this.instructions) {
            let row = document.createElement("tr");
            row.setAttribute("data-ri", ri.toString());
            if (instruction.section === prevSection)
                row.innerHTML =
                    `<td class="Empty"></td>
                 <td>${instruction.number}</td>
				 <td>${Category[instruction.category].toLowerCase()}</td>
				 <td><a href="#${instruction.id}" onclick="BreadCrumb.onclick(this);">${instruction.short}</a></td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales"></td>
                 <td>${instruction.pointFraction.toFixed(0)}</td>
                 <td>${instruction.points.toFixed(2)}</td>
                 <td></td>
                 <td><input type="text"></td>`;
            else
                row.innerHTML =
                    `<td>${instruction.section}</td>
				 <td>${instruction.number}</td>
				 <td>${Category[instruction.category].toLowerCase()}</td>
				 <td><a href="#${instruction.id}" onclick="BreadCrumb.onclick(this);">${instruction.short}</a></td>
                 <td><input type="checkbox" id="#CB_${instruction.id}" name="scales"></td>
                 <td>${instruction.pointFraction.toFixed(0)}</td>
                 <td>${instruction.points.toFixed(2)}</td>
                 <td></td>
                 <td><input type="text"></td>`;
            prevSection = instruction.section;
            row.querySelector('input[type="text"]').addEventListener('input',
                (e: Event) => {
                    const itemID = (<HTMLInputElement>(e.target)).parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('a').getAttribute('href');
                    const rowIndex = parseInt((<HTMLInputElement>(e.target)).parentElement.parentElement.getAttribute("data-ri"));
                    console.log(itemID.slice(1) + ":" + rowIndex + ":" + e);
                    console.log(instructions.instructions[rowIndex]);
                    instructions.instructions[rowIndex].comment = (<HTMLInputElement>(e.target)).value;
                });
            rubric.append(row);
            ri++;
        }
        let ttd = document.getElementById("Total");
        //(<HTMLElement>ttd.nextElementSibling).innerText = total.toString();

    }
}
export const instructions = new Instructions();

/**
 **
 **  INTERNAL FUNCTIONS
 **
 */

function itemString(...args: number[]) {
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

function roman_lower(n): string {
    let str = "";
    for (let i = 0; i < 13; i++) {
        const v = ROMAN_VALUE[i];
        let q = Math.floor(n / v);
        n -= q * v;
        str += ROMAN_SYMBOL[i].repeat(q);
    }
    return str;
}
