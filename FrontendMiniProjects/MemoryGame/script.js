const modalContainer = document.querySelector('.modal-container');
const themeNumbersBtn = modalContainer.querySelector('[data-theme="numbers"]');
const themeIconsBtn = modalContainer.querySelector('[data-theme="icons"]');

const gridWrapper = modalContainer.querySelector('.modal .box:nth-child(3) > .wrapper');
const grid4x4 = gridWrapper.querySelector('.btn.btn-blue:nth-child(1)');
const grid6x6 = gridWrapper.querySelector('.btn.btn-blue:nth-child(2)');

const playerContainer = modalContainer.querySelector('.modal .box:nth-child(2) > .wrapper');
const playerNumBtns = playerContainer.querySelectorAll('.btn.btn-blue');
const gridBoxContainer = document.querySelector('.gridBox');

const startGameBtn = modalContainer.querySelector('[data-btn="start-game"]');
const newGameBtn = modalContainer.querySelector('[data-btn="new-game"]');
const gameScreenContainer = document.querySelector('.gameScreen');
gameScreenContainer.style.display = "none";

const playerOneMovesDiv = document.querySelector('.moves-div.playerOne');

const containerEle = document.querySelector('.container');
const playerIndicationContainer = document.querySelector('.playerIndicationBx');

const resultModalContainer = document.querySelector('.resultModal');

let selectedTheme = "Numbers";
let selectedGridSize = "4x4";
let noOfPlayers = 1;
let activePlayerIndex = 0;
let players = [];
let movesCnt = 0;
let pairsCnt = 0;


for (let i = 0; i < playerNumBtns.length; i++) {
     playerNumBtns[i].addEventListener('click', (e) => {
          playerNumBtns.forEach((btn) => {
               if (btn !== playerNumBtns[i]) {
                    btn.classList.remove('active');
               }
          });
          playerNumBtns[i].classList.add('active');
          noOfPlayers = Number.parseInt(playerNumBtns[i].textContent);
     });
}

// Theme Switch
themeNumbersBtn.addEventListener('click', (e) => {
     handleClassActive(e.target, themeIconsBtn, "active");
     selectedTheme = e.target.textContent;
});

themeIconsBtn.addEventListener('click', (e) => {
     handleClassActive(e.target, themeNumbersBtn, "active");
     selectedTheme = e.target.textContent;
});

// Grid Size Switch
grid4x4.addEventListener('click', (e) => {
     handleClassActive(e.target, grid6x6, "active");
     selectedGridSize = "4x4";
});

grid6x6.addEventListener('click', (e) => {
     handleClassActive(e.target, grid4x4, "active");
     selectedGridSize = "6x6";
});

const handleClassActive = (clickedEle, ele, className) => {
     if (ele.classList.contains(className)) {
          ele.classList.remove(className);
     }
     clickedEle.classList.add(className);
}

// On start Game
startGameBtn.addEventListener('click', (e) => {
     modalContainer.style.display = "none";
     document.body.style.backgroundColor = "#fff";
     document.querySelector('.main-heading').style.color = "#000";
     gameScreenContainer.style.display = "flex";
     initializePlayers(noOfPlayers);
     createGrid();
     hightlightCurrentPlayer();
});

function Player(id) {
     this.id = id;
     this.isTurn = false;
     this.matchedPairs = 0;
     this.moves = 0;
}

function initializePlayers(noOfPlayers) {
     for (let i = 0; i < noOfPlayers; i++) {
          players.push(new Player(`Player-${i + 1}`));
     }

     if(noOfPlayers > 1){
          playerOneMovesDiv.style.display = 'none';
     }else if(noOfPlayers === 1){
          playerOneMovesDiv.style.display = 'flex';
     }
     if (players.length > 1) {
          for (let i = 0; i < players.length; i++) {
               const movesDiv = document.createElement('div');
               movesDiv.setAttribute('data-playernum', i + 1);
               movesDiv.className = "moves-div";
               const wrapperDivHtml = `
                         <span class="player-text">Player ${i + 1}</span>
                         <div class="wrapper">
                              <div>
                                   <span>Moves</span>
                                   <h3 class="moves-count">${players[i].moves}</h3>
                              </div>
                              <div>
                                   <span>Match Pairs</span>
                                   <h3 class="matched-pairs-count">${players[i].matchedPairs}</h3>
                              </div>
                         </div>
                    `;
               movesDiv.innerHTML = wrapperDivHtml;
               playerIndicationContainer.appendChild(movesDiv);
          }
     }
}

