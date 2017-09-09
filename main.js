let COL = 10;
let ROW = 10;
let MINES = 20;


for(let r = 0; r < ROW; r++){
    let $newRow = $(`<div class='row'></div>`);
    for(let c = 0; c < COL; c++){
        let $newSpace = $(`<button class='blank' data-row='row${r}' data-col='col${c}'/>`)
        $newRow.append($newSpace);
    }
    $('.game').append($newRow);
}

$('.game .blank').on({
    'mousedown': function(event){
        $(event.target).css('background', `url('./images/Empty.png')`)
    },
    'mouseup': function(event){
        $(event.target).css('background', `url('./images/Blank.png')`)        
    },
    'mouseleave': function(event){
        $(event.target).css('background', `url('./images/Blank.png')`)
    },
    'click': function(event){
        let col = $(event.target).attr('data-col')
        let row = $(event.target).attr('data-row')
        console.log(col, row)
        switch(event.which){
            case 1: /*reveal()*/ console.log('left'); break;
            case 3: /*flag()*/ console.log('right'); break;
        }
    }
})