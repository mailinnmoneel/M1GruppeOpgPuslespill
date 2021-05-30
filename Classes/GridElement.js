class GridElement
{
    constructor(_gridID)
    {
        this.gridID = _gridID;
        this.occupied = false;
    }

    setOccupied(isOccupied)
    {
        this.occupied = isOccupied;
    }

    checkIfOccupied()
    {
        return this.occupied;
    }

    resetElement()
    {
        this.occupied = false;
    }
}