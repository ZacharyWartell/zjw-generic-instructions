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
function AUTO_DOC() {
    //stub
    return new String;
}
/**
 * [wip] \todo AUTO_DOC a mechanism for generating user documentation and writing the text next the source code that directly implements the user visible concepts.
 */
AUTO_DOC["Instruction Category"] =
    `
    <ol> These are the CSS class for ol, li or section HTML::Elements that map to Instruction object (of enum Category that is either individual or composite)
        <li> Instruction_Question - the li element asks a question the student must answer.   The method of submitting the must be descrbed within li element content.
        </li>
        <li> Instruction_Read - the li element listed required reading only.
        </li>
        <li> Instruction_Todo - the li element is a specific todo action item instruction
        </li>
        <li> Instruction_Overview - the li element is an textual overview of the nested set of li Instruction elememnts
        </li>        
        <li> Instruction_General - the li element is an general instruction 
        </li>        
        <li> Instruction_Reminder - the li element has no points assigned to it in the Rubric
        </li>        
        <li> Instruction_Section - the section element will have its own entry in the Rubric table
        </li>        
        <li> Instruction_Composite - the li element will is tagged as a composition instruction, and li element containing at nest ol element and containing nested instructions
        </li>  
        <li> Instruction_Git_Commit - the li element will is tagged as a git commit operation
        </li>        
        <li> Instruction_NonRubric - the li element will be ignored by the Rubric generation algorithm
        </li>        
    </ol>
 `;
/*
 * @brief Category is a kind of Instruction.  There is a 1-to-1 mapping between enum Category values and CSS classes with names matching the regex "Instruction_.*"
 * @see AUTO_DOC["Instruction Category"]
 */
var Category;
(function (Category) {
    Category["AUTO"] = "AUTO";
    /* Instruction instance is associated with a a HTML <section> */
    Category["SECTION"] = "SECTION";
    /* Instruction instance is associated with a  HTML <li> that has a nested, child <ol> that contains sub-instructions  */
    Category["COMPOSITE"] = "COMPOSITE";
    /* Instruction instance is associated with a question HTML <li> */
    Category["QUESTION"] = "QUESTION";
    /* Instruction instance is associated with a reading HTML <li> */
    Category["READ"] = "READ";
    /* Instruction instance is associated with a todo HTML <li> */
    Category["TODO"] = "TODO";
    /* Instruction instance is associated with a reminder HTML <li>. A Reminder Instruction has point fraction = 0 */
    Category["REMINDER"] = "REMINDER";
    /* Instruction instance is associated with a  HTML <li> that has a nested, child <ol> that contains sub-instructions.
       Unlike Category.COMPOSITE, the child <ol>'s sub elements (<li>) represent mutually exclusive options.
       The student only performs one of the options.
       
       Therefore, the Rubric table generation will only generate a grading checkbox for the Instruction with Category.OPTION_SET
       and will not generate table rows for the child <ol>'s element (<li>'s).

       Category.OPTION_SET is useful when different instructions are needed for different operating systems, or to accommodate other
       differing aspects of the student's computing environment.

       It is assumed that each option requires an equal amount of student effort and is therefore worth the same number points.
       The points are calculated for the Category.OPTION_SET Instruction, since the nested, child <ol> is not represented by rows
       in the Rubric table.
     */
    Category["OPTION_SET"] = "OPTION_SET";
    /* [considered for deprecation] Instruction instance is associated with a question HTML <li> */
    Category["GENERAL"] = "GENERAL";
    Category["OVERVIEW"] = "OVERVIEW";
    Category["NON_RUBRIC"] = "NON_RUBRIC";
    Category["GIT_COMMIT"] = "GIT_COMMIT";
})(Category || (Category = {}));
/**
 * @param element
 * @param returnNull - this is a vestige of earlier code, eventually this parameter should be removed and all code refactored
 * @returns
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
    if (element.className.includes("Instruction_Option_Set"))
        return Category.OPTION_SET;
    if (element.className.includes("Instruction_Git_Commit"))
        return Category.GIT_COMMIT;
    if (returnNull)
        return null;
    else
        return Category.AUTO;
}
/**
 * \brief Some tutorial assignments have different options for students with different levels of past experiences
 * OptionSet contains the multiple Section's each of which is one of the available options.
 */
export class OptionSet {
    constructor(n) {
        this.name = n;
        this.options = new Array;
    }
}
OptionSet.optionSetByName = new Map();
/**
 * @brief A Section corresponds to a <section> in the HTML document and contains Instruction objects (which correspond to HTMLElements with class="Instruction_*") and child Section's (which correspond to the child <section>'s)
 */
