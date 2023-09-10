/*
* @author Zachary Wartell
*/

/* 
 *   Toggle a Code_Example table between scrolled presentation and expanded presentation
 *   @param {String} - ID HTML Element ID of table
 */
function Code_Example_Toggle(ID)
{
    document.getElementById(ID).classList.toggle('Code_Example_Expand');
}

/* 
 *   Toggle a Code_Example table between scrolled presentation and expanded presentation
 *   @param {String} - ID HTML Element ID of table
 */
function Scroll_Into_View(ID)
{
    let e = document.getElementById(ID);
    if (e !== null) 
        e.scrollIntoView();
}

function windowOpenLeft(url,name)
{
    let s1='',s2='';
    let left=0;
    left=window.screenLeft+window.outerWidth; 
    s2=s1.concat('left=',left,',top=100,width=',window.outerWidth.toString(),',height=',window.outerHeight.toString() ); 
    //alert(s2);
    window.open(url,name,s2);
}
