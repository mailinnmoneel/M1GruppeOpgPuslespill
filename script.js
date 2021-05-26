var heldObject;
var isHoldingObject;

var boxWidth = 800;
var boxHeight = 600;

var puzzleBox;
var puzzleBoxWidth;

var info;

var puzzlePieces = [];
var _1_1;
var _1_2;

// Setter opp variabler og henter referanse til elementer
function init()
{
    document.addEventListener('mousemove', getMousePosition, true);

    info = document.getElementById("info");
    puzzleBox = document.getElementById("brikkeboks");

    puzzleBox.style.width = getPixels(boxWidth);
    puzzleBox.style.height = getPixels(boxHeight);

    // Referanse til alle elementene. Kan gjøres bedre men tar det kjapt for å kunne teste
    _1_1 = document.getElementById("1-1");   
    _1_2 = document.getElementById("1-2");
    
    _1_1 = new PuzzlePiece("1-1", 100,50);
    _1_2 = new PuzzlePiece("1-2", 320, 50);
    
    puzzlePieces.push(_1_1);
    puzzlePieces.push(_1_2);

    isHoldingObject = false;

    setInterval(updateItemPos, 10);
}

function updateItemPos()
{
    // Avslutt om vi ikke holder et bilde
    if (heldObject == null)
    {
        info.innerHTML = "Not holding anything"; 
        return;
    }     

    
    if (heldObject != null)
    {
        /* KUN FOR TESTING */
        info.innerHTML = "Holding " + heldObject.obj.id + "At Object Position X: " + heldObject.x + " Y: " + heldObject.y;        
        info.innerHTML += "  Mouse Position X: " + mousePosition.x + " Y: " + mousePosition.y;
        /* KUN FOR TESTING */

        heldObject.setPosition(mousePosition.x, mousePosition.y)
        setPosition(heldObject.obj, heldObject.x, heldObject.y);
    }
}

// Plukker opp brikke
async function pickUpPiece(_clickedID)
{  

    if (isHoldingObject)
        return;

    await sleep(20);

    if (_clickedID != puzzleBox.id)
    {        
        isHoldingObject = true;
        for (p = 0; p < puzzlePieces.length; p++)
        {
            if (puzzlePieces[p].obj.id == _clickedID)
            {
                heldObject = puzzlePieces[p].obj;
            }
        }
    }
}

function dropPiece()
{
    if (isHoldingObject == false)
        return;   
    
    console.log("Dropped picture number " + heldObject.obj.id);
    heldObject = null;
    isHoldingObject = false; 
}

function setPosition(_obj, _x, _y)
{
    _obj.style.left = getPixels(_x-heldObject.offsetx);
    _obj.style.top = getPixels(_y-heldObject.offsety);
}


function getMousePosition(e)
{
    // Vet ikke hva denne gjør
    e.preventDefault();

    mousePosition = {

        x : e.clientX,
        y : e.clientY
    };
}



function getPixels(coord)
{
    return coord.toString() + "px";
}


class PuzzlePiece
{  
    constructor(_id, _x, _y)
    {
        this.x = _x;
        this.y = _y;

        this.obj = document.getElementById(_id);
        this.obj.style.left = getPixels(this.x);
        this.obj.style.top = getPixels(this.y);
    }
}




function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}






// function placeBrikke()
// {
//     let x;
//     let y;
    
//      x = Math.random() * breddePåGrid;
//      y = Math.random() * høydePåGrid;
    
//     if (x > breddePåGrid - breddePåBrikke)
//         x = breddePåGrid - breddePåBrikke;
    
//     if (y > høydePåGrid - høydePåBrikke)
//         y = høydePåGrid - høydePåBrikke;
    
//     div.style.left = x.toString() + "px";
//     div.style.top = y.toString() + "px";
// }