export class Section {
    constructor(name, parent, number) {
        this.optionSet = null; // can only be !== null when this.level === 1
        this.optionIndex = 0; // index of this Section within it's OptionSet (if optionSet !== null)
        this.cumulativeFraction = 0;
        this.instruction = null; // associated Instruction
        this.name = name;
        this.parent = parent;
        this.children = new Array();
        this.level = 1;
        if (parent !== null) {
            parent.children.push(this);
            this.sectionNumber = parent.sectionNumber + "." + number.toFixed(0);
            for (let p = parent; p !== null; p = p.parent)
                this.level++;
        }
        else
            this.sectionNumber = number.toFixed(0);
        // \todo [refactor] calculate id in this constructor instead
        this.id = "Section_" + this.sectionNumber;
        Section.sections.push(this);
    }
    /**
     * @brief [wip?] buildList construct TableOfContents HTML elements
     * @param section
     * @param ul
     */
    static buildList(section, ul) {
        const li = document.createElement("li");
        li.innerHTML = `${section.sectionNumber} <a href="#${section.id}">${section.name}</a>`;
        ul.appendChild(li);
        if (section.children.length !== 0) {
            const ul1 = document.createElement("ul");
            li.appendChild(ul1);
            ul1.classList.add("side-nav-bar");
            for (let s of section.children)
                Section.buildList(s, ul1);
        }
    }
    static displayTableOfContents() {
        const snb = document.querySelector("div#side-nav-bar > div");
        if (snb !== null) {
            const ul = document.createElement("ul");
            snb.appendChild(ul);
            ul.classList.add("side-nav-bar");
            for (let s of Section.sections) {
                if (s.level === 1)
                    Section.buildList(s, ul);
            }
        }
    }
}
export class Sequence {
    constructor() {
        this.sections = new Array;
        this.totalPoints = 0;
    }
}
Section.sections = new Array();
// 4/12/2023: unused , delete if still unsed after a few months, brainstorming idea
var PointCalculation;
(function (PointCalculation) {
    PointCalculation[PointCalculation["MANUAL_OVERRIDE"] = 0] = "MANUAL_OVERRIDE";
    PointCalculation[PointCalculation["COMPOSITE"] = 1] = "COMPOSITE";
    PointCalculation[PointCalculation["FULL_OR_ZERO"] = 2] = "FULL_OR_ZERO"; /* Instruction.awarded value is full credit or zero */
})(PointCalculation || (PointCalculation = {}));
/**
 * \brief Instruction is a instruction (or task) in an assignment.  Instructions can be of various types, determined by enum Category.
 * Some Instruction can be a hierarchical composites of other sub Instructions.
 * \author Zachary Wartell
 */