const updateTurn = () => {
     for (let i = 0; i < noOfPlayers; i++) {
          players[i].isTurn = !players[i].isTurn;
          if (players[i].isTurn) {
               break;
          }
     }
}

const updateScore = (activePlayer) => {
     activePlayer.matchedPairs++;
     const movesDiv = document.querySelector(`.playerIndicationBx .moves-div:nth-child(${players.indexOf(activePlayer) + 1}) `);
     if (movesDiv) {
          movesDiv.querySelector('.matched-pairs-count').textContent = activePlayer.matchedPairs;
     }
}


// Create Grid Box 
const createGridData = () => {
     const dataArr = [];
     let gridSize = selectedGridSize === "4x4" ? 4 : 6;
     const pairsCnt = (gridSize * gridSize) / 2;

     for (let i = 1; i <= pairsCnt; i++) {
          dataArr.push(i, i);
     }

     // use shuffle array
     for (let i = dataArr.length - 1; i > 0; i--) {
          let randomInd = Math.floor(Math.random() * (i + 1));
          // swap the elements
          [dataArr[i], dataArr[randomInd]] = [dataArr[randomInd], dataArr[i]];
     }

     return dataArr;
}

let bucketArr = [];

const createGrid = () => {
     // Clear the grid
     gridBoxContainer.innerHTML = '';

     let gridSize = selectedGridSize === "4x4" ? 4 : 6;
     const gridData = createGridData();

     for (let i = 0; i < gridSize; i++) {
          const gridDiv = document.createElement('div');
          gridDiv.classList.add('gridDiv');
          let html = '';
          for (let j = 0; j < gridSize; j++) {
               const gridItem = document.createElement('div');
               gridItem.classList.add('grid-item', 'hidden');
               // gridItem.textContent = gridData[gridSize * i + j];
               gridItem.dataset.value = gridData[gridSize * i + j];
               html += gridItem.outerHTML;
          }
          gridDiv.innerHTML = html;
          gridBoxContainer.appendChild(gridDiv);
          html = '';

          // if user clicks on grid item
          performTurn();
     }
}

const hightlightCurrentPlayer = () => {
     // Highlight the current turn
     const currentPlayerMovesDiv = document.querySelector(`.playerIndicationBx .moves-div:nth-child(${activePlayerIndex + 1})`);

     const allMovesDiv = document.querySelectorAll('.playerIndicationBx .moves-div');
     allMovesDiv.forEach((movesDiv) => {
          movesDiv.style.backgroundColor = '';
          movesDiv.classList.remove('active');
     });

     if (currentPlayerMovesDiv) {
          currentPlayerMovesDiv.classList.add('active');
          let divBgColor = window.getComputedStyle(document.documentElement).getPropertyValue('--orange-clr');
          currentPlayerMovesDiv.style.backgroundColor = divBgColor;
     }
}

const performTurn = () => {
     gridBoxContainer.addEventListener('click', (e) => {
          hightlightCurrentPlayer();
          let currPlayer = players[activePlayerIndex];
          let clickedEle = e.target;
          e.target.classList.add('active');
          if (clickedEle.classList.contains('grid-item') && !bucketArr.includes(clickedEle) && bucketArr.length < 2) {
               clickedEle.textContent = clickedEle.dataset.value;
               clickedEle.classList.remove('hidden');
               bucketArr.push(clickedEle);

               // keep track of player moves
               movesCnt++;
               currPlayer.moves++;
               const movesDiv = document.querySelector(`.playerIndicationBx .moves-div:nth-child(${activePlayerIndex + 1})`);
               if (movesDiv) {
                    movesDiv.querySelector('.moves-count').textContent = currPlayer.moves;
                    movesDiv.querySelector('.matched-pairs-count').textContent = currPlayer.matchedPairs;
               }

               if(playerOneMovesDiv){
                    playerOneMovesDiv.querySelector('.moves').textContent = movesCnt;
               }
               // document.querySelector('.moves').textContent = ++movesCnt;

               if (bucketArr.length === 2) {
                    // bucketArr.foreEach((item) => item.classList.remove('active'))
                    checkForPair(currPlayer);

                    activePlayerIndex = (activePlayerIndex + 1) % players.length;
                    currPlayer = players[activePlayerIndex];
               }
          }
     });
}


