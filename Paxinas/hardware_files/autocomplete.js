(function(){
   (function() {
        // Union of Chrome, Firefox, IE, Opera, and Safari console methods
        var methods = ["assert", "cd", "clear", "count", "countReset",
          "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed",
          "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd",
          "select", "table", "time", "timeEnd", "timeStamp", "timeline",
          "timelineEnd", "trace", "warn"];
        var length = methods.length;
        var console = (window.console = window.console || {});
        var method;
        var noop = function() {};
        while (length--) {
          method = methods[length];
          // define undefined methods as noops to prevent errors
          if (!console[method])
            console[method] = noop;
        }
    })();

    var getRawDomain = function(str) {
        return str.replace(/^(https?:)?\/\/(www.)?([^\/]+)(\/[\w\W]*)?$/i, '$3');
    };

    var nativeDomain = getRawDomain(location.href);
	var siqIsAutoCompleteDisplayed = false;
    var urlParam = function(url, name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
        if (!results) {
            return "";
        }
        return results[1] || "";
    };

    var siqScript = function(){
        var siqSearchFacetFilter = [];
        var siqPostTypeFilter = null;
            var enterFlag = true;
			var prevVal = "";
			var flagCall = true;
			var resultOnce = false;
			var currentHover;
			var currentElement;
			var holderWidth = 280;
            var oldTimeStamp;
            var bodyElement;
            var newTimeStamp;
            var extraResultClass = "_siq_main_searchbox";
            var currentSelectedElement;
            var isResponsive = false;
            var submitform = true;
            var windowsPhone;
            var siq_api_autoComp = "search/results";
			var searchWrapper 	= 	"<div  ='siq_searchWrapper'>";
					searchWrapper 	+= 	"<div class='siq_searchTop'>";
						searchWrapper 	+= 	"<div class='siq_searchInner'>";
						searchWrapper	+=	"</div>";
					searchWrapper	+=	"</div>";
				searchWrapper	+=	"</div>";
			
			var isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
            var isAndroid = /(android)/i.test(navigator.userAgent.toLowerCase());
			var ismsie   = function(){
				if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
					return true;
				}
				return false;
			}
					
			var msieversion = function(){
				if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
					return RegExp.$1;
				}
				return false;
			}
	
			var versionCompare = function(v1, comparator, v2) {
				comparator = comparator == '=' ? '==' : comparator;
				var v1parts = v1.split('.'), v2parts = v2.split('.');
				var maxLen = Math.max(v1parts.length, v2parts.length);
				var part1, part2;
				var cmp = 0;
				for(var i = 0; i < maxLen && !cmp; i++) {
					part1 = parseInt(v1parts[i], 10) || 0;
					part2 = parseInt(v2parts[i], 10) || 0;
					if(part1 < part2)
						cmp = 1;
					if(part1 > part2)
						cmp = -1;
				}
				return eval('0' + comparator + cmp);
			};

			var addJs = function(adJsId, jsUrl, callback) {
                if (document.getElementById(adJsId)) {
                    return;
                }
                var thisjs 	= document.createElement('script');
                thisjs.type = 'text/javascript';
                thisjs.id 	= adJsId;
                thisjs.src 	= jsUrl;
                if (typeof callback != "undefined" && typeof callback == 'function') {
                    if (ismsie() && parseInt(msieversion()) <= 8) {
                        thisjs.onreadystatechange = function () {
                            if (this.readyState == 'complete' || this.readyState == 'loaded'){ callback();}
                        }

                    } else {
                        thisjs.onload = callback;
                    }
                }
                document.getElementsByTagName("head")[0].appendChild(thisjs);

            };

			
			var isJQueryValid = function (jq) {
				var isValid = jq && jq.fn && jq.fn.jquery && versionCompare(jq.fn.jquery, ">=", "1.9.1");
				return isValid;
			};

			var init           = function(){
				bindFunctions();
			}

            var detectKeyword = function () {
                // Detect keyword in the url
                var url = location.href;
                return urlParam(url, SiqConfig.searchBoxName) || urlParam(url, SiqConfig.queryParameter) || urlParam(url, "_siq_search") || urlParam(url, "s") || urlParam(url, "q") || urlParam(url, "kw") || urlParam(url, "search") || urlParam(url, "w");
            };

        var filterGetName = SiqConfig.queryParameter == "f" ? "sf" : "f";
        var documentTypeGetName = SiqConfig.queryParameter == "dtf" ? "sdtf" : "dtf";

		var bindFunctions = function(){
            windowsPhone = /Windows Phone/i.test(navigator.userAgent);

			//siq_S(window).load(function(){
			siq_S(window).on('load', function(){
				if (ismsie()) {
					siq_S('body').addClass('ie_'+parseInt(msieversion()));
				}
			});
            siq_S(document).on('click', '.siq_searchForm .siq_searchWrapper.siq_searchHover .siq_searchTop .searchWrapperLabel, .siq_searchForm .holdResults ul li .resultsMore, .siq_searchForm .inp-srch-btn', function(){
                siq_S(this).parents('form.siq_searchForm').submit();
			});
			siq_S(document).on('click', '.holdResults .searchWrapperLabel, .holdResults ul li .resultsMore', function(){
			    if (siq_S(this).parents('.holdResults').length > 0 && /^.*?siq_searchIndexResult-(\d+).*$/.test(siq_S(this).parents('.holdResults')[0].className)) {
                    var formIndex = siq_S(this).parents('.holdResults')[0].className.replace(/^.*?siq_searchIndexResult-(\d+).*$/, '$1');
                    siq_S("input.siq_searchIndex-" + formIndex).val(siq_S("input.siq_searchIndex-" + formIndex).val().replace(/[<>()\/]+/g, ' '));
                    if (siq_S("input.siq_searchIndex-" + formIndex).parents("form").length > 0) {
                        if (siq_S("input.siq_searchIndex-" + formIndex).parents("form")[0].submit && typeof siq_S("input.siq_searchIndex-" + formIndex).parents("form")[0].submit == "object") {
                            siq_S(siq_S("input.siq_searchIndex-" + formIndex).parents("form")[0].submit).click();
                        } else {
                            siq_S("input.siq_searchIndex-" + formIndex).parents("form").submit();
                        }
                    }
                } else {
                    siq_S("#siq_search_results form.siq_searchForm input.siq_searchBox").val(siq_S("#siq_search_results form.siq_searchForm input.siq_searchBox").val().replace(/[<>()\/]+/g, ' '));
                    siq_S('#siq_search_results form.siq_searchForm').submit();
                }
            });
            siq_S(document).on("submit", 'form.siq_searchForm', function() {
                var input = siq_S(this).find('input.siq_searchBox');
                input.val(input.val().replace(/[<>()\/]+/g, ' '));
            });
			siq_S(document).on("focus", 'input[name="s"],input[name="q"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : ''), function(e){
				var thisElement = siq_S(this);
				var thisVal 	= thisElement.val();
				if (thisVal != "") {
				}
				
			});
			siq_S(function() {
			    siq_S('input[name="s"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : '')).each(function() {
			        siq_S(this).attr("autocomplete", "off");
                    if (SiqConfig.resultPageUrl) {
                        siq_S(this).parents("form:eq(0)").attr("action", SiqConfig.resultPageUrl.replace(/^https?:/i, ''));
                        siq_S(this).attr("name", "q");
                    }
			    });
			});

			var cleanClassNameInexes = function() {
			    var index = 0;
			    siq_S('input[name="s"],input[name="q"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : '')).each(function() {
			        while (/^[\w\W]*\b(siq_searchIndex-(\d+))\b[\w\W]*$/.test(siq_S(this).attr("class"))) {
			            siq_S(this).removeClass(siq_S(this).attr("class").replace(/^[\w\W]*\b(siq_searchIndex-(\d+))\b[\w\W]*$/, "$1"))
			        }
			        siq_S(this).addClass("siq_searchIndex-" + (index++));
			    });
			    var elements = siq_S(".siq_searchIndex-"+index);
			    if (elements.length <= 1) return;
			    elements.each(function() {
			        var newIndex = siq_S('input[name="s"],input[name="q"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : '')).index(this);
			        siq_S(this).removeClass("siq_searchIndex-" + index).addClass("siq_searchIndex-" + newIndex);
			    });
			};

			var getSearchBoxIndex = function(el) {
			    return siq_S('input[name="s"],input[name="q"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : '')).index(el)
			};

			siq_S(document).on("keyup", 'input[name="s"],input[name="q"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : ''), function(e){
				e.preventDefault();
				var thisElement     = siq_S(this);
				var thisVal 	    = thisElement.val();
				var isCustomSearch  = (thisElement.parents('.siq_search_results').length > 0) ? false : false;
				if (SiqConfig.disableAutocomplete && !isCustomSearch) return true;
                cleanClassNameInexes();
                var index = getSearchBoxIndex(thisElement);
                setTimeout(function() { thisElement.focus();},5);
				if(thisElement.parents('#wpadminbar').length == 0){
                  if(!thisElement.hasClass("siq_searchBox")){
                     thisElement.addClass('siq_searchBox');
                     var thisWidth = siq_S(this).parents('form').outerWidth();
                     thisElement.parents('form').addClass('siq_searchForm');
                     thisElement.addClass('siq_searchIndex-'+index);
					if(thisElement.parents().size(".siq_search_results") == 0){
					}
                  } else if (!thisElement.hasClass('siq_searchIndex-'+index)) {
                    while (siq_S('.siq_searchIndex-'+index).length > 0) index++;
                    thisElement.addClass('siq_searchIndex-'+index);
                  }
                }else{
                  return false;  
                }
				thisElement.attr('autocomplete','off');	
				var code = e.which;
				if(prevVal!="" && prevVal == thisVal){
					return false;
				}
				prevVal = thisVal;
				
				var thisParent	= thisElement.parents('.siq_searchWrapper');
				var post_types 	= siq_S('#siq_post_types').val();
				var leftVar;
				var windowWidth;
				var classWrapper;
				windowWidth = siq_S( document ).width();
				leftVar = thisElement.offset().left;
				
				if(leftVar + 500 > windowWidth){
					classWrapper = "fromRight";
				}else{
					classWrapper = "";
				}
				

				if(thisVal != ""){
					if(flagCall){
						flagCall = false;
						setTimeout(function() {
						    if (enterFlag) return;
                            oldTimeStamp = new Date().getTime();
                            flagCall = true;

							var thisVal 	= thisElement.val();
							if (thisVal == "") return;
							var url 	= siq_api_endpoint+siq_api_autoComp;
								url		+= '?q='+encodeURIComponent(buildFilterURLQuery() + thisVal.replace(/[<>()\/]+/g, ' '));
								url		+= '&engineKey='+siq_engine_key;
								url		+= '&page=0';
								url		+= '&itemsPerPage='+SiqConfig.autocompleteNumRecords;
								url		+= '&group=' + (SiqConfig.crossSiteSearch ? 1 : 0);
                                url     += '&autocomplete=1';
                            if (!!siqPostTypeFilter && siqPostTypeFilter !== '_siq_all_posts') {
                                url += '&documentTypes=' + encodeURIComponent(siqPostTypeFilter);
                            } else if (thisElement.parents('form:eq(0)').length > 0 && thisElement.parents('form:eq(0)').find("input[name=postTypes]").length > 0) {
                                url += '&documentTypes=' + encodeURIComponent(thisElement.parents('form:eq(0)').find("input[name=postTypes]").val());
                            } else if (thisElement.parent().children("input[name=postTypes]").length === 1) {
                                url += '&documentTypes=' + encodeURIComponent(thisElement.parent().children("input[name=postTypes]").val());
                            }
                            if (thisElement.parents('form:eq(0)').length > 0 && thisElement.parents('form:eq(0)').find("input[name=siqACFilters]").length > 0) {
								url += '&filter=' + encodeURIComponent(thisElement.parents('form:eq(0)').find("input[name=siqACFilters]").val());
							} else if (thisElement.parent().children("input[name=siqACFilters]").length === 1) {
								url += '&filter=' + encodeURIComponent(thisElement.parent().children("input[name=siqACFilters]").val());
							}
							siq_S.support.cors = true;
							if (ismsie() && parseInt(msieversion(), 10) >= 8  && window.XDomainRequest) {
								siq_S('body').addClass('ie_'+parseInt(msieversion()));
								siq_ajax({
									dataType: "jsonp",
									url: url+"",
									data: "",
									success: function(data){
									    if (enterFlag) return;
                                        var res = eval(data);
                                        if (res.main.query == buildFilterURLQuery() + thisElement.val().replace(/[<>()\/]+/g, ' ')) {
                                            if ((typeof res.main.totalResults == "undefined" || res.main.totalResults == 0) && (typeof res.partners == "undefined" || typeof res.partners.totalResults == "undefined" || res.partners.totalResults == 0)) {
                                                removeElement(thisElement, isCustomSearch);
                                                var holder = createResponse(thisElement, thisVal, "", true, isCustomSearch);
                                                placeElement(thisElement, holder, isCustomSearch);
                                            }
                                            resultOnce = true;
                                             removeElement(thisElement, isCustomSearch);
                                            currentElement = -1;
                                            var holder = createResponse(thisElement, thisVal, res, false, isCustomSearch);
                                            placeElement(thisElement, holder, isCustomSearch)
                                        }
                                        
									},
									error: function(jqXHR, textStatus, errorThrown ){
                                        if (enterFlag) return;
                                        if (jqXHR.status == 404 && resultOnce == true) {
                                            removeElement(thisElement, isCustomSearch);
                                            var holder = createResponse(thisElement, thisVal, "", true, isCustomSearch);
                                            placeElement(thisElement, holder, isCustomSearch)
                                        }else if(resultOnce == true){
                                            removeElement(thisElement, isCustomSearch);
                                            var holder = createResponse(thisElement, thisVal, "", true, isCustomSearch);
                                            placeElement(thisElement, holder, isCustomSearch)
                                        }else{
                                             removeElement(thisElement, isCustomSearch);
                                          }
                                       
									}
								  });
							}else{
								siq_S.getJSON( url, function( data ) {
								    if (enterFlag) return;
                                    var res = eval(data);
                                    if (res.main.query == buildFilterURLQuery() + thisElement.val().replace(/[<>()\/]+/g, ' ')) {
                                        if ((typeof res.main.totalResults == "undefined" || res.main.totalResults == 0) && (typeof res.partners == "undefined" || typeof res.partners.totalResults == "undefined" || res.partners.totalResults == 0)) {
                                            removeElement(thisElement, isCustomSearch);
                                            var holder = createResponse(thisElement, thisVal, "", true, isCustomSearch);
                                            placeElement(thisElement, holder, isCustomSearch);
                                        }
                                        resultOnce = true;
                                        removeElement(thisElement, isCustomSearch);
                                        currentElement = -1;
                                        var holder = createResponse(thisElement, thisVal, res, false, isCustomSearch);
                                        placeElement(thisElement, holder, isCustomSearch);
                                    }
								}).fail(function(jqXHR) {
                                    if (enterFlag) return;
                                    if (jqXHR.status == 404 && resultOnce == true) {
                                        removeElement(thisElement, isCustomSearch);
                                        var holder = createResponse(thisElement, thisVal, "", true, isCustomSearch);
                                        placeElement(thisElement, holder, isCustomSearch);
                                    }else if(resultOnce == true){
                                        removeElement(thisElement, isCustomSearch);
                                        var holder = createResponse(thisElement, thisVal, "", true, isCustomSearch);
                                        placeElement(thisElement, holder, isCustomSearch);
                                    }else{
                                       removeElement(thisElement, isCustomSearch);
                                    }
                                    
								});
							}
						}, 200);
			
					}
				}else{
                    newTimeStamp = new Date().getTime();
					flagCall = true;
					resultOnce = false;
					removeElement(thisElement, isCustomSearch);
					thisParent.removeClass('siq_searchResultWrapper');
					thisParent.removeClass('siq_searchHover');
				}
			});

            var buildFilterURLQuery = function() {
                var filters = [];
                if (siqSearchFacetFilter != null) {
                    filters = siqSearchFacetFilter;
                }
                var query = "";
                siq_S(filters).each(function() {
                    if (this === null) return;
                    query += this.value + ' AND ';
                });
                if (query.length > 0) {
                    return "(" + query.replace(/ AND $/, ") AND ");
                } else {
                    return ""
                }
            };

            var getObjectKeys = function(obj) {
                var keys = [], i;
                for (i in obj) {
                    if (obj.hasOwnProperty(i)) keys.push(i);
                }
                return keys;
            };

            var buildStringFacetPanel = function (facet, expanded) {
                var html = "";
                html += '<ul class="siq-term-list siq-clearfix" data-siq-filter-field="' + facet.field + '" data-siq-filter-order="' + facet.order + '" data-siq-filter-type="' + facet.type + '" data-siq-filter-query-field="' + facet.queryField + '" data-siq-filter-documenttype="' + facet.postType + '">';
                for (j = 0; j < facet.results.length; j++) {
                    var result = facet.results[j];
                    var keys = getObjectKeys(result);
                    if (keys.length != 1) continue;
                    var key = keys[0];
                    var filterValue = facet.queryField + ':&quot;' + key + '&quot;';
                    if (facet.postType && facet.postType != '_siq_all_posts') {
                        filterValue += ' AND documentType:&quot;' + facet.postType + '&quot;';
                    }
                    html += '<li class="siq-term-item ' + (j > 2 && !expanded ? "siq-toggleable" : "") + '" data-siq-filter-val="' + filterValue + '" data-siq-filter-humanvalue="' + key + '">';
                    html += '<a href="javascript:;">' + key + '<h4>' + result[key] + '</h4></a>';
                    html += '</li>';
                }
                if (facet.results.length > 3) {
                    if (expanded) {
                        html += '<li class="siq-more">- Show Less</li>';
                    } else {
                        html += '<li class="siq-more">+ Show More</li>';
                    }
                }
                html += '</ul>';
                return html;
            };

            if (SiqConfig.enableAutocompleteFacet) {
                var updateFacetSection = function(facetEl, response) {
                    siq_S(facetEl).children('ul').replaceWith(buildStringFacetPanel(response, true));
                };

                siq_S(document).on("keyup", "input.siq-ac-facet-filter", function() {
                    var term = siq_S(this).val();
                    var el = this;
                    var fField = siq_S(this).attr("data-siq-filter-field");
                    var autocompleteIndex = getAutocompleteIndex(siq_S(this).parents(".holdResults"));
                    var thisElement = siq_S(".siq_searchIndex-" + autocompleteIndex);
                    var thisVal = thisElement.val();
                    var hasCustomPostTypeFilter = thisElement.parent().children("input[name=postTypes]").length === 1;
                    setTimeout(function() {
                        if (term == siq_S(el).val()) {
                            var url = siq_api_endpoint + "search/facets";
                            url += '?q='+encodeURIComponent(buildFilterURLQuery() + thisVal.replace(/[<>()\/]+/g, ' '));
                            url += '&facetQuery='+encodeURIComponent(fField + ":" + term);
                            url += '&engineKey='+encodeURIComponent(siq_engine_key);
                            if (!!siqPostTypeFilter && siqPostTypeFilter !== '_siq_all_posts') {
                                url += '&documentTypes=' + encodeURIComponent(siqPostTypeFilter);
                            } else if (thisElement.parents('form:eq(0)').length > 0 && thisElement.parents('form:eq(0)').find("input[name=postTypes]").length > 0) {
                                url += '&documentTypes=' + encodeURIComponent(thisElement.parents('form:eq(0)').find("input[name=postTypes]").val());
                            } else if (thisElement.parent().children("input[name=postTypes]").length === 1) {
                                url += '&documentTypes=' + encodeURIComponent(thisElement.parent().children("input[name=postTypes]").val());
                            }
                            if (thisElement.parents('form:eq(0)').length > 0 && thisElement.parents('form:eq(0)').find("input[name=siqACFilters]").length > 0) {
								url += '&filter=' + encodeURIComponent(thisElement.parents('form:eq(0)').find("input[name=siqACFilters]").val());
							} else if (thisElement.parent().children("input[name=siqACFilters]").length === 1) {
								url += '&filter=' + encodeURIComponent(thisElement.parent().children("input[name=siqACFilters]").val());
							}
                            if (ismsie() && parseInt(msieversion(), 10) >= 8  && window.XDomainRequest) {
                                siq_S('body').addClass('ie_'+parseInt(msieversion()));
                                siq_ajax({
                                    dataType: "jsonp",
                                    url: url+"",
                                    data: "",
                                    success: function(data){
                                        var res = eval(data);
                                        if (thisVal == thisElement.val() && term == siq_S(el).val()) {
                                            updateFacetSection(siq_S(el).parent().parent(), res);
                                        }

                                    },
                                    error: function(jqXHR, textStatus, errorThrown ){
                                        if (thisVal == thisElement.val() && term == siq_S(el).val()) {
                                            updateFacetSection(siq_S(el).parent().parent(), null);
                                        }
                                    }
                                });
                            }else{
                                siq_S.getJSON( url, function( data ) {
                                    var res = eval(data);
                                    if (thisVal == thisElement.val() && term == siq_S(el).val()) {
                                        updateFacetSection(siq_S(el).parent().parent(), res);
                                    }
                                }).fail(function(jqXHR) {
                                    if (thisVal == thisElement.val() && term == siq_S(el).val()) {
                                        updateFacetSection(siq_S(el).parent().parent(), null);
                                    }
                                });
                            }
                        }
                    }, 200);
                });
            }
			
            function removeElement(thisElement, isCustomSearch) {
                if (isCustomSearch || false) {
				  siqIsAutoCompleteDisplayed = false;
                  thisElement.next('.holdResults').remove();
                }else{
				  siqIsAutoCompleteDisplayed = false;
                   siq_S('body').find('.holdResults.'+extraResultClass).remove(); 
                }
            }
            function placeElement(thisElement, holder, isCustomSearch) {
                if (siq_S(thisElement).hasClass("siq-overlaySearchBox")) {
				  siqIsAutoCompleteDisplayed = true;
                  siq_S(".siq_overlaycont").append(holder);
                  siq_S("body .siq_overlaycont .holdResults._siq_main_searchbox").attr("style", "");
               }else{
				   siqIsAutoCompleteDisplayed = true;
                   siq_S('body').append(holder); 
               }
                var el = siq_S('.siq-blogrfct-facet:visible');
                if (el.length > 0) {
                    el.attr("style", "display:none!important");el.attr("style","max-height: " + (el.parent().height()) + "px!important;min-height: " + (el.parent().height()) + "px!important;");
					siqIsAutoCompleteDisplayed = false;
                    el.children(".siq-scrollbox").trigger("siq-scrollbox-resize");
                }
            }
            
            function changeDisplayLocation() {
               siq_S("body>.holdResults").each(function() {
                    if (!siq_S(this).hasClass("holdResults") || siq_S(this).parent().hasClass("siq_overlaycont")) return;
                    var left = 0;
                    var windowsOffset;
                    var reduceLeft = 0;
                    var elHeight;
                    var isFixed = 0;
                    var windowWidth = siq_S( document ).width();
                    var thisElementR   = siq_S(this);
                    try{
                      var classIndex     = thisElementR.attr("class").match(/\d+/)[0];
                        classIndex         = (classIndex) ? classIndex : "";
                    }catch(e){

                    }
                    var thisElement, customSearchPage;
                    if (classIndex) {
                        thisElement = siq_S('.siq_searchIndex-'+classIndex);
                        customSearchPage = false;
                    } else {
                        thisElement = siq_S(this).parent().find("input:eq(0)");
                        customSearchPage = true;
                    }
                    if (thisElement.outerWidth() == 0) {
                        setTimeout(arguments.callee, 200);
                        return;
                    }
                   var hasFacets = siq_S(this).children(".siq-filter-on").length > 0;
                   var minAutoWidth = hasFacets ? 540 : 300
                    var elWidth = (SiqConfig.autocompleteWidth == null ? Math.max(thisElement.outerWidth(), minAutoWidth) : Math.max(minAutoWidth, parseInt(SiqConfig.autocompleteWidth)));
                    var rightResWidth = SiqConfig.enableAutocompleteFacet ? (hasFacets ? (Math.round(elWidth - 2) * 0.61 - (SiqConfig.showACImages ? 71 : 21)) : elWidth - (SiqConfig.showACImages ? 72 : 22)) : elWidth - (SiqConfig.showACImages ? 64 : 12);
                   siq_S("._siq_main_searchbox li.siq-autocomplete div.siq_resultRight.siq-has-no-price").each(function(index, el){
                       el.style="width:" + rightResWidth + "px!important;";
                   });
                    siq_S(this).attr("style", "width:" + elWidth + "px!important");
                    var style = "";

                    if(!customSearchPage || true){
                        var searchBoxWidth = thisElement.outerWidth();
                        left  = thisElement.offset().left;

                        left  = thisElement.offset().left;
                        if (elWidth != thisElement.outerWidth()) {
                            left -= (elWidth - thisElement.outerWidth())/2;
                        }
                        elHeight = thisElement.offset().top + thisElement.outerHeight(false);

                        if (typeof windowsOffset != "undefined") {
                           left      = windowsOffset[0] + reduceLeft;
                           elHeight = windowsOffset[1] + thisElement.outerHeight(false);
                        }
                        if(left + elWidth > windowWidth){
                            left = left - ((left + elWidth) - windowWidth) - 5;
                        }else if (left < 0 && left + elWidth != windowWidth) {
                            left = 0;
                        }

                        if (isResponsive) {
                            elHeight -= window.scrollY;
                        }
                        style   = "left:"+left+"px;";
                        thisElement.parents().each(function(){
                           if (siq_S(this).css("position") === "fixed") {
                              isFixed = 1;
                           }
                        });

                    }else{
                        elHeight = thisElement.outerHeight(false);
                        if (elWidth != thisElement.outerWidth()) {
                            left -= (elWidth - thisElement.outerWidth())/2;
                        }
                    }

                    elHeight -= (siq_S("body").css("position") == "relative" || siq_S("body").css("position") == "absolute") ? siq_S("body").offset().top : 0;
                    left -= (siq_S("body").css("position") == "relative" || siq_S("body").css("position") == "absolute") ? siq_S("body").offset().left : 0;
                    siq_S(this).css({left: left, top: elHeight});
               });

            }

            function fixUnclosedTags(str) {
                var arr = str.split(/<\/?em>/i);
                if (arr.length == 1) return str;
                var fixedStr = "";
                for (var i = 0; i < arr.length; i++) {
                    fixedStr += arr[i].replace(/<\/?(e(m(>)?)?)?/i, '');
                    if (i % 2 == 0) {
                        if(i+1 < arr.length && !(arr[i+1] === "..." && i+2 == arr.length)) {
                            fixedStr += "<em>";
                        }
                    } else {
                        if (i+1 == arr.length) {
                            if (fixedStr.indexOf("...") >= 0) {
                                if (arr[i] !== "...") fixedStr = fixedStr.replace("...", "</em>...");
                            } else {
                                fixedStr += "</em>";
                            }
                        } else {
                            fixedStr += "</em>";
                        }
                    }
                }
                return fixedStr;
            };

            var currentDomain = getRawDomain(location.href);

            var removeProtocolFromURL = function(url) {
                return url.replace(/^https?:/i, "");
            };

            var getImages = function(doc) {
                var images = [];
                if (doc.thumbnail_small_url) {
                    if (getRawDomain(doc.thumbnail_small_url) == currentDomain) {
                        images.push(removeProtocolFromURL(doc.thumbnail_small_url));
                    }
                    images.push(doc.thumbnail_small_url);
                }
                if (!!doc.image && doc.image instanceof Array && doc.image.length > 0) {
                    if (!!doc.image[0] && doc.image[0] != "false") {
                        if (getRawDomain(doc.image[0]) == currentDomain) {
                            images.push(removeProtocolFromURL(doc.image[0]));
                        }
                        images.push(doc.image[0]);
                    }
                    if (doc.image.length > 1 && !!doc.image[1] && doc.image[1] != "false") {
                        if (getRawDomain(doc.image[1]) == currentDomain) {
                            images.push(removeProtocolFromURL(doc.image[1]));
                        }
                        images.push(doc.image[1]);
                    }
                }
                return images;
            };

            var hasImage = function(doc) {
                // we check doc.image[x] != "false" because old plugin version can set string with value "false"
                return !!doc.thumbnail_small_url || !!doc.image && doc.image instanceof Array && doc.image.length > 0
                    && (!!doc.image[0] && doc.image[0] != "false"
                        || doc.image.length > 1 && !!doc.image[1] && doc.image[1] != "false");
            };

            window.SIQ_showNextImg = window.SIQ_showNextImg || function(imgList, img) {
                var index = parseInt(img.getAttribute("data-siq_img_index")) + 1;
                if (index < imgList.length) {
                    img.setAttribute("data-siq_img_index", index);
                    img.src = imgList[index];
                } else {
                    siq_S(img).parent().removeClass('has-image').addClass('no-image');
                    siq_S(img).replaceWith('<span class=\'no-img\'></span>');
                }
                siq_S(img).parents('._siq_main_searchbox').find('.siq-scrollbox').trigger('siq-scrollbox-resize');
            };
            
			function createResponse(thisElement, thisVal, res, error, customSearch){
                if (res === "" || typeof res.main == "undefined" || typeof res.main.records == "undefined" || res.main.records.length == 0) return "";
                if (SiqConfig.enableAutocompleteFacet) { // && SiqConfig.enableAutocompleteFacet && res.main.facetedSearchInfos instanceof Array && res.main.facetedSearchInfos.length > 0) {
                    return createResponsePro(thisElement, thisVal, res, error, customSearch)
                }
			        var elWidth = (SiqConfig.autocompleteWidth == null ? Math.max(thisElement.outerWidth(), 300) : Math.max(300, parseInt(SiqConfig.autocompleteWidth)));
					var searchBoxWidth = thisElement.outerWidth();
                    try{
                     var classIndex     = getSearchBoxIndex(thisElement) + "";
                         classIndex         = (classIndex || classIndex === "0") ? classIndex : "";
                    }catch(e){
                        var classIndex      = "";
                    }
					var style = "";
					var left=0, elHeight;
                    var reduceLeft = 0;
                    var isFixed = 0;
					var customSearchPage = (typeof customSearch != "undefined" && customSearch == true) ? true : false;
                    var thumbnailType = (typeof SiqConfig.thumbnailType != "undefined" && SiqConfig.thumbnailType == "resize") ? "resize" : "crop";
                    var holdResultExtraClass= (customSearchPage == true) ? "" : extraResultClass+" siq_searchIndexResult-"+classIndex;
                    var windowWidth = siq_S( document ).width();
					if(!customSearchPage || true){
                        left  = thisElement.offset().left;
                        if (elWidth != thisElement.outerWidth()) {
                            left -= (elWidth - thisElement.outerWidth())/2;
                        }
                        elHeight = thisElement.offset().top + thisElement.outerHeight(false);
                        
                        if (typeof windowsOffset != "undefined") {
                           left      = windowsOffset[0] + reduceLeft;
                           elHeight = windowsOffset[1] + thisElement.outerHeight(false);
                        }
                        if(left + elWidth > windowWidth){
                            left = left - ((left + elWidth) - windowWidth);
                        }else if (left < 0 && left + elWidth != windowWidth) {
                            left = 0;
                        }
                        
                        if (isResponsive) {
                            elHeight -= window.scrollY;
                        }
                        left -= (siq_S("body").css("position") == "relative" || siq_S("body").css("position") == "absolute") ? siq_S("body").offset().left : 0;
                        style   = "left:"+left+"px;";
                        thisElement.parents().each(function(){
                           if (siq_S(this).css("position") === "fixed") {
                              isFixed = 1;
                           } 
                        });
					}else{
                        elHeight = thisElement.outerHeight(false);
                        if (elWidth != thisElement.outerWidth()) {
                            left -= (elWidth - thisElement.outerWidth())/2;
                            style   = "left:"+left+"px;";
                        }
                    }
                    
                    elHeight -= (siq_S("body").css("position") == "relative" || siq_S("body").css("position") == "absolute") ? siq_S("body").offset().top : 0;
                    var rightResWidth = elWidth - (SiqConfig.showACImages ? 64 : 12);
                    
                    style += "top:"+elHeight+"px; position:absolute;width:"+elWidth+"px!important;";
                    var allResults = res;
                    var totalNumOfResults = (typeof allResults.main != "undefined" && typeof allResults.main.records != "undefined" ? allResults.main.records.length : 0);
                    var totalBottom = (typeof allResults.bottom != "undefined" && typeof allResults.bottom.records != "undefined" ? allResults.bottom.records.length : 0);
                    if( totalNumOfResults == 0 && totalBottom == 0) return;
					var holder = '<div class="holdResults '+holdResultExtraClass+'" style="'+style+'">';
							holder += "<span class='topArrow'></span>";
  						        holder += '<ul style="/*position:relative!important*/">';
								if(!error && totalNumOfResults > 0){

                                    res = allResults.main;
                                    var top = allResults.top;
                                    var bottom = allResults.bottom;
                                    var interleave = allResults.interleave;
                                    var zeroIndexFlag = true;
                                    var resRecommed = interleave;
                                    var mainResult = "";

                                    if(typeof res.records != "undefined" && res.records.length > 0){
                                        mainResult += '<li class="sectionHead"><h3>' + SiqConfig.autocompleteTextResults;
                                        if (!SiqConfig.hideLogo) {
                                            mainResult += '<div class="siq-powered-by">'+SiqConfig.autocompleteTextPoweredBy+' <a href="http://searchiq.co/" target="_blank">SearchIQ</a></div>';
                                        }
                                        mainResult += '</h3></li>';
                                        var index = 0;
                                        for(var i = 0; i < res.records.length; i++){
                                            var docHasImage = hasImage(res.records[i]), images = getImages(res.records[i]);
                                            if((i == 0 ? zeroIndexFlag : true)  && i%2 == 0 && typeof resRecommed != "undefined" && typeof resRecommed.records != "undefined" && resRecommed.records.length >= (index+1)) {
                                                var classImage = "";
                                                var classNoImage = "";

                                                var rHasImage = hasImage(resRecommed.records[index]), rImages = getImages(resRecommed.records[index]);
                                                classImage = rHasImage ? 'has-image' : 'no-image';
                                                mainResult += '<li class="siq-autocomplete siq-autocomplete-'+resRecommed.records[index].externalId+' "data-engineKey="' + resRecommed.records[index].engineKey + '">';
                                                mainResult += '<a target="_blank" href="'+resRecommed.records[index].url+'">';
                                                if(SiqConfig.showACImages){
                                                    mainResult += '<div class="siq_resultLeft '+classImage+' '+thumbnailType+'">';
                                                    if(rHasImage){
                                                        mainResult += '<img src="' + rImages[0] + '" data-siq_img_index="0" onerror="SIQ_showNextImg([\'' + rImages.join("','") + '\'], this)" onload="siq_S(this).parents(\'._siq_main_searchbox\').find(\'.siq-scrollbox\').trigger(\'siq-scrollbox-resize\')" />';
                                                    }else{
                                                        mainResult += '<span class="no-img"></span>';
                                                    }
                                                    mainResult += '</div>';
                                                }else{
                                                    classNoImage = "no-show-image";
                                                }
                                                mainResult += '<div class="siq_resultRight '+classNoImage+' siq-has-no-price" style="width:'+rightResWidth+'px!important;">';
                                                var docTitle = resRecommed.records[index].title;
                                                if (docTitle.length > 84) {
                                                    docTitle = fixUnclosedTags(docTitle.replace(/^([\w\W]{1,84})[^a-zA-Z0-9][\w\W]*$/, '$1') + "...");
                                                }
                                                mainResult += '<h3>'+docTitle+'</h3>';

                                                if(!!resRecommed.records[index].domain)
                                                    mainResult += '<p>' + resRecommed.records[index].domain + ' | Sponsored'+'</p>';
                                                else
                                                    mainResult += '<p>' + 'Sponsored' + '</p>';

                                                mainResult += '</div>';
                                                mainResult += '</a>';
                                                mainResult += '</li>';
                                                index++;
                                            }

                                                var classImage = "";
                                                var classNoImage = "";
                                                classImage = docHasImage ? 'has-image' : 'no-image';
                                                mainResult += '<li class="siq-autocomplete siq-autocomplete-' + res.records[i].externalId + '" data-engineKey="' + res.records[i].engineKey + '">';
                                                var link = res.records[i].url;
                                                if (getRawDomain(link) == nativeDomain) {
                                                    link = link.replace(/^https?:/i, '');
                                                }
                                                mainResult += '<a ' + (SiqConfig.openResultInTab ? ' target="_blank"' : '') + ' href="' + link + '">';
                                                if (SiqConfig.showACImages) {
                                                    mainResult += '<div class="siq_resultLeft ' + (SiqConfig.defaultThumbnailUrl != null  || classImage == 'has-image' ? "has-image" : "no-image") + ' '+thumbnailType+'">';
                                                    if (docHasImage) {
                                                        if(SiqConfig.defaultThumbnailUrl != null) images.push(SiqConfig.defaultThumbnailUrl);
                                                        mainResult += '<img src="' + images[0] + '" data-siq_img_index="0" onerror="SIQ_showNextImg([\'' + images.join("','") + '\'], this)" onload="siq_S(this).parents(\'._siq_main_searchbox\').find(\'.siq-scrollbox\').trigger(\'siq-scrollbox-resize\')" />';
                                                    } else {
                                                    	if(SiqConfig.defaultThumbnailUrl != null){
                                                    		siq_S(this).parent().removeClass('no-image').addClass('has-image');
                                                    		mainResult += '<img src=\"'+SiqConfig.defaultThumbnailUrl+'\" onerror="siq_S(this).parent().removeClass(\'has-image\').addClass(\'no-image\');siq_S(this).parent().html(\'<span class=no-img></span>\')" />';
                                                    	}else{
                                                    		siq_S(this).parent().removeClass('has-image').addClass('no-image');
                                                    		mainResult += '<span class="no-img"></span>';
                                                    	}
                                                    }
                                                    mainResult += '</div>';
                                                } else {
                                                    classNoImage = "no-show-image";
                                                }
                                                mainResult += '<div class="siq_resultRight ' + classNoImage + ' siq-has-no-price" style="width:' + rightResWidth + 'px!important;">';
                                                var docTitle = res.records[i].title;
                                                if (docTitle.length > 84) {
                                                    docTitle = fixUnclosedTags(docTitle.replace(/^([\w\W]{1,84})[^a-zA-Z0-9][\w\W]*$/, '$1') + "...");
                                                }
                                                mainResult += '<h3>' + docTitle + '</h3>';
                                                if (SiqConfig.crossSiteSearch && !!res.records[i].domain) {
                                                    mainResult += '<p>' + res.records[i].domain + '</p>';
                                                }
                                                mainResult += '</div>';
                                                mainResult += '</a>';
                                                mainResult += '</li>';
                                        }
                                    }

                                    //Top Also Recommended
                                    var topResults = buildAlsoRecommend(allResults.top,thumbnailType,rightResWidth);

                                    //Bottom Also Recommmended
                                    var bottomResults = buildAlsoRecommend(allResults.bottom,thumbnailType,rightResWidth);

                                    if(typeof allResults.top != "undefined" && typeof allResults.top.records != "undefined" && allResults.top.records.length > 0)
                                        holder += topResults;

                                    holder += mainResult;

                                    if(typeof allResults.bottom != "undefined" && typeof allResults.bottom.records != "undefined" && allResults.bottom.records.length > 0)
                                        holder += bottomResults;

                                    if (allResults.main.totalResults > 0) holder += '<li class="resultsMoreLi"><a href="javascript:;" class="resultsMore">' + SiqConfig.autocompleteTextMoreLink.replace("#", allResults.main.totalResults) + '</span></li>';

								}else{
									holder += buildAlsoRecommend(allResults.bottom,thumbnailType, rightResWidth);
								}
							holder += '</ul>';

						holder += '</div>';
                        
						return holder;
				}

            var getDateNameByKey = function(key) {
                switch (key) {
                    case 'today':
                        return "Today";
                    case 'yesterday':
                        return "Yesterday";
                    case 'past_week':
                        return "Past week";
                    case 'past_month':
                        return "Past month";
                    case 'past_year':
                        return "Past year";
                }
            };

            var buildAlsoRecommend = function(res, thumbnailType, rightResWidth){
                var result = "";
                if(typeof res != "undefined" && typeof res.records != "undefined" && res.records.length > 0){
                    result += '<li class="sectionHead"><h3>Also Recommended';
                    result += '</h3></li>';
                    for(var i = 0; i < res.records.length; i++){
                        var docHasImage = hasImage(res.records[i]), images = getImages(res.records[i]);
                        var classImage = "";
                        var classNoImage = "";
                        classImage = docHasImage ? 'has-image' : 'no-image';
                        result += '<li class="siq-autocomplete siq-autocomplete-'+res.records[i].externalId+' " data-engineKey="' + res.records[i].engineKey + '">';
                        result += '<a target="_blank" href="'+res.records[i].url+'">';
                        if(SiqConfig.showACImages){
                            result += '<div class="siq_resultLeft '+classImage+' '+thumbnailType+'">';
                            if(classImage == 'has-image'){
                                mainResult += '<img src="' + images[0] + '" data-siq_img_index="0" onerror="SIQ_showNextImg([\'' + images.join("','") + '\'], this)" onload="siq_S(this).parents(\'._siq_main_searchbox\').find(\'.siq-scrollbox\').trigger(\'siq-scrollbox-resize\')" />';
                            }else{
                                result += '<span class="no-img"></span>';
                            }
                            result += '</div>';
                        }else{
                            classNoImage = "no-show-image";
                        }
                        result += '<div class="siq_resultRight '+classNoImage+' siq-has-no-price" style="width:'+rightResWidth+'px!important;">';
                        var docTitle = res.records[i].title;
                        if (docTitle.length > 84) {
                            docTitle = fixUnclosedTags(docTitle.replace(/^([\w\W]{1,84})[^a-zA-Z0-9][\w\W]*$/, '$1') + "...");
                        }
                        result += '<h3>'+docTitle+'</h3>';
                        if(!!res.records[i].domain)
                            result += '<p>' + res.records[i].domain + '</p>';

                        result += '</div>';
                        result += '</a>';
                        result += '</li>';
                    }
                }
                return result;
            };

            var buildFacetsHTML = function(facetedSearchInfos) {
                var html = "";
                if (typeof facetedSearchInfos !== "undefined"
                        && facetedSearchInfos instanceof Array
                        && facetedSearchInfos.length > 0) {
                    var i,j;
                    for (i = 0; i < facetedSearchInfos.length; i++) {
                        var facet = facetedSearchInfos[i];
                        if (facet.order < 0 && (!siqPostTypeFilter && facet.results.length < 2)) continue;
                        if (facet.results.length == 0 || facet.type == "NUMBER" && facet.results[0].min > facet.results[0].max) continue;
                        html += '<div class="siq-facet-row">';
                        html += '<button class="siq-accordion siq-active">' + facet.label + "</button>";
                        html += '<div class="siq-panel siq-show">';

                        if (facet.order < 0) {
                            if (!!siqPostTypeFilter) {
                                html += "<a href='javascript:;' class='siq-applied-type-filter' data-filter-field='post_type' data-filter-val='" +
                                    siqPostTypeFilter + "'>" + siqPostTypeFilter + "</a>";
                            }
                        } else if (facet.type === "STRING") {
                            var appliedFilters = [];
                            for (var x = 0; x < siqSearchFacetFilter.length; ++x) {
                                if (siqSearchFacetFilter[x].field == facet.field) {
                                    html += "<a href='javascript:;' class='siq-applied-filter' data-filter-field='" +
                                        siqSearchFacetFilter[x].field + "' data-filter-val='" +
                                        siqSearchFacetFilter[x].value + "'>" + siqSearchFacetFilter[x].humanValue + "</a>";
                                }
                            }
                        } else if (facet.type === "RATING") {
                            var appliedFilters = [];
                            for (var x = 0; x < siqSearchFacetFilter.length; ++x) {
                                if (siqSearchFacetFilter[x].field == facet.field) {
                                    html += "<a href='javascript:;' class='siq-applied-filter' data-filter-field='" +
                                        siqSearchFacetFilter[x].field + "' data-filter-val='" +
                                        siqSearchFacetFilter[x].value + "'>" + siqSearchFacetFilter[x].humanValue + "</a>";
                                }
                            }
                        } else if (facet.type === 'DATE') {
                            var appliedFilters = [];
                            for (var x = 0; x < siqSearchFacetFilter.length; ++x) {
                                if (siqSearchFacetFilter[x].field == facet.field) {
                                    html += "<a href='javascript:;' class='siq-applied-filter' data-filter-field='" +
                                        siqSearchFacetFilter[x].field + "' data-filter-val='" +
                                        siqSearchFacetFilter[x].value + "'>" + getDateNameByKey(siqSearchFacetFilter[x].humanValue) + "</a>";
                                }
                            }
                        } else if (facet.type === "NUMBER") {
                            var appliedFilters = [];
                            for (var x = 0; x < siqSearchFacetFilter.length; ++x) {
                                if (siqSearchFacetFilter[x].field == facet.field) {
                                    html += "<a href='javascript:;' class='siq-applied-filter' data-filter-field='" +
                                        siqSearchFacetFilter[x].field + "' data-filter-val='" +
                                        siqSearchFacetFilter[x].value + "'>" + siqSearchFacetFilter[x].humanValue + "</a>";
                                }
                            }
                        }

                        switch (facet.type) {
                            case "STRING":
                                if (facet.order >= 0) {
                                    html += '<div class="siq-ac-facet-filter-wrp"><input class="siq-ac-facet-filter siq-hidden" data-siq-filter-field="' + facet.field + '" data-type="' + facet.type + '" data-order="' + facet.order + '" type="text"/></div>';
                                }
                            case "DATE":
                                if (facet.order >= 0) {
                                    html += '<ul class="siq-term-list siq-clearfix" data-siq-filter-field="' + facet.field + '" data-siq-filter-query-field="' + facet.queryField + '" data-siq-filter-documenttype="' + facet.postType + '" data-siq-filter-order="' + facet.order + '" data-siq-filter-type="' + facet.type + '">';
                                } else {
                                    html += '<ul class="siq-postType-list siq-clearfix">';
                                }
                                for (j = 0; j < facet.results.length; j++) {
                                    var result = facet.results[j];
                                    var keys = getObjectKeys(result);
                                    if (keys.length != 1) continue;
                                    var key = keys[0];
                                    if (facet.order >= 0) {
                                        var filterValue = (facet.type === "DATE" ? facet.queryField + ':[' + (result[key].fromDateStr == null ? '*' : result[key].fromDateStr) + ' TO ' + (result[key].toDateStr == null ? '*' : result[key].toDateStr) + ']' : facet.queryField + ':&quot;' + key.replace('"', '\\&quot;') + '&quot;');
                                        if (facet.postType && facet.postType != '_siq_all_posts') {
                                            filterValue += ' AND documentType:&quot;' + facet.postType + '&quot;';
                                        }
                                        html += '<li class="siq-term-item ' + (j > 2 ? "siq-toggleable" : "") + '" data-siq-filter-val="' + filterValue + '" data-siq-filter-humanvalue="' + key.replace('"', '&quot;') + '">';
                                        html += '<a href="javascript:;">' + (facet.type === "DATE" ? getDateNameByKey(key) : key) + '<h4>' + (facet.type === "DATE" ? result[key].count : result[key]) + '</h4></a>';
                                    } else {
                                        html += '<li class="siq-postType-item ' + (j > 2 ? "siq-toggleable" : "") + '" data-siq-filter-val="' + key + '">';
                                        html += '<a href="javascript:;">' + (key == "_siq_all_posts" ? "All post types" : key) + '<h4>' + result[key] + '</h4></a>';
                                    }
                                    html += '</li>';
                                }
                                if (facet.results.length > 3) {
                                    html += '<li class="siq-more">+ Show More</li>';
                                }
                                html += '</ul>';
                                break;
                            case "NUMBER":
                                html += '<div class="siq-filter-options-cont">';
                                html += '<div class="siq-ui-slider siq-ui-slider-horizontal siq-ui-widget siq-ui-widget-content siq-ui-corner-all" data-siq-min="'+facet.results[0].min+'" data-siq-max="'+facet.results[0].max+'" data-siq-filter-field="' + facet.field + '" data-siq-filter-query-field="' + facet.queryField + '" data-siq-filter-documenttype="' + facet.postType + '" data-siq-filter-order="' + facet.order + '" data-siq-filter-type="' + facet.type + '">';
                                html += '<span class="siq-ui-slider-handle siq-ui-state-default siq-ui-corner-all siq-slider-min" style="left: 0%" tabindex="0"></span>';
                                html += '<span class="siq-ui-slider-handle siq-ui-state-default siq-ui-corner-all siq-slider-max" style="left: 100%" tabindex="0"></span>';
                                html += '</div>';
                                html += '<p><input readonly type="text" value="' + facet.results[0].min + ' - ' + facet.results[0].max + '"></p>';
                                html += '</div>';
                                break;
                            case "RATING":
                                html += '<ul class="siq-term-list siq-clearfix" data-siq-filter-field="' + facet.field + '" data-siq-filter-order="' + facet.order + '" data-siq-filter-type="' + facet.type + '" data-siq-filter-query-field="' + facet.queryField + '" data-siq-filter-documenttype="' + facet.postType + '">';
                                for(j = 5; j >= 1; --j) {
                                    var key = 'r' + j;
                                    if (typeof facet.results[0][key] == "undefined") continue;
                                    var filterValue = facet.queryField + ':>=' + j;
                                    if (facet.postType && facet.postType != '_siq_all_posts') {
                                        filterValue += ' AND documentType:&quot;' + facet.postType + '&quot;';
                                    }
                                    html += '<li class="siq-term-item" data-siq-filter-val="' + filterValue + '" data-siq-filter-humanvalue="' + j + ' &amp; more stars">';
                                    html += '<a href="javascript:;">' + buildRatingStars(j) + '<h4>' + facet.results[0][key] + '</h4></a>';
                                    html += '</li>';
                                }
                                html += '</ul>';
                        }
                        html += '</div></div>';
                    }
                }
                return html;
            };

            var buildRatingStars = function(rating) {
                return '<div class="siq-starratings"> ' +
                    '<div class="siq-starratings-top" style="width: ' + ratingToWidthPercent(rating) + '% !important;"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div> ' +
                    '<div class="siq-starratings-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div> ' +
                    '</div>';
            };

            var formatPrice = function(num) {
                var tmp = (num + "").split(".");
                if (tmp.length == 1) {
                    tmp.push("00");
                } else {
                    if (tmp[1].length == 1) tmp[1] += "0" + "";
                }
                return tmp.join(".");
            };

            var getLeftPriceSym = function (res) {
                if (typeof res.currencySymbol !== "undefined" && typeof res.currencySymbolPosition !== "undefined") {
                    if (res.currencySymbolPosition === "LEFT") return res.currencySymbol;
                    else if (res.currencySymbolPosition === "LEFT_SPACE") return res.currencySymbol + "&nbsp;";
                }
                return "";
            };

            var getRightPriceSym = function (res) {
                if (typeof res.currencySymbol !== "undefined" && typeof res.currencySymbolPosition !== "undefined") {
                    if (res.currencySymbolPosition === "RIGHT") return res.currencySymbol;
                    if (res.currencySymbolPosition === "RIGHT_SPACE") return "&nbsp;" + res.currencySymbol;
                }
                return "";
            };

            var ratingToWidthPercent = function (rating) {
                return rating / 5 * 100;
            };

            var displayFacets = function(facets) {
                if (SiqConfig.enableAutocompleteFacet && facets instanceof Array && facets.length > 0) {
                    if (facets.length == 1 && facets[0].order == -1 && facets[0].results.length == 1 && !siqPostTypeFilter) return false;
                    return true;
                }
                return false;
            };

            var createResponsePro = function(thisElement, thisVal, res, error, customSearch){
                var hasFacets = displayFacets(res.main.facetedSearchInfos);
                var autoMinWidth = hasFacets ? 540 : 300;
                var elWidth = (SiqConfig.autocompleteWidth == null ? Math.max(thisElement.outerWidth(), autoMinWidth) : Math.max(autoMinWidth, parseInt(SiqConfig.autocompleteWidth)));
                var searchBoxWidth = thisElement.outerWidth();
                try{
                    var classIndex     = getSearchBoxIndex(thisElement) + "";
                    classIndex         = (classIndex || classIndex === "0") ? classIndex : "";
                }catch(e){
                    var classIndex      = "";
                }
                var style = "";
                var left=0, elHeight;
                var reduceLeft = 0;
                var isFixed = 0;
                var customSearchPage = !!(typeof customSearch != "undefined" && customSearch == true);
                var thumbnailType = (typeof SiqConfig.thumbnailType != "undefined" && SiqConfig.thumbnailType == "resize") ? "resize" : "crop";
                var holdResultExtraClass= (customSearchPage == true) ? "" : extraResultClass+" siq_searchIndexResult-"+classIndex;
                var windowWidth = siq_S( document ).width();
                if(!customSearchPage || true){
                    left  = thisElement.offset().left;
                    if (elWidth != thisElement.outerWidth()) {
                        left -= (elWidth - thisElement.outerWidth())/2;
                    }
                    elHeight = thisElement.offset().top + thisElement.outerHeight(false);

                    if (typeof windowsOffset != "undefined") {
                        left      = windowsOffset[0] + reduceLeft;
                        elHeight = windowsOffset[1] + thisElement.outerHeight(false);
                    }
                    if(left + elWidth > windowWidth){
                        left = left - ((left + elWidth) - windowWidth);
                    }else if (left < 0 && left + elWidth != windowWidth) {
                        left = 0;
                    }

                    if (isResponsive) {
                        elHeight -= window.scrollY;
                    }
                    left -= (siq_S("body").css("position") == "relative" || siq_S("body").css("position") == "absolute") ? siq_S("body").offset().left : 0;
                    style   = "left:"+left+"px;";
                    thisElement.parents().each(function(){
                        if (siq_S(this).css("position") === "fixed") {
                            isFixed = 1;
                        }
                    });
                }else{
                    elHeight = thisElement.outerHeight(false);
                    if (elWidth != thisElement.outerWidth()) {
                        left -= (elWidth - thisElement.outerWidth())/2;
                        style   = "left:"+left+"px;";
                    }
                }

                elHeight -= (siq_S("body").css("position") == "relative" || siq_S("body").css("position") == "absolute") ? siq_S("body").offset().top : 0;
                var rightResWidth = hasFacets ? Math.round((elWidth - 2) * 0.61 - (SiqConfig.showACImages ? 71 : 21)) : (elWidth - (SiqConfig.showACImages ? 72 : 22));

                style += "top:"+elHeight+"px; position:absolute;width:"+elWidth+"px!important;";
                var allResults = res;
                var totalNumOfResults = (typeof allResults.main != "undefined" && typeof allResults.main.records != "undefined" ? allResults.main.records.length : 0);
                if( totalNumOfResults == 0) return;

                var filterOnOffClass = "siq-filter-" + (hasFacets ? "on" : "off");
                var holder = '<div class="holdResults '+holdResultExtraClass+'" style="'+style+'">';
                holder += "<span class='topArrow'></span>";
                holder += '<div class="siq-blogrfct-cont siq-clearfix ' + filterOnOffClass + '">';
                if (hasFacets) {
                    holder += '<div class="siq-blogrfct-facet"><div class="siq-scrollbox">' + buildFacetsHTML(allResults.main.facetedSearchInfos) + '</div>' +
                        '<div style="position: absolute!important; z-index: 1!important; margin: 0px!important; padding: 0px!important; right: 61%!important; top: 11px!important;">' +
                        '<div class="siq-scroll-track"><a href="javascript:;" class="siq-scroll-handle" style="position: absolute!important; z-index: 1!important; top: 0px!important;"></a></div></div>' +
                        '</div>';
                }
                holder += '<div class="siq-blogrfct-srchmain">';
                holder += '<ul>';
                if(!error && totalNumOfResults > 0){

                    res = allResults.main;
                    var top = allResults.top;
                    var bottom = allResults.bottom;
                    var interleave = allResults.interleave;
                    var zeroIndexFlag = true;
                    var resRecommed = interleave;
                    var mainResult = "";

                    if(typeof res.records != "undefined" && res.records.length > 0){
                        mainResult += '<li class="sectionHead"><h3>';
                        //if (!SiqConfig.hideLogo) {
                            //mainResult += '<div class="siq-powered-by">' + SiqConfig.autocompleteTextPoweredBy + ' <a href="http://searchiq.xyz/" target="_blank">searchIQ</a></div>';
                        //}
                        mainResult += SiqConfig.autocompleteTextResults;
                        mainResult += '</h3></li>';
                        mainResult += '<li class="siq-tabswrp"><div class="siq-tbaram">';
                        mainResult += '<div class="siq-tabcontent current"><ul>';
                        var index = 0;
                        for(var i = 0; i < res.records.length; i++){
                            var docHasImage = hasImage(res.records[i]), images = getImages(res.records[i]);
                            if((i == 0 ? zeroIndexFlag : true)  && i%2 == 0 && typeof resRecommed != "undefined" && typeof resRecommed.records != "undefined" && resRecommed.records.length >= (index+1)) {
                                var classImage = "";
                                var classNoImage = "";
                                var rHasImage = hasImage(resRecommed.records[index]), rImages = getImages(resRecommed.records[index]);
                                classImage = rHasImage ? 'has-image' : 'no-image';
                                mainResult += '<li class="siq-autocomplete siq-autocomplete-'+resRecommed.records[index].externalId+' "data-engineKey="' + resRecommed.records[index].engineKey + '">';
                                mainResult += '<a target="_blank" href="'+resRecommed.records[index].url+'">';
                                if(SiqConfig.showACImages){
                                    mainResult += '<div class="siq_resultLeft '+classImage+' '+thumbnailType+'">';
                                    if(rHasImage){
                                        mainResult += '<img src="' + rImages[0] + '" data-siq_img_index="0" onerror="SIQ_showNextImg([\'' + rImages.join("','") + '\'], this)" onload="siq_S(this).parents(\'._siq_main_searchbox\').find(\'.siq-scrollbox\').trigger(\'siq-scrollbox-resize\')" />';
                                    }else{
                                        mainResult += '<span class="no-img"></span>';
                                    }
                                    mainResult += '</div>';
                                }else{
                                    classNoImage = "no-show-image";
                                }
                                mainResult += '<div class="siq_resultRight '+classNoImage+' siq-has-no-price" style="width:'+rightResWidth+'px!important;">';
                                var docTitle = resRecommed.records[index].title;
                                if (docTitle.length > 84) {
                                    docTitle = fixUnclosedTags(docTitle.replace(/^([\w\W]{1,84})[^a-zA-Z0-9][\w\W]*$/, '$1') + "...");
                                }
                                mainResult += '<h3>'+docTitle+'</h3>';

                                if(!!resRecommed.records[index].domain)
                                    mainResult += '<p>' + resRecommed.records[index].domain + ' | Sponsored'+'</p>';
                                else
                                    mainResult += '<p>' + 'Sponsored' + '</p>';

                                mainResult += '</div>';
                                mainResult += '</a>';
                                mainResult += '</li>';
                                index++;
                            }

                            var classImage = "";
                            var classNoImage = "";
                            classImage = docHasImage ? 'has-image' : 'no-image';
                            mainResult += '<li class="siq-autocomplete siq-autocomplete-' + res.records[i].externalId + '" data-engineKey="' + res.records[i].engineKey + '">';
                            var link = res.records[i].url;
                            if (getRawDomain(link) == nativeDomain) {
                                link = link.replace(/^https?:/i, '');
                            }
                            mainResult += '<a ' + (SiqConfig.openResultInTab ? ' target="_blank"' : '') + ' href="' + link + '">';
                            if (SiqConfig.showACImages) {
                                mainResult += '<div class="siq_resultLeft ' + (SiqConfig.defaultThumbnailUrl != null || classImage == 'has-image' ? "has-image" : "no-image") + ' '+thumbnailType+'">';
                                if (docHasImage) {
                                    if(SiqConfig.defaultThumbnailUrl != null) images.push(SiqConfig.defaultThumbnailUrl);
                                    mainResult += '<img src="' + images[0] + '" data-siq_img_index="0" onerror="SIQ_showNextImg([\'' + images.join("','") + '\'], this)" onload="siq_S(this).parents(\'._siq_main_searchbox\').find(\'.siq-scrollbox\').trigger(\'siq-scrollbox-resize\')" />';
                                } else {
                                	if(SiqConfig.defaultThumbnailUrl != null){
                                		siq_S(this).parent().removeClass('no-image').addClass('has-image');
                                		mainResult += '<img src=\"'+SiqConfig.defaultThumbnailUrl+'\" onerror="siq_S(this).parent().removeClass(\'has-image\').addClass(\'no-image\');siq_S(this).parent().html(\'<span class=no-img></span>\')" />';
                                	}else{
                                		mainResult += '<span class="no-img"></span>';
                                	}
                                }
                                mainResult += '</div>';
                            } else {
                                classNoImage = "no-show-image";
                            }
                            if (res.records[i].documentType === "product" && typeof res.records[i].regularPrice === "number") {
                                mainResult += '<div class="siq_resultRight ' + classNoImage + '">';
                            } else {
                                mainResult += '<div class="siq_resultRight ' + classNoImage + ' siq-has-no-price" style="width:' + rightResWidth + 'px!important;">';
                            }
                            var docTitle = res.records[i].title;
                            if (docTitle.length > 84) {
                                docTitle = fixUnclosedTags(docTitle.replace(/^([\w\W]{1,84})[^a-zA-Z0-9][\w\W]*$/, '$1') + "...");
                            }
                            mainResult += '<h3>' + docTitle + '</h3>';
                            if (typeof res.records[i].rating === "number") {
                                mainResult += buildRatingStars(res.records[i].rating);
                            }
                            if ((SiqConfig.crossSiteSearch || (typeof resRecommed != "undefined" && typeof resRecommed.records != "undefined" && resRecommed.records.length > 0)) && !!res.records[i].domain) {
                                mainResult += '<p>' + res.records[i].domain + '</p>';
                            }
                            mainResult += '</div>';
                            if (typeof res.records[i].regularPrice === "number") {
                                mainResult += '<div class="siq_prdprice"><p>';
                                if (typeof res.records[i].salePrice === "number") {
                                    mainResult += getLeftPriceSym(res.records[i]) + formatPrice(res.records[i].salePrice) + getRightPriceSym(res.records[i]);
                                } else {
                                    mainResult += getLeftPriceSym(res.records[i]) + formatPrice(res.records[i].regularPrice) + getRightPriceSym(res.records[i]);
                                }
                                mainResult += '</p></div>';
                            }
                            mainResult += '</a>';
                            mainResult += '</li>';
                        }
                    }

                    //Top Also Recommended
                    var topResults = buildAlsoRecommend(allResults.top,thumbnailType,rightResWidth);

                    //Bottom Also Recommmended
                    var bottomResults = buildAlsoRecommend(allResults.bottom,thumbnailType,rightResWidth);

                    if(typeof allResults.top != "undefined" && typeof allResults.top.records != "undefined" && allResults.top.records.length > 0)
                        holder += topResults;

                    holder += mainResult;

                    if(typeof allResults.bottom != "undefined" && typeof allResults.bottom.records != "undefined" && allResults.bottom.records.length > 0)
                        holder += bottomResults;

                    if (allResults.main.totalResults > 0) holder += '<li class="resultsMoreLi"><a href="javascript:;" class="resultsMore">' + SiqConfig.autocompleteTextMoreLink.replace("#", allResults.main.totalResults) + '</a></li>';
                    if (!SiqConfig.hideLogo) {
                        console.log('SiqConfig.autocompleteTextPoweredBy', SiqConfig.autocompleteTextPoweredBy);
                        holder += '<li class="siq-powered-by">' + SiqConfig.autocompleteTextPoweredBy + ' <a href="http://searchiq.co/" target="_blank">SearchIQ</a></li>'
                    }

                }else{
                    holder += '<li class="sectionHead"><h3>'+SiqConfig.autocompleteTextResults+'</h3></li>';
                    holder += '<li class="no-result">' + (SiqConfig.noRecordsFoundText ? SiqConfig.noRecordsFoundText : 'No records found') + '</li>';
                }

                holder += '</ul></div></div></li></ul>';
                holder += '</div>';
                holder += '</div>';
                holder += '</div>';

                return holder;
            };

			siq_S(document).on('mouseenter', 'h1 a, h2 a, h3 a, h4 a, h5 a, h6 a', function(){
				if(siq_S(this).find('.siq_wp_search_result_title').length > 0){
					var thiEl = siq_S(this).find('.siq_wp_search_result_title');
					if(thiEl.parents('.siq-post').length == 0){
						var dwClasses 	= thiEl.attr('class');
						var regExp		= /siq-post-([0-9]+)/g;
						var classes     = regExp.exec(dwClasses);
                        if (typeof classes != "undefined" && classes != null) {
                           thiEl.parent().addClass('siq-post siq-post-'+classes[1]);
                           thiEl.removeClass('siq-post').removeClass('siq-post-'+classes[1]);   
                        }
					}
				}
			});
             
			siq_S(document).on("mouseup touchstart click", 'body', function (e){
				var container 	= siq_S(".holdResults");
				var containerS 	= siq_S('input[name="s"],input[name="q"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : ''));
                if (siq_S("body>.holdResults").length > 0 && !container.is(e.target) && container.has(e.target).length === 0 &&  !containerS.is(e.target) && !containerS.hasClass("siq-overlaySearchBox")) {
                     siq_S('.siq_searchWrapper').removeClass("siq_searchResultWrapper").removeClass("siq_searchHover");
                    siqPostTypeFilter = null;
                    siqSearchFacetFilter = [];
                     setTimeout(function(){container.attr("style", "display:none!important"); siqIsAutoCompleteDisplayed=false;},10);
				}
			});

			siq_S(document).on("blur focus", 'body', function (e){
                var containerS;
                siq_S('input[name="s"],input[name="q"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : '')).each(function() {
                    if (siq_S(this).is(e.target)) {
                        containerS = siq_S(this);
                    }
                });
                if (!containerS || containerS.hasClass("siq-overlaySearchBox")) return;
                var indexes = containerS.attr("class").match(/\bsiq_searchIndex-(\d+)\b/g);
                if (!indexes || indexes.length == 0) return;
            });
			
			siq_S(document).on("mouseenter", '.siq_searchBox', function(){
				currentElement = -1;
				siq_S(this).attr('autocomplete', 'off');
				if(siq_S(".holdResults .siq-autocomplete.highlighted").length > 0){
					siq_S(".holdResults .siq-autocomplete").removeClass("highlighted");
				}
			});
			
			siq_S(document).on("mouseenter", '.siq_searchWrapper', function(){
				if(!siq_S(this).hasClass('siq_searchHover')){
					siq_S(this).addClass('siq_searchHover');
                    var isCustomSearch  = (siq_S(this).parents('.siq_search_results').length > 0) ? true : false;
                    if (!isCustomSearch) {
                        try{
                           var classIndex     = siq_S(this).find('.siq_searchBox').attr("class").match(/\d+/)[0];
                           classIndex     = (classIndex) ? classIndex : "";
                           if (classIndex) {
                             var searchResult = siq_S('body').find('.siq_searchIndexResult-'+classIndex);
                           }
                        }catch(e){
                           
                        }
                    }else{
                        var searchResult = siq_S(this).find('.holdResults');
                    }
					if(typeof(searchResult) != "undefined"){
						if(searchResult.find(".siq-autocomplete").length > 0 || searchResult.find(".no-result").length > 0){
							siq_S(this).addClass("siq_searchResultWrapper").addClass("siq_searchHover");
							searchResult.attr("style", "display:block!important");
							changeDisplayLocation();
						}else{
							siq_S(this).removeClass("siq_searchResultWrapper").removeClass("siq_searchHover");
                            searchResult.attr("style", "display:none!important");
							siqIsAutoCompleteDisplayed = false;
						}
					}
				}
			});
			
			siq_S(document).on("mouseleave", '.siq_searchWrapper', function(e){
				var container 	= siq_S(this);
                var isCustomSearch  = (siq_S(this).parents('.siq_search_results').length > 0) ? true : false;
                  if (!isCustomSearch) {
                     try{
                        var classIndex      = siq_S(this).find('.siq_searchBox').attr("class").match(/\d+/)[0];
                             classIndex     = (classIndex) ? classIndex : "";
                             if (classIndex ) {
                               var searchResult = siq_S('body').find('.siq_searchIndexResult-'+classIndex);
                             }
                        }catch(e){
                           
                        }
                  }else{
                      var searchResult = siq_S(this).find('.holdResults');
                  }
				if (typeof searchResult !="undefined" && !container.is(e.target) && container.has(e.target).length === 0) {
					siq_S(this).removeClass('siq_searchResultWrapper').removeClass("siq_searchHover");
					searchResult.hide();
					siqIsAutoCompleteDisplayed  = false;
				}
			});
				
			siq_S(document).on("click", ".siq-autocomplete a", function(e){
                var isCustomSearch  = (siq_S(this).parents('.siq_search_results').length > 0) ? true : false;
                if (!isCustomSearch) {
                    var index = siq_S(this).parents('.holdResults.'+extraResultClass).attr("class").replace(/^[\w\W]*?\bsiq_searchIndexResult-(\d+)\b[\w\W]*$/, '$1');
                    if (!/^\d+$/.test(index) || siq_S('.siq_searchIndex-' + index).length < 1) return;
                    var searchVal = siq_S('.siq_searchIndex-' + index).val();
                }else{
                    var searchVal = siq_S(this).parents(".siq_searchInner").find("input.siq_searchBox").val();
                }

                if (siq_S(this).hasClass("siq-recommended-link") || siq_S(this).parents(".siq-recommended-link").length > 0) {
                    var baseUrl = siq_S(this).attr("href");
                    siq_S(this).attr("href",baseUrl+"&q="+searchVal);
                    return;
                }
                else{
                    return	logAutocompleteClick(siq_S(this), siq_S(this).parents("li").attr('class'), searchVal);
                }
			});

            siq_S(document).on("click", ".siq-accordion", function(e) {
                siq_S(this).toggleClass("siq-active");
                siq_S(this).parent().children("div.siq-panel").toggleClass("siq-show");
                siq_S(this).parents(".siq-scrollbox").trigger("siq-scrollbox-resize");
            });

            siq_S(document).on("click", ".siq-more", function(e) {
                var collapsed = siq_S(this).text().trim() === "+ Show More";
                siq_S(this).text(collapsed ? "- Show Less" : "+ Show More");
                siq_S(this).parent().children(".siq-term-item").each(function(key, elm) {
                    if (key > 2) {
                        siq_S(elm).toggleClass("siq-toggleable");
                    }
                });
                if (collapsed) {
                    siq_S(this).parents('.siq-panel:first').find('.siq-ac-facet-filter').removeClass("siq-hidden");
                } else {
                    siq_S(this).parents('.siq-panel:first').find('.siq-ac-facet-filter').addClass("siq-hidden");
                }
                siq_S(this).parents(".siq-scrollbox").trigger("siq-scrollbox-resize");
            });

            var getClosestSliderHandler = function (min, max, pageX) {
                var m1 = Math.abs(min.offset().left - pageX);
                var m2 = Math.abs(max.offset().left - pageX);
                return m1 < m2 ? min : max;
            };

            var setSliderValue = function(sliderEl, pageX) {
                var offset = sliderEl.offset();
                var width = sliderEl.width();
                var currentOffset = pageX - offset.left;
                var minEl = sliderEl.children(".siq-slider-min");
                var maxEl = sliderEl.children(".siq-slider-max");
                var activeEl = minEl.hasClass("siq-slider-handler-active") ? minEl : (maxEl.hasClass("siq-slider-handler-active") ? maxEl : getClosestSliderHandler(minEl, maxEl, pageX));
                activeEl.addClass("siq-slider-handler-active");
                var currentPercent = (currentOffset / width) * 100;
                var min = sliderEl.data("siq-min");
                var max = sliderEl.data("siq-max");
                var minMax = sliderEl.next().children("input").val().split(" - ");
                if (activeEl.hasClass("siq-slider-min")) {
                    minMax[0] = Math.max(min, Math.min(Math.floor((max - min) * currentPercent / 100 + min), minMax[1]));
                    activeEl.css("left", Math.max(0, 100 * (minMax[0] - min) / (max - min)) + "%");
                } else {
                    minMax[1] = Math.min(max, Math.max(Math.ceil((max - min) * currentPercent / 100 + min), minMax[0]));
                    activeEl.css("left", Math.min(100, 100 * (minMax[1] - min) / (max - min)) + "%");
                }
                sliderEl.next().children("input").val(minMax[0] + ' - ' + minMax[1]);
            };

            siq_S(document).on("mousedown", ".siq-ui-slider", function(e) {
                siq_S(this).addClass("siq-ui-slider-moving");
                setSliderValue(siq_S(this), e.pageX);
            });

            var scrollFacetBlock = function(el, lastY, y, lastScrollTop) {
                var handle = el.find("a");
                var totalHeight = el.prev().outerHeight(true);
                var handleHeight = handle.parent().height();
                var movePercent = 100 * (y - lastY) / handleHeight;
                el.parent()[0].scrollTop = lastScrollTop + movePercent * totalHeight / 100;
                var style = handle.attr("style");
                style = style.replace(/top:\d+(\.\d+)?%!important;/, "top:" + (100 * el.parent()[0].scrollTop / totalHeight) + "%!important;");
                handle.attr("style", style);
            };

            siq_S(document).on("mousemove", function(e) {
                if (siq_S(".siq-ui-slider.siq-ui-slider-moving").length > 0) {
                    setSliderValue(siq_S(".siq-ui-slider.siq-ui-slider-moving"), e.pageX);
                    e.preventDefault();
                } else if (siq_S(".siq-scroll-handle-active").length > 0) {
                    var handle = siq_S(".siq-scroll-handle-active");
                    var lastY = handle.data("siq-last-y");
                    var lastScrollTop = handle.data("siq-last-scroll-top");
                    //handle.data("siq-last-y", e.pageY);
                    scrollFacetBlock(handle.parent().parent(), lastY, e.pageY, lastScrollTop);
                    e.preventDefault();
                }
            });

            var updateResultsOnly = function(autocompleteIndex) {
                var thisElement = siq_S(".siq_searchIndex-" + autocompleteIndex);
                var form = siq_S(".siq_searchIndex-" + autocompleteIndex).parents("form:first");
                form.find("input[type=hidden][name=" + filterGetName + "], input[type=hidden][name=" + documentTypeGetName + "]").remove();
                if (siqPostTypeFilter != null && siqPostTypeFilter !== "_siq_all_posts") {
                    form.append("<input type='hidden' name='" + documentTypeGetName + "' value='" + siqPostTypeFilter + "' />");
                }
                if (siqSearchFacetFilter != null) {
                    for (var i = 0; i < siqSearchFacetFilter.length; ++i) {
                        form.append("<input type='hidden' name='" + filterGetName + "' value='' />");
                        form.find("input[type=hidden][name="+filterGetName+"]:last").val(siqSearchFacetFilter[i].field + '|' + siqSearchFacetFilter[i].humanValue + "|" + siqSearchFacetFilter[i].value);
                    }
                }
                var thisVal = thisElement.val();
                var isCustomSearch  = (thisElement.parents('.siq_search_results').length > 0) ? false : false;

                var hasCustomPostTypeFilter = thisElement.parent().children("input[name=postTypes]").length === 1;

                var url 	= siq_api_endpoint+siq_api_autoComp;
                url		+= '?q='+encodeURIComponent(buildFilterURLQuery() + thisVal.replace(/[<>()\/]+/g, ' '));
                url		+= '&engineKey='+siq_engine_key;
                url		+= '&page=0';
                url		+= '&itemsPerPage='+SiqConfig.autocompleteNumRecords;
                url		+= '&group=' + (SiqConfig.crossSiteSearch ? 1 : 0);
                if (!!siqPostTypeFilter && siqPostTypeFilter !== '_siq_all_posts') {
                    url += '&documentTypes=' + encodeURIComponent(siqPostTypeFilter);
                } else if (thisElement.parents('form:eq(0)').length > 0 && thisElement.parents('form:eq(0)').find("input[name=postTypes]").length > 0) {
                    url += '&documentTypes=' + encodeURIComponent(thisElement.parents('form:eq(0)').find("input[name=postTypes]").val());
                } else if (thisElement.parent().children("input[name=postTypes]").length === 1) {
                    url += '&documentTypes=' + encodeURIComponent(thisElement.parent().children("input[name=postTypes]").val());
                }
                if (thisElement.parents('form:eq(0)').length > 0 && thisElement.parents('form:eq(0)').find("input[name=siqACFilters]").length > 0) {
					url += '&filter=' + encodeURIComponent(thisElement.parents('form:eq(0)').find("input[name=siqACFilters]").val());
				} else if (thisElement.parent().children("input[name=siqACFilters]").length === 1) {
					url += '&filter=' + encodeURIComponent(thisElement.parent().children("input[name=siqACFilters]").val());
				}
                url     += '&autocomplete=1';

                if (ismsie() && parseInt(msieversion(), 10) >= 8  && window.XDomainRequest) {
                    siq_S('body').addClass('ie_'+parseInt(msieversion()));
                    siq_ajax({
                        dataType: "jsonp",
                        url: url+"",
                        data: "",
                        success: function(data){
                            var res = eval(data);
                            if (thisVal == thisElement.val()) {
                                removeElement(siq_S('.siq_searchIndex-' + autocompleteIndex), isCustomSearch);
                                var holder = createResponse(siq_S('.siq_searchIndex-' + autocompleteIndex), thisVal, res, false, isCustomSearch);
                                placeElement(thisElement, holder, isCustomSearch);
                            }

                        },
                        error: function(jqXHR, textStatus, errorThrown ){
                            createResponse(siq_S('.siq_searchIndex-' + autocompleteIndex), thisVal, null, false, isCustomSearch);
                        }
                    });
                }else{
                    siq_S.getJSON( url, function( data ) {
                        var res = eval(data);
                        if (thisVal == thisElement.val()) {
                            removeElement(siq_S('.siq_searchIndex-' + autocompleteIndex), isCustomSearch);
                            var holder = createResponse(siq_S('.siq_searchIndex-' + autocompleteIndex), thisVal, res, false, isCustomSearch);
                            placeElement(thisElement, holder, isCustomSearch);
                        }
                    }).fail(function(jqXHR) {
                        createResponse(siq_S('.siq_searchIndex-' + autocompleteIndex), thisVal, res, false, isCustomSearch);
                    });
                }
            };

            var getAutocompleteIndex = function(el) {
                var classList = el.attr("class").split(/\s+/), i;
                for (i = 0; i < classList.length; ++i) {
                    var clName = classList[i];
                    if (/siq_searchIndexResult-\d+/.test(clName)) {
                        return clName = clName.replace(/siq_searchIndexResult-(\d+)/, '$1');
                    }
                }
                return null;
            };

            siq_S(document).on("mouseup", function(e) {
                if (siq_S(".siq-ui-slider.siq-ui-slider-moving").length > 0) {
                    var field = siq_S(".siq-ui-slider.siq-ui-slider-moving").data("siq-filter-query-field"),
                        value = field + ':[' + siq_S(".siq-ui-slider.siq-ui-slider-moving").next().find("input").val().replace('-', 'TO') + ']';
                    var postType = siq_S(".siq-ui-slider.siq-ui-slider-moving").data("siq-filter-documenttype");
                    if (postType && postType != "_siq_all_posts") {
                        value += " AND documentType:\"" + postType + '"';
                    }
                    for(var i = 0; i < siqSearchFacetFilter.length; ++i) {
                        if (siqSearchFacetFilter[i].field == field) {
                            siqSearchFacetFilter = siqSearchFacetFilter.slice(0, i).concat(siqSearchFacetFilter.slice(i + 1));
                        }
                    }
                    siqSearchFacetFilter.push({
                        "value": value,
                        "field": field,
                        "humanValue": siq_S(".siq-ui-slider.siq-ui-slider-moving").next().find("input").val()
                    });
                    updateResultsOnly(getAutocompleteIndex(siq_S(".siq-ui-slider.siq-ui-slider-moving").parents(".holdResults")));
                    siq_S(".siq-ui-slider.siq-ui-slider-moving").removeClass("siq-ui-slider-moving");
                    siq_S(".siq-slider-handler-active").removeClass("siq-slider-handler-active");
                    e.preventDefault();
                }
                if (siq_S(".siq-scroll-handle-active").length > 0) {
                    siq_S(".siq-scroll-handle-active").removeClass("siq-scroll-handle-active");
                    e.preventDefault();
                }
            });

            siq_S(document).on("click", ".siq-applied-filter", function() {
                var value = siq_S(this).attr("data-filter-val"),
                    field = siq_S(this).attr("data-filter-field");
                for(var i = 0; i < siqSearchFacetFilter.length; ++i) {
                    if (siqSearchFacetFilter[i].field == field && siqSearchFacetFilter[i].value == value) {
                        siqSearchFacetFilter = siqSearchFacetFilter.slice(0, i).concat(siqSearchFacetFilter.slice(i + 1));
                    }
                }
                updateResultsOnly(getAutocompleteIndex(siq_S(this).parents(".holdResults")));
            });

            siq_S(document).on("click", ".siq-applied-type-filter", function() {
                siqPostTypeFilter = null;
                updateResultsOnly(getAutocompleteIndex(siq_S(this).parents(".holdResults")));
            });

            siq_S(document).on("click", ".siq-term-item", function() {
                var value = siq_S(this).data("siq-filter-val"), field = siq_S(this).parent().data("siq-filter-field"),
                    type = siq_S(this).parent().data("siq-filter-type"),
                    humanValue = siq_S(this).data("siq-filter-humanvalue");
                if (siqSearchFacetFilter == null) {
                    siqSearchFacetFilter = [];
                } else {
                    for(var i = 0; i < siqSearchFacetFilter.length; ++i) {
                        if (siqSearchFacetFilter[i].field == field) {
                            if (type == "STRING" && siqSearchFacetFilter[i].value == value) {
                                return;
                            } else if (type != "STRING") {
                                siqSearchFacetFilter = siqSearchFacetFilter.slice(0, i).concat(siqSearchFacetFilter.slice(i + 1));
                            }
                        }
                    }
                }
                siqSearchFacetFilter.push({
                    "value": value,
                    "field": field,
                    "humanValue": humanValue
                });
                updateResultsOnly(getAutocompleteIndex(siq_S(this).parents(".holdResults")));
            });

            siq_S(document).on("click", ".siq-postType-item", function(e) {
                siqPostTypeFilter = siq_S(this).data("siq-filter-val");
                updateResultsOnly(getAutocompleteIndex(siq_S(this).parents(".holdResults")));
            });

            var loadAutocompleteCss = function() {
                var link = document.createElement("LINK");
                link.href = siq_baseUrl + "css/" + SiqConfig.jsVersion + (SiqConfig.enableAutocompleteFacet ? "/autocomplete-pro.css" : "/autocomplete.css");
                link.rel = "stylesheet";
                link.id = "siq_autocomplete_remote_css";
                document.getElementsByTagName("HEAD")[0].appendChild(link);
                if (window.siq_autocompleteStyleVar) {
                    var style = document.createElement("STYLE");
                    style.type = "text/css";
                    if (style.styleSheet) {
                        style.styleSheet.cssText = window.siq_autocompleteStyleVar;
                    } else {
                        style.appendChild(document.createTextNode(window.siq_autocompleteStyleVar));
                    }
                    document.getElementsByTagName("head")[0].appendChild(style);
                }
            };

            var loadCustomCss = function(engineKey) {
                var customStyleId = "siq_custom_css";

                if (!document.getElementById(customStyleId)){
                    var link = document.createElement("LINK");
                    link.href = siq_api_endpoint + "css/"+siq_engine_key+"/custom.css?cb=" + (Math.floor((Math.random() * 99999)) + "&v=" + SiqConfig.jsVersion);
                    link.rel = "stylesheet";
                    link.id = customStyleId;
                    document.getElementsByTagName("HEAD")[0].appendChild(link);
                }
            };

            function logAutocompleteClick(thisVar, classVar, query){
                var currentEngineKey = siq_engine_key;
                var refEngineKey = "";
                if (thisVar.hasClass("siq-autocomplete") || thisVar.parents(".siq-autocomplete").size()>0) {
                    if (thisVar.parents(".siq-autocomplete").attr("data-engineKey") && thisVar.parents(".siq-autocomplete").attr("data-engineKey") != siq_engine_key) {
                        refEngineKey = currentEngineKey;
                        currentEngineKey = thisVar.parents(".siq-autocomplete").attr("data-engineKey");
                    }
                }
                var dwClasses 	= classVar;
                var regExp		= /siq-autocomplete-([0-9a-f]+)/g;
                var classes = regExp.exec(dwClasses);
                var search_query = encodeURIComponent(query).replace(/^\s+|\s+$/g, "");
                if (search_query === "") return true;
                var url	= siq_api_endpoint+"search/log?q="+search_query+"&documentId="+classes[1]+"&engineKey="+currentEngineKey+"&autocomplete=1&refEngineKey="+refEngineKey;
                if (ismsie() && parseInt(msieversion(), 10) >= 8  && window.XDomainRequest) {

                    siq_ajax({
                        method: "GET",
                        url: url,
                        data: {},
                        dataType: 'jsonp',
                        async: false
                    }).done(function( response ) {
                        if (enterFlag) {
                            enterFlaf = false;
                            if (thisVar[0].target == "_blank") {
                                window.open(thisVar[0].href);
                            } else {
                                window.location.href = thisVar[0].href;
                            }
                        }
                    }).fail(function( jqXHR ) {
                        if (enterFlag) {
                            enterFlaf = false;
                            if (thisVar[0].target == "_blank") {
                                window.open(thisVar[0].href);
                            } else {
                                window.location.href = thisVar[0].href;
                            }
                        }
                    });
                }else{
                    siq_S.ajax({
                        method: "GET",
                        url: url,
                        data: {},
                        dataType: 'json',
                        async: false
                    }).done(function( response ) {
                        if (enterFlag) {
                            enterFlaf = false;
                            if (thisVar[0].target == "_blank") {
                                window.open(thisVar[0].href);
                            } else {
                                window.location.href = thisVar[0].href;
                            }
                        }
                    }).fail(function( jqXHR ) {
                        if (enterFlag) {
                            enterFlaf = false;
                            if (thisVar[0].target == "_blank") {
                                window.open(thisVar[0].href);
                            } else {
                                window.location.href = thisVar[0].href;
                            }
                        }
                    });
                }
                return;
            }
			
			siq_S(document).on('keydown', function(e) {
				e = e || window.event;
				switch(e.which || e.keyCode) {
					case 38:
						if(siqIsAutoCompleteDisplayed == true){
							e.preventDefault();
							rotateResponse(e, "up");
						}
					break;
					
					case 40:
						if(siqIsAutoCompleteDisplayed == true){
							e.preventDefault();
							rotateResponse(e, "down");
						}
					break;
					
					case 13:
                        enterFlag = true;
                        if(siq_S(".holdResults").length > 0 && siq_S(".holdResults .siq-autocomplete.highlighted").length > 0){
                            e.preventDefault();
                            gotoSelectedLink(e);
                        }
					break;
					default:
					    enterFlag = false;
				}
			});

            siq_S(document).on("siq-scrollbox-resize", ".siq-scrollbox", function() {
                var f = function(that) {
                    return function() {
                        var container = that.next();
                        var style = container.attr("style").replace(/;height:\s\d[^$]+/, '');
                        style += ";height: " + container.parent().outerHeight() + "px!important";
                        container.attr("style", style);
                        container.children('.siq-scroll-track').attr("style", "height: 100%!important;");
                        var handle = container.find("a");
                        var totalHeight = that.outerHeight(true);
                        var handleHeight = Math.min(100, (100 * container.parent().height() / totalHeight));
                        style = "height:" + handleHeight + "%!important;";
                        style += "top:" + (100 * container.parent()[0].scrollTop / totalHeight) + "%!important;";
                        style += "position:absolute!important;";
                        handle.attr("style", style);
                        var el = siq_S('.siq-blogrfct-facet:visible');
                        if (el.length > 0) {
                            el.attr("style", "display:none!important");el.attr("style","max-height: " + (el.parent().height()) + "px!important;min-height: " + (el.parent().height()) + "px!important;");
							siqIsAutoCompleteDisplayed = false;
                            //el.children(".siq-scrollbox").trigger("siq-scrollbox-resize");
                        }
                    }
                }(siq_S(this));
                f();
                setTimeout(f, 300);
            });

            siq_S(document).on("siq-scrollbox-scroll", ".siq-scrollbox", function() {
                var that = siq_S(this);
                var container = that.next();
                var handle = container.find("a");
                var totalHeight = that.outerHeight(true);
                var handleHeight = Math.min(100, (100 * container.parent().height() / totalHeight));
                var style = "height:" + handleHeight + "%!important;";
                style += "top:" + (100 * container.parent()[0].scrollTop / totalHeight) + "%!important;";
                style += "position:absolute!important;";
                handle.attr("style", style);
            });

            siq_S(document).on("mousewheel", ".siq-scrollbox", function(e){
                siq_S(this).parent().each(function(){this.scrollTop -= e.originalEvent.wheelDelta / 3});
                siq_S(this).trigger("siq-scrollbox-scroll");
                e.preventDefault();
            });

            siq_S(document).on("mousedown", ".siq-scroll-handle", function(e) {
                siq_S(this).addClass("siq-scroll-handle-active");
                siq_S(this).data("siq-last-y", e.pageY);
                siq_S(this).data("siq-last-scroll-top", siq_S(this).parent().parent().parent()[0].scrollTop);
                e.preventDefault();
            });

            siq_S(document).on("mousedown", ".siq-scroll-track", function(e) {
                var handle = siq_S(this).children("a");
                var lastY = handle.offset().top + handle.height() / 2;
                var lastScrollTop = siq_S(this).parent().parent()[0].scrollTop;
                scrollFacetBlock(siq_S(this).parent(), lastY, e.pageY, lastScrollTop);
                handle.addClass("siq-scroll-handle-active");
                handle.data("siq-last-y", e.pageY);
                handle.data("siq-last-scroll-top", siq_S(this).parent().parent()[0].scrollTop);
                e.preventDefault();
            });
           
			function gotoSelectedLink(e){
			    var searchVal = "";
               if (e.target.nodeName == "INPUT") {
                  currentSelectedElement =  e.target;
                  searchVal = siq_S(currentSelectedElement).val();
                }
               var isCustomSearch  = (siq_S(currentSelectedElement).parents('.siq_search_results').length > 0) ? true : false;
               if (!isCustomSearch && !searchVal) {
                   searchVal = siq_S('body').find('.holdResults.'+extraResultClass).find("span.searchWord").html();
                }else if (!searchVal){
                   searchVal = siq_S(currentSelectedElement).parents(".siq_searchInner").find("input.siq_searchBox").val();
                }
				var whichElement = siq_S(".holdResults .siq-autocomplete.highlighted");
				logAutocompleteClick(whichElement.find("a"), whichElement.attr("class"), searchVal);

			}
			
			function rotateResponse(e, where){
				if (e.target.nodeName == "INPUT") {
                  currentSelectedElement =  e.target;  
                }
                var searchResult = siq_S('body').find('.holdResults.'+extraResultClass);

               
				if(searchResult.length > 0 && searchResult.find(".siq-autocomplete").length > 0){
					searchResult.parents(".siq_searchInner").find('input.siq_searchBox').trigger('blur');
					var size = searchResult.find(".siq-autocomplete").length;
					if(where == 'up'){
						currentElement = (typeof(currentHover) == "undefined") ?  size - 1: ( (currentElement > 0) ?  currentElement - 1 :  size - 1);
					}else if(where == 'down'){
						currentElement = (typeof(currentHover) == "undefined") ? 0: ( (currentElement < (size -1)) ?  currentElement + 1 :  0);
					}
					if(typeof(currentElement) != "undefined"){
						searchResult.find(".siq-autocomplete").removeClass("highlighted");
						currentHover = searchResult.find(".siq-autocomplete").eq(currentElement);
						var currentTop = currentHover.offset().top;
						
						if(!isElementInViewport(currentHover) && currentTop > siq_S(window).scrollTop()){
							siq_S('html, body').animate({scrollTop: siq_S(window).scrollTop() + currentHover.outerHeight() + 75}, 500);
						}else if(!isElementInViewport(currentHover) && currentTop < siq_S(window).scrollTop()){
							siq_S('html, body').animate({scrollTop: currentTop - 75}, 500);
						}
						currentHover.addClass("highlighted");
					}
				}
			}
			
			function isElementInViewport (el) {
			
				elementToBeChecked = el;
				var TopView = siq_S(window).scrollTop();
				var BotView = TopView + siq_S(window).height();
				var TopElement = siq_S(elementToBeChecked).offset().top;
				var BotElement = TopElement + siq_S(elementToBeChecked).height();
				return ((BotElement <= BotView) && (TopElement >= TopView));
			}
			
            function specialChecks() {
                if((siq_S(this).scrollLeft() >= 100 || windowsPhone) && isResponsive == false){
                    if ( (/Chrome/i.test(navigator.userAgent) && /Android/i.test(navigator.userAgent)) || windowsPhone) {
                     isResponsive = true;   
                  }
               }else{
                  isResponsive = false;
               }
            }
            
            siq_S(document).scroll(function(){
               specialChecks();
           });
            siq_S(window).on("orientationchange", function(){
              specialChecks();
              changeDisplayLocation();
            });
            
			if(window.attachEvent) {
				window.attachEvent('onresize', function() {
					resizeResult("attach");
				});
				window.attachEvent('onscroll', function() {
                    resizeResult("attach");
                });
			}
			else if(window.addEventListener) {
				window.addEventListener('resize', function() {
					resizeResult("add");
				}, true);
				window.addEventListener('scroll', function() {
					resizeResult("add");
				}, true);
			}
			function resizeResult(what){
			    if (siq_S('._siq_main_searchbox').length > 0 && siq_S('._siq_main_searchbox').attr("style").indexOf("display:none") >= 0) return;
                changeDisplayLocation();
				if(siq_S(window).width() <= 680 && siq_S('.siq_search_results').outerWidth() > siq_S(window).width() ){
					var widthRes = siq_S('.siq_search_results').css("width", siq_S(window).width()*0.98);
				}else{
					var widthRes = siq_S('.siq_search_results').removeAttr('style');	
				}
			}

            siq_S(function(){
			    var globalSiqIsCustomSearchPage = (siq_S('.siq_search_results').length > 0) ? true : false;
                if (!globalSiqIsCustomSearchPage) {
                    siq_S("body").on("siq_vars_loaded", function() {
                        logEvent();
                    });
                } else {
                    siq_S("body").on("siq_search_results_loaded", function() {
                        logEvent();
                    });
                }
                window.siq_script_ready = true;
            });

            loadAutocompleteCss();
            loadCustomCss(window.siq_engine_key);
		};
		init();
	};
	siqScript();
})();
