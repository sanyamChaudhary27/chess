const blocks = document.querySelectorAll('.white-block, .black-block');
let selectedSquare = null;
let moves = null;
let positions = [];
let movesDone = [];
let currentColor = 'white';

const rows = [1, 2, 3, 4, 5, 6, 7, 8];
const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

columns.forEach(i => {
    for (let j=1; j<=8; j++){
        positions.push(`${i}${j}`);
    }
})

function moveMade(color){
    if (color === 'white'){
        currentColor = 'black';
    } else {
        currentColor = 'white';
    }
}


console.log("All positions: ", positions);

function clearHighlight() {
    blocks.forEach(b => {
        if (b.classList.contains("white-block")) {
            b.style.backgroundColor = '#e9fff4';
        } else {
            b.style.backgroundColor = '#22804b';
        }
        b.style.outline = "none";
    });
}

function getPieceColor(position) {
    let block = document.querySelector(`.${position}`);
    if (!block) return null;
    let piece = block.querySelector(".white, .black");
    if (piece) return piece.classList[0];
    return null;
}

function isOccupied(position) {
    let block = document.querySelector(`.${position}`);
    let piece = block.querySelector(".white, .black");
    if (piece) {
        // console.log("isOccupied returned: ", piece.classList);
        // console.log("What could be returned: ", position);
        // return piece.classList;
        return position;
    }
    else {
        return 0;
    };
}

function pawnMove(color, position) {
    let column = position[0];
    let row = Number(position[1]); 
    let move = []

    if (color === 'white') {
        let toCheckCol1 = null;
        let toCheckCol2 = null;
        const toCheckRow = row + 1;

        if (isOccupied(`${column}${row+1}`) === 0){
            move.push(`${column}${row+1}`)
            if (row === 2 && isOccupied(`${column}${row+2}`) === 0){
                move.push(`${column}${row+2}`);
            }
        }

        let columnIndex = columns.indexOf(column);
        if (columnIndex > 0) toCheckCol1 = columns[columnIndex - 1];
        if (columnIndex < 7) toCheckCol2 = columns[columnIndex + 1];
        

        if (toCheckCol1 && getPieceColor(`${toCheckCol1}${toCheckRow}`) === 'black'){
            move.push(`${toCheckCol1}${toCheckRow}`);
        }
        if (toCheckCol2 && getPieceColor(`${toCheckCol2}${toCheckRow}`) === 'black'){
            move.push(`${toCheckCol2}${toCheckRow}`);
        }
    }

    else if (color === 'black') {
        let toCheckCol1 = null;
        let toCheckCol2 = null;
        const toCheckRow = row - 1;

        if (isOccupied(`${column}${row-1}`) === 0){
            move.push(`${column}${row-1}`)
            if (row === 7 && isOccupied(`${column}${row-2}`) === 0){
                move.push(`${column}${row-2}`);
            }
        } 

        let columnIndex = columns.indexOf(column);
        if (columnIndex > 0) toCheckCol1 = columns[columnIndex - 1];
        if (columnIndex < 7) toCheckCol2 = columns[columnIndex + 1];
        

        if (toCheckCol1 && getPieceColor(`${toCheckCol1}${toCheckRow}`) === 'white'){
            move.push(`${toCheckCol1}${toCheckRow}`);
        }
        if (toCheckCol2 && getPieceColor(`${toCheckCol2}${toCheckRow}`) === 'white'){
            move.push(`${toCheckCol2}${toCheckRow}`)
        }
    }
    return move;
}

function moveThePawn(from, to){
    const pieceFrom = document.querySelector(`.${from}`);
    const blockTo = document.querySelector(`.${to}`);
    blockTo.innerHTML = pieceFrom.innerHTML;
    pieceFrom.innerHTML = '';
    moveMade(blockTo.querySelector('.black, .white').classList[0]);
}

function rookMove(color, position){

}

function moveTheRook(from, to){

}

function knightMove(color, position){

}

function moveTheKnight(from, to){

}

function queenMove(color, position){

}

function moveTheQueen(from, to){

}

function kingMove(color, position){

}

function moveTheKing(from, to){

}

function checkEnPessant(){

}

function checkChecks(){

}

function checkCheckMate(){
    
}

blocks.forEach(block => {
    block.addEventListener('click', () => {
        clearHighlight();
        let pieceInBlock = block.querySelector(".white, .black");

        // First Click
        if (selectedSquare === null) {
            if (pieceInBlock) {
                selectedSquare = block;
                if (getPieceColor(selectedSquare.classList[1]) === currentColor){
                    block.style.outline = "4px solid yellow";

                    //Block for the operations of Pawn
                    if (pieceInBlock.classList.contains('pawn')) {
                        const color = pieceInBlock.classList[0];
                        const pos = block.classList[1];
                        moves = pawnMove(color, pos);
                        console.table(moves);

                        // Show available moves on the board
                        moves.forEach(movePos =>{
                            let optionSquare = document.querySelector(`.${movePos}`);
                            if (optionSquare){
                                optionSquare.style.backgroundColor = '#59becb';
                            }
                        })
                    }
                }
            }
        } 
        // Second Click
        else {
            let selectedPiece = selectedSquare.querySelector(".white, .black");
            const fromPos = selectedSquare.classList[1];
            const toPos = block.classList[1];
            
            if (block === selectedSquare) {
                selectedSquare.style.outline = "none";
                selectedSquare = null;
                return;
            }

            if (selectedSquare && pieceInBlock && pieceInBlock.classList[0] === selectedPiece.classList[0]) {
                selectedSquare.style.outline = "none";
                selectedSquare = null;
                selectedSquare = block;
                selectedPiece = selectedSquare.querySelector(".white, .black");
                pieceInBlock = selectedPiece;
                selectedSquare.style.outline = "4px solid yellow";
                if (pieceInBlock.classList.contains('pawn')) {
                    const color = pieceInBlock.classList[0];
                    const pos = block.classList[1];
                    moves = pawnMove(color, pos);
                    console.log("Available moves: ", moves);
                };
                return; 
            }

            // block.innerHTML = selectedSquare.innerHTML;
            // selectedSquare.innerHTML = "";
            console.log("Trying to move from ", fromPos, " to ", toPos);
            if (moves && moves.includes(toPos)) {
                moveThePawn(fromPos, toPos);
                selectedSquare.style.outline = "none";
                selectedSquare = null;
                moves = null;
            } else {
                console.log("Illegal move!");
                return;
            }
        }
    });
})