export class Instruction {
    constructor(s = "", n = "", sh = "", c = Category.GENERAL, pointFraction = 0, parent = null) {
        this.section = s;
        this.number = n;
        this.short = sh;
        this.category = c;
        this.id = "Section_" + (s + "_Item_" + n).replace(/\./g, '_');
        this.pointFraction = pointFraction;
        this.points = 0;
        this.awarded = 0;
        this.comment = "";
        this.pointCalculation = PointCalculation.FULL_OR_ZERO;
        this.parent = parent;
        this.subSteps = new Array();
        if (this.parent !== null) {
            if (parent.category !== Category.OPTION_SET) { // override any category that was set in the HTML file with Category.COMPOSITE
                parent.pointCalculation = PointCalculation.COMPOSITE;
                parent.category = Category.COMPOSITE;
                console.assert(this.parent !== undefined);
                console.assert(this.parent.subSteps !== undefined);
            }
            this.parent.subSteps.push(this);
        }
    }
    assign(jsonObject) {
        for (let p in Object)
            if (p in this)
                this[p] = jsonObject[p];
    }
    /**
     * \brief update to this Instruction.awarded points based on GUI checkbox change and handle upward and downward
     *  propagation of checkbox changes based on Instruction hierarchy
     * @param input
     */
    gui_checkbox(input) {
        this.gui_checkbox_recursive(input);
        instructions.recalc_points();
        instructions.gui_update_awarded();
        /*
        <table id="RubricAwardedPointsTable" class="RubricAwardedPointsTable">
            <thead>
                <tr>
                    <th>Combination</th><!--       <th>Completed</th> -->
                    <th>Max Points</th>
                    <th>Awarded Points</th>
                </tr>
                <tr>
                    <th><!--       </td><td>--></td>
                    <th><span data-total-points="">150</span></th>
                    <th><span id="AwardedPoints" data-zxw-mvc="dynamic-content"></span></th>
                </tr>
            </thead>
            <tbody data-zxw-mvc="dynamic-content">
            </tbody>
        </table>
        */
        for (let tr = document.querySelector('*[id="AwardedPoints"]').parentElement.parentElement.parentElement.nextElementSibling.children[0]; tr !== null; tr = tr.nextElementSibling) {
            //let percentage : string;
            const percentage = instructions.awardedPoints / parseFloat((tr.children[1]).innerText) * 100;
            if (percentage <= 101)
                tr.children[2].innerText = percentage.toFixed(1) + "%";
            else
                tr.children[2].innerText = "-";
            tr.children[2].setAttribute("contenteditable", "true");
        }
        //percentages += "]";
        /*
        for (let os of instructions.optionSets)
        
        */
        //(<HTMLSpanElement>document.getElementById("AwardedPoints")).innerText = instructions.awardedPoints.toFixed(2) + percentages;
        document.getElementById("AwardedPoints").innerText = instructions.awardedPoints.toFixed(2);
        /* this causes the Rubric .html that is saved to a fill, to have it's checkbox HTML Attribute 'default'
           set to the DOM checkbox's run-time state
         */
        input.defaultChecked = input.checked;
    }
    /**
     * \brief update to this Instruction.awarded points based on GUI checkboxchange and handle upward and downward
     *  propagation of checkbox changes based on Instruction hierarchy
     * @param input
     */
    gui_checkbox_recursive(input, processChildren = true) {
        const oldAwarded = this.awarded;
        if (input.checked) { // checkbox chedked, set awarded points, this.awarded, to this.points                
            const i = instructions.instructions.findIndex((element) => element == this);
            const td = document.querySelector("table.Rubric > tbody > tr[data-ri='" + i.toString() + "'] > td:nth-child(6) > span:nth-child(2) > span:nth-child(2)");
            this.awarded = this.points;
            td.innerHTML = this.awarded.toFixed(2);
            input.classList.remove("Grey");
            for (let c of this.subSteps) {
                const ci = instructions.instructions.findIndex((element) => element == c);
                const tr = document.querySelector("table.Rubric > tbody > tr[data-ri='" + ci.toString() + "'");
                console.assert(tr !== null);
                const childCB = tr.querySelector(":scope input[type='checkbox']");
                console.assert(childCB !== null);
                childCB.checked = true;
                c.gui_checkbox_recursive(childCB);
            }
            /* this causes the Rubric .html that is saved to a fill, to have it's checkbox HTML Attribute 'default'
                set to the DOM checkbox's run-time state
            */
            input.defaultChecked = input.checked;
        }
        else { // checkbox unchecked, reset Instruction.awarded points to 0 (and adjust Instruction.subStep hierarchy as needed)                
            const i = instructions.instructions.findIndex((element) => element == this);
            const td = document.querySelector("table.Rubric > tbody > tr[data-ri='" + i.toString() + "'] > td:nth-child(6) > span:nth-child(2) > span:nth-child(2)");
            this.awarded = 0;
            td.innerHTML = this.awarded.toFixed(2);
            input.classList.remove("Grey");
            if (oldAwarded !== this.awarded) { // box was checked and now unchecked, so reset all parent Instructions                    
                for (let p = this.parent; p !== null; p = p.parent) {
                    /* get GUI <tr> element contains Instruction at level above this Instruction */
                    const pi = instructions.instructions.findIndex((element) => element == p);
                    console.assert(pi !== -1);
                    const parentCB = document.querySelector("table.Rubric > tbody > tr[data-ri='" + pi.toString() + "'] input[type='checkbox']");
                    console.assert(parentCB !== null);
                    parentCB.checked = false;
                    parentCB.classList.add("Grey");
                    p.gui_checkbox_recursive(parentCB, false);
                    parentCB.classList.add("Grey");
                }
                /*
                Goal:  uncheck child Instructions
                Bug:   right now this code causes all sorts of problems , disabled for now
                */
                if (processChildren)
                    for (let c of this.subSteps) {
                        const i = instructions.instructions.findIndex((element) => element == c);
                        const tr = document.querySelector("table.Rubric > tbody > tr[data-ri='" + i.toString() + "'");
                        console.assert(tr !== null);
                        const cInput = tr.querySelector(":scope input[type='checkbox']");
                        console.assert(cInput !== null);
                        cInput.checked = false;
                        c.gui_checkbox_recursive(cInput);
                        cInput.classList.remove("Grey");
                    }
            }
        }
    }
    /**
     * \brief replacer callback for JSON.stringify
     * @param key
     * @param value
     * @returns
     */
    static replacer(key, value) {
        if (key === 'parent')
            return instructions.instructions.indexOf(value);
        if (key === 'subSteps') {
            const subSets = new Array;
            for (let s of value)
                subSets.push(instructions.instructions.indexOf(s));
            return subSets;
        }
        return value;
    }
}
/**
 * @author Zachary Wartell
 * @brief BreadCrumb and BreadCrumbs are used to navigate precisely (forward and back) within the page uses the DOM .scrollIntoView() function which is much more precise
 * then simply letting the browser jump to within page hyperlinks
 *
 * @status [IN PROGRESS] partial implementation, disabled except in "TA Mode"
 */
