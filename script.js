var heldObject;
var isHoldingObject;

var boxWidth = 800;
var boxHeight = 600;

var puzzleBox;
var puzzleBoxWidth;


// Setter opp variabler og henter referanse til elementer
function init()
{
    

    puzzleBox = document.getElementById("brikkeboks");
    puzzleBox.style.width = getPixels(boxWidth);
    puzzleBox.style.height = getPixels(boxHeight);

    console.log("Grid is " + puzzleBox.style.width + " wide");
    console.log("Grid is " + puzzleBox.style.height + " high");

    document.addEventListener('mousemove', getMousePos, true);

    isHoldingObject = false;

    setInterval(updateItemPos, 10);
}


function updateItemPos()
{
    if (heldObject != null)
    {
        setPosition(heldObject.obj, new Point(mousePosition.x, mousePosition.y));
    }
}

// Plukker opp brikke
async function pickUpPiece(_clickedID)
{
    await sleep(200);

    if (isHoldingObject == false && _clickedID != puzzleBox.id)
    {        
        isHoldingObject = true;
        heldObject = new HeldObject(_clickedID, mousePosition.x, mousePosition.y);
        console.log(heldObject.obj);
    }
}

async function dropPiece()
{    
    if (isHoldingObject == true)
    {   
        await sleep(200);    

        setPosition(heldObject.obj, new Point(mousePosition.x, mousePosition.y));
        //heldObject = null;
        isHoldingObject = false;
    }  
}

function setPosition(_obj, _pos)
{
    _obj.style.left = getPixels(_pos.x);
    _obj.style.top = getPixels(_pos.y);
}

// Henter museposisjon
function getMousePos(e)
{
    if (isHoldingObject)
        return;

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


class HeldObject
{  
    constructor(_id, _x, _y)
    {
        this.pos = new Point(_x, _y);
        this.obj = document.getElementById(_id);
    }
}

class Point
{
    constructor(_x, _y)
    {
        this.x = _x;
        this.y = _y;
    }
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


function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}