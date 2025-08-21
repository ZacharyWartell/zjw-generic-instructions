/**
 * @author Zachary Wartell
 * @copyright Copyright 2015. Zachary Wartell.
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 - http://creativecommons.org/licenses/by-nc-sa/4.0/

 \status [STATUS=not deployed] work-in-progress
 */
import * as ZxW_GUI from "ZxW_GUI";
import * as ZxW_Toolbar from "ZxW_Toolbar";
import * as ZxW_Annotation from "ZxW_Annotation";
import * as ZxW_TextEditor from "ZxW_TextEditor";
//import "./third-party/jquery-3.5.1.min.js";
import * as Rubric from "./Rubric.js";
//import {cssNumber} from "./third-party/jquery-3.5.1.min.js";
import { Instruction } from "./Rubric.js";
class App extends ZxW_GUI.DefaultApplication {
    constructor() {
        super();
    }
    postUserDocumentLoadCallback() {
    }
}
let app;
/**
 ** @brief AssignmentName contains various components used to describe the name/tile of the instruction's assignment.
 *
 *  These is are set the HTMLElement.innerText of various <span> elements which are distinguished by their having a number of special data- attributes.
 **/
export class AssignmentName {
    constructor(ele) {
        if (ele instanceof HTMLDivElement) {
            const div = ele;
            this.courseNumber = div.children[0].innerText;
            this.number = div.children[1].innerText;
            this.numberLongDir = div.children[2].innerText;
            this.name = div.children[3].innerText;
        }
        else if (ele instanceof HTMLScriptElement) {
            const script = ele;
            const jsonObject = JSON.parse(script.innerText);
            this.courseNumber = jsonObject.AssignmentName.courseNumber;
            this.number = jsonObject.AssignmentName.number;
            this.numberLongDir = jsonObject.AssignmentName.numberLongDir;
            this.name = jsonObject.AssignmentName.name;
        }
        this.git = this.numberLongDir;
    }
    insertText(doc) {
        let elements = doc.querySelectorAll('span[data-course-number]');
        for (let e of elements) {
            e.innerText = this.courseNumber;
        }
        elements = doc.querySelectorAll('span[data-project-number]');
        for (let e of elements) {
            e.innerText = this.number;
        }
        elements = doc.querySelectorAll('span[data-project-number-long-dir]');
        for (let e of elements) {
            e.innerText = this.numberLongDir;
        }
        elements = doc.querySelectorAll('span[data-project-name-dir]');
        for (let e of elements) {
            e.innerText = this.name;
        }
        elements = doc.querySelectorAll('span[data-project-number-name-dir]');
        for (let e of elements) {
            e.innerText = this.number + "-" + this.name;
        }
        elements = doc.querySelectorAll('span[data-project-git]');
        for (let e of elements) {
            e.innerText = this.git;
        }
        /*
        *  remove DataField:before contents now that data text is inserted
        */
        elements = doc.querySelectorAll('span.DataField');
        elements = doc.querySelectorAll('span.DataField');
        for (let e of elements) {
            e.setAttribute("class", "");
        }
    }
}
/**
 *  @author Zachary Wartell
 *  @brief toggle the "hidden" attribute of all elements of class "Class"
 *  @param {String} - name of class
 */
