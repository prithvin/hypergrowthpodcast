var garbageBin;

if (typeof(garbageBin) === 'undefined') {
    //Here we are creating a 'garbage bin' object to temporarily 
    //store elements that are to be discarded
    garbageBin = document.createElement('div');
    garbageBin.style.display = 'none'; //Make sure it is not displayed
    document.body.appendChild(garbageBin);
}
function discardElement(element)
{
//The way this works is due to the phenomenon whereby child nodes
//of an object with it's innerHTML emptied are removed from memory

//Move the element to the garbage bin element
garbageBin.appendChild(element);
//Empty the garbage bin
garbageBin.innerHTML = "";
}