export class BreadCrumb {
    constructor(target) {
        this.target = target;
    }
    static onclick(anchor) {
        anchor.id = "BC_" + Date.now().toString();
        //const url = new URL(window.location);        
        //window.history.pushState(null,url.toString()+"#"+anchor.id);
        anchor.setAttribute("anchor", anchor.id);
        window.history.pushState({}, "", window.location.pathname + "#" + anchor.id);
        console.log("BreadCrumb.onclick:", anchor, "state", window.history.state);
        const target = document.getElementById(anchor.getAttribute("href").split('#')[1]);
        target.scrollIntoView(true);
        BreadCrumbs.singleton.array.push(new BreadCrumb(anchor));
        BreadCrumbs.singleton.array.push(new BreadCrumb(anchor));
        BreadCrumbs.singleton.cursor += 2;
    }
}
/**
 * @author Zachary Wartell
 * @bug this is BreadCrumb mechanism is failing occasionally for certain internal links
 * @brief set of BreadCrumb's
 */
export class BreadCrumbs {
    constructor() {
        this.array = new Array();
        this.cursor = 0;
    }
}
BreadCrumbs.singleton = new BreadCrumbs();
/**
 * \author Zachary Wartell
 */
export class Instructions {
    constructor() {
        this.instructions = [];
        this.optionSets = [];
        this.totalPoints = 100;
        this.awardedPoints = 0;
    }
    push(i) {
        this.instructions.push(i);
    }
    /**
     *   Update the awarded points column in the Rubric <table> as well as any Grey check boxes
     */
    gui_update_awarded() {
        let rubric = document.querySelector("#RubricTable > tbody");
        let trs = rubric.querySelectorAll("tr");
        let i = 0;
        for (let tr of trs) {
            const td = tr.querySelector(":scope td:nth-child(6) > span:nth-child(2) > span:nth-child(2)");
            if (td !== null) {
                const instruction = this.instructions[i];
                td.innerText = instruction.awarded.toFixed(2);
                if (instruction.category === Category.COMPOSITE) {
                    const checkbox = tr.querySelector(":scope input[type='checkbox']");
                    if (Math.abs(instruction.awarded - instruction.points) < 1e-5) {
                        instruction.awarded = instruction.points;
                        checkbox.classList.remove("Grey");
                        checkbox.checked = true;
                    }
                    else {
                        checkbox.classList.add("Grey");
                        checkbox.checked = false;
                    }
                }
                i++;
            }
        }
    }
    /**
     * \brief recalculate all Instruction.points based on Instruction subStep hierarchy
     */
    recalc_points_resursive(i) {
        //if (i.pointCalculation === PointCalculation.COMPOSITE)
        if (i.category === Category.COMPOSITE) {
            i.awarded = 0;
            for (let c of i.subSteps)
                i.awarded += this.recalc_points_resursive(c);
            return i.awarded;
        }
        else
            return i.awarded;
    }
    /**
     * @brief recalculate all Instruction.points based on Instruction subStep hierarchy
     */
    recalc_points() {
        this.awardedPoints = 0;
        for (let i of this.instructions)
            if (i.parent === null) {
                this.recalc_points_resursive(i);
                this.awardedPoints += i.awarded;
            }
    }
    /**
     * @brief collectInstructions_recursive resursively extracts Instructions from nested ol.Instructions within the <section> of the document "section"
     **/
    collectInstructions_recursive(section, // the Section object we are extracting from
    sectionElement, // the HTML <section> element corresponding to the above "section"
    sectionLabel, // name of the section , e.g. 4.1 or 4.2.3
    parent, // parent Instruction (if any) that contains (as subSteps) all Instructions being extracted from the "olList"
    itemLevels, // array (if any) of index numbers of nested <li> items (with respect to their own <ol>) that contain the "olList"
    olList) {
        let lic = 1;
        for (let ol of olList) {
            let category = getCategoryFromClass(ol, false);
            const li1List = ol.querySelectorAll(":scope > li");
            /*
            count number of items that contribute points to the rubric
            */
            let rubricItems = 0;
            for (let li_ of li1List) {
                const li = li_;
                let tmp, cat = (tmp = getCategoryFromClass(li, true)) !== null ? tmp : category;
                if (tmp !== Category.NON_RUBRIC)
                    rubricItems++;
            }
            let equalFraction1;
            if (parent !== null && parent.category === Category.OPTION_SET)
                equalFraction1 = 100;
            else
                equalFraction1 = 1.0 / rubricItems * 100;
            lic = 1;
            /*
            **  Collection level 1 <li> Instructions
            */
            for (let li_ of li1List) {
                const li = li_;
                let tmp, cat = (tmp = getCategoryFromClass(li, true)) !== null ? tmp : category;
                if (tmp === Category.NON_RUBRIC)
                    continue;
                itemLevels.push(lic);
                this.instructions.push(new Instruction(sectionLabel, itemString(...itemLevels), li.innerText.trimStart().slice(0, 10) + " ...", cat, 'pointFraction' in li.dataset ? parseFloat(li.dataset.pointFraction) : equalFraction1, parent));
                const parentLI = this.instructions[instructions.instructions.length - 1]; // parentLI is the just pushed new Instruction (previously line)
                if (parentLI.category == Category.AUTO)
                    parentLI.category = Category.TODO;
                li.id = this.instructions[this.instructions.length - 1].id;
                const liOList = li.querySelectorAll(":scope > ol, :scope > ul");
                if (liOList !== null && liOList.length) {
                    if (parentLI.category !== Category.OPTION_SET)
                        parentLI.category = Category.COMPOSITE;
                }
                this.collectInstructions_recursive(section, sectionElement, sectionLabel, parentLI, itemLevels, liOList);
                itemLevels.pop();
                lic++;
            }
        }
    }
    /**
     * @brief collectInstructions extracts all the instructions embedded in the HTML document <section> "section"
     */
    collectInstructions(section, sectionElement, sectionLabel, parent) {
        let olList = sectionElement.querySelectorAll(":scope > ol.Instruction, :scope > ul.Instruction");
        const itemLevels = new Array;
        this.collectInstructions_recursive(section, sectionElement, sectionLabel, parent, itemLevels, olList);
    }
    /**
     * @brief extractSectionsAndRubric recursively traverses nested <section> elements in the DOM, creation Section objects and constructing Instruction objects
     * the corresponding to <ol.Instruction> <li> HTML elements.
     **/
    extractSectionsAndRubric(parent, // the Section who we will recursively search for sub-<section>
    sectionElement, // <section> corresponding the Section object 'parent'
    level) {
        /**
         *   <section> <h1>
         */
        let hList = sectionElement.querySelectorAll(":scope section > h" + level.toFixed(0)); // headingList
        if (hList !== null && hList.length !== 0) {
            let hc = 1; // 'headingCount'
            let ISectionParent1 = null;
            for (let h of hList) {
                const sectionElement = h.parentElement;
                const sectionName = h.innerText;
                console.log(`h${level}: `, sectionName);
                console.assert(sectionElement.tagName === "SECTION");
                const section = new Section(sectionName, parent, hc);
                if (level === 1) {
                    if (sectionElement.dataset['optionset'] !== undefined) {
                        let osJSON = JSON.parse(sectionElement.dataset['optionset']);
                        if (osJSON.name !== undefined) { // HTML <section> has data-optionset, so treat is as an class Section optionSet member
                            let os = OptionSet.optionSetByName.get(osJSON.name);
                            if (os === undefined) {
                                os = new OptionSet(osJSON.name);
                                OptionSet.optionSetByName.set(os.name, os);
                            }
                            console.assert(os !== null);
                            section.optionSet = os;
                            os.options.push(section);
                            section.optionIndex = os.options.length - 1;
                            console.log("os.name: ", os.name, section.optionSet);
                        }
                    }
                }
                sectionElement.setAttribute("id", section.id);
                if (sectionElement.classList.contains("Instruction_Section")) {
                    //if (level === 1 && section.optionSet !== null)
                    //  ISectionParent1 = new Instruction(section.sectionNumber + " (" + section.optionSet.name + (section.optionSet.options.length === 1 ? "" : ": Opt. " +  roman(section.optionIndex+1,Roman.UPPER)) + ")","",sectionName.trimStart().slice(0, 10) + " ...", Category.SECTION,'pointFraction' in sectionElement.dataset ? parseFloat(sectionElement.dataset.pointFraction) : 0,parent === null ? null : parent.instruction);
                    //else
                    ISectionParent1 = new Instruction(section.sectionNumber, "", sectionName.trimStart().slice(0, 10) + " ...", Category.SECTION, 'pointFraction' in sectionElement.dataset ? parseFloat(sectionElement.dataset.pointFraction) : 0, parent === null ? null : parent.instruction);
                    this.instructions.push(ISectionParent1);
                    section.instruction = ISectionParent1;
                    console.log(sectionElement.dataset.pointFraction);
                    console.log(parent);
                    if (level === 1)
                        section.cumulativeFraction = parseFloat(sectionElement.dataset.pointFraction);
                }
                this.collectInstructions(section, sectionElement, section.sectionNumber, ISectionParent1);
                this.extractSectionsAndRubric(section, sectionElement, section.level + 1);
                if (h.className !== "nocount")
                    hc++;
            }
        }
    }
    /**
     * @brief extractSectionsAndRubricAll traverses the DOM and all nested <section> elements and all nested <ol.Instruction> <li> elements, constructing
     * a corresponding tree of Section objects and Instruction objects.
     **/
    extractSectionsAndRubricAll(totalPoints) {
        this.totalPoints = totalPoints;
        this.extractSectionsAndRubric(null, document.body, 1);
        /**
         *  compute points from fraction hierarchy
         */
        for (let instruction of this.instructions) {
            let fraction = 1.0;
            for (let p = instruction; p != null; p = p.parent)
                fraction = fraction * (p.pointFraction / 100.0);
            instruction.points = this.totalPoints * fraction;
        }
        console.log(this.instructions);
        console.log(Section.sections);
        this.displayRubric();
    }
    //console.log("instructions.length:"+instructions.length);
    /**
     * @brief generate the <tr> elements in the Rubric <table> of the active HTML document
     */
    displayRubric() {
        console.log("*************************************************");
        console.log("displayRubric() ");
        /*
         * construct <tbody> for <table> (#RubricTable) using instructions array and add
         * various <input> HTML elements to certain <table> columns
         */
        for (let osPair of OptionSet.optionSetByName) {
            const os = osPair[1];
            // append option suffix to instruction names.
            for (let o of os.options) {
                if (os.options.length === 1)
                    o.instruction.section += " - " + os.name + "";
                else
                    o.instruction.section += " - " + os.name + ": Opt. " + roman(o.optionIndex + 1, Roman.UPPER);
            }
        }
        let rubric = document.querySelector("#RubricTable > tbody");
        let prevSection = "";
        const REGEX = /Symbol\(([^)]*)\)/; // for removing Symbol sub-string
        let ri = 0;
        for (let instruction of this.instructions) {
            let parentOptionSet;
            /**
             * if instruction is child of an Category.OPTION_SET, handle <tr> differently
             */
            if (instruction.parent !== null && instruction.parent.category === Category.OPTION_SET)
                parentOptionSet = true;
            else
                parentOptionSet = false;
            /**
             *  In the innerText of the Instruction <li> HTML::Element's, insert display of points allocated to this Instruction in the
             */
            const iElement = document.getElementById(instruction.id);
            if (!parentOptionSet && iElement !== null) {
                const ptDiv = document.createElement("span");
                ptDiv.classList.add("Points");
                ptDiv.setAttribute('data-zxw-mvc', "dynamic-content-self");
                let points = instruction.points.toFixed(1);
                if (points.split('.')[1] === '0')
                    points = points.split('.')[0];
                else if (points.split('.')[0] === '0')
                    points = "." + points.split('.')[1];
                if (instruction.category === Category.COMPOSITE)
                    ptDiv.innerHTML = "[" + points + " pt]"; //ptDiv.innerHTML="[ &#x2211;" + points + " pt]";                        
                else
                    ptDiv.innerHTML = "[" + points + " pt]";
                if (iElement.firstElementChild instanceof HTMLSpanElement && iElement.firstElementChild.classList.contains("Instruction_Title")) {
                    ptDiv.innerHTML = "&nbsp;" + ptDiv.innerHTML;
                    iElement.firstElementChild.after(ptDiv);
                }
                else
                    //iElement.insertAdjacentHTML("afterbegin","|<sup>"+ptDiv.innerHTML + "</sup>| &nbsp;");
                    iElement.insertAdjacentHTML("afterbegin", "<span data-zxw-mvc='dynamic-content-self'>|<sup>" + ptDiv.innerHTML + "</sup>|</span>");
            }
            /**
             *   In the Rubric table, insert rows corresponding to all Instructions
             */
            let row = document.createElement("tr");
            row.setAttribute("data-ri", ri.toString()); // 'ri' abbr. 'rowIndex'
            let levelPrefix = ""; // string used to display ASCII art tree diagram
            let level = 0; // 'level' is the depth in the Instruction tree of 'instruction'
            // construct ASCII art tree diagram
            for (let i = instruction; i != null; i = i.parent) {
                if (level > 0) {
                    if (i.parent) {
                        let pi = i.parent.subSteps.findIndex((e) => e == i); // 'parentIndex'
                        if (pi < i.parent.subSteps.length - 1)
                            // current instruction parent is a child of the grandparent with further children, so at |
                            levelPrefix = "|&nbsp;&nbsp;&nbsp;&nbsp;" + levelPrefix;
                        else
                            levelPrefix = "&nbsp;&nbsp;&nbsp;&nbsp;" + levelPrefix;
                    }
                    else
                        levelPrefix = "&nbsp;&nbsp;&nbsp;&nbsp;" + levelPrefix;
                }
                level++;
            }
            if (instruction.parent !== null)
                levelPrefix += "|---";
            // add level info to <td> HTML element -- might be useful in future                
            row.setAttribute("data-level", level.toString());
            // pad pointFraction string representation to length of 4 using spaces
            let pf = instruction.pointFraction.toFixed(0); // abbr. 'pointFraction'
            let len = 4 - pf.length;
            for (let i = 0; i < len; i++)
                pf = "&nbsp" + pf;
            // pad point string representation to length of 4 using spaces
            let ps = instruction.points.toFixed(2); // abbr. 'pointString'
            len = 4 - ps.length;
            for (let i = 0; i < len; i++)
                ps = "&nbsp" + ps;
            // disable checkbox for instructions worth 0 points.                
            let disabled = "";
            if (parentOptionSet || instruction.points === 0.0)
                disabled = "disabled";
            // created row's HTML code                 
            if (instruction.section === prevSection)
                row.innerHTML =
                    `<td class="Empty"></td>`;
            else {
                //if (instruction.gui_checkbox)
                row.innerHTML =
                    `   <td>${instruction.section}</td>`;
            }
            row.innerHTML +=
                `<td>${instruction.number}</td>
                <td>${Category[instruction.category].toLowerCase()}</td>
                <td><a href="#${instruction.id}" onclick="BreadCrumb.onclick(this);">${instruction.short}</a></td>                 
                <td style='width:fit-content;'><span>${levelPrefix}</span>${pf}&percnt;</td>
                <td>
                <span>${levelPrefix}</span>${ps}
                    <span hidden class="Instructor_Mode" style="padding: 4px; border: solid 1px black">
                    <span><input type="checkbox" id="#CB_${instruction.id}" name="scales" ${disabled}></span>
                    <span style="margin-left:10px"> 0.00 
                </span>                        
                </td>                                                                        
                <td class="Instructor_Mode" hidden> <textarea rows='1'></textarea></td>`;
            //<td class="Instructor_Mode" hidden> <form><textarea rows='1'></textarea></form> </td>`;  
            // the form seems unnecessary given that this page is an 'static webpage'
            //<td class="Instructor_Mode" hidden> <input type="text"> </td>`;
            //<td class="Instructor_Mode" hidden> <form><textarea rows='1'></textarea></form> </td>
            //<td><span style="color:white; border : ${level!=0?'solid':'none'} 1px black;">${levelPrefix}</span>${instruction.pointFraction.toFixed(0)}&percnt;</td>
            //<td><div style="vertical-align: 2px; display : inline-block; color:white; border : ${level!=0?'solid':'none'} 1px black; height: 5px; width : ${level*25}px"></div>${instruction.pointFraction.toFixed(0)}&percnt;</td>
            /*
            <td><div style="vertical-align: 2px; display : inline-block; color:white; border : ${level!=0?'solid':'none'} 1px black; height: 5px; width : ${level*25}px"></div>${instruction.points.toFixed(2)}
                    <span hidden class="Instructor_Mode" style="padding: 4px; border: solid 1px black">
                        <span><input type="checkbox" id="#CB_${instruction.id}" name="scales" ${disabled}></span>
                        <span style="margin-left:10px"> 0.00 </span>
                    </span>
            </td>
            */
            const input = row.querySelector("input[type='checkbox']");
            input.addEventListener('change', (e) => { instruction.gui_checkbox(e.target); });
            prevSection = instruction.section;
            row.querySelector('textarea').addEventListener('change', (e) => {
                const ta = e.target;
                console.log(ta.value);
                ta.innerText = ta.value;
                /*
                const itemID = (<HTMLInputElement>(e.target)).parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('a').getAttribute('href');
                const rowIndex = parseInt((<HTMLInputElement>(e.target)).parentElement.parentElement.getAttribute("data-ri"));
                console.log(itemID.slice(1) + ":" + rowIndex + ":" + e);
                console.log(instructions.instructions[rowIndex]);
                instructions.instructions[rowIndex].comment = (<HTMLInputElement>(e.target)).value;
                */
            });
            /*
            row.querySelector('input[type="text"]').addEventListener('input',
                (e: Event) => {
                    const itemID = (<HTMLInputElement>(e.target)).parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('a').getAttribute('href');
                    const rowIndex = parseInt((<HTMLInputElement>(e.target)).parentElement.parentElement.getAttribute("data-ri"));
                    console.log(itemID.slice(1) + ":" + rowIndex + ":" + e);
                    console.log(instructions.instructions[rowIndex]);
                    instructions.instructions[rowIndex].comment = (<HTMLInputElement>(e.target)).value;
                });
            */
            rubric.append(row);
            ri++;
        }
        //let ttd = document.getElementById("Total");
        const tps = document.querySelectorAll("span[data-total-points]");
        for (let tp of tps)
            tp.innerText = this.totalPoints.toString();
        /************************************************************************************
         *  In the Rubric Awarded Points Table, add the generated Sequences
         *  [wip] 9/15/2023
         ************************************************************************************/
        const rapTable = document.getElementById("RubricAwardedPointsTable");
        const sequences0 = new Array(), sequences1 = new Array();
        const sequences = [sequences0, sequences1];
        let last = 0, next = 1;
        sequences[last];
        for (let osPair of OptionSet.optionSetByName) {
            const os = osPair[1];
            console.log(os);
            // construct and update the sequences
            sequences[next].length = 0;
            if (sequences[last].length === 0) {
                for (let so of os.options) {
                    const se = new Sequence();
                    se.sections.push(so);
                    try {
                        //console.assert(so.instruction !== undefined);
                        se.totalPoints += so.instruction.points;
                    }
                    catch (e) {
                        throw e;
                    }
                    se.totalPoints += so.instruction.points;
                    sequences[next].push(se);
                }
                console.log(sequences[next]);
            }
            else
                for (let i = 0; i < sequences[last].length; i++) {
                    for (let so of os.options) {
                        const se = new Sequence();
                        se.sections = Array.from(sequences[last][i].sections);
                        se.sections.push(so);
                        sequences[next].push(se);
                    }
                    console.log(sequences[next]);
                }
            [last, next] = [next, last];
        }
        let sequenceFraction = 1.0;
        for (let s of sequences[last]) {
            const tbody = rapTable.querySelector(":scope tbody");
            const tr = document.createElement('tr');
            tbody.appendChild(tr);
            let innerHTML = "";
            innerHTML = "<td>";
            let si = 0;
            let sequenceFraction = 0;
            for (let se of s.sections) {
                innerHTML += `${se.optionSet?.name}` + (se.optionSet.options.length === 1 ? "" : `-${roman(se.optionIndex + 1, Roman.UPPER)}`) + ", ";
                sequenceFraction += se.cumulativeFraction;
                si++;
            }
            innerHTML += "</td>";
            //innerHTML +=`<td><input type="checkbox" disabled></input></td>`;
            innerHTML += `<td>${(sequenceFraction / 100 * this.totalPoints).toFixed(2)}</td><td></td>`;
            tr.innerHTML = innerHTML;
        }
    }
}
export const instructions = new Instructions();
/**
 **
 **  INTERNAL FUNCTIONS
 **
 */
