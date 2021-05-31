class PuzzlePiece
{    

    constructor(_id, _correctGridLocation, _x, _y, _hasRandomSpawnPoint, width, height)
    {   
        this.element = document.getElementById(_id);        
        
        this.pieceWidth = width;
        this.pieceHeight = height;

        this.isPlacedOnGrid = false;
        this.correctGridLocation = _correctGridLocation;

        if (_hasRandomSpawnPoint)
            this.randomizeStartPosition();
        else
            { this.x = _x; this.y = _y; }
        
        this.updatePosition();            
    }

    setOffset(_mouseX, _mouseY)
    {
        this.offsetX = this.x - _mouseX;
        this.offsetY = this.y - _mouseY;
    }

    setPosition(_x, _y, _useOffset)
    {
        this.x = _x;
        this.y = _y;

        if (_useOffset)
        {
            this.x += this.offsetX;
            this.y += this.offsetY;
        }

        this.updatePosition();
    }

    setDrawDepth(_newIndex)
    {
        this.zIndex = _newIndex;
        this.element.style.zIndex = this.zIndex;
    }

    setCurrentGridLocation(_newGridLocation)
    {
        this.currentGridLocation = _newGridLocation;
    }

    updatePosition()
    {
        this.element.style.left = getPixels(this.x);
        this.element.style.top = getPixels(this.y);
    }

    randomizeStartPosition()
    {  
        let rect = puzzleBox.getBoundingClientRect();

        this.x = rect.left + boxBorder + (Math.random() * ((rect.right-rect.left) - (this.pieceWidth + boxBorder * 2)));
        this.y = rect.top + boxBorder + window.scrollY + (Math.random() * ((rect.bottom-rect.top) - (this.pieceHeight + boxBorder * 2)));
    }

    isPiecePlacedCorrectly()
    {
        if (this.currentGridLocation == this.correctGridLocation)
            return true;
        else
            return false;
    }

    resetPiece()
    {
        this.isPlacedOnGrid = false;
        this.currentGridLocation = false;

        this.randomizeStartPosition();
        this.updatePosition();
    }
}
