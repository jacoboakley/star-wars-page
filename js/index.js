/* global $ */



const getKeys = () => {
  $.ajax({
    type: 'GET',
    url: 'https://swapi.co/api/',
    success: (response) => {
      /* Makes an array from the Object returned by the API */
      var category = $.makeArray(Object.keys(response));
      /* Loop through the array and create an element for each key*/
      for(var i = 0; i < category.length; i++) {
        $('.dropdown-menu').append(`<a class='category dropdown-item' id='${category[i]}'>${category[i]}</a>`);
      }
    },
    error: () => {
      $('.dropdown-menu').html('Cannot Load');
    },
    dataType: 'json',
  });
};


const getResults = () => {
  /* Attach event handler to the dropdown menu */    
  $('.dropdown-toggle').on('click', (event) => {

    $('.category').click((event) => {
      var category = event.target.id;

      $.ajax({
        type: 'GET',
        url: `https://swapi.co/api/${category}`,
        success: (response) => {
          
          var pages = (Math.ceil(response.count / 10));
          $('.content').html('')
          for (var p = 1; p <= pages; p++) {
            $.ajax({
              type: 'GET',
              url: `https://swapi.co/api/${category}/?page=${p}`,
              success: (response) => {
                
                for (var i = 0; i < response.results.length; i++) {
                  if (category === 'films') {
                    var title = response.results[i].title;
                    $('.content').append(`<a class='nav-link'>${title}</a>`);
                  }
                  else {
                    var name = response.results[i].name;
                  $('.content').append(`<a class='nav-link'>${name}</a>`);
                  }
                }
              }
            })
          }
        },
        error: () => {
          $('.content').text('Cannot Load');
        },
        dataType: 'json',
      });
    });  
  });
};


$(document).ready(() => {
  
  getKeys();
  getResults();

});

