/**
 * \author Zachary Wartell
 * \copyright Copyright 2015. Zachary Wartell.
 * \license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 - http://creativecommons.org/licenses/by-nc-sa/4.0/

 \status [STATUS=not deployed] work-in-progress
 */
import "./third-party/jquery-3.5.1.min.js";
import * as Rubric from "./Rubric.js";
import { Instruction } from "./Rubric.js";
/**
 ** \brief AssignmentName contains various components used to describe the name/tile of the instruction's assignment.
 *
 *  These is are set the HTMLElement.innerText of various <span> elements which are distinguished by their having a number of special data- attributes.
 **/
export class AssignmentName {
    constructor(div) {
        this.courseNumber = div.children[0].innerText;
        this.number = div.children[1].innerText;
        this.numberLongDir = div.children[2].innerText;
        this.name = div.children[3].innerText;
        this.git = this.courseNumber + "-" + this.numberLongDir;
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
/*  \author Zachary Wartell
 *  \brief toggle the "hidden" attribute of all elements of class "Class"
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
    if (window.showSaveFilePicker === undefined)
        //throw "Browser does not support window.showSaveFilePicker";
        alert("Browser does not support window.showSaveFilePicker");
}
export function main() {
    apiCheck();
    /**
     **   Setup Toolbar
     **/
    /*
     *  add eventListners the close SubMenu on mouseleave
     */
    let nl = document.querySelectorAll("ul.SubMenu");
    nl.forEach((n) => {
        n.addEventListener('mouseleave', (e) => {
            e.target.hidden = true;
        });
    });
    let input;
    /*
    *  Menu#File Download button
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
    */
    input = document.getElementById("save");
    input.addEventListener('click', (e) => {
        const options = {
            types: [
                {
                    description: 'json files',
                    accept: {
                        'text/json': ['.json'],
                    },
                },
            ],
        };
        window.showSaveFilePicker(options).
            then((handle) => {
            console.log("Save " + handle);
            //return writeFile(handle,document.getElementById("RubricTable").outerHTML);
            return writeFile(handle, JSON.stringify(Rubric.instructions));
        }).
            catch((e) => { throw e; });
        e.target.parentElement.parentElement.hidden = true;
    });
    /*
    *  Menu#File Download button
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
    */
    input = document.getElementById("exportAll");
    input.addEventListener("click", (e) => {
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
    input = document.getElementById("back");
    input.addEventListener('click', (e) => {
        console.log("back", window.history.state);
        if (false) {
            window.history.scrollRestoration = "auto";
            window.history.go(-1);
        }
        else {
            Rubric.BreadCrumbs.singleton.array[Rubric.BreadCrumbs.singleton.array.length - 1].target.scrollIntoView(true);
        }
    });
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
    onload();
}
export function onload() {
    /**
     ** Initialize misc. content to reflect the current assignment's name, directory names, etc.
     **/
    const assignmentName = new AssignmentName(document.getElementById("AssignmentName"));
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
     **  \todo [PRIORITY=AS_NEEDED][GENERALIZE] Generalize for cases of multiple embedded video's
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
     ***  Initialize <table id="RubricTable">
     **/
    //init_rubric();
    Rubric.instructions.extractSectionsAndRubricAll();
    Rubric.Section.displayTableOfContents();
    //Rubric.main();
}
//# sourceMappingURL=ClassAssignmentWartell.js.map