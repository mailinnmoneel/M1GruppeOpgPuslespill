var gameOver = false;

var heldObject;
var isHoldingObject = false;

var puzzleBox;
var boxBorder = 50;
var puzzleGrid;
var gridWidth = 4;

var numberOfPieces = 12;
var puzzlePieces = [];
var pieceIDs = ["1-1", "1-2", "1-3", "1-4", 
                "2-1", "2-2", "2-3", "2-4", 
                "3-1", "3-2", "3-3", "3-4"];

var gridElements = [];
var gridIDs = ["plass_1_1", "plass_1_2", "plass_1_3", "plass_1_4",
               "plass_2_1", "plass_2_2", "plass_2_3", "plass_2_4",
               "plass_3_1", "plass_3_2", "plass_3_3", "plass_3_4"];




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
        let newPiece = new PuzzlePiece(pieceIDs[p], gridIDs[p], 0, 0, true, 200, 200); 
        newPiece.setDrawDepth(p+1);     
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





async function pickUpPiece(_clickedPieceID)
{  

    if (isHoldingObject || gameOver) return;

    await sleep(20); // Uten denne ender dropPiece og pickUpPiece med kjøre på samme museklikk.      
    isHoldingObject = true;

    for (p = 0; p < puzzlePieces.length; p++)
    { 
        if (puzzlePieces[p].element.id == _clickedPieceID)
        {            
            heldObject = puzzlePieces[p];
            heldObject.element.style.zIndex = numberOfPieces+1;
            heldObject.setOffset(mousePosition.x, mousePosition.y + window.scrollY);

            if (!heldObject.isPlacedOnGrid) return;
             
            setGridSlotAsOccupied(findGridElementFromPiece(heldObject), false);
            heldObject.setCurrentGridLocation(null);
            heldObject.isPlacedOnGrid = false; 

            p = puzzlePieces.length;
        }
    }
}





function dropPiece()
{     
    if (!isHoldingObject) return;   
    
    sortPiecesByZIndex(heldObject.zIndex);

    let index = getClickedGridIndex()
    if (index != null)
        snapPiece(gridIDs[index]);

    heldObject = null;  
    isHoldingObject = false;
}





function sortPiecesByZIndex(_zIndexOfDroppedPiece)
{
    for (p = 0; p < puzzlePieces.length; p++)
    {
        if (puzzlePieces[p].zIndex > _zIndexOfDroppedPiece && !puzzlePieces[p].isPlacedOnGrid)
        {   
            puzzlePieces[p].setDrawDepth( Math.max(puzzlePieces[p].zIndex-1, 1) );                
        }                 
    }

    heldObject.setDrawDepth(numberOfPieces);
}





function snapPiece(_idOfGridElementToSnapTo)
{
    if (checkIfGridIsOccupied(_idOfGridElementToSnapTo)) return;

    let rect = document.getElementById(_idOfGridElementToSnapTo).getBoundingClientRect();

    heldObject.setPosition(rect.left, rect.top + window.scrollY, false);  
    heldObject.setCurrentGridLocation(_idOfGridElementToSnapTo);
    heldObject.isPlacedOnGrid = true;  
    heldObject.setDrawDepth(0);

    setGridSlotAsOccupied(_idOfGridElementToSnapTo, true);
    checkIfPuzzleIsComplete();
}





function setGridSlotAsOccupied(_gridID, _isOccupied)
{
    for (g = 0; g < gridElements.length; g++)
    {
        if (gridElements[g].gridID == _gridID)            
                gridElements[g].setOccupied(_isOccupied);
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





function findGridElementFromPiece(_piece)
{
    for (g = 0; g < gridElements.length; g++)
    {
        if (gridElements[g].gridID == _piece.currentGridLocation)
            return gridElements[g].gridID;
    }
}





async function checkIfPuzzleIsComplete()
{
    
    let correctlyPlacedPieces = 0;

    for (p = 0; p < puzzlePieces.length; p++)
    {       
        if (puzzlePieces[p].isPiecePlacedCorrectly())
            correctlyPlacedPieces++;                   
    }

    if(correctlyPlacedPieces == numberOfPieces)
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
        gridElements[i].resetElement();
        puzzlePieces[i].resetPiece();        
    }

    gameOver = false;
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





function getClickedGridIndex()
{
    let rect = puzzleGrid.getBoundingClientRect();

    if (mousePosition.x > rect.right || mousePosition.x < rect.left) return;

    let gridX = Math.floor((mousePosition.x - rect.left) / puzzlePieces[0].pieceWidth);
    let gridY = Math.floor((mousePosition.y - rect.top) / puzzlePieces[0].pieceHeight);
    
    let index = (gridY * gridWidth) + gridX;

    if (index < 0 || index >= numberOfPieces)    
        index = null; 

    return index;
}





// Flytter brikken vi holder etter musepekeren
function updateItemPos()
{
    if (!heldObject) return;  

    heldObject.setPosition(mousePosition.x, mousePosition.y + window.scrollY, true);
}





function refreshPiecePositions()   
{
    for (p = 0; p < puzzlePieces.length; p++)
    {
        if (puzzlePieces[p].isPlacedOnGrid)
        {
            let rect = document.getElementById(findGridElementFromPiece(puzzlePieces[p])).getBoundingClientRect();
            puzzlePieces[p].setPosition(rect.left, rect.top, false); 
        }
    }
}





// Starter en timer som kjører en funksjon når timeren går ut. Restarter timeren hver gang vinduet resizes slik at recheckPiecePositions ikke kjører før vi stoper å resize
var resizeDelayTimer;

window.addEventListener('resize', function() {
    clearTimeout(resizeDelayTimer);
    resizeDelayTimer = setTimeout(refreshPiecePositions, 50);
});





function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}