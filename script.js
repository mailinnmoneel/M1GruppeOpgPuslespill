
/* Eksempelkode

// Plasserer en brikke på tilfedig sted innenfor brikkeboksen

function placeBrikke()
{
    let x;
    let y;
    
     x = Math.random() * breddePåGrid;
     y = Math.random() * høydePåGrid;
    
    if (x > breddePåGrid - breddePåBrikke)
        x = breddePåGrid - breddePåBrikke;
    
    if (y > høydePåGrid - høydePåBrikke)
        y = høydePåGrid - høydePåBrikke;
    
    div.style.left = x.toString() + "px";
    div.style.top = y.toString() + "px";
}

*/

function placeBrikke()
{
    let x;
    let y;

       x = Math.random() * 100;
       y = Math.random() * 100;

    if (x > 400 - 100) 
        x = 300 - 100;
        
    if (y > 400 - 100)
        y = 300 - 100;   

    div.style.left = x.toString() + "px";
    div.style.top = y.toString()  + "px";

    }

   /* lage en onclick for å "starte spillet" */     
