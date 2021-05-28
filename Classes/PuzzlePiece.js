class PuzzlePiece
{  
    constructor(_id, _plass, _x, _y, _isRandom)
    {
        this.obj = document.getElementById(_id);

        this.x = _x;
        this.y = _y;
        
        this.isPlacedOnGrid = false;
        this.plass = _plass;

        this.pieceWidth = 200;
        this.pieceHeight = 200;       

        if (_isRandom)
            this.placeRandom();
        
        this.obj.style.left = getPixels(this.x);
        this.obj.style.top = getPixels(this.y);
            
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

    setCurrentGridLocation(_location)
    {
        this.currentGridLocation = _location;
    }

    updatePosition()
    {
        this.obj.style.left = getPixels(this.x);
        this.obj.style.top = getPixels(this.y);
    }

    placeRandom()
    {  
        let rect = puzzleBox.getBoundingClientRect();

        this.x = rect.left + boxBorder + (Math.random() * ((rect.right-rect.left) - (this.pieceWidth + boxBorder * 2)));
        this.y = rect.top + boxBorder + (Math.random() * ((rect.bottom-rect.top) - (this.pieceHeight + boxBorder * 2)));
    }

    isPiecePlacedCorrect()
    {
        if (this.currentGridLocation == this.plass)
            return true;
        else
            return false;
    }
}