const checkForPair = (currPlayer) => {
     let gridSize = selectedGridSize === "4x4" ? 4 : 6;
     let totalPairsCnt = (gridSize * gridSize) / 2;
     updateTurn();

     if (bucketArr[0].dataset.value === bucketArr[1].dataset.value) {

          // update the score
          updateScore(currPlayer);
          pairsCnt++;
          setTimeout(() => {
               bucketArr.forEach((item) => {
                    item.classList.add('matched');
                    bucketArr = [];
               });
          }, 1000);
     } else {
          setTimeout(() => {
               bucketArr.forEach((item) => {
                    item.classList.remove('active')
                    item.textContent = '';
                    item.classList.add('hidden');
                    bucketArr = [];
               });
          }, 1000);
     }
     console.log("pairsCnt ", pairsCnt)

     if (totalPairsCnt === pairsCnt) {
          // If user won show result modal
          containerEle.classList.add('active');
          let winnerPlayerPairCnt = players.reduce((max, player) => {
               return Math.max(max, player.matchedPairs);
          }, 0);
          let winnerPlayerIndex = players.findIndex((player) => player.matchedPairs === winnerPlayerPairCnt);

          resultModalContainer.querySelector('.main-heading').textContent = `Player ${winnerPlayerIndex + 1} Wins!`;

          for(let i = 0 ; i < noOfPlayers; i++){
               let boxDiv = document.createElement('div');
               boxDiv.classList.add('box');
               boxDiv.innerHTML = `
                    <div class="leftBx">
                         <h3>Player ${i + 1} ${winnerPlayerIndex === i ? "(Winner!)" : ""} </h3>
                    </div>
                    <div class="rightBx">
                         <h2>${players[i].matchedPairs} Pairs</h2>
                    </div>
               `;
               resultModalContainer.querySelector('.middleBar').appendChild(boxDiv);
          }
          resultModalContainer.style.display = 'flex';
     }    
}

containerEle.addEventListener('click', (e) => {
     if (e.target.dataset.btn == "new-game") {
          console
          gameScreenContainer.style.display = "none";
          modalContainer.style.display = "block";
          containerEle.classList.remove('active');
          // reset the game 
          resetGame();
     } else if (e.target.dataset.btn == "restart-game") {
          bucketArr = [];
          activePlayerIndex = 0;
          pairsCnt = 0;

          players.forEach((player, ind) => {
               player.matchedPairs = 0;
               player.moves = 0;
          });

          const allMovesDiv =  document.querySelectorAll(`.playerIndicationBx .moves-div`);
          allMovesDiv.forEach((movesDiv, ind) => {
               if(movesDiv){
                    movesDiv.querySelector('.moves-count').textContent = players[ind].moves;
                    movesDiv.querySelector('.matched-pairs-count').textContent = players[ind].matchedPairs; 
               }
          });
          
          hightlightCurrentPlayer();
          createGrid();

          if(resultModalContainer){
               resultModalContainer.style.display = 'none';
               containerEle.classList.remove("active");
          }
     }

});

const resetGame = () => {
     bucketArr = [];
     players = [];
     movesCnt = 0;
     pairsCnt = 0;

     if(playerOneMovesDiv){
          playerOneMovesDiv.querySelector('.moves').textContent = movesCnt;
     }
     players.forEach((player, ind) => {
          player.matchedPairs = 0;
          player.moves = 0;
     });

     activePlayerIndex = 0;
     playerIndicationContainer.innerHTML = '';
     resultModalContainer.style.display = 'none';

     createGrid();
}
