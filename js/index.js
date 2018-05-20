/* global $ */



const getKeys = () => {
  $.ajax({
    type: 'GET',
    url: 'https://swapi.co/api/',
    success: (response) => {
      
      /* Get the keys of the Object returned by the API and Alphabitize them */
      const category = Object.keys(response).sort();
      
      /* Loop through the array and create an item in the dropdown menu for each key */
      for(let i = 0; i < category.length; i++) {
        $('.dropdown-menu').append(`<a class='dropdown-item' id='${category[i]}' data-url='https://swapi.co/api/${category[i]}'>${category[i]}</a>`);
      }
      
    }
  });
};


const getResults = () => {
  
  /* Listen for click events in the dropdown menu */    
  $('.nav-item').on('click', () => {
    
    let category = event.target.id;
    let url = event.target.getAttribute('data-url');
    console.log(url);
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
              
              $('.info').html('');
              $('.dropdown-toggle').html(category)
              
              response.results.forEach((item) => {
                
                if (category === 'films') {
                  $('.content').append(`<h3 class='btn btn-link' id='${category}' data-url='${item.url}'>${item.title}</h3>`);
                }
                else {
                  $('.content').append(`<h3 class='btn btn-link' id='${category}' data-url='${item.url}'>${item.name}</h3>`);
                }
                
              });
            }
          });
        }        
      }
    });
  });
};

const displayInfo = () => {
  $('.content').on('click', () => {
    
    let category = event.target.id;
    let url = event.target.getAttribute('data-url');
    
    $.ajax({
      type: 'GET',
      url: url,
      success: (response) => {
        
        let results = Object.keys(response);
        let value = Object.values(response);
        
        $('.info').html('');
        $('.content').html('');
        
        for (let i = 0; i < results.length; i++) {
          
          if (typeof(value[i]) === 'object') {
            $('.info').append(`<div class='results text-center'><h3>${results[i]}</h3><div class='${results[i]}'></div></div>`);
            for (let item of value[i]) {
              
              $.ajax({
                type: 'GET',
                url: item,
                success: (response) => {
                  $(`.${results[i]}`).append(`<p>${Object.values(response)[0]}</p>`);
                  console.log(response.name);
                }
              });
            }
          }
          else {
            $('.info').append(`<div class='results text-center'><h3>${results[i]}</h3><p>${value[i]}</p></div>`);  
          }
        }
        
      },
    });
  });
};


$(document).ready(() => {
  
  getKeys();
  getResults();
  displayInfo();

});

