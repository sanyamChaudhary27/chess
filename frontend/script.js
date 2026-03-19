const blocks = document.querySelectorAll('.white-block, .black-block');
let selectedSquare = null;
let moves = null;
let positions = [];
let movesDone = {
    'white': [],
    'black': []
};
let currentColor = 'white';
let lastMove = {
    'piece': null,
    'from': null,
    'to': null,
    'color': null
}

const rows = [1, 2, 3, 4, 5, 6, 7, 8];
const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

columns.forEach(i => {
    for (let j=1; j<=8; j++){
        positions.push(`${i}${j}`);
    }
})

function moveMade(){
    if (currentColor === 'white'){
        currentColor = 'black';

    } else {
        currentColor = 'white';
    }
    updateCheckUI();
}


console.log("All positions: ", positions);

function clearHighlight() {
    blocks.forEach(b => {
        if (b.classList.contains("white-block")) {
            b.style.backgroundColor = '#e9fff4';
        } else {
            b.style.backgroundColor = '#22804b';
        }
        if (b.style.outlineColor !== "red") {
            b.style.outline = "none";
        }
    });
}

function updateCheckUI() {
    ['white', 'black'].forEach(color => {
        const kingPiece = document.querySelector(`.king.${color}`);
        if (kingPiece) {
            const kingSquare = kingPiece.parentElement;
            if (checkInCheck(color)) {
                kingSquare.style.outline = "4px solid red";
                kingSquare.style.outlineOffset = "-4px";
            }
        }
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
    if (checkEnPessant(color, position)){
        move.push(checkEnPessant(color, position));
    }
    return move;
}

function moveThePawn(from, to) {
    const fromBlock = document.querySelector(`.${from}`);
    const toBlock = document.querySelector(`.${to}`);
    const movingPieceHTML = fromBlock.innerHTML;
    
    if (fromBlock.querySelector('.pawn') && from[0] !== to[0] && toBlock.innerHTML === "") {
        const capturedPawnRow = from[1];
        const capturedPawnCol = to[0];
        document.querySelector(`.${capturedPawnCol}${capturedPawnRow}`).innerHTML = "";
    }

    if ((to[1] === '8' && currentColor === 'white') || (to[1] === '1' && currentColor === 'black')) {
        pawnPromotion(currentColor, to);
        fromBlock.innerHTML = '';
        lastMove = { piece: 'queen', from: from, to: to, color: currentColor };
        moveMade();
        return;
    }

    toBlock.innerHTML = movingPieceHTML;
    fromBlock.innerHTML = '';
    
    lastMove = { piece: 'pawn', from: from, to: to, color: currentColor };
    moveMade();
}

function rookMove(color, position){
    let column = [...position][0];
    let row = Number([...position][1]);
    let move = [];

    for (let r = row + 1; r <= 8; r++) {
        let target = `${column}${r}`;
        if (isOccupied(target)) {
            if (getPieceColor(target) !== color) move.push(target);
            break;
        }
        move.push(target);
    }

    for (let r = row - 1; r >= 1; r--) {
        let target = `${column}${r}`;
        if (isOccupied(target)) {
            if (getPieceColor(target) !== color) move.push(target);
            break;
        }
        move.push(target);
    }

    for (let c = columns.indexOf(column) - 1; c >= 0; c--) {
        let target = `${columns[c]}${row}`;
        if (isOccupied(target)) {
            if (getPieceColor(target) !== color) move.push(target);
            break;
        }
        move.push(target);
    }

    for (let c = columns.indexOf(column) + 1; c < 8; c++) {
        let target = `${columns[c]}${row}`;
        if (isOccupied(target)) {
            if (getPieceColor(target) !== color) move.push(target);
            break;
        }
        move.push(target);
    }
    return move;   
}

function moveTheRook(from, to){
    const fromBlock = document.querySelector(`.${from}`);
    const toBlock = document.querySelector(`.${to}`);

    if (fromBlock.querySelector('.rook') && from[0] !== to[0] && toBlock.innerHTML === "") {
        const capturedRookRow = from[1];
        const capturedRookCol = to[0];
        document.querySelector(`.${capturedRookCol}${capturedRookRow}`).innerHTML = "";
    }

    toBlock.innerHTML = fromBlock.innerHTML;
    fromBlock.innerHTML = '';

    lastMove = { piece: 'rook', from: from, to: to, color: currentColor };
    moveMade();
}

function knightMove(color, position){
    let column = [...position][0];
    let row = Number([...position][1]);
    let move = [];

    const toCheck = [
        `${columns[columns.indexOf(column)+1]}${row+2}`,
        `${columns[columns.indexOf(column)-1]}${row+2}`,
        `${columns[columns.indexOf(column)+2]}${row+1}`,
        `${columns[columns.indexOf(column)-2]}${row+1}`,

        `${columns[columns.indexOf(column)+1]}${row-2}`,
        `${columns[columns.indexOf(column)+2]}${row-1}`,
        `${columns[columns.indexOf(column)-1]}${row-2}`,
        `${columns[columns.indexOf(column)-2]}${row-1}`,
    ]
    toCheck.forEach(pos => {
        if (!(columns.indexOf([...pos][0]) > 7 || columns.indexOf([...pos][0]) < 0 || [...pos][1] > 8 || [...pos][1] < 1)){
            if (positions.includes(pos)){
                if (isOccupied(pos) === 0 || getPieceColor(pos) !== color){
                    move.push(pos);
                }
            }
        }
    });
    return move;
}

function moveTheKnight(from, to){
    const fromBlock = document.querySelector(`.${from}`);
    const toBlock = document.querySelector(`.${to}`);

    toBlock.innerHTML = fromBlock.innerHTML;
    fromBlock.innerHTML = '';

    lastMove = { piece: 'knight', from: from, to: to, color: currentColor };
    moveMade();
}

function bishopMove(color, position) {
    let column = position[0];
    let row = Number(position[1]);
    let colIdx = columns.indexOf(column);
    let move = [];

    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    directions.forEach(([rDir, cDir]) => {
        let r = row + rDir;
        let c = colIdx + cDir;

        while (r >= 1 && r <= 8 && c >= 0 && c <= 7) {
            let target = `${columns[c]}${r}`;
            if (isOccupied(target)) {
                if (getPieceColor(target) !== color) move.push(target);
                break;
            }
            move.push(target);
            r += rDir;
            c += cDir;
        }
    });
    return move;
}

function moveTheBishop(from, to){
    const fromBlock = document.querySelector(`.${from}`);
    const toBlock = document.querySelector(`.${to}`);

    toBlock.innerHTML = fromBlock.innerHTML;
    fromBlock.innerHTML = '';

    lastMove = { piece: 'bishop', from: from, to: to, color: currentColor };
    moveMade();
}

function queenMove(color, position){
    const straightMove = rookMove(color, position);
    const diagonalMove = bishopMove(color, position);
    return [...straightMove, ...diagonalMove];
}

function moveTheQueen(from, to){
    const fromBlock = document.querySelector(`.${from}`);
    const toBlock = document.querySelector(`.${to}`);

    toBlock.innerHTML = fromBlock.innerHTML;
    fromBlock.innerHTML = '';

    lastMove = { piece: 'queen', from: from, to: to, color: currentColor };
    moveMade();
}

function kingMove(color, position) {
    const column = position[0];
    const row = Number(position[1]);
    const colIdx = columns.indexOf(column);
    const moves = [];
    const enemyColor = (color === 'white') ? 'black' : 'white';

    const offsets = [
        [1, 0], [1, 1], [0, 1], [-1, 1], 
        [-1, 0], [-1, -1], [0, -1], [1, -1]
    ];

    offsets.forEach(([cOff, rOff]) => {
        const targetColIdx = colIdx + cOff;
        const targetRow = row + rOff;

        if (targetColIdx >= 0 && targetColIdx <= 7 && targetRow >= 1 && targetRow <= 8) {
            const target = `${columns[targetColIdx]}${targetRow}`;
            const targetOccupied = isOccupied(target);
            
            if (targetOccupied === 0 || getPieceColor(target) !== color) {
                if (!isInCheck(target, enemyColor)) {
                    moves.push(target);
                }
            }
        }
    });
    return moves;
}

function moveTheKing(from, to){
    const fromBlock = document.querySelector(`.${from}`);
    const toBlock = document.querySelector(`.${to}`);

    toBlock.innerHTML = fromBlock.innerHTML;
    fromBlock.innerHTML = '';

    lastMove = { piece: 'king', from: from, to: to, color: currentColor };
    moveMade();
}

function checkEnPessant(color, pos) {
    const col = [...pos][0];
    const row = Number([...pos][1]);

    if (!lastMove.to) return null;

    if (color === 'white' && row !== 5) return null;
    if (color === 'black' && row !== 4) return null;

    const lastToCol = lastMove.to[0];
    const lastToRow = Number(lastMove.to[1]);
    const lastFromRow = Number(lastMove.from[1]);

    const doubleJump = Math.abs(lastToRow - lastFromRow) === 2;

    if (doubleJump) {
        const colIdx = columns.indexOf(col);
        const lastColIdx = columns.indexOf(lastToCol);
        let targetRow;

        if (Math.abs(colIdx - lastColIdx) === 1) {
            if (color === 'white') {
                targetRow = 6;
            } else {
                targetRow = 3;
            }
            return `${lastToCol}${targetRow}`;
        }
    }
    return null;
}

function isInCheck(position, enemyColor) {
    const enemyPieces = document.querySelectorAll(`.${enemyColor}`);
    
    for (let piece of enemyPieces) {
        const pieceType = piece.classList[1];
        const piecePos = piece.parentElement.classList[1];
        let possibleMoves = [];

        if (pieceType === 'pawn') possibleMoves = pawnMove(enemyColor, piecePos);
        else if (pieceType === 'rook') possibleMoves = rookMove(enemyColor, piecePos);
        else if (pieceType === 'bishop') possibleMoves = bishopMove(enemyColor, piecePos);
        else if (pieceType === 'knight') possibleMoves = knightMove(enemyColor, piecePos);
        else if (pieceType === 'queen') possibleMoves = queenMove(enemyColor, piecePos);
        else if (pieceType === 'king') {
            const colIdx = columns.indexOf(piecePos[0]);
            const row = Number(piecePos[1]);
            const offsets = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
            offsets.forEach(([co, ro]) => {
                possibleMoves.push(`${columns[colIdx+co]}${row+ro}`);
            });
        }

        if (possibleMoves.includes(position)) return true;
    }
    return false;
}

function checkInCheck(color) {
    const kingPiece = document.querySelector(`.king.${color}`);
    if (!kingPiece) return false;
    const kingPos = kingPiece.parentElement.classList[1];
    const enemyColor = (color === 'white') ? 'black' : 'white';
    
    return isInCheck(kingPos, enemyColor);
}

function isInCheck(position, enemyColor) {
    const enemyPieces = document.querySelectorAll(`.${enemyColor}`);
    
    for (let piece of enemyPieces) {
        const pieceType = piece.classList[1];
        const piecePos = piece.parentElement.classList[1];
        let moves = [];

        if (pieceType === 'pawn') {
            const cIdx = columns.indexOf(piecePos[0]);
            const r = Number(piecePos[1]);
            const side = (enemyColor === 'white') ? 1 : -1;
            if (columns[cIdx-1]) moves.push(`${columns[cIdx-1]}${r+side}`);
            if (columns[cIdx+1]) moves.push(`${columns[cIdx+1]}${r+side}`);
        } 
        else if (pieceType === 'knight') moves = knightMove(enemyColor, piecePos);
        else if (pieceType === 'rook') moves = rookMove(enemyColor, piecePos);
        else if (pieceType === 'bishop') moves = bishopMove(enemyColor, piecePos);
        else if (pieceType === 'queen') moves = queenMove(enemyColor, piecePos);
        else if (pieceType === 'king') {
            const cIdx = columns.indexOf(piecePos[0]);
            const r = Number(piecePos[1]);
            const offsets = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
            offsets.forEach(([co, ro]) => {
                const target = `${columns[cIdx+co]}${r+ro}`;
                if (positions.includes(target)) moves.push(target);
            });
        }

        if (moves.includes(position)) return true;
    }
    return false;
}

function getRawMoves(pieceType, color, position) {
    if (pieceType === 'pawn') return pawnMove(color, position);
    else if (pieceType === 'rook') return rookMove(color, position);
    else if (pieceType === 'bishop') return bishopMove(color, position);
    else if (pieceType === 'knight') return knightMove(color, position);
    else if (pieceType === 'queen') return queenMove(color, position);
    else if (pieceType === 'king') {
        const column = position[0];
        const row = Number(position[1]);
        const colIdx = columns.indexOf(column);
        const moves = [];
        const offsets = [
            [1, 0], [1, 1], [0, 1], [-1, 1],
            [-1, 0], [-1, -1], [0, -1], [1, -1]
        ];

        offsets.forEach(([cOff, rOff]) => {
            const targetColIdx = colIdx + cOff;
            const targetRow = row + rOff;

            if (targetColIdx >= 0 && targetColIdx < columns.length && targetRow >= 1 && targetRow <= 8) {
                moves.push(`${columns[targetColIdx]}${targetRow}`);
            }
        });

        return moves;
    }
}

function pawnPromotion(color, position) {
    const block = document.querySelector(`.${position}`);
    const pieceSymbol = (color === 'white') ? '&#9813;' : '&#9819;';
    
    block.innerHTML = `<div class="${color} queen">${pieceSymbol}</div>`;
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
                    }
                    else if (pieceInBlock.classList.contains('rook')) {
                        const color = pieceInBlock.classList[0];
                        const pos = block.classList[1];
                        moves = rookMove(color, pos);
                        console.table(moves);
                    }
                    else if (pieceInBlock.classList.contains('knight')) {
                        const color = pieceInBlock.classList[0];
                        const pos = block.classList[1];
                        moves = knightMove(color, pos);
                        console.table(moves);
                    }
                    else if (pieceInBlock.classList.contains('bishop')) {
                        const color = pieceInBlock.classList[0];
                        const pos = block.classList[1];
                        moves = bishopMove(color, pos);
                        console.table(moves);
                    }
                    else if (pieceInBlock.classList.contains('queen')) {
                        const color = pieceInBlock.classList[0];
                        const pos = block.classList[1];
                        moves = queenMove(color, pos);
                        console.table(moves);
                    }
                    else if (pieceInBlock.classList.contains('king')) {
                        const color = pieceInBlock.classList[0];
                        const pos = block.classList[1];
                        moves = kingMove(color, pos);
                        console.table(moves);
                    }
                    if (moves){
                        // Show available moves on the board
                        moves.forEach(movePos =>{
                            let optionSquare = document.querySelector(`.${movePos}`);
                            if (optionSquare){
                                optionSquare.style.backgroundColor = '#59becb';
                            }
                        })
                    }
                }
                else {
                    return;
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

            if (selectedSquare && pieceInBlock && pieceInBlock.classList[0] === selectedPiece.classList[0] && pieceInBlock.classList.contains(currentColor)) {
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
                }
                else if (pieceInBlock.classList.contains('rook')) {
                    const color = pieceInBlock.classList[0];
                    const pos = block.classList[1];
                    moves = rookMove(color, pos);
                    console.log("Available Rook moves: ", moves);
                }
                else if (pieceInBlock.classList.contains('knight')) {
                    const color = pieceInBlock.classList[0];
                    const pos = block.classList[1];
                    moves = knightMove(color, pos);
                    console.log("Available Knight moves: ", moves);
                }
                else if (pieceInBlock.classList.contains('bishop')) {
                    const color = pieceInBlock.classList[0];
                    const pos = block.classList[1];
                    moves = bishopMove(color, pos);
                    console.log("Available Bishop moves: ", moves);
                }
                else if (pieceInBlock.classList.contains('queen')) {
                    const color = pieceInBlock.classList[0];
                    const pos = block.classList[1];
                    moves = queenMove(color, pos);
                    console.log("Available queen moves: ", moves);
                }
                else if (pieceInBlock.classList.contains('king')) {
                    const color = pieceInBlock.classList[0];
                    const pos = block.classList[1];
                    moves = kingMove(color, pos);
                    console.log("Available king moves: ", moves);
                }
                if (moves) {
                    moves.forEach(movePos => {
                        let optionSquare = document.querySelector(`.${movePos}`);
                        if (optionSquare) optionSquare.style.backgroundColor = '#59becb';
                    });
                }
                if (checkInCheck(currentColor)){
                    const kingSquare = document.querySelector(`.king.${currentColor}`).parentElement;
                    alert("Check!");
                    kingSquare.style.outline = "4px solid red";
                }
                if (checkCheckMate(currentColor, fromPos)){
                    const kingSquare = document.querySelector(`.king.${currentColor}`).parentElement;
                    alert(`Checkmate! ${currentColor === 'white' ? 'Black' : 'White'} wins!`);
                    kingSquare.style.outline = "4px solid red";
                }
                return; 
            }

            console.log("Trying to move from ", fromPos, " to ", toPos);
            console.log("Moves logs: ");
            console.table(movesDone);
            if (moves && moves.includes(toPos)) {
                if (selectedSquare.querySelector('.pawn')){
                    moveThePawn(fromPos, toPos);
                    movesDone[currentColor].push(toPos);
                }
                else if (selectedSquare.querySelector('.rook')){
                    console.log("Rook move from ", fromPos, " to ", toPos);
                    moveTheRook(fromPos, toPos);
                    movesDone[currentColor].push(toPos);
                }
                else if (selectedSquare.querySelector('.knight')){
                    console.log("Knight moves from ", fromPos, " to ", toPos);
                    moveTheKnight(fromPos, toPos);
                    movesDone[currentColor].push(toPos);
                }
                else if (selectedSquare.querySelector('.bishop')){
                    console.log("Bishop moves from ", fromPos, " to ", toPos);
                    moveTheBishop(fromPos, toPos);
                    movesDone[currentColor].push(toPos);
                }
                else if (selectedSquare.querySelector('.queen')){
                    console.log("Queen moves from ", fromPos, " to ", toPos);
                    moveTheQueen(fromPos, toPos);
                    movesDone[currentColor].push(toPos);
                }
                else if (selectedSquare.querySelector('.king')){
                    console.log("King moves from ", fromPos, " to ", toPos);
                    moveTheKing(fromPos, toPos);
                    movesDone[currentColor].push(toPos);
                }
                selectedSquare.style.outline = "none";
                selectedSquare = null;
                moves = null;

            } else {
                console.log("Illegal move!");
                selectedSquare.style.outline = 'none';
                selectedSquare = null;
                return;
            }
        }
    });
})