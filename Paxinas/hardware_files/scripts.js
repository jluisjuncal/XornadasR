// Import.io WordPress Theme Javascript
// Created with Ambition
// ---------------------------------------------------------------------

// Add SmoothScroll for links with #
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
            }
        }
    });
});

// Run matchHeight plugin on all .container-fluid > row > divs
$('.col-match-height > .row > div').matchHeight();
$('.spotlight').matchHeight();
$('.match-height').matchHeight();

// Checks the main Import.io app site to see if user is logged in
// Needs full explanation...GC
function loginLinks() {
    
    var e_url = $('#login_links').attr('data-envurl');
    var a_url = $('#login_links').attr('data-accurl');
    var d_url = $('#login_links').attr('data-daturl');
    var l_url = $('#login_links').attr('data-logurl');
    var s_url = $('#login_links').attr('data-sigurl');
    var call_url = 'https://api.' + e_url + '/auth/currentuser';
    var account_url = 'https://' + e_url + a_url;
    var data_url = 'https://' + e_url + d_url;
    var login_url = 'https://' + e_url + l_url;
    //var signup_url = 'https://' + e_url + s_url;
	var signup_url = s_url;
    // or var signup_url = s_url; and add the full URL into the Signup URL field. Could also be a #id to trigger a modal...

        
    // Make AJAX call to /auth/currentuser
    $.ajax({
        type: 'get',
        url: call_url,
        data: null,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        }
    })
    .done(function(user) {
        analytics.identify(user.guid, {
            name: user.email,
            guid: user.guid,
            roles: user.roles,
            email: user.email,
        });
        /* $('#login_links').prepend('<li class="logged-in"><a href="'+account_url+'" class="btn btn-link" target="_blank">My Account</a></li>'); */
        $('#login_links').append('<li class="logged-in"><a href="'+data_url+'" class="btn btn-signup">Dashboard</a></li>');
    })
    .fail(function() {
        analytics.identify();
        $('#login_links').prepend('<li class="logged-out"><a href="'+login_url+'" class="btn btn-link">Log in</a> <span>or</span></li>');
        $('#login_links').append('<li class="logged-out"><a href="'+signup_url+'" class="btn btn-signup" id="reg-now-btn">Sign up</a></li>');
		$("#reg-now-btn").on('click', (function(){
           $('#register-now').modal();
       }));
    });
    
}




// Run scripts on document ready.
//
$( document ).ready(function() {
    
    // Run login links function (above).
    loginLinks();
    
    // Set up packery grid for blog section
    $('#article-grid').packery({
        itemSelector: '.grid-entry'
    });
    
    // Intitialise WOW.js (for animations)
    new WOW().init();
    
    // Add custom classes to comment form submit buttons.
    $('#commentform input#submit').addClass('btn btn-primary');

});

