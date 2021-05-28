class GridElement
{
    constructor()
    {

    }

    placedPiece()
    {
        this.occupied = true;
    }

    takenPiece()
    {
        this.occupied = false;
    }

    checkIfOccupied()
    {
        if (this.occupied)
            return false;
    }
}