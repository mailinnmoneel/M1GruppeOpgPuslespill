class GridElement
{
    constructor(_gridID)
    {
        this.gridID = _gridID;
        this.occupied = false;
    }

    setOccupied(flag)
    {
        if (flag)
            this.occupied = true;
        else
            this.occupied = false;
    }

    checkIfOccupied()
    {
        return this.occupied;
    }
}