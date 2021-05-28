var heldObject;
var isHoldingObject;

var boxWidth = 800;
var boxHeight = 600;

var puzzleBox;
var puzzleBoxWidth;

var puzzlePieces = [];
var pieces = 12;
var pieceIDs = ["1-1", "1-2", "1-3", "1-4", 
                "2-1", "2-2", "2-3", "2-4", 
                "3-1", "3-2", "3-3", "3-4"];



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

    // let _1_1;
    // let _1_2;
    // let _1_3;
    // let _1_4;

    // let _2_1;
    // let _2_2;
    // let _2_3;
    // let _2_4;

    // let _3_1;
    // let _3_2;
    // let _3_3;
    // let _3_4;

    // _1_1 = new PuzzlePiece("1-1", 100, 50, true);
    // _1_2 = new PuzzlePiece("1-2", 320, 50, true);
    // _1_3 = new PuzzlePiece("1-3", 320, 50, true);
    // _1_4 = new PuzzlePiece("1-4", 320, 50, true);
    
    // _2_1 = new PuzzlePiece("2-1", 100, 50, true);
    // _2_2 = new PuzzlePiece("2-2", 320, 50, true);
    // _2_3 = new PuzzlePiece("2-3", 320, 50, true);
    // _2_4 = new PuzzlePiece("2-4", 320, 50, true);

    // _3_1 = new PuzzlePiece("3-1", 100, 50, true);
    // _3_2 = new PuzzlePiece("3-2", 320, 50, true);
    // _3_3 = new PuzzlePiece("3-3", 320, 50, true);
    // _3_4 = new PuzzlePiece("3-4", 320, 50, true);
    
    // puzzlePieces.push(_1_1);
    // puzzlePieces.push(_1_2);
    // puzzlePieces.push(_1_3);
    // puzzlePieces.push(_1_4);
    
    // puzzlePieces.push(_2_1);
    // puzzlePieces.push(_2_2);
    // puzzlePieces.push(_2_3);
    // puzzlePieces.push(_2_4);
    
    // puzzlePieces.push(_3_1);
    // puzzlePieces.push(_3_2);
    // puzzlePieces.push(_3_3);
    // puzzlePieces.push(_3_4);

    createPieces();

    isHoldingObject = false;
    setInterval(updateItemPos, 10);
}






function createPieces()
{
    for (p = 0; p < pieces; p++)
    {
        let newPiece = new PuzzlePiece(pieceIDs[p], 0, 0, true);
        puzzlePieces.push(newPiece);
    }    
}

/*****************/
/*  Eksperiment  */
/*****************/
function checkIfClickedInPlacementGrid()
{
    let rect = puzzleGrid.getBoundingClientRect();

    if( mousePosition.x > rect.left &&
        mousePosition.x < rect.left + (boxWidth / 4) &&
        mousePosition.y > rect.top &&
        mousePosition.y < rect.top + (boxHeight / 3))
    {
        document.getElementById("plass_1_1").appendChild(heldObject.obj);
        heldObject.setPosition(0, 0, false); 
        heldObject.isPlacedOnGrid = true;

        heldObject = null;        
        isHoldingObject = false; 
    }
}
/****************/
/****************/
/****************/



function updateItemPos()
{
    if (heldObject == null)
        return;  

    
    if (heldObject != null)
        heldObject.setPosition(mousePosition.x, mousePosition.y, true);
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
                document.getElementById("brikkeboks").appendChild(heldObject.obj);
                // Og endrer dybde på style-elementet så brikken vi holder ligger over alle de andre brikkene
                heldObject.obj.style.zIndex = "3";
                //Og vi regner så ut hvor på brikken vi har trykket så vi kan posisjonere den korrekt på musepekeren
                
                if (heldObject.isPlacedOnGrid)
                {
                    heldObject.isPlacedOnGrid = false;
                    heldObject.setPosition(mousePosition.x, mousePosition.y, false);
                } 
                
                heldObject.setOffset(mousePosition.x, mousePosition.y);
                console.log("Plukket opp brikke nummer " + heldObject.obj.id);
            }
        }
    // }
}





function dropPiece()
{    
    
    if (isHoldingObject == false)
        return;   
    
    console.log("La ned brikke nummer " + heldObject.obj.id);
    // Endrer style-dybde tilbake til samme som de andre brikkene slik at nye brikker vi plukker opp vil ligge på toppen
    heldObject.obj.style.zIndex = "2";
    heldObject.setOffset(0,0); 
    checkIfClickedInPlacementGrid();

    heldObject = null;
    isHoldingObject = false; 
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






function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