/**
 * @brief convert list (an array) of item numbers for a set of nested items into a string using the convention of
 *                    [Decimal Number] . [Lower Case Letter] . [Lower Case Roman Numeral]
 * @param args
 * @returns string
 */
function itemString(...args) {
    const aCode = "a".charCodeAt(0);
    switch (arguments.length) {
        case 1:
            return args[0].toString();
        case 2:
            return args[0].toString() + "." + String.fromCharCode(aCode + args[1] - 1);
        case 3:
            return args[0].toString() + "." + String.fromCharCode(aCode + args[1] - 1) + "." + roman(args[2]);
        case 4:
            return args[0].toString() + "." + String.fromCharCode(aCode + args[1] - 1) + "." + roman(args[2]) + "." + args[3].toString();
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
const ROMAN_SYMBOL = new Array("m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i");
var Roman;
(function (Roman) {
    Roman[Roman["UPPER"] = 0] = "UPPER";
    Roman[Roman["LOWER"] = 1] = "LOWER";
})(Roman || (Roman = {}));
;
function roman(n, r = Roman.LOWER) {
    let str = "";
    for (let i = 0; i < 13; i++) {
        const v = ROMAN_VALUE[i];
        let q = Math.floor(n / v);
        n -= q * v;
        const rs = r === Roman.LOWER ? ROMAN_SYMBOL[i] : ROMAN_SYMBOL[i].toUpperCase();
        str += rs.repeat(q);
    }
    return str;
}
//# sourceMappingURL=Rubric.js.map