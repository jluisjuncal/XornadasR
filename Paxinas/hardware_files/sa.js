(function(){
    var getDomain = function (str) {
        return str.replace(/^https?:\/\/(www\.)?([^\/$]+)(\/[^$]*)$/i, '$2').toLowerCase();
    };

    var versionCompare = function (v1, comparator, v2) {
        comparator = comparator == '=' ? '==' : comparator;
        var v1parts = v1.split('.'), v2parts = v2.split('.');
        var maxLen = Math.max(v1parts.length, v2parts.length);
        var part1, part2;
        var cmp = 0;
        for (var i = 0; i < maxLen && !cmp; i++) {
            part1 = parseInt(v1parts[i], 10) || 0;
            part2 = parseInt(v2parts[i], 10) || 0;
            if (part1 < part2)
                cmp = 1;
            if (part1 > part2)
                cmp = -1;
        }
        return eval('0' + comparator + cmp);
    };

    var isBuildInSearch = function() {
        var regExp = new RegExp("(\\?|&)"+SiqConfig.searchBoxName+"=");
        return regExp.test(location.href);
    };

    var urlParam = function(url, name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
        if (!results) {
            return "";
        }
        return results[1] || "";
    };

    var detectKeyword = function () {
        // Detect keyword in the url
        var url = location.href;
        return urlParam(url, SiqConfig.searchBoxName) || urlParam(url, SiqConfig.queryParameter) || urlParam(url, "_siq_search") || urlParam(url, "s") || urlParam(url, "q") || urlParam(url, "kw") || urlParam(url, "search") || urlParam(url, "w");
    };

    var isMobile = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    var ismsie = function(){
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            return true;
        }
        return false;
    };

    var msieversion = function(){
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            return RegExp.$1;
        }
        return false;
    };

    var bindLinkClickListener = function () {
        if (versionCompare(SiqConfig.jsVersion, "<", "1.5.1")) return;

        siq_S(document).on("click", "a", function(e){
            if (!isBuildInSearch() || siq_S(this).parents("._siq_main_searchbox").length > 0) return;
            var thisElement      = siq_S(this);

            if (typeof window.siq_search_query == "undefined") {
                window.siq_search_query = detectKeyword();
                if (!window.siq_search_query) return;
            }
            if (getDomain(thisElement[0].href) !== getDomain(window.location.href)) return;

            var url	= siq_api_endpoint+"search/log?q="+encodeURIComponent(siq_search_query)+"&documentURL="+encodeURIComponent(thisElement[0].href)+"&engineKey="+siq_engine_key+"&autocomplete=0&documentTypes="+encodeURIComponent(SiqConfig.postTypesForSearch);
            var dataType = "json";
            if (ismsie() && parseInt(msieversion(), 10) >= 8  && window.XDomainRequest) {
                dataType = "jsonp";
            }
            siq_S.ajax({
                method: "GET",
                url: url,
                data: { },
                dataType: dataType,
                async: false
            }).done(function( response ) {
                if (thisElement[0].target == "_blank") {
                    window.open(thisElement[0].href);
                } else {
                    window.location.href = thisElement[0].href;
                }

            }).fail(function(){
                if (thisElement[0].target == "_blank") {
                    window.open(thisElement[0].href);
                } else {
                    window.location.href = thisElement[0].href;
                }
            });
            e.preventDefault();
            return false;
        });
    };
    var addClassesToSearchFormsAndListenSubmitEvent = function(){
        siq_S('input[name="s"],input[name="q"]' + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : '')).each(function(index){
            if(siq_S(this).parents('#wpadminbar').length == 0 && !siq_S(this).hasClass("siq_searchBox") || true){
                siq_S(this).addClass('siq_searchBox');
                var thisWidth = siq_S(this).parents('form').outerWidth();
                siq_S(this).parents('form').addClass('siq_searchForm');
                if(siq_S(this).parents(".siq_search_results").length == 0 || true){
                    siq_S(this).addClass('siq_searchIndex-'+index);
                }
            }
        });

        var logsSent = false;

        siq_S(document).on("submit", function(e){
            var target = e.target;
            if (target.tagName != "FORM") return;
            if (siq_S(target).find("input[name='s'],input[name='q']" + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : '')).length == 0) return;

            if (logsSent) {
                if (SiqConfig.resultPageUrl) return false;
                return true;
            }
            logsSent = true;

            /**
             * #816: Prevent form submission and show autocomplete screen
             * */
            if (isMobile() && SiqConfig.mobileEnabled) {
                return;
            }

            var filterGetName = SiqConfig.queryParameter == "f" ? "sf" : "f";
            var documentTypeGetName = SiqConfig.queryParameter == "dtf" ? "sdtf" : "dtf";

            if (siq_S(target).parents(".siq_search_results").length == 0) {
                var thisVal = siq_S(target).find("input[name='s'],input[name='q']" + (SiqConfig.searchBoxName !== "s" ? ',input[name="'+SiqConfig.searchBoxName+'"]' : '')).val();
                var url = siq_api_endpoint + "search/results?q=" + encodeURIComponent(thisVal) + "&engineKey=" + siq_engine_key + "&group=" + (SiqConfig.crossSiteSearchOnPage ? 1 : 0) + "&itemsPerPage=" + SiqConfig.customSearchNumRecords + "&enter=1";
                // check is the browser is Internet Explorer or not
                var callback = function(a) {
                    if (SiqConfig.resultPageUrl) {
                        return function() {
                            var additionalFilters = "";
                            if (siq_S(target).find("input[type=hidden][name=" + documentTypeGetName + "]").length > 0) {
                                additionalFilters += "&" + documentTypeGetName + "=" + encodeURIComponent(siq_S(target).find("input[type=hidden][name=" + documentTypeGetName + "]:last").val());
                            }
                            siq_S(target).find("input[type=hidden][name=" + filterGetName + "]").each(function() {
                                additionalFilters += "&" + filterGetName + "=" + encodeURIComponent(siq_S(this).val());
                            });
                            siq_S(target).find("input[type=hidden][name=postTypes]").each(function() {
                                additionalFilters += "&postTypes=" + encodeURIComponent(siq_S(this).val());
                            });
                            siq_S(target).find("input[type=hidden][name=siqACFilters]").each(function() {
                                additionalFilters += "&siqACFilters=" + encodeURIComponent(siq_S(this).val());
                            });
                            location.href = SiqConfig.resultPageUrl.replace(/^https?:/i, '') + (/\?/.test(SiqConfig.resultPageUrl) ? '&' : '?') + encodeURIComponent(SiqConfig.queryParameter) + '=' + encodeURIComponent(a) + additionalFilters;
                        };
                    }
                    return function(){};
                }(thisVal);
                if (ismsie() && parseInt(msieversion(), 10) >= 8  && window.XDomainRequest) {
                    siq_ajax({
                        method: "GET",
                        url: url,
                        data: {},
                        dataType: 'jsonp',
                        jsonpCallback: callback
                    });
                } else {
                    siq_S.ajax({
                        method: "GET",
                        url: url,
                        data: {},
                        dataType: 'json',
                        complete: callback
                    });
                }
                if (SiqConfig.resultPageUrl) {
                    return false;
                }
            }
        });
    };
    if (siq_S.isReady) {
        bindLinkClickListener();
        addClassesToSearchFormsAndListenSubmitEvent();
    } else {
        siq_S(function() {
            bindLinkClickListener();
            addClassesToSearchFormsAndListenSubmitEvent();
        });
    }
})();
