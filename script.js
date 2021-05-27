var heldObject;
var isHoldingObject;

var boxWidth = 800;
var boxHeight = 600;

var puzzleBox;
var puzzleBoxWidth;

var puzzlePieces = [];

var _1_1;
var _1_2;
var _1_3;
var _1_4;

var _2_1;
var _2_2;
var _2_3;
var _2_4;

var _3_1;
var _3_2;
var _3_3;
var _3_4;

// Setter opp variabler og henter referanse til elementer
function init()
{
    document.addEventListener('mousemove', getMousePosition, true);

    puzzleBox = document.getElementById("brikkeboks");

    puzzleBox.style.width = getPixels(boxWidth);
    puzzleBox.style.height = getPixels(boxHeight);
   
    // Lager en ny versjon av "PuzzlePiece" til hver brikke og gir en ID, posisjon og velger om de skal ha en tilfeldig plassering på brettet
    _1_1 = new PuzzlePiece("1-1", 100, 50, true);
    _1_2 = new PuzzlePiece("1-2", 320, 50, true);
    _1_3 = new PuzzlePiece("1-3", 320, 50, true);
    _1_4 = new PuzzlePiece("1-4", 320, 50, true);
    
    _2_1 = new PuzzlePiece("2-1", 100, 50, true);
    _2_2 = new PuzzlePiece("2-2", 320, 50, true);
    _2_3 = new PuzzlePiece("2-3", 320, 50, true);
    _2_4 = new PuzzlePiece("2-4", 320, 50, true);

    _3_1 = new PuzzlePiece("3-1", 100, 50, true);
    _3_2 = new PuzzlePiece("3-2", 320, 50, true);
    _3_3 = new PuzzlePiece("3-3", 320, 50, true);
    _3_4 = new PuzzlePiece("3-4", 320, 50, true);
    
    puzzlePieces.push(_1_1);
    puzzlePieces.push(_1_2);
    puzzlePieces.push(_1_3);
    puzzlePieces.push(_1_4);
    
    puzzlePieces.push(_2_1);
    puzzlePieces.push(_2_2);
    puzzlePieces.push(_2_3);
    puzzlePieces.push(_2_4);
    
    puzzlePieces.push(_3_1);
    puzzlePieces.push(_3_2);
    puzzlePieces.push(_3_3);
    puzzlePieces.push(_3_4);

    isHoldingObject = false;
    setInterval(updateItemPos, 10);
}




function updateItemPos()
{
    if (heldObject == null)
        return;  

    
    if (heldObject != null)
        heldObject.setPosition(mousePosition.x, mousePosition.y);
}



async function pickUpPiece(_clickedID)
{  

    if (isHoldingObject)
        return;

    await sleep(20); // Uten denne blir bildet puttet ned igjen med en gang det plukkes opp siden dropPiece funksjonen aktiverer på samme museklikk

    if (_clickedID != puzzleBox.id)
    {        
        isHoldingObject = true;

        // Går igjennom alle puslespillbrikkene en etter en
        for (p = 0; p < puzzlePieces.length; p++)
        {    // Helt til vi finner den brikken vi har plukket opp
            if (puzzlePieces[p].obj.id == _clickedID)
            {   
                // setter heldObject til den brikken vi plukket opp så vi kan gjøre endringer på den
                heldObject = puzzlePieces[p];
                //Og vi regner så ut hvor på brikken vi har trykket så vi kan posisjonere den korrekt på musepekeren
                heldObject.setOffset(mousePosition.x, mousePosition.y);
                console.log("Plukket opp brikke nummer " + heldObject.obj.id);
            }
        }
    }
}





function dropPiece()
{
    if (isHoldingObject == false)
        return;   
    
    console.log("La ned brikke nummer " + heldObject.obj.id);
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



// Konverterer et tall til pixelverdi som en string
function getPixels(coord)
{
    return coord.toString() + "px";
}







function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
