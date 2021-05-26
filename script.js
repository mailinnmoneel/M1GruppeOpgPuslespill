var heldObject;
var isHoldingObject;

var boxWidth = 800;
var boxHeight = 600;

var puzzleBox;
var puzzleBoxWidth;

var info;
var info2;

var puzzlePieces = [];
var _1_1;
var _1_2;

// Setter opp variabler og henter referanse til elementer
function init()
{
    document.addEventListener('mousemove', getMousePosition, true);

    info = document.getElementById("info");
    info2 = document.getElementById("info2");

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
        /* KUN FOR TESTING - KAN TRYGT FJERNES */
        info.innerHTML = "Holding " + heldObject.obj.id + "At Object Position X: " + heldObject.x + " Y: " + heldObject.y;        
        info.innerHTML += "  Mouse Position X: " + mousePosition.x + " Y: " + mousePosition.y;
        /* KUN FOR TESTING - KAN TRYGT FJERNES */

        heldObject.setPosition(mousePosition.x, mousePosition.y);
    }
}



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
                heldObject = puzzlePieces[p];
                heldObject.setOffset(mousePosition.x, mousePosition.y);
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






// Denne oppdaterer museposisjonen hver gang musa flyttes. 'e' argumentet kommer fra EventListeneren vi la til i init()
function getMousePosition(e)
{
    // Vet ikke hva denne gjør
    e.preventDefault();

    mousePosition = {

        x : e.clientX,
        y : e.clientY
    };
}



// Konverterer et tall til pixelverdi
function getPixels(coord)
{
    return coord.toString() + "px";
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