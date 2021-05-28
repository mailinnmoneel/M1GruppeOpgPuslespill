var heldObject;
var isHoldingObject = false;

var puzzleBox;
var boxWidth = 800;
var boxHeight = 600;
var boxBorder = 50;

var numberOfPieces = 12;

var gameOver = false;

var puzzlePieces = [];
var pieceIDs = ["1-1", "1-2", "1-3", "1-4", 
                "2-1", "2-2", "2-3", "2-4", 
                "3-1", "3-2", "3-3", "3-4"];

var gridElements = [];
var gridIDs = ["plass_1_1", "plass_1_2", "plass_1_3", "plass_1_4",
               "plass_2_1", "plass_2_2", "plass_2_3", "plass_2_4",
               "plass_3_1", "plass_3_2", "plass_3_3", "plass_3_4"];



// Setter opp variabler og henter referanse til elementer
function Awake()
{
    document.addEventListener('mousemove', getMousePosition, true);

    puzzleBox = document.getElementById("brikkeboks");
    puzzleGrid = document.getElementById("brikkebrett");
   
    createPieces();
    createPlacementGrids();

    setInterval(updateItemPos, 10);
}





function createPieces()
{
    for (p = 0; p < numberOfPieces; p++)
    {
        let newPiece = new PuzzlePiece(pieceIDs[p], gridIDs[p], 0, 0, true, p+1);        
        puzzlePieces.push(newPiece);
    }    
}





function createPlacementGrids()
{
    for (p = 0; p < numberOfPieces; p++)
    {
        let newGridElement = new GridElement(gridIDs[p]);
        gridElements.push(newGridElement);
    }
}





async function pickUpPiece(_clickedID)
{  

    if (isHoldingObject || gameOver)
        return;

    await sleep(20); // Uten denne ender dropPiece og pickUpPiece med kjøre på samme museklikk.
      
    isHoldingObject = true;


    for (p = 0; p < puzzlePieces.length; p++)
    { 
        if (puzzlePieces[p].obj.id == _clickedID)
        {   
            heldObject = puzzlePieces[p];
            heldObject.obj.style.zIndex = numberOfPieces+1;
            
            if (heldObject.isPlacedOnGrid)
            {                
                setGridSlotAsOccupied(findGridElementFromPiece(heldObject), false);
                heldObject.setCurrentGridLocation(null);
                heldObject.isPlacedOnGrid = false;
            } 
            
            heldObject.setOffset(mousePosition.x, mousePosition.y);
        }
    }
}






function dropPiece()
{    
    
    if (isHoldingObject == false)
        return;   
    
    sortPiecesByzIndex(heldObject.zIndex, heldObject);

    heldObject.setOffset(0,0); 

    checkIfClickedByPixelRounding();
    checkIfClickedInPlacementGrid();

    heldObject = null;
    isHoldingObject = false; 
}



function sortPiecesByzIndex(_indexOfDroppedPiece, _heldObject)
{
    for (p = 0; p < puzzlePieces.length; p++)
    {
        if (puzzlePieces[p].zIndex > _indexOfDroppedPiece && puzzlePieces[p].isPlacedOnGrid == false)
        {            
            if (puzzlePieces[p].zIndex > 1)
            {
                puzzlePieces[p].zIndex--;
                puzzlePieces[p].obj.style.zIndex--;
            }
            
        }                 
    }

    _heldObject.zIndex = numberOfPieces;
    _heldObject.obj.style.zIndex = numberOfPieces;
}




function snapPiece(_idVerdi)
{
    if (checkIfGridIsOccupied(_idVerdi))
        return;


    let rect = document.getElementById(_idVerdi).getBoundingClientRect();
    heldObject.setPosition(rect.left, rect.top, false); 

    heldObject.isPlacedOnGrid = true;
    heldObject.obj.style.zIndex = 0;
    heldObject.zIndex = 0;
    heldObject.setCurrentGridLocation(_idVerdi);

    setGridSlotAsOccupied(_idVerdi, true);

    checkIfPuzzleIsComplete();

    heldObject = null;  
    isHoldingObject = false;
}






function setGridSlotAsOccupied(_gridID, _condition)
{
    for (g = 0; g < gridElements.length; g++)
    {
        if (gridElements[g].gridID == _gridID)            
                gridElements[g].setOccupied(_condition);
    }
}





function checkIfGridIsOccupied(_gridID)
{
    for (g = 0; g < gridElements.length; g++)
    {
        if (gridElements[g].gridID == _gridID)            
            return gridElements[g].checkIfOccupied();
    }
}





function findGridElementFromPiece(_heldObject)
{
    for (g = 0; g < gridElements.length; g++)
    {
        if (gridElements[g].gridID == _heldObject.currentGridLocation)
            return gridElements[g].gridID;
    }
}





