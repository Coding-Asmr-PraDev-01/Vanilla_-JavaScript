const walkThroughSteps = ['header', 'box-3','box-1','box-5','box-2', 'footer', 'box-4', 'box-6'];

let ind = 0;

const scrollTo = (element) => {
     let eleTop = element.offsetTop;
     window.scrollTo({top: eleTop, behavior: 'smooth'});
}

const highLightElement = (selectorClass) => {
     // remove the previous added highlight and popup
     document.querySelector('.popUp')?.remove();
     document.querySelector('.highlight')?.remove();

     let element = document.querySelector(`.${selectorClass}`);
     scrollTo(element);
     let elementDimensions = element.getBoundingClientRect();
     let width = elementDimensions.width;
     let height = elementDimensions.height;
     let top = elementDimensions.top + window.scrollY;
     let left = elementDimensions.left + window.scrollX;
     let highLightDiv = document.createElement('div');
     highLightDiv.className = 'highlight'

     highLightDiv.style = `
          position: absolute;
          top: ${top}px;
          left: ${left}px;
          width: ${width}px;
          height: ${height}px;
          background: rgba(0,0,0,0.3);
     `;
     document.body.appendChild(highLightDiv);
     document.querySelector('.grid').appendChild(createPopUp(elementDimensions));
}

const createPopUp = (elementDimensions) => {
     let bottom = elementDimensions.bottom + window.scrollY;
     let left = elementDimensions.left + window.scrollX;
     let right = elementDimensions.right;

     let popUpDiv = document.createElement('div');
     popUpDiv.className = 'popUp';
     popUpDiv.style = `
          position: absolute;
          top: ${bottom - 120}px;
          left: ${(left + right) / 2 - 65}px;
          width: 140px;
          height: 100px;
          padding: 1rem;
          display: flex;
          gap: 1.4rem;
          background: red;
     `;

     // Add navigation Button
     const fragment = document.createDocumentFragment();
     
     const nextBtn = document.createElement('button');
     nextBtn.className = 'btn next-btn';
     nextBtn.textContent = 'Next';
     
     const prevBtn = document.createElement('button');
     prevBtn.className = 'btn prev-btn';
     prevBtn.textContent = 'Prev';

     nextBtn.addEventListener('click', (e) => {
          console.log(ind)
          if(ind < walkThroughSteps.length - 1){
               highLightElement(walkThroughSteps[++ind]);
          }
     });

     prevBtn.addEventListener('click', (e) => {
          if(ind > 0){
               highLightElement(walkThroughSteps[--ind]);
          }
     });
     
     fragment.appendChild(prevBtn);
     fragment.appendChild(nextBtn);

     popUpDiv.appendChild(fragment);
     return popUpDiv;
}

highLightElement(walkThroughSteps[ind]);

