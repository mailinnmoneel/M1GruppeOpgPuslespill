class PuzzlePiece
{  
    constructor(_id, _x, _y, _isRandom)
    {
        this.obj = document.getElementById(_id);

        this.x = _x;
        this.y = _y;

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

    setPosition(_x, _y)
    {
        this.x = _x + this.offsetX;
        this.y = _y + this.offsetY;
        this.updatePosition();
    }

    updatePosition()
    {
        this.obj.style.left = getPixels(this.x);
        this.obj.style.top = getPixels(this.y);
    }

    placeRandom()
    {   
        this.x = distanceFromLeft + (Math.random() * (boxWidth -this.pieceWidth));
        this.y = distanceFromTop + (Math.random() * (boxHeight -this.pieceHeight));
    }
}