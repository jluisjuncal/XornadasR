/*!
 * WP Googel Analytics Events | v2.4.6
 * Copyright (c) 2013 Yuval Oren (@yuvalo)
 * License: GPLv2
 */

/*jslint indent: 4 */
/*global $, jQuery, document, window, _gaq*/

var scroll_events = (function ($) {
    "use strict";

    var scroll_elements  = [];
    var click_elements = [];
    var universal = 0;
    var gtm = 0;
    var ga_element;

    var track_event = function (category, action, label, universal, bounce, evalue ){
        var event_category = !category ? '' : category;
        var event_action = !action ? '' : action;
        var event_label = !label ? '' : label;
        var event_bounce = !bounce ? false : bounce;
        var event_value = !evalue ? false : evalue;

        if( typeof ga_element === "undefined" ){
           if( typeof ga !== 'undefined' ){
               ga_element = ga;
            } 
            else if( typeof _gaq !== 'undefined' ){
                ga_element = _gaq;
            } 
            else if( typeof __gaTracker === "function" ){
                ga_element = __gaTracker;
            } else if (!gtm){
               return;
           }
        }

        if (gtm) {
            dataLayer.push({
                'event' : 'WPGAE',
                'eventCategory' : category,
                'eventAction' : action,
                'eventLabel' : label,
                'eventValue' : event_value,
                'nonInteraction': event_bounce
            });
        } else if( universal ){
            // ga_element('send','event', category, action, label);
            if (event_value) {
                ga_element('send','event', category, action, label, event_value,{'nonInteraction': event_bounce});
            }else{
                ga_element('send','event', category, action, label, {'nonInteraction': event_bounce});
            }
            

        }
        else {
            // ga_element.push(['_trackEvent',category, action, label]);
            ga_element.push( ['_trackEvent',category, action, label, event_value, event_bounce] );
        }

    };

    var click_event = function( event ){
        
        track_event(event.data.category, event.data.action, event.data.label, event.data.universal, event.data.bounce, event.data.evalue);
        var hasHref = event.currentTarget.href;
        var hrefTarget = event.currentTarget.target;
        if (hasHref && hasHref !== "") {
            event.preventDefault();
            if (hrefTarget.trim() === "_blank") {
                var w = window.open('', '_blank');
                w.location.href = hasHref;
            } else {
                setTimeout(function () {
                    window.location = hasHref;
                }, 100);
            }
        }
    };

    var unescapeChars = function (text) {

        var map = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '\"': '"',
            '&#039;': "'"
        };        

        if (typeof text != 'string') {

            var cleanObj;

            // if param text is non-string (assuming JSON object), we convert it first to string
            cleanObj = JSON.stringify(text);

            // we replace other chars
            cleanObj.replace(/&lt;|&gt;|&quot;|'&#039;/gi, function (m) {
                        return map[m];
                    });

            // convert it back to JSON obj
            cleanObj = JSON.parse(cleanObj);
            return cleanObj;
        }else{
            return text.replace(/&lt;|&gt;|&quot;|'&#039;/gi, function (m) {
                        return map[m];
                    });
        }
        
        return ''; //fallback
    };


    return {
        bind_events : function (settings) {
            scroll_elements = settings.scroll_elements;
            click_elements = settings.click_elements;
            universal = settings.universal;
            gtm = settings.gtm;

            var i;
            for (i = 0; i < click_elements.length; i++) {
                var clicked = click_elements[i];
                var selector = unescapeChars(clicked.select);

                clicked.universal = universal;
                //$(selector).on('click', clicked, click_event);
                $('body').on('click', selector, clicked, click_event);
            }



            $(window).scroll(function () {
                var ga_window = $(window).height();
                var ga_scroll_top = $(document).scrollTop();
                var i;
                for (i = 0; i < scroll_elements.length; i++) {
                    if (!scroll_elements[i].sent) {
                        scroll_elements[i].offset =  $( unescapeChars( scroll_elements[i].select) ).offset();
                        if (scroll_elements[i].offset && ga_scroll_top + ga_window >= scroll_elements[i].offset.top + $(scroll_elements[i].select).height()) {
                            track_event(scroll_elements[i].category, scroll_elements[i].action, scroll_elements[i].label, universal, scroll_elements[i].bounce, scroll_elements[i].evalue);
                            scroll_elements[i].sent = true;
                        }
                    }
                }
            });
        }
    };

}(jQuery));