export function Visibility_Toggle(Class, visible) {
    const list = document.querySelectorAll("." + Class);
    for (let n of list) {
        const el = n;
        /*
        if (list[i].previousElementSibling === null ||
            list[i].previousElementSibling.tagName !== "BUTTON" ||
            list[i].previousElementSibling.className !== "Div_Toggle_Button"
           )
        {// Hide button wasn't created yet, so insert it
          var unhideButton = document.createElement("BUTTON");
          unhideButton.className = "Div_Toggle_Button";
          unhideButton.setAttribute("style", "text-align:center;");
          unhideButton.setAttribute("onclick", "Div_Toggle (" + '"' + Class + '"' + ")");
          unhideButton.textContent = "Unhide ... ";
          list[i].parentElement.insertBefore(unhideButton, list[i]);
        }
          */
        el.hidden = !visible;
        /*
        if (!list[i].hasAttribute("hidden"))
        {// hide div and show Unhide button
            // enable the unhide button
            //list[i].previousElementSibling.textContent = "Unhide";

            // hide this div
            list[i].setAttribute("hidden", "true");
        }
        else
        {// unhide div and show Hide button
            list[i].removeAttribute("hidden");
            //list[i].previousElementSibling.setAttribute("hidden","true");
            //list[i].previousElementSibling.textContent = "Hide";
        }
        */
    }
}
/*
https://web.dev/file-system-access/
*/
async function writeFile(fileHandle, contents) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}
function apiCheck() {
    // https://web.dev/file-system-access/
    // ZJW: 8/20/2025: I'm silencing this warning for now, since it's only relevant to the zxw-doc editors and not the students reading the
    //   the instruction zxw-doc.html page
    /*
    if ((<any>window).showSaveFilePicker === undefined)
        //throw "Browser does not support window.showSaveFilePicker";
        alert("Browser does not support window.showSaveFilePicker");
    */
}
/**
 * @status   [experimental , deployed only in 'Beta' mode]
 *
 * @brief See USAGE
 *
 * Notes:   From what I have read it is not possible to use the ?body= query parameter to pass html code that will be displayed as rendered HTML
 * Other more complex mechanisms would be needed to get the users selection from the HTML document to be auto-inserted at HTML into an email.
 * Doing perfectly would not be really possible because you would have to pull the CSS stylesheets as well.
 */
const USAGE = `
    Left-clicking on part of the assignment document opens a new browser tab composing a email via the UNCC account active in that browser.
    The email is addressed to computer-graphics-wartell-group@uncc.edu.  The body is pre-filled with a WWW hyperlink to the inner most Instruction item
    on whihc you clicked and a brief bit of the surrounding text in the document where you clicked:

    Add your question about selected part of the assignment to the email's text and send.
`;
export function QandAModeClick(e) {
    if (e.button === 0) {
        const target = e.target;
        console.log(`
            ${e.target}
            `);
        console.log(e.target);
        if (0)
            for (let p = e.target; p !== document.body; p = p.parentElement) {
                //if (p is HTMLLIElement && p.classList.contains("Instruction") )
                if (p.classList.contains("Instruction_Todo") ||
                    p.classList.contains("Instruction_Read") ||
                    p.classList.contains("Instruction_Git_Commit") ||
                    p.classList.contains("Instruction_Question") ||
                    p.classList.contains("Instruction_Section")) {
                    console.log(p);
                    let id = p.getAttribute('id');
                    console.log(id);
                    if (id !== null)
                        id = "#" + id;
                    else
                        id = "";
                    const body = encodeURIComponent("At " + window.location.toString().split("#")[0] + id + ":" +
                        "\n-----------------------------------------------------------------\n" +
                        p.innerText +
                        "\n-----------------------------------------------------------------\n");
                    let short = window.location.toString();
                    let count = 0;
                    let i = short.length - 1;
                    for (; i >= 0 && count != 2; i--)
                        if (short[i] === '/')
                            count++;
                    short = short.substring(i + 2).split("#")[0];
                    const subject = encodeURIComponent("Question: " + assignmentName.name + " | " + short + "#" + id);
                    console.log(body);
                    window.open("https://mail.google.com/mail/?view=cm&to=computer-graphics-wartell-group@uncc.edu&su=" + subject + "&body=" + body, "_blank");
                    break;
                }
            }
        else {
            const p = QandAModeTarget;
            console.log(p);
            let id = p.getAttribute('id');
            console.log(id);
            if (id !== null)
                id = "#" + id;
            else
                id = "";
            const body = encodeURIComponent("At " + window.location.toString().split("#")[0] + id + ":" +
                "\n-----------------------------------------------------------------\n" +
                p.innerText +
                "\n-----------------------------------------------------------------\n");
            let short = window.location.toString();
            let count = 0;
            let i = short.length - 1;
            for (; i >= 0 && count != 2; i--)
                if (short[i] === '/')
                    count++;
            short = short.substring(i + 2).split("#")[0];
            const subject = encodeURIComponent("Question: " + assignmentName.name + " | " + short + "#" + id);
            console.log(body);
            window.open("https://mail.google.com/mail/?view=cm&to=computer-graphics-wartell-group@uncc.edu&su=" + subject + "&body=" + body, "_blank");
        }
    }
    document.body.removeEventListener('mousedown', QandAModeClick);
    document.body.removeEventListener('mouseover', QandAModeHover);
}
/**
 * The last HTMLElement that was sslected in Q&A Mode
 */
