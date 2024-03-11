// Grab DOM Elements
const gridContainerEle = document.querySelector('.gridContainer');
const closeModalBtn = document.querySelector('.close-modal-btn');
const instructionsModalEle = document.querySelector('.instructions-modal');
const faCircleQueEle = document.querySelector('.fa-circle-question');
const gameResultBxEle = document.querySelector('.gameResultBx');
const playAgainBtn = document.querySelector('.play-again-btn');

// Close modal handler
closeModalBtn.addEventListener('click', () => {
     instructionsModalEle.style.transform = `scaleY(0)`;
     document.body.classList.remove('overlay');
});

// Open instructions Modal
faCircleQueEle.addEventListener('click', () => {
     instructionsModalEle.style.transform = `scaleY(1)`;
     document.body.classList.add('overlay');
});

// Row & Columns configuration
const ROWCOUNT = 6;
const COLCOUNT = 5;

const wordsArr = [
     "PUPIL",
     "TIGER",
     "LEAST",
     "LEAVE",
     "POWER",
     "STOPS"
];

// Select the random word
// let randomWordSelected = wordsArr[Math.floor(Math.random() * wordsArr.length)];
let randomWordSelected = "TIGER";

let htmlStr = "";

function handleKeyDown(event) {
     if(event.target.classList.contains('box-input')){
          const currentInput = event.target;
          const boxes = document.querySelectorAll('.box-input');
          let inputIndex = Array.from(boxes).indexOf(currentInput);
          
          if(inputIndex !== 0 && (inputIndex + 1) % COLCOUNT === 0){
               if(event.key === "Enter"){
                    let inputWord = '';
                    for(let i = inputIndex - (COLCOUNT - 1); i <= inputIndex; i++){
                         inputWord += boxes[i].value;
                    }
                    // make it uppercase
                    inputWord = inputWord.toUpperCase();

                    // Compare users word with guess word
                    let feedbackPattern = '';
                    for(let i = 0; i < inputWord.length; i++){
                         // if the correct letter is present at correct position
                         if(inputWord[i] === randomWordSelected[i]){
                              feedbackPattern += "O";
                         }
                         // if letter is correct but at wrong position
                         else if(randomWordSelected.includes(inputWord[i])){
                              feedbackPattern += "X";
                         }else{
                              // wrong letter
                              feedbackPattern += "-";
                         }
                    }

                    // Apply styling based on feedbackPattern
                    for(let i = inputIndex - (COLCOUNT - 1); i <= inputIndex; i++){
                         let currInd = i - (inputIndex - (COLCOUNT - 1));
                         console.log(feedbackPattern[currInd])
                         if(feedbackPattern[currInd] === "O"){
                              boxes[i].classList.add('correct-letter');
                         }else if(feedbackPattern[currInd] === "X"){
                              boxes[i].classList.add('wrong-position');
                         }else{
                              boxes[i].classList.add('wrong-letter');
                         }
                    }

                    if(feedbackPattern === "OOOOO"){
                         gameResultBxEle.style.opacity = 1;
                         document.body.classList.add('overlay');
                    }
               }
          }

          if(currentInput.value.length > 0){
               const newIndex = inputIndex < boxes.length - 1 ? inputIndex + 1 : boxes.length - 1;
               boxes[newIndex].focus();
          }
          if(event.key === "Backspace"){
               if(currentInput.value !== ""){
                    currentInput.value = "";
               }
               const newIndex = inputIndex > 0 ? inputIndex - 1 : 0;
               boxes[newIndex].focus();
          }
     }     
}

gridContainerEle.addEventListener('keydown', handleKeyDown);

document.addEventListener("DOMContentLoaded", (event) => {

     // Add theme class to body of document
     const checkbox = document.getElementById("checkbox")
     checkbox.addEventListener("change", () => {
          document.body.classList.toggle("light");
     }); 

     console.log("DOM fully loaded and parsed");
     for(let i = 0; i < ROWCOUNT; i++){
          for(let j = 0; j < COLCOUNT; j++){
               let boxDiv = document.createElement('div');
               boxDiv.classList.add('box');
               let inputEle = document.createElement('input');
               inputEle.classList.add('box-input')
               inputEle.type = "text";
               inputEle.maxLength = 1;
               boxDiv.append(inputEle);
               htmlStr += boxDiv.outerHTML;
          }
          let gridItemDiv = document.createElement('div');
          gridItemDiv.classList.add('grid-item');
          gridItemDiv.innerHTML = htmlStr;
          htmlStr = '';
          gridContainerEle.appendChild(gridItemDiv)
     }

     // focus on the first input element
     document.querySelector('.box-input').focus();
});


const resetGame = () => {
     console.log("reest the game");
     // Close the game result modal first
     gameResultBxEle.style.opacity = 0;

     document.body.classList.remove('overlay');


     // Reset all inputs
     let inputElems = document.querySelectorAll('.gridContainer .box-input');
     for(let i = 0; i < inputElems.length; i++){
          if(inputElems[i].value.length > 0){
               inputElems[i].value = "";
               inputElems[i].classList.remove('correct-letter');
               inputElems[i].classList.remove('wrong-letter');
               inputElems[i].classList.remove('wrong-position');
          }
     }
}

playAgainBtn.addEventListener('click', resetGame);
