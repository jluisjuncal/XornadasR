var siq_log = function (a) {
    if (location.href.indexOf("siqdebug=1") > -1 && typeof console != "undefined" && console.log) {
        console.log("siq_container_pub: " + a);
    }
};

function siq_contentLoaded(win, fn) {

    var done = false, top = true,

        doc = win.document,
        root = doc.documentElement,
        modern = doc.addEventListener,

        add = modern ? 'addEventListener' : 'attachEvent',
        rem = modern ? 'removeEventListener' : 'detachEvent',
        pre = modern ? '' : 'on',

        init = function(e) {
            if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
            (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
            if (!done && (done = true)) fn.call(win, e.type || e);
        },

        poll = function() {
            try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
            init('poll');
        };

    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
        if (!modern && root.doScroll) {
            try { top = !win.frameElement; } catch(e) { }
            if (top) poll();
        }
        doc[add](pre + 'DOMContentLoaded', init, false);
        doc[add](pre + 'readystatechange', init, false);
        win[add](pre + 'load', init, false);
    }

}

/**
 * SiqContainer class definition
 * */
SiqContainer = function (csId) {
    if (!window.siqConfig || !window.siqConfig.engineKey) return;
    if(!SiqContainer.pageHasSearchBox() && !SiqContainer.hasResultPageWrapper()) return;
    siq_log("SiqContainer.constructor():" + csId);

    window.siqConfig.version = window.siqConfig.version || "2.2.16";
    window.siq_version = window.siqConfig.version;
    window.siq_engine_key = window.siqConfig.engineKey;
    window.siq_baseUrl = window.siqConfig.baseUrl;
    window.siq_api_endpoint = window.siq_baseUrl.replace(/^(https?:)?\/\/(pub|static)\.searchiq\.(xyz|co)/, '//api.searchiq.co') + "api/";

    SiqContainer.start();
};

/**
 * SiqContainer Public methods
 * */
SiqContainer.start = function () {
    siq_log("SiqContainer.start()");

    SiqContainer.loadJQuery(
        function() {
            siq_log("jquery loaded.");

            SiqContainer.loadSettings(function() {
                siq_log("Setting loaded.");
                if (siq_S("#siq_search_results,input[name='q'],input[name='s'],input[name='" + SiqConfig.searchBoxName + "']").length) {
                    SiqContainer.loadTargetJs();
                } else {
                    siq_log("Skipping loading scripts, no search box found.");
                }
            });
        }
    );
};
/**
 * SiqContainer check if page has any search(input) boxes
 * */
SiqContainer.pageHasSearchBox = function(){
    var hasSearchBox = false;
    var el = document.getElementsByTagName('input');

    if(typeof el != "undefined" && el != null && el.length > 0){
        siq_log("Number of input elements on page:"+el.length);
        for(i=0; i<el.length; i++){
            if((el[i].type === "text" || el[i].type === "search") && (!el[i].id || el[i].id != "adminbar-search")){
                hasSearchBox = true;
                break;
            }
        }
    }
    if(hasSearchBox){siq_log("Atleast one input[type='text'] found");}else{siq_log("No input[type='text'] found");}
    return hasSearchBox;
};
/**
 * SiqContainer check if page has search result wrapper
 * */
SiqContainer.hasResultPageWrapper = function(){
    var hasSearchWrapper = false;
    var el = document.getElementById('siq_search_results');

    if(typeof el != "undefined" && el != null){
        hasSearchWrapper =  true;
        siq_log("Search result wrapper found on page");
    }
    if(!hasSearchWrapper){siq_log("Search result wrapper not found on page");}
    return hasSearchWrapper;
};

SiqContainer.loadSettings = function(callback) {
    var handler = function(data){
        var res = eval(data);
        window.SiqConfig = res;
        SiqConfig.jsVersion = siqConfig.version = SiqConfig.jsVersion || siqConfig.version;
        callback();
    };

    siq_log("loadSettings():start.");
    var url = siq_api_endpoint + "searchEngines/" + siq_engine_key + "/settings?cb=" + Math.ceil(Math.random() * 9999999) + '&r=' + encodeURIComponent(location.href);
    if (siqConfig.preview) url += "&preview=true";
    if (typeof window.siq_S === "undefined") return;
    if (SiqContainer.ismsie() && parseInt(SiqContainer.msieversion(), 10) >= 8  && window.XDomainRequest) {
        siq_S.ajax({
            dataType: "jsonp",
            url: url,
            data: "",
            success: handler
        });
    }else{
        siq_S.getJSON(url, handler);
    }
};