var QandAModeTarget = null;
export function QandAModeHover(e) {
    const target = e.target;
    console.log(`
        ${e.target}
        `);
    console.log(e.target);
    /**
     * favor selections of inner mode Instruction item , if found
     */
    let p;
    for (p = e.target; p !== document.body; p = p.parentElement) {
        //if (p is HTMLLIElement && p.classList.contains("Instruction") )
        if (p.classList.contains("Instruction_Todo") ||
            p.classList.contains("Instruction_Read") ||
            p.classList.contains("Instruction_Git_Commit") ||
            p.classList.contains("Instruction_Question") ||
            p.classList.contains("Instruction_Composite")
        /*|| p.classList.contains("Instruction_Section")*/ ) {
            if (QandAModeTarget !== null)
                QandAModeTarget.removeAttribute('style');
            p.setAttribute('style', 'background-color : yellow');
            p.addEventListener('mouseleave', (e) => { e.target.removeAttribute('style'); });
            QandAModeTarget = p;
            break;
        }
    }
    /**
     * if no inner mode Instruction item, favor the inner most general HTMLElement
     * \todo
     */
    if (p === document.body) {
        if (QandAModeTarget !== null)
            QandAModeTarget.removeAttribute('style');
        p = e.target;
        p.setAttribute('style', 'background-color : yellow');
        p.addEventListener('mouseleave', (e) => { e.target.removeAttribute('style'); });
        QandAModeTarget = p;
    }
}
/**
 * @brief Enable scrollIntoView behavior for browser forward/back buttons
 */
