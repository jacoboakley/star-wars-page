/* global $ */

/* Used to clear displayed content and info */
 
const clear = () => {
  $('.content').html('');
  $('.info').html('');
};

/* Get keys for selection in dropdown menu */

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

/* Displays results of query with image */

const getResults = () => {
  
  /* Listen for click events in the dropdown menu */    
  $('.nav-item').on('click', () => {
    
    let category = event.target.id;
    let url = event.target.getAttribute('data-url');
    
    /* Clear content and info from page */
    clear();
    
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

/* Displays info for the selected result */

const displayInfo = () => {
  $('.content').on('click', () => {
    
    let category = event.target.id;
    let url = event.target.getAttribute('data-url');
    
    if(typeof(url) === 'string') {
      $.ajax({
        type: 'GET',
        url: url,
        success: (response) => {
          
          let results = Object.keys(response);
          let value = Object.values(response);
          /* Clear content and info from page */
          clear();
          
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
    }
  });
};

/* Queries the API using selected category and keyword */

const keywordSearch = () => {
  $('#search').click(() => {
    let userInput = $('#input').val();
    let category = $('.dropdown-toggle').html().toLowerCase();
    if (category === 'category') {
      alert('Please select a category to search');
    }
    else {
      /* Clear content and info from page */
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