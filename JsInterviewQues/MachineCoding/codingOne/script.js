// Coding Que Link : https://dev.to/shiv1998/makemytrip-frontend-machine-coding-interview-c7b

const boxContainerEle = document.querySelector('.box-container');
const boxesEle = document.querySelectorAll('.box');

const activeBoxes = [];
const createBoxes = (noOfBoxes, delay) => {
     boxContainerEle.innerHTML = '';
     for(let i = 0; i < noOfBoxes; i++){
          let boxEle = document.createElement('div');
          boxEle.className = 'box';
          boxEle.innerHTML = `<h1>${i + 1}</h1>`;
          boxEle.addEventListener('click', () => {
               boxEle.classList.add('active');
               activeBoxes.push(i);

               if(activeBoxes.length === noOfBoxes){
                    for(let i = 0; i < activeBoxes.length; i++){
                         setTimeout(() => {
                              let boxColorRemoved = document.querySelector(`.box:nth-child(${activeBoxes[i] + 1})`);
                              boxColorRemoved.classList.remove('active');
                         }, delay * i);
                    }
               }
          });
          boxContainerEle.appendChild(boxEle);
     }
}

createBoxes(9, 4000);