function scrollIntoViewNavigation() {
    if (true)
        window.addEventListener("popstate", (event) => {
            //alert(
            //  `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
            //);
            const s = document.location.toString().split('#');
            if (s.length == 2) {
                console.log(s[1]);
                const id = document.getElementById(s[1]);
                console.log("id:", id);
                if (id !== null)
                    id.scrollIntoView();
                else {
                    const mc = document.querySelector("article");
                    console.log("mc 1:" + mc);
                    mc.scrollIntoView();
                }
            }
            else {
                const mc = document.querySelector("article");
                console.log("mc 2:" + mc + mc.classList);
                //mc.scrollIntoView({ behavior: "instant", block: "start" });
                const scrollToOptions = { behavior: "instant", block: "start" };
                mc.scrollIntoView(scrollToOptions);
            }
            console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
        });
}
export async function main(totalPoints) {
    apiCheck();
    scrollIntoViewNavigation();
    /**
     ** init zxw-mvc
     **/
    ZxW_GUI.init();
    app = new App();
    const toolbar = new ZxW_Toolbar.Toolbar(null, app, null, { includedMenubarItems: ["help"], useUserGuideFile: true });
    ZxW_Annotation.main(toolbar);
    ZxW_TextEditor.main(toolbar);
    /**
     *  insert zjwgi menu tab into zxw-mvc menu tab bar
     */
    const tabPanel1 = document.createElement('div', { is: 'tab-panel' }); //new ZxW_GUI.TabPanel();
    const tabIndex1 = document.createElement('button', { is: 'tab-index' }); //new ZxW_GUI.TabPanel();
    //const tabIndex = <ZxW_TabContainer.TabIndex>tb.tabContainer.appendChild(tabPanel1);
    const tps = toolbar.tabContainer.querySelector(':scope div.TabPanels');
    const tis = toolbar.tabContainer.querySelector(':scope div.TabIndexes');
    //(<HTMLElement>tis!.firstElementChild).innerText="Edit"; // rename from 'File' to 'Edit'        
    tis.insertBefore(tabIndex1, tis.firstElementChild);
    tps.firstElementChild.deactivateTabPanel();
    tps.insertBefore(tabPanel1, tps.firstElementChild);
    tabIndex1.innerText = "Project";
    toolbar.tabContainer.createEventListeners();
    let div = document.getElementById("Toolbar");
    tabPanel1.appendChild(div);
    /**
     **   Setup Toolbar
     **/
    /*
    Notes:
        https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
    */
    let button = document.getElementById("Question");
    button.addEventListener('click', (e) => {
        /*
        \todo change mouse cursor to indicate 'question' mode
        \todo add mouee hover to highlight the inner most instruction section being queried
         */
        document.body.addEventListener('mousedown', QandAModeClick);
        document.body.addEventListener('mouseover', QandAModeHover);
    });
    let input = document.getElementById("Beta_Mode");
    input.addEventListener('change', (e) => {
        let list = document.querySelectorAll('div#BetaModeGUI button, div#BetaModeGUI input');
        for (let l of list)
            if (!input.checked)
                l.setAttribute('disabled', '');
            else
                l.removeAttribute('disabled');
    });
    document.getElementById("Instructor_Mode").addEventListener('change', (e) => {
        const target = e.target;
        Visibility_Toggle('Instructor_Mode', target.checked);
        Visibility_Toggle('Staff_Only', target.checked);
        document.getElementById("fileMenu").disabled = !target.checked;
    });
    /*
     *  add eventListners the close SubMenu on mouseleave
     */
    let nl = document.querySelectorAll("ul.SubMenu");
    nl.forEach((n) => {
        n.addEventListener('mouseleave', (e) => {
            e.target.hidden = true;
        });
    });
    button;
    /*
    *  Menu#File Download button
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
    */
    /**
     *   Implement callback for "Export" button that exports Rubric as HTML file
     */
    button = document.getElementById("Export");
    button.addEventListener('click', (e) => {
        const options = {
            types: [
                /*
                {
                    description: 'json files',
                    accept: {
                        'text/json': ['.json'],
                    },
                },
                */
                {
                    description: 'html files',
                    accept: {
                        'text/html': ['.html'],
                    },
                }
            ],
        };
        window.showSaveFilePicker(options).
            then((handle) => {
            console.log("Save " + handle);
            /* hack: subfix - check boxes are being check even on 0.00 values in export
            */
            /* does fix problem
            const fixList = document.getElementById("Div_Rubric")?.querySelectorAll('span');
            let fixArray=[];
            fixList.forEach((a,b,o)=>{fixArray.push(a);});
            fixArray.filter((e) => e.innerText=="0.00").forEach((a,b,c)=> {
                if (a.previousElementSibling && a.previousElementSibling.previousElementSibling && a.previousElementSibling.previousElementSibling.firstChild) {
                    a?.previousElementSibling?.previousElementSibling?.firstElementChild?.removeAttribute("checked");
                }
            })
            */
            return writeFile(handle, `<!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                            table {
                                border: solid 2px black;
                                border-collapse: collapse;
                                width: fit-content;
                                }
                            td {
                                border: solid 1px;                                
                                }
                            </style>
                            <script>
                                function main()
                                {
                                    const fixList = document.getElementById("Div_Rubric")?.querySelectorAll('span');
                                    let fixArray=[];
                                    fixList.forEach((a,b,o)=>{fixArray.push(a);});
                                    fixArray.filter((e) => e.innerText=="0.00").forEach(
                                        (a,b,c)=> {
                                            //if (a.previousElementSibling && a.previousElementSibling.previousElementSibling && a.previousElementSibling.previousElementSibling.firstChild)                                     
                                            a?.previousElementSibling?.firstElementChild?.removeAttribute("checked");                                    
                                        });
                                }
                                window.main = main;                                
                            </script>
                        </head>
                        <body onload="main();">                        
                        
                        ${document.getElementById("Div_Rubric").outerHTML}
                        </body>
                        </html>
                        `);
            //return writeFile(handle,JSON.stringify(Rubric.instructions));
        }).
            catch((e) => { alert(e); throw e; });
        e.target.parentElement.parentElement.hidden = true;
    });
    /**
     * Implement callback for "ExportAll" button that exports Rubric as HTML file
     *
     * \todo I have forgotten what "ExportAll" was supposed to do
     *
     * - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files
     * - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
     */
    button = document.getElementById("exportAll");
    if (button === null)
        throw "button with id 'exportAll' not found";
    button.addEventListener("click", (e) => {
        try {
            let htmlOut = "";
            const scs = document.querySelectorAll(`div.SlideContainer`);
            scs.forEach((sc) => { htmlOut += sc.outerHTML; });
            const a = document.createElement("a");
            document.body.appendChild(a);
            const url = URL.createObjectURL(new Blob([htmlOut], { type: 'plain/text' }));
            a.href = url;
            a.download = "zjw-Inst.instructions.bak.html";
            a.click();
            document.body.removeChild(a);
            e.target.parentElement.parentElement.hidden = true;
        }
        catch (err) {
            throw err;
        }
    });
    /**
     *  Implement callback for "back" button that uses the BreadCrumbs history for fined grained navigation than
     *  the standard browser back button.
     */
    button = document.getElementById("back");
    if (button !== null)
        button.addEventListener('click', (e) => {
            console.log("back", window.history.state);
            if (false) {
                window.history.scrollRestoration = "auto";
                window.history.go(-1);
            }
            else {
                Rubric.BreadCrumbs.singleton.array[Rubric.BreadCrumbs.singleton.array.length - 1].target.scrollIntoView(true);
            }
        });
    /**
     *  Implement callback for "loadFile" button that loads an external Rubric file into the current Rubric <table>
     *  for further editing of that rubric file.   (assumption is that the file is associated with a particular student, etc.)
     */
    const inputFile = document.getElementById("loadFile");
    inputFile.addEventListener('change', (e) => {
        const reader = new FileReader();
        //const captureThis = this;
        /*
         must be 'loadend' on mobile phone 'load' event triggers multiple times for large files
         */
        reader.addEventListener('loadend', (event) => {
            /**
             * Load the Inst.instructions.content Html Fragment into DOM
             *
             * - https://developer.mozilla.org/en-US/docs/Web/API/Window/frames
             */
            const instructions = Array(JSON.parse(event.target.result.toString()));
            Rubric.instructions.instructions.splice(0);
            for (let ji of instructions) {
                const i = new Instruction();
                i.assign(ji);
                Rubric.instructions.push(i);
            }
            /**
             * Update JS Objects
             */
            Rubric.instructions.displayRubric();
            //init_rubric();
            //onload_InstructionsFile();
        });
        reader.readAsText(e.target.files[0]);
        //console.log((<HTMLInputElement>e.currentTarget).value);
        /*
        slides.loadFile((<HTMLInputElement>e.target).files[0]);
        (<HTMLElement>e.target).parentElement.parentElement.hidden = true;
        */
    });
    /*
     *   Use XHR to load Chapter4.html
     *   \todo extend to allow user to choose a chapter available from the server
     *
     *  - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
     *  - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/HTML_in_XMLHttpRequest
     */
    //slides.url = "Chapter5.html";
    // 4/11: keep for potential load from server file system (will require more work on the code below)
    /*
    let xhr = new XMLHttpRequest();

    xhr.onload = function ()
    {
        console.log(this.responseXML);
        const sw=document.querySelector("section.SlidesWindow");
        const xhr_scs = this.responseXML.body.querySelectorAll("div.SlideContainer");
        xhr_scs.forEach(
            (e)=>
            {
                sw.appendChild(e);
                slides.slides.push(new SP.Slide(<HTMLElement>e));
            });
        const scs = document.querySelectorAll("div.SlideContainer");
        slides.count = slides.htmlCount = scs.length;

    };
    let url = window.location.href;
    const name = "ITCS 5121/ITCS 5121 - IVPD - Chapter 6.html";
    // handle fact that url comes uot differently when testing on localhost versus reomte browser
    if (url[url.length-1]==='/')
        url += name;//slides.url);
    else
        url = url.replace('index.html',name);
    console.log(url);
    xhr.open("GET", url);
    xhr.responseType = "document";
    xhr.send();
     */
    /**
     *
     */
    while (document.readyState === "interactive" || document.readyState === "loading") {
        console.log("waiting for document to be ready");
        // wait for the document to be ready
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
    }
    // let c : bigint = Atomics.load(app.zxwMvcFetchElementLoadCount,0)
    // while (c == BigInt(-1) || c > 0)
    //     c = Atomics.load(app.zxwMvcFetchElementLoadCount,0)
    // {        
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     console.log("waiting for document to be ready");
    // }
    /**
     *  finish initialization the DOM inserting computer point annotations, creating the Rubric table, etc.
     */
    onload(totalPoints);
    return;
    /**
     * trick below weren't good enough, because neither  <object> nor <embed> element is not accessible by DOM operations, so it can't be found to add event listeners to it's elements (AFAIK)
     */
    // this is needed since the .html includes some <object> elements that need to be loaded before the document is ready
    while (document.readyState === "interactive" || document.readyState === "loading") {
        console.log("waiting for document to be ready");
        // wait for the document to be ready
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
    }
    // document.addEventListener("readystatechange", (event) => {
    //     const  target : HTMLDocument | null = <HTMLDocument>event.target;
    //     if (target != null && target.readyState === "interactive")
    //         onload(totalPoints);  
    //     });    
}
/**
 * @brief Git_Commit_Message collection of method used for span.Git_Commit_Message elements
 */
