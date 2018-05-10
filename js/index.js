/* global $ */



const getKeys = () => {
  $.ajax({
    type: 'GET',
    url: 'https://swapi.co/api/',
    success: (response) => {
      /* Makes an array from the Object returned by the API */
      let category = Object.keys(response);
      /* Loop through the array and create an element for each key*/
      for(let i = 0; i < category.length; i++) {
        $('.dropdown-menu').append(`<a class='category dropdown-item' id='${category[i]}' data-url='https://swapi.co/api/${category[i]}'>${category[i]}</a>`);
      }
    }
  });
};


const getResults = () => {
  /* Attach event handler to the dropdown menu */    
  $('.nav-item').on('click', () => {
    
    let category = event.target.id;
      
    
    let url = event.target.getAttribute('data-url');
  /* Clear content Html */
    $('.content').html('');
  /* Replace content Html with retrieved data*/  
    $.ajax({
      type: 'GET',
      url: url,
      success: (response) => {
        let pages = (Math.ceil(response.count / 10));
      
        for (let p = 1; p <= pages; p++) {
          $.ajax({
            type: 'GET',
            url: `${url}/?page=${p}`,
            success: (response) => {
              for (let i = 0; i < response.results.length; i++) {
                
                url = response.results[i].url;
                
                if (category === 'films') {
                  let title = response.results[i].title;
                  $('.content').append(`<a class='nav-link' id='${category}' data-url='${url}'>${title}</a>`);
                }
                else {
                  let name = response.results[i].name;
                  $('.content').append(`<a class='nav-link' id='${category}' data-url='${url}'>${name}</a>`);
                }
              }
            }
          });
        }
      }
    });
  });
};

const displayInfo = () => {
  $('.content').on('click', () => {
    
    let url = event.target.getAttribute('data-url');
    
    $.ajax({
      type: 'GET',
      url: url,
      success: (response) => {
        console.log(response);
        $('.info').append(`<p>${response.name}</p>`);
      },
    });
  });
};


$(document).ready(() => {
  
  getKeys();
  getResults();
  displayInfo();

});

