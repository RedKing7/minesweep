//different themes?

const game = () =>{
    //set ROWs and COLs and MINES
    let COL = 8;
    let ROW = 8;
    let MINES = 10;

    let minesLeft = MINES; //used for left LCD counter

    let field = [[]];
    let mineLocations = [];
    
    let firstClick = true;

    let remainingSquares = (COL*ROW)-MINES;
    
    const addToDOM = (rows, cols) =>{
        for(let r = 0; r < rows; r++){
            let $newRow = $(`<div class='row'></div>`);
            for(let c = 0; c < cols; c++){
                let $newSpace = $(`<button class='blank' data-row='row${r}' data-col='col${c}'/>`);
                $newSpace.attr('revealed', false);
                $newRow.append($newSpace);
            }
            $('#game').append($newRow);
        }
        addListeners();
    }

    const addListeners = () =>{
        $('#game .blank').on({
            'mousedown': function(event){
                if(event.which === 3){
                    let $this = $(event.target);
                    //if blank
                    //remove blank class
                    //add flag class and picture
                    //set attr('revealed', true)
                    //minesLeft--;
                    if($this.hasClass('blank')){
                        $this.off('mouseup');
                        $this.off('mouseleave');
                        $this.off('click');
                        $this.removeClass('blank').addClass('flag');
                        $this.css('background', `url('./images/Flag.png')`);
                        $this.attr('revealed', true);
                        minesLeft--;
                    } else

                    //if flagged
                    //remove flag class
                    //add unknown class and picture
                    //set attr('revealed', false)
                    //turn 'click' back on
                    //minesLeft++;
                    if($this.hasClass('flag')){
                        $this.removeClass('flag').addClass('unknown');
                        $this.css('background', `url('./images/Unknown.png')`);
                        $this.attr('revealed', false);
                        $this.on('click');
                        minesLeft++;
                    } else 

                    //if unknown
                    //remove unknown class
                    //add blank class and picture
                    //turn 'mouseup' and 'mouseleave' back on
                    if($this.hasClass('unknown')){
                        $this.removeClass('unknown').addClass('blank');
                        $this.css('background', `url('./images/Blank.png')`);
                        $this.on('mouseup');
                        $this.on('mouseleave');
                    }
                } else {
                    if($(event.target).hasClass('blank')){
                        $(event.target).css('background', `url('./images/Empty.png')`);                        
                    }
                }
            },
            'mouseup': function(event){
                $(event.target).css('background', `url('./images/Blank.png')`)        
            },
            'mouseleave': function(event){
                $(event.target).css('background', `url('./images/Blank.png')`)
            },
            'click': function(event){
                let row = $(event.target).attr('data-row')
                let col = $(event.target).attr('data-col')
                //console.log($(event.target));
                //console.log(row, col)
                $(event.target).removeClass('hidden');                
                if(firstClick){
                    makeField(ROW,COL,MINES, row, col);
                } else {
                    reveal(row, col);
                }
            }
        })
    }
    
    const placeMines = (rows, cols, mines, fR, fC) =>{
        for(let m=0; m<mines; m++){
            let r;
            let c;
            do{
                r = Math.floor(Math.random() * rows);
                c = Math.floor(Math.random() * cols);
            }while((field[r][c] === 9) || ((r === fR) && (c === fC)));//make sure space isn't the first click or already a mine
            field[r][c] = 9;
            mineLocations.push({row: r, col: c});
        }
        //console.log(mineLocations);
    }
    
    const makeField = (rows, cols, mines, firstRow, firstCol) =>{
        firstClick = false;
        for(let r=0; r<rows; r++){
            field[r] = [];
            for(let c=0; c<cols; c++){
                field[r][c] = 0;
            }
        }
        fr = Number(firstRow[3]);//get number from 'rowN'
        fc = Number(firstCol[3]);//get number from 'colN'
        placeMines(rows, cols, mines, fr, fc);
        getNums(rows, cols);
        reveal(firstRow,firstCol);
    }
    
    const getNums = (rows, cols) =>{
        for(let m=0; m<mineLocations.length; m++){
            let r = mineLocations[m].row;
            let c = mineLocations[m].col;
            for(let h = r - 1; h <= r + 1; h++){
                for(let v = c -1; v <= c + 1; v++){
                    if((0 <= h) && (h < rows) && (0 <= v) && (v < cols)){
                        if(!((r === h) && (c === v))){
                            if(field[h][v] !== 9){
                                field[h][v] += 1;
                            }
                        }
                    }
                }
            }
        }
    }
    
    const reveal = (row, col, isZero) =>{
        remainingSquares -= 1;
        let thisnum;
        let $clicked;
        if(!isZero){
            $clicked = $(`.blank[data-row='${row}'][data-col='${col}']`);
            row = Number(row[3]);
            col = Number(col[3]);
            thisnum = field[row][col];
        } else {
            $clicked = $(`.blank[data-row='row${row}'][data-col='col${col}']`);
            thisnum = field[row][col];
        }
        $clicked.attr('revealed', true);
        switch(thisnum){
            case 0:
                $clicked.off();
                $clicked.css('background', `url('./images/Empty.png')`);
                zero(row, col);           
                break;
            case 9:
                $('button').off();
                $clicked.css('background', `url('./images/ClickedMine.png')`);
                gameOver(row, col);
                break;
            default:
                $clicked.off();
                $clicked.css('background', `url('./images/num${thisnum}.png')`);
        }
        if(remainingSquares === 0){
            win();
        }
    }
    
    const zero = (row, col) =>{
        for(let r=row-1; r<=row+1; r++){
            for(let c=col-1; c<=col+1; c++){
                if((0 <= r) && (r < ROW) && (0 <= c) && (c < COL)){
                    if(!((r === row) && (c === col))){
                        let revealed = $(`.blank[data-row='row${r}'][data-col='col${c}']`).attr('revealed');
                        if(revealed === 'true'){
                            revealed = true;
                        } else {
                            revealed = false;
                        }
                        if(!revealed){
                            reveal(r, c, true);
                        }
                    }
                }
            }
        }
    }
    
    const gameOver = (row, col) =>{
        mineLocations.forEach(function(m){
            //console.log(m.row, m.col);
            if(!((m.row === row) && (m.col === col))){
                $(`.blank[data-row='row${m.row}'][data-col='col${m.col}']`).css('background', `url('./images/Mine.png')`);
            }
        });
        //switch face to dead, stop timer
    }
    
    const win = () =>{
        console.log('You WIN!');
        //stop timer
        //mark flags that were on not mines
        mineLocations.forEach(function(m){
            $(`.blank[data-row='row${m.row}'][data-col='col${m.col}']`).css('background', `url('./images/Flag.png')`);
            $(`.blank[data-row='row${m.row}'][data-col='col${m.col}']`).off();
        });
        //switch face to sunglasses
    }


    addToDOM(ROW, COL);
}

game();