async function checkIfPuzzleIsComplete()
{
    
    let countCorrectlyPlacedPieces = 0;

    for (p = 0; p < puzzlePieces.length; p++)
    {       
        if (puzzlePieces[p].isPiecePlacedCorrect())
        {
            countCorrectlyPlacedPieces += 1;
        }                    
    }

    if(countCorrectlyPlacedPieces == numberOfPieces)
    {
        await sleep(50);
        gameOver = true;
        alert("Du vant! (ingenting)");
    }
}





function resetPuzzle()
{
    for (i = 0; i < numberOfPieces; i++)
    {
        gameOver = false;
        gridElements[i].resetElement();
        puzzlePieces[i].resetPiece();
    }
}










// Denne oppdaterer museposisjonen hver gang musa flyttes. 'e' argumentet er museposisjonen som kommer fra EventListeneren vi la til i init()
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






/*

Forslag: Regne ut rute ved å runde ned museposisjon til nærmeste 200px for X og Y, og så sette posisjon basert på det.
Theodor og Morten ser på det i helga

*/
/********EXPERIMENTAL***********/
function checkIfClickedByPixelRounding()
{
    let rect = puzzleGrid.getBoundingClientRect();

    let relativeMouseX = mousePosition.x - rect.left;
    let relativeMouseY = mousePosition.y - rect.top;

    console.log("X Pos: " + Math.floor(relativeMouseX / puzzlePieces[0].pieceWidth));
    console.log("Y Pos: " + Math.floor(relativeMouseY / puzzlePieces[0].pieceHeight));

}
/***********************/

function checkIfClickedInPlacementGrid()
{
    let rect = puzzleGrid.getBoundingClientRect();
    //let gridWidth = boxWidth / 4;
    //let gridHeight = boxHeight / 3;
    
    if      (   mousePosition.y > rect.top &&
                mousePosition.y < rect.top + 200 )
            {
                checkRow1(rect.left);
            }
    else if (   mousePosition.y > rect.top + 200 &&
                mousePosition.y < rect.top + 400)
            {
                checkRow2(rect.left);
            }
    else if (   mousePosition.y > rect.top + 400 &&
                mousePosition.y < rect.top + 600)
            {
                checkRow3(rect.left);
            }
}


// Kan forsåvidt bare sende med rad.nr i tillegg til leftPos, også henter vi ut ID fra gridIDs's arrayet i stedet for å ha en funksjon per rad.
// F.eks checkRow(rect.left, radNr). Så blir det snapPiece(gridIDs[ ((radNr - 1) * 4) + kolonneNr ]) for å snappe til et spesifik Grid Element.

function checkRow1(leftPos)
{

    if  (   mousePosition.x > leftPos &&
            mousePosition.x < leftPos + 200)
            {
                snapPiece("plass_1_1");
            }
    else if (   mousePosition.x > leftPos + 200 &&
                mousePosition.x < leftPos + 400)
            {
                snapPiece("plass_1_2");
            }

    else if (   mousePosition.x > leftPos +  400 &&
                mousePosition.x < leftPos +  600)
            {
                snapPiece("plass_1_3");
            }
    else if (   mousePosition.x > leftPos +  600 &&
                mousePosition.x < leftPos +  800)
            {
                snapPiece("plass_1_4");
            }
}



function checkRow2(leftPos)
{
    if  (   mousePosition.x > leftPos &&
            mousePosition.x < leftPos + 200)
        {
            snapPiece("plass_2_1");
        }
    else if (   mousePosition.x > leftPos + 200 &&
                mousePosition.x < leftPos + 400)
        {
            snapPiece("plass_2_2");
        }

    else if (   mousePosition.x > leftPos +  400 &&
                mousePosition.x < leftPos +  600)
        {
            snapPiece("plass_2_3");
        }
    else if (   mousePosition.x > leftPos +  600 &&
                mousePosition.x < leftPos +  800)
        {
            snapPiece("plass_2_4");
        }    
}



function checkRow3(leftPos)
{
    if  (   mousePosition.x > leftPos &&
            mousePosition.x < leftPos + 200)
        {
            snapPiece("plass_3_1");
        }
    else if (   mousePosition.x > leftPos + 200 &&
                mousePosition.x < leftPos + 400)
        {
            snapPiece("plass_3_2");
        }

    else if (   mousePosition.x > leftPos +  400 &&
                mousePosition.x < leftPos +  600)
        {
            snapPiece("plass_3_3");
        }
    else if (   mousePosition.x > leftPos +  600 &&
                mousePosition.x < leftPos +  800)
        {
            snapPiece("plass_3_4");
        }    
}












// Flytter brikken vi holder etter musepekeren
function updateItemPos()
{
    if (heldObject == null)
        return;  

    heldObject.setPosition(mousePosition.x, mousePosition.y, true);
}



function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
