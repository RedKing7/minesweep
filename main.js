var difficulty;

$('#reset').on('click', function(){
    newGame();
})

$('#easy').on('click', function(){
    difficulty = 0;
    newGame();
})

$('#medium').on('click', function(){
    difficulty = 1;
    newGame();
})

$('#hard').on('click', function(){
    difficulty = 2;
    newGame();
})

const game = (choice) =>{
    //set ROWs and COLs and MINES
    var difficulty = [{
        rows: 8,
        columns: 8,
        mines: 10
    },{
        rows: 16,
        columns: 16,
        mines: 40
    },{
        rows: 16,
        columns: 30,
        mines: 99
    }];

    var ROW = difficulty[choice].rows;
    var COL = difficulty[choice].columns;
    var MINES = difficulty[choice].mines;

    var minesLeft = MINES; //used for left LCD counter

    var field = [[]];

    var mineLocations = [];
    
    var firstClick = true;

    var remainingSquares = (COL*ROW)-MINES;

    //add field of blank buttons to the DOM
    for(let r = 0; r < ROW; r++){
        let $newRow = $(`<div class='row'></div>`);
        for(let c = 0; c < COL; c++){
            let $newSpace = $(`<button class='blank' data-row='row${r}' data-col='col${c}'/>`);
            $newSpace.attr('revealed', false);
            $newRow.append($newSpace);
        }
        $('#game').append($newRow);
    }

    //define event handlers
    const Click = (event) =>{       //handles left clicks
        let row = $(event.target).attr('data-row')
        let col = $(event.target).attr('data-col')
        $(event.target).removeClass('hidden');                
        if(firstClick){
            makeField(row, col);
        } else {
            reveal(row, col);
        }
    }
    const MouseLeave = (event) =>{  //purely cosmetic
        $(event.target).css('background', `url('./images/Blank.png')`)
        $('#reset').css('background', `url('./images/Smiley.png')`)
    }
    const MouseUp = (event) =>{     //also cosmetic
        $(event.target).css('background', `url('./images/Blank.png')`)
        $('#reset').css('background', `url('./images/Smiley.png')`)
    }
    const MouseDown = (event) =>{   //biggest and messiest because of right clicking + flagging
        if(event.which === 3){
            $('#reset').css('background', `url('./images/Smiley.png')`)                    
            let $this = $(event.target);
            if(($this.hasClass('blank')) && !($this.hasClass('unknown'))){                            //if blank and not unknown
                $this.off('mouseup', MouseUp);                      //remove listeners
                $this.off('mouseleave', MouseLeave);
                $this.off('click', Click);
                $this.removeClass('blank').addClass('flag');        //remove blank class, add flag class
                $this.css('background', `url('./images/Flag.png')`);//change pic
                $this.attr('revealed', true);                       //set revealed
                minesLeft--;                                        //decrement 'mine' counter
            } else if($this.hasClass('flag')){                                  //if flagged
                $this.removeClass('flag').addClass('unknown').addClass('blank');//remove flag class, add unknown and blank class
                $this.css('background', `url('./images/Unknown.png')`);         //change pic
                $this.attr('revealed', false);                                  //set revealed to false
                $this.on('click', Click);                                       //turn click listener back on
                $this.on('mouseleave', MouseLeave);
                minesLeft++;                                        //un-decrement 'mine' counter
            } else if($this.hasClass('unknown')){                    //if unknown
                $this.removeClass('unknown');                        //remove unknown class
                $this.css('background', `url('./images/Blank.png')`);//change pic
                $this.on('mouseup', MouseUp);                        //put listeners back on
                $this.on('mouseleave', MouseLeave);
            }
        } else {
            if($(event.target).hasClass('blank')){
                $('#reset').css('background', `url('./images/Scared.png')`)                        
                $(event.target).css('background', `url('./images/Empty.png')`);                        
            }
        }
    }

    //add listeners to the buttons
    $('#game .blank').on({
        'mousedown': MouseDown,
        'mouseup': MouseUp,
        'mouseleave': MouseLeave,
        'click': Click
    })

    //distribute mines accross the field
    const placeMines = (fR, fC) =>{
        for(let m=0; m<MINES; m++){
            let r;
            let c;
            do{
                r = Math.floor(Math.random() * ROW);
                c = Math.floor(Math.random() * COL);
            }while((field[r][c] === 9) || ((r === fR) && (c === fC)));//make sure space isn't the first click or already a mine
            field[r][c] = 9;
            mineLocations.push({row: r, col: c});
        }
    }
    
    //create the minefield, then call placeMines
    const makeField = (firstRow, firstCol) =>{
        firstClick = false;
        for(let r=0; r<ROW; r++){
            field[r] = [];
            for(let c=0; c<COL; c++){
                field[r][c] = 0;
            }
        }
        fr = parseInt(firstRow.slice(3,firstRow.length), 10);//get number from 'rowN'
        fc = parseInt(firstCol.slice(3,firstCol.length), 10);//get number from 'colN'
        placeMines(fr, fc);
        getNums();
        reveal(firstRow,firstCol);
    }
    
    //add one to every space adjacent to a mine
    const getNums = () =>{
        for(let m=0; m<mineLocations.length; m++){
            let r = mineLocations[m].row;
            let c = mineLocations[m].col;
            for(let h = r - 1; h <= r + 1; h++){
                for(let v = c -1; v <= c + 1; v++){
                    if((0 <= h) && (h < ROW) && (0 <= v) && (v < COL)){//bounds check
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
    
    //reveal a space given the row and column
    const reveal = (row, col, isZero) =>{
        remainingSquares -= 1;
        let thisnum;
        let $clicked;
        if(!isZero){
            $clicked = $(`.blank[data-row='${row}'][data-col='${col}']`);
            typeof(row);
            row = parseInt(row.slice(3,row.length), 10);//'rowN'
            col = parseInt(col.slice(3,col.length), 10);
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
                $clicked.css('background', `url('./images/ClickedMine.png')`);
                gameOver(row, col);
                return;//make sure it doesn't call 'win()' after clicking a mine if there's only one clear space left
                break;
            default:
                $clicked.off();
                $clicked.css('background', `url('./images/num${thisnum}.png')`);
        }
        if(remainingSquares === 0){
            win();
        }
    }
    
    //handles clearing of spaces without adjacent mines
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
        $('button').off();//disable clicking any more buttons
        $('#reset').css('background', `url('./images/Dead.png')`)//kill the smiley
        //stop timer
        mineLocations.forEach(function(m){  //mark mines that weren't flagged
            if(!((m.row === row) && (m.col === col))){//don't touch the mine that was clicked
                let $mine = $(`[data-row='row${m.row}'][data-col='col${m.col}']`);
                if(!$mine.hasClass('flag')){
                    $mine.css('background', `url('./images/Mine.png')`);
                    $mine.addClass('isMine');
                }
            }
        });
        for(let row = 0; row < ROW; row++){ //mark flags that were on not mines with an X
            for(let col = 0; col < COL; col++){
                let $flag = $(`[data-row='row${row}'][data-col='col${col}']`);
                if($flag.hasClass('flag')){
                    if(field[row][col] !== 9){
                        $flag.css('background', `url('./images/NotMine.png')`);
                    }
                }
            }
        }
    }
    
    const win = () =>{
        //stop timer
        mineLocations.forEach(function(m){
            $(`.blank[data-row='row${m.row}'][data-col='col${m.col}']`).css('background', `url('./images/Flag.png')`);
            $(`.blank[data-row='row${m.row}'][data-col='col${m.col}']`).off();
        });
        $('#reset').css('background', `url('./images/Win.png')`)
    }
}

const newGame = () =>{
    $('#reset').css('background', `url('./images/Smiley.png')`)                        
    $('#game button').remove();
    $('.row').remove();
    game(difficulty);
}

difficulty = 0;
game(difficulty); //load page with an easy game