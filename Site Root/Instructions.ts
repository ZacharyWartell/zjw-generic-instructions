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
}
export const instructions = new Instructions();
