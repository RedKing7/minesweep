// $('h1').fadeIn();
// let boxNum = 0;
// let box = $(`<button id='num${boxNum}'/>`);
// $('div.game').append(box);

// boxNum = 3;
// let three = $(`<button id='num${boxNum}'/>`);
// $('div.game').append(three);

$('body').append

for(let i=0; i < 10; i++){
    $('div.game').append($(`<button id='blank'/>`));
}

for(let i=0; i < 10; i++){
    $('div.game').append($(`<button id='num${i}'/>`));
}

$('button#blank').on({
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
        let thisBox = 0;
        console.log(`${thisBox} was clicked`)
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