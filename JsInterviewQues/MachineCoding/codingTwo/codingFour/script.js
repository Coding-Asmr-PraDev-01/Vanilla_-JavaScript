// https://javascriptinterviewquestions.com/2021/01/frontend-interview-guide-machine-coding-website.html
// Sample Coding Que - 1

// DOM ELEMENTS
const tableBodyEle = document.querySelector('.table-body');
const inputSearchEle = document.querySelector('.input-search');
const searchBtnEle = document.querySelector('.search-btn');
const tableContainerEle = document.querySelector('.table-container');

// If ther data is already present in the localStorage
const fetchedData = JSON.parse(localStorage.getItem('student-data')) || [];

fetch(`https://jsonplaceholder.typicode.com/users/`)
.then((res) => res.json())
.then((studentData) => {
     localStorage.setItem('student-data', JSON.stringify(studentData));
     const tableRowEle = document.createElement('tr');

     renderDataToUI(studentData);
});

searchBtnEle.addEventListener('click', () => {
     let searchValue = inputSearchEle.value;
     if(searchValue !== ""){
          let filteredData = fetchedData.filter((item, ind) => {
               return item.name.toLowerCase().includes(searchValue.toLowerCase());
          });
          tableBodyEle.innerHTML = '';
          renderDataToUI(filteredData);
     }
});

const renderDataToUI = (dataArr) => {
     if(dataArr.length > 0){
          dataArr.map((student, ind) => {
               const tableRowEle = document.createElement('tr');
               let tableData = `
                              <td>${ind + 1}</td>
                              <td>${student.name}</td>
                              <td>${student.email}</td>
                              <td>${student.address.city}</td>`;

               tableRowEle.innerHTML = tableData;
               tableBodyEle.append(tableRowEle);
          });
     }else{
          let h1Ele = document.createElement('h1');
          h1Ele.innerHTML = `No Results Found`;
          tableContainerEle.appendChild(h1Ele);
     }

}
