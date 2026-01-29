const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#Reset");

let isPlayerX = true;
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let gameActive = true;

const reset = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.textContent = "";
    });
    isPlayerX = true;
    gameActive = true;
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boxes[a].textContent && 
            boxes[a].textContent === boxes[b].textContent &&
            boxes[b].textContent === boxes[c].textContent) {
            return boxes[a].textContent;
        }
    }
    return null;
};

const isGameDrawn = () => {
    return Array.from(boxes).every(box => box.textContent !== "");
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!gameActive || box.textContent) return;

        box.textContent = isPlayerX ? "X" : "O";
        box.disabled = true;

        const winner = checkWinner();
        if (winner) {
            setTimeout(() => {
                alert(`Player ${winner} wins! Congratulations!`);
                reset();
            }, 300);
            gameActive = false;
            return;
        }

        if (isGameDrawn()) {
            setTimeout(() => {
                alert("Game Draw! It's a tie.");
                reset();
            }, 300);
            gameActive = false;
            return;
        }

        isPlayerX = !isPlayerX;
    });
});

resetBtn.addEventListener("click", reset);



