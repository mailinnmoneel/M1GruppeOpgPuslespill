var heldObject;
var isHoldingObject;

var boxWidth = 800;
var boxHeight = 600;

var boxBorder = 50;

var puzzleBox;
var puzzleBoxWidth;

var puzzlePieces = [];
var numberOfPieces = 12;
var pieceIDs = ["1-1", "1-2", "1-3", "1-4", 
                "2-1", "2-2", "2-3", "2-4", 
                "3-1", "3-2", "3-3", "3-4"];

var gridElements = [];
var gridIDs = ["plass_1_1", "plass_1_2", "plass_1_3", "plass_1_4",
               "plass_2_1", "plass_2_2", "plass_2_3", "plass_2_4",
               "plass_3_1", "plass_3_2", "plass_3_3", "plass_3_4"];



// Setter opp variabler og henter referanse til elementer
function init()
{
    document.addEventListener('mousemove', getMousePosition, true);

    puzzleBox = document.getElementById("brikkeboks");
    puzzleGrid = document.getElementById("brikkebrett");

    // Setter style manuelt i stedet for via CSS. Går ikke an å enkelt hente style width/height om det kun settes in stylesheet
    puzzleBox.style.width = getPixels(boxWidth);
    puzzleBox.style.height = getPixels(boxHeight);
   
    /* Lager en ny versjon av "PuzzlePiece" til hver brikke og gir en ID, posisjon og velger om de skal ha en tilfeldig plassering på brettet */

    createPieces();
    createPlacementGrids();

    isHoldingObject = false;
    setInterval(updateItemPos, 10);
}





function createPieces()
{
    for (p = 0; p < numberOfPieces; p++)
    {
        let newPiece = new PuzzlePiece(pieceIDs[p], gridIDs[p], 0, 0, true);
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

    if (isHoldingObject)
        return;

    await sleep(20); // Uten denne blir bildet puttet ned igjen med en gang det plukkes opp siden dropPiece funksjonen aktiverer på samme museklikk
      
    isHoldingObject = true;

    // Går igjennom alle puslespillbrikkene en etter en
    for (p = 0; p < puzzlePieces.length; p++)
    {    // Helt til vi finner den brikken vi har plukket opp
        if (puzzlePieces[p].obj.id == _clickedID)
        {   
            // setter heldObject til den brikken vi plukket opp så vi kan gjøre endringer på den
            heldObject = puzzlePieces[p];
            // Og endrer dybde på style-elementet så brikken vi holder ligger over alle de andre brikkene
            heldObject.obj.style.zIndex = "4";
            // Setter gridden brikken befinner seg på tilbake til ingenting når den plukkes opp slik at den returner false når vi sjekker om alle brikkene er plassert korrekt
            
            //Og vi regner så ut hvor på brikken vi har trykket så vi kan posisjonere den korrekt på musepekeren
            
            if (heldObject.isPlacedOnGrid)
            {
                heldObject.isPlacedOnGrid = false;
                setGridAsOccupied(findGridElementFromPiece(heldObject), false);
                heldObject.setCurrentGridLocation(null);
            } 

            heldObject.setOffset(mousePosition.x, mousePosition.y);
        }
    }
}


function findGridElementFromPiece(_heldObject)
{
    for (g = 0; g < gridElements.length; g++)
    {
        if (gridElements[g].gridID == _heldObject.currentLocation)
            return gridElements[g].gridID;
    }
}



function dropPiece()
{    
    
    if (isHoldingObject == false)
        return;   
    
    // Endrer style-dybde tilbake til samme som de andre brikkene slik at nye brikker vi plukker opp vil ligge på toppen
    heldObject.obj.style.zIndex = "3";
    heldObject.setOffset(0,0); 
    checkIfClickedInPlacementGrid();

    heldObject = null;
    isHoldingObject = false; 
}





function snapPiece(_idVerdi)
{
    if (checkIfGridIsOccupied(_idVerdi))
        return;


    let rect = document.getElementById(_idVerdi).getBoundingClientRect();

    heldObject.setPosition(rect.left, rect.top, false); 
    heldObject.isPlacedOnGrid = true;
    heldObject.obj.style.zIndex = 2;
    heldObject.setCurrentGridLocation(_idVerdi);

    setGridAsOccupied(_idVerdi, true);

    checkIfPuzzleIsComplete();

    heldObject = null;  
    isHoldingObject = false;
}

function setGridAsOccupied(_gridID, _flag)
{
    for (g = 0; g < gridElements.length; g++)
    {
        if (gridElements[g].gridID == _gridID)            
                gridElements[g].setOccupied(_flag);
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




async function checkIfPuzzleIsComplete()
{
    let countCorrectlyPlacedPieces = 0;

    for (p = 0; p < puzzlePieces.length; p++)
    {
        if (puzzlePieces[p].isPiecePlacedCorrect())
            countCorrectlyPlacedPieces += 1;
    }

    if( countCorrectlyPlacedPieces == numberOfPieces)
    {
        await sleep(50);
        alert("Du vant! (ingenting)");
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












// Konverterer et tall til pixelverdi som en string
function getPixels(coord)
{
    return coord.toString() + "px";
}






/*

Forslag: Regne ut rute ved å runde ned museposisjon til nærmeste 200px for X og Y, og så sette posisjon basert på det.
Theodor og Morten ser på det i helga

*/


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

    
    if (heldObject != null)
        heldObject.setPosition(mousePosition.x, mousePosition.y, true);
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