class Git_Commit_Message {
    static copyToClipboard(e) {
        const b = e.currentTarget;
        //console.log(b.previousElementSibling?.innerText);
        navigator.clipboard.writeText((b.parentElement?.previousElementSibling).innerText);
        if (b.nextElementSibling !== null)
            b.nextElementSibling.style.display = 'block';
        setTimeout(() => { b.nextElementSibling.style.display = 'none'; }, 2000);
    }
}
let assignmentName;
export function onload(totalPoints) {
    /**
     ** Initialize misc. content to reflect the current assignment's name, directory names, etc.
     **/
    assignmentName = new AssignmentName(document.getElementById("AssignmentName"));
    assignmentName.insertText(document);
    /**
     ** Hide Staff_Only sections
     */
    let elements = document.querySelectorAll('.Staff_Only');
    for (let e of elements) {
        e.hidden = true;
    }
    /**
     ** Hide Staff_Only sections
     */
    elements = document.querySelectorAll('table.Code_Example button');
    for (let e of elements) {
        e.addEventListener('click', (e) => {
            const el = e.target;
            el.parentElement.parentElement.parentElement.parentElement.classList.toggle('Code_Example_Expand');
        });
    }
    /**
     **  Create video cue buttons
     *
     **  @todo [PRIORITY=AS_NEEDED][GENERALIZE] Generalize for cases of multiple embedded video's
     **/
    elements = document.querySelectorAll('span.VideoCue');
    for (let n of elements) {
        const e = n;
        // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
        const videoCue = Function('"use strict";return (' + e.dataset.videoCue + ')')();
        const button = document.createElement("button");
        button.addEventListener('click', (e) => {
            const cclv = document.getElementById(videoCue.videoID);
            console.log(videoCue.interval[0]);
            cclv.currentTime = videoCue.interval[0];
            cclv.play();
            const timeupdate = (e) => {
                const target = e.target;
                console.log("currentTime:" + target.currentTime);
                if (target.currentTime >= videoCue.interval[1]) {
                    target.pause();
                    target.removeEventListener('timeupdate', timeupdate);
                }
            };
            cclv.addEventListener('timeupdate', timeupdate);
        });
        //const cclv = document.getElementById(videoCue.videoID);
        button.innerHTML = "&trianglerighteq;";
        e.after(button);
    }
    /**
     *   insert the <ins> element datetime attribute info into the associate span.Updated_Text_Popup_Note innerText
     */
    elements = document.querySelectorAll('span.Updated_Text_Popup_Note');
    for (let e of elements) {
        if (e.parentElement !== null && e.parentElement.getAttribute('datetime') != null)
            e.innerHTML = "&nwArr;<b>" + e.parentElement.getAttribute('datetime') + ":</b>  " + e.innerText;
    }
    /**
     *  insert "copy to clipboard" button after span.Git_Commit_Message elements.
     */
    elements = document.querySelectorAll('span.Git_Commit_Message');
    for (let e of elements) {
        const div = document.createElement('div');
        const b = document.createElement('button');
        const img = document.createElement('img');
        const msg = document.createElement('span');
        e.after(div);
        div.setAttribute('class', 'CopiedToClipboardPopup');
        div.appendChild(b);
        b.style.padding = '0';
        b.appendChild(img);
        b.addEventListener('click', Git_Commit_Message.copyToClipboard);
        // https://www.iconfinder.com/icons/7124212/copy_clipboard_icon
        img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAkJJREFUOE+t1E9IFHEUB/Dv+42klXXRLgYGHSJog46dag/9YWcLSv1tF2+lzhoI0S0EN6KITnZxd1g7SVD+zARzZqtDrQTeLSuCoEOREGHBUtbu/F78QmV3239Rc3nMmzefeb/fvBnCfz6olmef6dtDgQgBwgoo+LgNKwtKqaDWPVXBSI9zEeAbRCSKgOxWfD6mlPpZDS0BT3b37w2EcEDogMYpJl4CcF2w0AAfZUIfA/NE/FYwzT5Qqfvl8AZ4QvZ3aqbnINq+XsSk77TySq9ZZrQnLpl4shgg8Lk55d4qza2d2TFnCIybxNw9N+VOR+RAhkDHyzr4ykEh1MLN31et4DURv/KUe6gamABjhMH7fOW+lPLC5m+0OqQRHCAIi8EfiHTSu5t+Y4CoHHhh4pxyQw2B9abpn8BwONG0ZcfyFYCznnIz5mER6WRN9FXq8F91aLCW9uXbghBj4KqvUsMGCMvBVhOfqrFcw2AxRqBnLApnKd9UKAaEledZNf4OAJv8xtjYMafkpawtK07AWL39ZGDQV6lkXdDuOr+LrWCegE5ALzKT/wdO4geCfNqfHn9fF/w9Hl3x3driJwB2WoCs9HU0vIfrhQZl4kcgTHhTqcsmb8fi10z0JpOXKoM9zggIifXBrrdvtnSWGKx95e6vCEZj8V5mniBGGqDHtUBN3A5glMCep9zTFUEp5aYc2h4SEK7X3dr1T1rTkcy95GJF0CSllFaO2g4KTR01OwRyzYXmhZmZ0S/ldTX/2A12WlL2C0ahKCSti4+MAAAAAElFTkSuQmCC');
        msg.setAttribute('class', 'CopiedToClipboardPopup');
        msg.setAttribute('role', 'alert');
        msg.innerText = "Copied to Clipboard";
        b.after(msg);
    }
    /**
     * @brief For all <figure class="Screen_Capture">, add focus and focusout event listeners to all <figure> elements
     * which zooms the figure from it's original present size to full width of the parent element
     *
     * ZJW: I investigated using CSS alone to do this, but I did not find a way to do it.
     */
    const focus = (ev) => {
        const target = ev.target;
        if (target.tagName === "FIGURE") {
            const parentWidth = window.getComputedStyle(target.parentElement).width;
            const targetStyle = window.getComputedStyle(target);
            const targetWidth = targetStyle.width;
            const targetLeft = targetStyle.left;
            const targetBLW = targetStyle.borderLeftWidth;
            const targetML = targetStyle.marginLeft;
            const targetPL = targetStyle.paddingLeft;
            const sx = parseFloat(parentWidth) / parseFloat(targetWidth);
            const tx = (parseFloat(parentWidth) / 2) - (parseFloat(targetLeft) + parseFloat(targetBLW) + parseFloat(targetPL) + parseFloat(targetML) + parseFloat(targetWidth) / 2);
            //target.style.transform = `scale(${sx}) translate(${tx}px,0)`;
            target.style.transform = `translate(${tx}px,0px) scale(${sx})`;
            //target.style.transform = `scale(${sx})`;
        }
    };
    const focusout = (ev) => {
        const target = ev.target;
        if (target.tagName === "FIGURE") {
            target.style.transform = "";
        }
    };
    elements = document.querySelectorAll('figure.Screen_Capture');
    for (let e of elements) {
        e.addEventListener('focus', focus);
        e.addEventListener('focusout', focusout);
    }
    /**
     *  Initialize <table id="RubricTable">
     */
    //init_rubric();
    Rubric.instructions.extractSectionsAndRubricAll(totalPoints);
    Rubric.Section.displayTableOfContents();
    //Rubric.main();
}
//# sourceMappingURL=ClassAssignmentWartell.js.map