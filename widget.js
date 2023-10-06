const gridId = 'grid';
const squareId = 'square';
const valueInputId = 'valueInput';

const size = 4;
const maxValue = size;

// add generator
const game = [
    [3, null, 4, null],
    [null, 1, null, 2],
    [null, 4, null, 3],
    [2, null, 1, null],
];

// change this values during the game
const gameData = [...game];

// build from size automatically
const blocksHash = {
    0: {
        start: 0,
        end: 1,
        block: 1,
    },
    1: {
        start: 0,
        end: 1,
        block: 1,
    },
    2: {
        start: 2,
        end: 3,
        block: 2,
    },
    3: {
        start: 2,
        end: 3,
        block: 2,
    },
};

const hasDuplicates = (list) => {
    const values = list.filter((item) => item != null)
    const allUniqValues = new Set(values);
    
    return values.length !== allUniqValues.size;
}

const hasRowError = (row) => hasDuplicates(gameData[row]);
const hasColumnError = (col) => hasDuplicates(gameData.map((row) => row[col]));
const hasBlockError = (row, col) => {
    const values = [];

    for (let i = blocksHash[row].start; i <= blocksHash[row].end; i++) {
        for (let j = blocksHash[col].start; j <= blocksHash[col].end; j++) {
            values.push(gameData[i][j]);
        }
    }

    return hasDuplicates(values);
};

const getIndex = (row, col) => row * size + col + 1;
const createBlockAttrValue = (row, col) => `${blocksHash[row].block}-${blocksHash[col].block}`;

const buildBoard = () => {
    const container = document.getElementById(gridId);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const item = document.createElement('div');
            
            item.classList.add(squareId);
            item.id = getIndex(i, j);
            item.setAttribute('row', `${i + 1}`);
            item.setAttribute('col', `${j + 1}`);
            item.setAttribute('block', createBlockAttrValue(i, j));
            
            container.appendChild(item);
        }
    }
};

const checkCompleteness = () => {
    const hasEmptyValues = gameData.flat().includes(null);

    if (hasEmptyValues) return;
    
    const container = document.getElementById(gridId);
    container.classList.add('completed');

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const value = gameData[i][j];
            const index = getIndex(i, j);
            const node = document.getElementById(`${index}`);
            
            node.textContent = value;
        }
    }
}

const updateErrors = (row, col) => {
    const rowError = hasRowError(row);
    const colError = hasColumnError(col);
    const blockError = hasBlockError(row, col);

    const container = document.getElementById(gridId);

    const rowNodes = container.querySelectorAll(`.${squareId}[row='${row + 1}']`);
    rowNodes.forEach((node) => {
        if (rowError) {
            node.classList.add('rowError');
        } else {
            node.classList.remove('rowError')
        }
    })

    const colNodes = container.querySelectorAll(`.${squareId}[col='${col + 1}']`);
    colNodes.forEach((node) => {
        if (colError) {
            node.classList.add('colError');
        } else {
            node.classList.remove('colError')
        }
    })

    const blockNodes = container.querySelectorAll(`.${squareId}[block='${createBlockAttrValue(row, col)}']`);
    blockNodes.forEach((node) => {
        if (blockError) {
            node.classList.add('blockError');
        } else {
            node.classList.remove('blockError')
        }
    })
};

const createOninputHandler = (row, col) => (event) => {
    const { data } = event;
    
    if (!data) {
        gameData[row][col] = null;
        
        updateErrors(row, col);
        return;
    }

    const value = parseInt(data);

    if (!value || value < 1 || value > maxValue) {
        event.target.value = gameData[row][col];
        return;
    }

    gameData[row][col] = value;
    
    updateErrors(row, col);
    checkCompleteness();
};

const createInput = (onInputhandler) => {
    const input = document.createElement('input');     
    input.maxLength = 1;
    input.type = 'text';
    input.classList.add(valueInputId);
    input.oninput = onInputhandler;

    return input;
};

const setInitialValues = () => {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const value = game[i][j];
            const index = getIndex(i, j);
            const node = document.getElementById(`${index}`);
            
            if (value !== null) {
                node.textContent = value;
            } else {
                const onInputhandler = createOninputHandler(i, j);
                const input = createInput(onInputhandler);
            
                node.appendChild(input);
            }
        }
    }
};

buildBoard();
setInitialValues();