/* global $ */


// Used to clear HTML for 
const clear = () => {
  $('.content').html('');
  $('.info').html('');
};

const getKeys = () => {
  $.ajax({
    type: 'GET',
    url: 'https://swapi.co/api/',
    success: (response) => {
      
      /* Get the keys of the Object returned by the API and Alphabitize them */
      const category = Object.keys(response).sort();
      
      /* Loop through the array and create an item in the dropdown menu for each key */
      for(let i = 0; i < category.length; i++) {
        $('.dropdown-menu').append(`<a class='dropdown-item' id='${category[i]}' data-url='https://swapi.co/api/${category[i]}'>${category[i].toUpperCase()}</a>`);
      }
      
    }
  });
};


const getResults = () => {
  
  /* Listen for click events in the dropdown menu */    
  $('.nav-item').on('click', () => {
    
    let category = event.target.id;
    let url = event.target.getAttribute('data-url');
    /* Clear content and info from page */
    $('.content').html('');
    $('.info').html('');
    
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
              
/* Show the selected category in dropdown */
              $('.dropdown-toggle').html(category.toUpperCase());
              
              response.results.forEach((item) => {

               let itemNum = item.url.split('/')[5];
               
                
                if (category === 'films') {
                  $('.content').append(`
                    <div class='d-flex flex-column m-5 card'>
                      <img src='./assets/images/${category}/${itemNum}.jpg' id='${category}' data-url='${item.url}'/>
                      <h3 class='btn btn-link' id='${category}' data-url='${item.url}'>${item.title}</h3>
                    </div>
                  `);
                }
                else {
                  $('.content').append(`
                    <div class='d-flex flex-column m-5 card'>
                      <img src='./assets/images/${category}/${itemNum}.jpg' id='${category}' data-url='${item.url}'/>
                      <h3 class='btn btn-link' id='${category}' data-url='${item.url}'>${item.name}</h3>
                    </div>
                  `);
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

const keywordSearch = () => {
  $('#search').click(() => {
    let userInput = $('#input').val();
    let category = $('.dropdown-toggle').html().toLowerCase();
    if (category === 'category') {
      alert('Please select a category to search');
    }
    else {
      
      clear();
    
      let url = `https://swapi.co/api/${category}/?search=${userInput}`;
      $.ajax({
        type: 'GET',
        url: url,
        success: (response) => {
          response.results.forEach((item) => {

               let itemNum = item.url.split('/')[5];
               
                
                if (category === 'films') {
                  $('.content').append(`
                    <div class='d-flex flex-column m-5 card'>
                      <img src='./assets/images/${category}/${itemNum}.jpg' id='${category}' data-url='${item.url}'/>
                      <h3 class='btn btn-link' id='${category}' data-url='${item.url}'>${item.title}</h3>
                    </div>
                  `);
                }
                else {
                  $('.content').append(`
                    <div class='d-flex flex-column m-5 card'>
                      <img src='./assets/images/${category}/${itemNum}.jpg' id='${category}' data-url='${item.url}'/>
                      <h3 class='btn btn-link' id='${category}' data-url='${item.url}'>${item.name}</h3>
                    </div>
                  `);
                }
                
              });
          
          
          
          
          
          
          
          
        }
      });
    }
  });
};

$(document).ready(() => {
  
  getKeys();
  getResults();
  displayInfo();
  keywordSearch();
  
});