class GridElement
{
    constructor(_gridID)
    {
        this.gridID = _gridID;
        this.occupied = false;
    }

    setOccupied(isOccupied)
    {
        if (isOccupied)
            this.occupied = true;
        else
            this.occupied = false;
    }

    checkIfOccupied()
    {
        return this.occupied;
    }
}