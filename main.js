// $('h1').fadeIn();
// let boxNum = 0;
// let box = $(`<button id='num${boxNum}'/>`);
// $('div.game').append(box);

// boxNum = 3;
// let three = $(`<button id='num${boxNum}'/>`);
// $('div.game').append(three);

$('body').append

const MAX_COL = 3;
const MAX_ROW = 3;

for(let r = 0; r < MAX_ROW; r++){
    for(let c = 0; c < MAX_COL; c++){
        let $newSpace = $(`<button class='blank' data-row='row${r}' data-col='col${c}'/>`)
        $('div.game').append($newSpace);
    }
}

// for(let i=0; i < 10; i++){
//     $('div.game').append($(`<button class='blank' data-id='num${i}'/>`));
// }

// for(let i=0; i < 10; i++){
//     $('div.game').append($(`<button class='num${i}'/>`));
// }

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
        let col = $(event.target).attr('data-col');
        let row = $(event.target).attr('data-row');
        console.log(col, row)
    }
})
/*
 *$('box').on({
     'click': function(event){
        swithc(event.which){
            case 1: reveal(); break;
            case 3: flag();   break;
            default: break;
        }
     })
 }) 
 * 
 * 
 * 
 * 
 */