SiqContainer.loadTargetJs = function () {
    siq_log("SiqContainer.loadTargetJs(): start loading target scripts");

    if (!(SiqConfig.scripts instanceof Array) || SiqConfig.length === 0) {
        return;
    }
    for (var i = 0; i < SiqConfig.scripts.length; i++) {
        var scriptUrl = SiqConfig.scripts[i].replace("##BASEURL##", siq_baseUrl).replace("##VERSION##", SiqConfig.jsVersion);
        siq_log("SiqContainer.loadTargetJs(): load " + scriptUrl);
        SiqContainer.MYLAB.script(scriptUrl);
    }
};

/**
 * SiqContainer Static methods and fields
 * */

/* LAB.js v2.0.3 */
(function(o){var K=o.$LAB,y="UseLocalXHR",z="AlwaysPreserveOrder",u="AllowDuplicates",A="CacheBust",B="BasePath",C=/^[^?#]*\//.exec(location.href)[0],D=/^\w+\:\/\/\/?[^\/]+/.exec(C)[0],i=document.head||document.getElementsByTagName("head"),L=(o.opera&&Object.prototype.toString.call(o.opera)=="[object Opera]")||("MozAppearance"in document.documentElement.style),q=document.createElement("script"),E=typeof q.preload=="boolean",r=E||(q.readyState&&q.readyState=="uninitialized"),F=!r&&q.async===true,M=!r&&!F&&!L;function G(a){return Object.prototype.toString.call(a)=="[object Function]"}function H(a){return Object.prototype.toString.call(a)=="[object Array]"}function N(a,c){var b=/^\w+\:\/\//;if(/^\/\/\/?/.test(a)){a=location.protocol+a}else if(!b.test(a)&&a.charAt(0)!="/"){a=(c||"")+a}return b.test(a)?a:((a.charAt(0)=="/"?D:C)+a)}function s(a,c){for(var b in a){if(a.hasOwnProperty(b)){c[b]=a[b]}}return c}function O(a){var c=false;for(var b=0;b<a.scripts.length;b++){if(a.scripts[b].ready&&a.scripts[b].exec_trigger){c=true;a.scripts[b].exec_trigger();a.scripts[b].exec_trigger=null}}return c}function t(a,c,b,d){a.onload=a.onreadystatechange=function(){if((a.readyState&&a.readyState!="complete"&&a.readyState!="loaded")||c[b])return;a.onload=a.onreadystatechange=null;d()}}function I(a){a.ready=a.finished=true;for(var c=0;c<a.finished_listeners.length;c++){a.finished_listeners[c]()}a.ready_listeners=[];a.finished_listeners=[]}function P(d,f,e,g,h){setTimeout(function(){var a,c=f.real_src,b;if("item"in i){if(!i[0]){setTimeout(arguments.callee,25);return}i=i[0]}a=document.createElement("script");if(f.type)a.type=f.type;if(f.charset)a.charset=f.charset;if(h){if(r){e.elem=a;if(E){a.preload=true;a.onpreload=g}else{a.onreadystatechange=function(){if(a.readyState=="loaded")g()}}a.src=c}else if(h&&c.indexOf(D)==0&&d[y]){b=new XMLHttpRequest();b.onreadystatechange=function(){if(b.readyState==4){b.onreadystatechange=function(){};e.text=b.responseText+"\n//@ sourceURL="+c;g()}};b.open("GET",c);b.send()}else{a.type="text/cache-script";t(a,e,"ready",function(){i.removeChild(a);g()});a.src=c;i.insertBefore(a,i.firstChild)}}else if(F){a.async=false;t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}else{t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}},0)}function J(){var l={},Q=r||M,n=[],p={},m;l[y]=true;l[z]=false;l[u]=false;l[A]=false;l[B]="";function R(a,c,b){var d;function f(){if(d!=null){d=null;I(b)}}if(p[c.src].finished)return;if(!a[u])p[c.src].finished=true;d=b.elem||document.createElement("script");if(c.type)d.type=c.type;if(c.charset)d.charset=c.charset;t(d,b,"finished",f);if(b.elem){b.elem=null}else if(b.text){d.onload=d.onreadystatechange=null;d.text=b.text}else{d.src=c.real_src}i.insertBefore(d,i.firstChild);if(b.text){f()}}function S(c,b,d,f){var e,g,h=function(){b.ready_cb(b,function(){R(c,b,e)})},j=function(){b.finished_cb(b,d)};b.src=N(b.src,c[B]);b.real_src=b.src+(c[A]?((/\?.*$/.test(b.src)?"&_":"?_")+~~(Math.random()*1E9)+"="):"");if(!p[b.src])p[b.src]={items:[],finished:false};g=p[b.src].items;if(c[u]||g.length==0){e=g[g.length]={ready:false,finished:false,ready_listeners:[h],finished_listeners:[j]};P(c,b,e,((f)?function(){e.ready=true;for(var a=0;a<e.ready_listeners.length;a++){e.ready_listeners[a]()}e.ready_listeners=[]}:function(){I(e)}),f)}else{e=g[0];if(e.finished){j()}else{e.finished_listeners.push(j)}}}function v(){var e,g=s(l,{}),h=[],j=0,w=false,k;function T(a,c){a.ready=true;a.exec_trigger=c;x()}function U(a,c){a.ready=a.finished=true;a.exec_trigger=null;for(var b=0;b<c.scripts.length;b++){if(!c.scripts[b].finished)return}c.finished=true;x()}function x(){while(j<h.length){if(G(h[j])){try{h[j++]()}catch(err){siq_log(err)}continue}else if(!h[j].finished){if(O(h[j]))continue;break}j++}if(j==h.length){w=false;k=false}}function V(){if(!k||!k.scripts){h.push(k={scripts:[],finished:true})}}e={script:function(){for(var f=0;f<arguments.length;f++){(function(a,c){var b;if(!H(a)){c=[a]}for(var d=0;d<c.length;d++){V();a=c[d];if(G(a))a=a();if(!a)continue;if(H(a)){b=[].slice.call(a);b.unshift(d,1);[].splice.apply(c,b);d--;continue}if(typeof a=="string")a={src:a};a=s(a,{ready:false,ready_cb:T,finished:false,finished_cb:U});k.finished=false;k.scripts.push(a);S(g,a,k,(Q&&w));w=true;if(g[z])e.wait()}})(arguments[f],arguments[f])}return e},wait:function(){if(arguments.length>0){for(var a=0;a<arguments.length;a++){h.push(arguments[a])}k=h[h.length-1]}else k=false;x();return e}};return{script:e.script,wait:e.wait,setOptions:function(a){s(a,g);return e}}}m={setGlobalDefaults:function(a){s(a,l);return m},setOptions:function(){return v().setOptions.apply(null,arguments)},script:function(){return v().script.apply(null,arguments)},wait:function(){return v().wait.apply(null,arguments)},queueScript:function(){n[n.length]={type:"script",args:[].slice.call(arguments)};return m},queueWait:function(){n[n.length]={type:"wait",args:[].slice.call(arguments)};return m},runQueue:function(){var a=m,c=n.length,b=c,d;for(;--b>=0;){d=n.shift();a=a[d.type].apply(null,d.args)}return a},noConflict:function(){o.$LAB=K;return m},sandbox:function(){return J()}};return m}o.$LAB=J();(function(a,c,b){if(document.readyState==null&&document[a]){document.readyState="loading";document[a](c,b=function(){document.removeEventListener(c,b,false);document.readyState="complete"},false)}})("addEventListener","DOMContentLoaded")})(this);
SiqContainer.MYLAB = $LAB.noConflict();


SiqContainer.isJQueryValid = function (jq) {
    var isValid = jq && jq.fn && jq.fn.jquery && SiqContainer.versionCompare(jq.fn.jquery, ">=", "1.9.1");
    return isValid;
};
SiqContainer.versionCompare = function (v1, comparator, v2) {
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

SiqContainer.getLogger = function (prefix) {
    return function (msg) {
        if (location.href.indexOf("siqdebug=1") > -1 && typeof console != "undefined" && console.log) {
            console.log(prefix + ": " + msg);
        }
    };
};


SiqContainer.loadJQuery = function(callback) {
    siq_log("loadJquery():start");
    if (SiqContainer.isJQueryValid(window.jQuery)) {
        window.siq_S = window.jQuery;
        window.siq_ajax = siq_S.ajax;
        if (typeof callback == "function") callback();
    } else {
        var url = "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
        SiqContainer.MYLAB.script(url).wait(function(){
            if (SiqContainer.isJQueryValid(window.jQuery)) {
                window.siq_S = window.jQuery.noConflict(true);
                window.siq_ajax = siq_S.ajax;
                if (typeof callback == "function") callback();
            }
        });
    }
};

SiqContainer.ismsie   = function(){
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        return true;
    }
    return false;
};

SiqContainer.msieversion = function(){
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        return RegExp.$1;
    }
    return false;
};

(function() {
    siq_contentLoaded(window, function(){
        var csId = "siq-container";
        new SiqContainer(csId);
    });
})();