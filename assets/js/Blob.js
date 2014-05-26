/*
    http://www.JSON.org/json2.js
    2008-07-15

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array, then it will be used to
            select the members to be serialized. It filters the results such
            that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*global JSON */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", call,
    charCodeAt, getUTCDate, getUTCFullYear, getUTCHours, getUTCMinutes,
    getUTCMonth, getUTCSeconds, hasOwnProperty, join, lastIndex, length,
    parse, propertyIsEnumerable, prototype, push, replace, slice, stringify,
    test, toJSON, toString
*/

if (!this.JSON) {

// Create a JSON object only if one does not already exist. We create the
// object in a closure to avoid creating global variables.

    JSON = function () {

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

            escapeable.lastIndex = 0;
            return escapeable.test(string) ?
                '"' + string.replace(escapeable, function (a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    }
                    return '\\u' + ('0000' +
                            (+(a.charCodeAt(0))).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        }


        function str(key, holder) {

// Produce a string from holder[key].

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

// What happens next depends on the value's type.

            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// If the object has a dontEnum length property, we'll treat it as an array.

                if (typeof value.length === 'number' &&
                        !(value.propertyIsEnumerable('length'))) {

// The object is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }

// Return the JSON object containing the stringify and parse methods.

        return {
            stringify: function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

                var i;
                gap = '';
                indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

// If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === 'string') {
                    indent = space;
                }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                         typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

                return str('', {'': value});
            },


            parse: function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' + ('0000' +
                                (+(a.charCodeAt(0))).toString(16)).slice(-4);
                    });
                }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                    return typeof reviver === 'function' ?
                        walk({'': j}, '') : j;
                }

// If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('JSON.parse');
            }
        };
    }();
}
/*!
 * jQuery JavaScript Library v1.4.4
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Nov 11 19:04:53 2010 -0500
 */
(function(E,B){function ka(a,b,d){if(d===B&&a.nodeType===1){d=a.getAttribute("data-"+b);if(typeof d==="string"){try{d=d==="true"?true:d==="false"?false:d==="null"?null:!c.isNaN(d)?parseFloat(d):Ja.test(d)?c.parseJSON(d):d}catch(e){}c.data(a,b,d)}else d=B}return d}function U(){return false}function ca(){return true}function la(a,b,d){d[0].type=a;return c.event.handle.apply(b,d)}function Ka(a){var b,d,e,f,h,l,k,o,x,r,A,C=[];f=[];h=c.data(this,this.nodeType?"events":"__events__");if(typeof h==="function")h=
h.events;if(!(a.liveFired===this||!h||!h.live||a.button&&a.type==="click")){if(a.namespace)A=RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)");a.liveFired=this;var J=h.live.slice(0);for(k=0;k<J.length;k++){h=J[k];h.origType.replace(X,"")===a.type?f.push(h.selector):J.splice(k--,1)}f=c(a.target).closest(f,a.currentTarget);o=0;for(x=f.length;o<x;o++){r=f[o];for(k=0;k<J.length;k++){h=J[k];if(r.selector===h.selector&&(!A||A.test(h.namespace))){l=r.elem;e=null;if(h.preType==="mouseenter"||
h.preType==="mouseleave"){a.type=h.preType;e=c(a.relatedTarget).closest(h.selector)[0]}if(!e||e!==l)C.push({elem:l,handleObj:h,level:r.level})}}}o=0;for(x=C.length;o<x;o++){f=C[o];if(d&&f.level>d)break;a.currentTarget=f.elem;a.data=f.handleObj.data;a.handleObj=f.handleObj;A=f.handleObj.origHandler.apply(f.elem,arguments);if(A===false||a.isPropagationStopped()){d=f.level;if(A===false)b=false;if(a.isImmediatePropagationStopped())break}}return b}}function Y(a,b){return(a&&a!=="*"?a+".":"")+b.replace(La,
"`").replace(Ma,"&")}function ma(a,b,d){if(c.isFunction(b))return c.grep(a,function(f,h){return!!b.call(f,h,f)===d});else if(b.nodeType)return c.grep(a,function(f){return f===b===d});else if(typeof b==="string"){var e=c.grep(a,function(f){return f.nodeType===1});if(Na.test(b))return c.filter(b,e,!d);else b=c.filter(b,e)}return c.grep(a,function(f){return c.inArray(f,b)>=0===d})}function na(a,b){var d=0;b.each(function(){if(this.nodeName===(a[d]&&a[d].nodeName)){var e=c.data(a[d++]),f=c.data(this,
e);if(e=e&&e.events){delete f.handle;f.events={};for(var h in e)for(var l in e[h])c.event.add(this,h,e[h][l],e[h][l].data)}}})}function Oa(a,b){b.src?c.ajax({url:b.src,async:false,dataType:"script"}):c.globalEval(b.text||b.textContent||b.innerHTML||"");b.parentNode&&b.parentNode.removeChild(b)}function oa(a,b,d){var e=b==="width"?a.offsetWidth:a.offsetHeight;if(d==="border")return e;c.each(b==="width"?Pa:Qa,function(){d||(e-=parseFloat(c.css(a,"padding"+this))||0);if(d==="margin")e+=parseFloat(c.css(a,
"margin"+this))||0;else e-=parseFloat(c.css(a,"border"+this+"Width"))||0});return e}function da(a,b,d,e){if(c.isArray(b)&&b.length)c.each(b,function(f,h){d||Ra.test(a)?e(a,h):da(a+"["+(typeof h==="object"||c.isArray(h)?f:"")+"]",h,d,e)});else if(!d&&b!=null&&typeof b==="object")c.isEmptyObject(b)?e(a,""):c.each(b,function(f,h){da(a+"["+f+"]",h,d,e)});else e(a,b)}function S(a,b){var d={};c.each(pa.concat.apply([],pa.slice(0,b)),function(){d[this]=a});return d}function qa(a){if(!ea[a]){var b=c("<"+
a+">").appendTo("body"),d=b.css("display");b.remove();if(d==="none"||d==="")d="block";ea[a]=d}return ea[a]}function fa(a){return c.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:false}var t=E.document,c=function(){function a(){if(!b.isReady){try{t.documentElement.doScroll("left")}catch(j){setTimeout(a,1);return}b.ready()}}var b=function(j,s){return new b.fn.init(j,s)},d=E.jQuery,e=E.$,f,h=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,l=/\S/,k=/^\s+/,o=/\s+$/,x=/\W/,r=/\d/,A=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,
C=/^[\],:{}\s]*$/,J=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,w=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,I=/(?:^|:|,)(?:\s*\[)+/g,L=/(webkit)[ \/]([\w.]+)/,g=/(opera)(?:.*version)?[ \/]([\w.]+)/,i=/(msie) ([\w.]+)/,n=/(mozilla)(?:.*? rv:([\w.]+))?/,m=navigator.userAgent,p=false,q=[],u,y=Object.prototype.toString,F=Object.prototype.hasOwnProperty,M=Array.prototype.push,N=Array.prototype.slice,O=String.prototype.trim,D=Array.prototype.indexOf,R={};b.fn=b.prototype={init:function(j,
s){var v,z,H;if(!j)return this;if(j.nodeType){this.context=this[0]=j;this.length=1;return this}if(j==="body"&&!s&&t.body){this.context=t;this[0]=t.body;this.selector="body";this.length=1;return this}if(typeof j==="string")if((v=h.exec(j))&&(v[1]||!s))if(v[1]){H=s?s.ownerDocument||s:t;if(z=A.exec(j))if(b.isPlainObject(s)){j=[t.createElement(z[1])];b.fn.attr.call(j,s,true)}else j=[H.createElement(z[1])];else{z=b.buildFragment([v[1]],[H]);j=(z.cacheable?z.fragment.cloneNode(true):z.fragment).childNodes}return b.merge(this,
j)}else{if((z=t.getElementById(v[2]))&&z.parentNode){if(z.id!==v[2])return f.find(j);this.length=1;this[0]=z}this.context=t;this.selector=j;return this}else if(!s&&!x.test(j)){this.selector=j;this.context=t;j=t.getElementsByTagName(j);return b.merge(this,j)}else return!s||s.jquery?(s||f).find(j):b(s).find(j);else if(b.isFunction(j))return f.ready(j);if(j.selector!==B){this.selector=j.selector;this.context=j.context}return b.makeArray(j,this)},selector:"",jquery:"1.4.4",length:0,size:function(){return this.length},
toArray:function(){return N.call(this,0)},get:function(j){return j==null?this.toArray():j<0?this.slice(j)[0]:this[j]},pushStack:function(j,s,v){var z=b();b.isArray(j)?M.apply(z,j):b.merge(z,j);z.prevObject=this;z.context=this.context;if(s==="find")z.selector=this.selector+(this.selector?" ":"")+v;else if(s)z.selector=this.selector+"."+s+"("+v+")";return z},each:function(j,s){return b.each(this,j,s)},ready:function(j){b.bindReady();if(b.isReady)j.call(t,b);else q&&q.push(j);return this},eq:function(j){return j===
-1?this.slice(j):this.slice(j,+j+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(N.apply(this,arguments),"slice",N.call(arguments).join(","))},map:function(j){return this.pushStack(b.map(this,function(s,v){return j.call(s,v,s)}))},end:function(){return this.prevObject||b(null)},push:M,sort:[].sort,splice:[].splice};b.fn.init.prototype=b.fn;b.extend=b.fn.extend=function(){var j,s,v,z,H,G=arguments[0]||{},K=1,Q=arguments.length,ga=false;
if(typeof G==="boolean"){ga=G;G=arguments[1]||{};K=2}if(typeof G!=="object"&&!b.isFunction(G))G={};if(Q===K){G=this;--K}for(;K<Q;K++)if((j=arguments[K])!=null)for(s in j){v=G[s];z=j[s];if(G!==z)if(ga&&z&&(b.isPlainObject(z)||(H=b.isArray(z)))){if(H){H=false;v=v&&b.isArray(v)?v:[]}else v=v&&b.isPlainObject(v)?v:{};G[s]=b.extend(ga,v,z)}else if(z!==B)G[s]=z}return G};b.extend({noConflict:function(j){E.$=e;if(j)E.jQuery=d;return b},isReady:false,readyWait:1,ready:function(j){j===true&&b.readyWait--;
if(!b.readyWait||j!==true&&!b.isReady){if(!t.body)return setTimeout(b.ready,1);b.isReady=true;if(!(j!==true&&--b.readyWait>0))if(q){var s=0,v=q;for(q=null;j=v[s++];)j.call(t,b);b.fn.trigger&&b(t).trigger("ready").unbind("ready")}}},bindReady:function(){if(!p){p=true;if(t.readyState==="complete")return setTimeout(b.ready,1);if(t.addEventListener){t.addEventListener("DOMContentLoaded",u,false);E.addEventListener("load",b.ready,false)}else if(t.attachEvent){t.attachEvent("onreadystatechange",u);E.attachEvent("onload",
b.ready);var j=false;try{j=E.frameElement==null}catch(s){}t.documentElement.doScroll&&j&&a()}}},isFunction:function(j){return b.type(j)==="function"},isArray:Array.isArray||function(j){return b.type(j)==="array"},isWindow:function(j){return j&&typeof j==="object"&&"setInterval"in j},isNaN:function(j){return j==null||!r.test(j)||isNaN(j)},type:function(j){return j==null?String(j):R[y.call(j)]||"object"},isPlainObject:function(j){if(!j||b.type(j)!=="object"||j.nodeType||b.isWindow(j))return false;if(j.constructor&&
!F.call(j,"constructor")&&!F.call(j.constructor.prototype,"isPrototypeOf"))return false;for(var s in j);return s===B||F.call(j,s)},isEmptyObject:function(j){for(var s in j)return false;return true},error:function(j){throw j;},parseJSON:function(j){if(typeof j!=="string"||!j)return null;j=b.trim(j);if(C.test(j.replace(J,"@").replace(w,"]").replace(I,"")))return E.JSON&&E.JSON.parse?E.JSON.parse(j):(new Function("return "+j))();else b.error("Invalid JSON: "+j)},noop:function(){},globalEval:function(j){if(j&&
l.test(j)){var s=t.getElementsByTagName("head")[0]||t.documentElement,v=t.createElement("script");v.type="text/javascript";if(b.support.scriptEval)v.appendChild(t.createTextNode(j));else v.text=j;s.insertBefore(v,s.firstChild);s.removeChild(v)}},nodeName:function(j,s){return j.nodeName&&j.nodeName.toUpperCase()===s.toUpperCase()},each:function(j,s,v){var z,H=0,G=j.length,K=G===B||b.isFunction(j);if(v)if(K)for(z in j){if(s.apply(j[z],v)===false)break}else for(;H<G;){if(s.apply(j[H++],v)===false)break}else if(K)for(z in j){if(s.call(j[z],
z,j[z])===false)break}else for(v=j[0];H<G&&s.call(v,H,v)!==false;v=j[++H]);return j},trim:O?function(j){return j==null?"":O.call(j)}:function(j){return j==null?"":j.toString().replace(k,"").replace(o,"")},makeArray:function(j,s){var v=s||[];if(j!=null){var z=b.type(j);j.length==null||z==="string"||z==="function"||z==="regexp"||b.isWindow(j)?M.call(v,j):b.merge(v,j)}return v},inArray:function(j,s){if(s.indexOf)return s.indexOf(j);for(var v=0,z=s.length;v<z;v++)if(s[v]===j)return v;return-1},merge:function(j,
s){var v=j.length,z=0;if(typeof s.length==="number")for(var H=s.length;z<H;z++)j[v++]=s[z];else for(;s[z]!==B;)j[v++]=s[z++];j.length=v;return j},grep:function(j,s,v){var z=[],H;v=!!v;for(var G=0,K=j.length;G<K;G++){H=!!s(j[G],G);v!==H&&z.push(j[G])}return z},map:function(j,s,v){for(var z=[],H,G=0,K=j.length;G<K;G++){H=s(j[G],G,v);if(H!=null)z[z.length]=H}return z.concat.apply([],z)},guid:1,proxy:function(j,s,v){if(arguments.length===2)if(typeof s==="string"){v=j;j=v[s];s=B}else if(s&&!b.isFunction(s)){v=
s;s=B}if(!s&&j)s=function(){return j.apply(v||this,arguments)};if(j)s.guid=j.guid=j.guid||s.guid||b.guid++;return s},access:function(j,s,v,z,H,G){var K=j.length;if(typeof s==="object"){for(var Q in s)b.access(j,Q,s[Q],z,H,v);return j}if(v!==B){z=!G&&z&&b.isFunction(v);for(Q=0;Q<K;Q++)H(j[Q],s,z?v.call(j[Q],Q,H(j[Q],s)):v,G);return j}return K?H(j[0],s):B},now:function(){return(new Date).getTime()},uaMatch:function(j){j=j.toLowerCase();j=L.exec(j)||g.exec(j)||i.exec(j)||j.indexOf("compatible")<0&&n.exec(j)||
[];return{browser:j[1]||"",version:j[2]||"0"}},browser:{}});b.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(j,s){R["[object "+s+"]"]=s.toLowerCase()});m=b.uaMatch(m);if(m.browser){b.browser[m.browser]=true;b.browser.version=m.version}if(b.browser.webkit)b.browser.safari=true;if(D)b.inArray=function(j,s){return D.call(s,j)};if(!/\s/.test("\u00a0")){k=/^[\s\xA0]+/;o=/[\s\xA0]+$/}f=b(t);if(t.addEventListener)u=function(){t.removeEventListener("DOMContentLoaded",u,
false);b.ready()};else if(t.attachEvent)u=function(){if(t.readyState==="complete"){t.detachEvent("onreadystatechange",u);b.ready()}};return E.jQuery=E.$=b}();(function(){c.support={};var a=t.documentElement,b=t.createElement("script"),d=t.createElement("div"),e="script"+c.now();d.style.display="none";d.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";var f=d.getElementsByTagName("*"),h=d.getElementsByTagName("a")[0],l=t.createElement("select"),
k=l.appendChild(t.createElement("option"));if(!(!f||!f.length||!h)){c.support={leadingWhitespace:d.firstChild.nodeType===3,tbody:!d.getElementsByTagName("tbody").length,htmlSerialize:!!d.getElementsByTagName("link").length,style:/red/.test(h.getAttribute("style")),hrefNormalized:h.getAttribute("href")==="/a",opacity:/^0.55$/.test(h.style.opacity),cssFloat:!!h.style.cssFloat,checkOn:d.getElementsByTagName("input")[0].value==="on",optSelected:k.selected,deleteExpando:true,optDisabled:false,checkClone:false,
scriptEval:false,noCloneEvent:true,boxModel:null,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableHiddenOffsets:true};l.disabled=true;c.support.optDisabled=!k.disabled;b.type="text/javascript";try{b.appendChild(t.createTextNode("window."+e+"=1;"))}catch(o){}a.insertBefore(b,a.firstChild);if(E[e]){c.support.scriptEval=true;delete E[e]}try{delete b.test}catch(x){c.support.deleteExpando=false}a.removeChild(b);if(d.attachEvent&&d.fireEvent){d.attachEvent("onclick",function r(){c.support.noCloneEvent=
false;d.detachEvent("onclick",r)});d.cloneNode(true).fireEvent("onclick")}d=t.createElement("div");d.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";a=t.createDocumentFragment();a.appendChild(d.firstChild);c.support.checkClone=a.cloneNode(true).cloneNode(true).lastChild.checked;c(function(){var r=t.createElement("div");r.style.width=r.style.paddingLeft="1px";t.body.appendChild(r);c.boxModel=c.support.boxModel=r.offsetWidth===2;if("zoom"in r.style){r.style.display="inline";r.style.zoom=
1;c.support.inlineBlockNeedsLayout=r.offsetWidth===2;r.style.display="";r.innerHTML="<div style='width:4px;'></div>";c.support.shrinkWrapBlocks=r.offsetWidth!==2}r.innerHTML="<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";var A=r.getElementsByTagName("td");c.support.reliableHiddenOffsets=A[0].offsetHeight===0;A[0].style.display="";A[1].style.display="none";c.support.reliableHiddenOffsets=c.support.reliableHiddenOffsets&&A[0].offsetHeight===0;r.innerHTML="";t.body.removeChild(r).style.display=
"none"});a=function(r){var A=t.createElement("div");r="on"+r;var C=r in A;if(!C){A.setAttribute(r,"return;");C=typeof A[r]==="function"}return C};c.support.submitBubbles=a("submit");c.support.changeBubbles=a("change");a=b=d=f=h=null}})();var ra={},Ja=/^(?:\{.*\}|\[.*\])$/;c.extend({cache:{},uuid:0,expando:"jQuery"+c.now(),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},data:function(a,b,d){if(c.acceptData(a)){a=a==E?ra:a;var e=a.nodeType,f=e?a[c.expando]:null,h=
c.cache;if(!(e&&!f&&typeof b==="string"&&d===B)){if(e)f||(a[c.expando]=f=++c.uuid);else h=a;if(typeof b==="object")if(e)h[f]=c.extend(h[f],b);else c.extend(h,b);else if(e&&!h[f])h[f]={};a=e?h[f]:h;if(d!==B)a[b]=d;return typeof b==="string"?a[b]:a}}},removeData:function(a,b){if(c.acceptData(a)){a=a==E?ra:a;var d=a.nodeType,e=d?a[c.expando]:a,f=c.cache,h=d?f[e]:e;if(b){if(h){delete h[b];d&&c.isEmptyObject(h)&&c.removeData(a)}}else if(d&&c.support.deleteExpando)delete a[c.expando];else if(a.removeAttribute)a.removeAttribute(c.expando);
else if(d)delete f[e];else for(var l in a)delete a[l]}},acceptData:function(a){if(a.nodeName){var b=c.noData[a.nodeName.toLowerCase()];if(b)return!(b===true||a.getAttribute("classid")!==b)}return true}});c.fn.extend({data:function(a,b){var d=null;if(typeof a==="undefined"){if(this.length){var e=this[0].attributes,f;d=c.data(this[0]);for(var h=0,l=e.length;h<l;h++){f=e[h].name;if(f.indexOf("data-")===0){f=f.substr(5);ka(this[0],f,d[f])}}}return d}else if(typeof a==="object")return this.each(function(){c.data(this,
a)});var k=a.split(".");k[1]=k[1]?"."+k[1]:"";if(b===B){d=this.triggerHandler("getData"+k[1]+"!",[k[0]]);if(d===B&&this.length){d=c.data(this[0],a);d=ka(this[0],a,d)}return d===B&&k[1]?this.data(k[0]):d}else return this.each(function(){var o=c(this),x=[k[0],b];o.triggerHandler("setData"+k[1]+"!",x);c.data(this,a,b);o.triggerHandler("changeData"+k[1]+"!",x)})},removeData:function(a){return this.each(function(){c.removeData(this,a)})}});c.extend({queue:function(a,b,d){if(a){b=(b||"fx")+"queue";var e=
c.data(a,b);if(!d)return e||[];if(!e||c.isArray(d))e=c.data(a,b,c.makeArray(d));else e.push(d);return e}},dequeue:function(a,b){b=b||"fx";var d=c.queue(a,b),e=d.shift();if(e==="inprogress")e=d.shift();if(e){b==="fx"&&d.unshift("inprogress");e.call(a,function(){c.dequeue(a,b)})}}});c.fn.extend({queue:function(a,b){if(typeof a!=="string"){b=a;a="fx"}if(b===B)return c.queue(this[0],a);return this.each(function(){var d=c.queue(this,a,b);a==="fx"&&d[0]!=="inprogress"&&c.dequeue(this,a)})},dequeue:function(a){return this.each(function(){c.dequeue(this,
a)})},delay:function(a,b){a=c.fx?c.fx.speeds[a]||a:a;b=b||"fx";return this.queue(b,function(){var d=this;setTimeout(function(){c.dequeue(d,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var sa=/[\n\t]/g,ha=/\s+/,Sa=/\r/g,Ta=/^(?:href|src|style)$/,Ua=/^(?:button|input)$/i,Va=/^(?:button|input|object|select|textarea)$/i,Wa=/^a(?:rea)?$/i,ta=/^(?:radio|checkbox)$/i;c.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",
colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"};c.fn.extend({attr:function(a,b){return c.access(this,a,b,true,c.attr)},removeAttr:function(a){return this.each(function(){c.attr(this,a,"");this.nodeType===1&&this.removeAttribute(a)})},addClass:function(a){if(c.isFunction(a))return this.each(function(x){var r=c(this);r.addClass(a.call(this,x,r.attr("class")))});if(a&&typeof a==="string")for(var b=(a||"").split(ha),d=0,e=this.length;d<e;d++){var f=this[d];if(f.nodeType===
1)if(f.className){for(var h=" "+f.className+" ",l=f.className,k=0,o=b.length;k<o;k++)if(h.indexOf(" "+b[k]+" ")<0)l+=" "+b[k];f.className=c.trim(l)}else f.className=a}return this},removeClass:function(a){if(c.isFunction(a))return this.each(function(o){var x=c(this);x.removeClass(a.call(this,o,x.attr("class")))});if(a&&typeof a==="string"||a===B)for(var b=(a||"").split(ha),d=0,e=this.length;d<e;d++){var f=this[d];if(f.nodeType===1&&f.className)if(a){for(var h=(" "+f.className+" ").replace(sa," "),
l=0,k=b.length;l<k;l++)h=h.replace(" "+b[l]+" "," ");f.className=c.trim(h)}else f.className=""}return this},toggleClass:function(a,b){var d=typeof a,e=typeof b==="boolean";if(c.isFunction(a))return this.each(function(f){var h=c(this);h.toggleClass(a.call(this,f,h.attr("class"),b),b)});return this.each(function(){if(d==="string")for(var f,h=0,l=c(this),k=b,o=a.split(ha);f=o[h++];){k=e?k:!l.hasClass(f);l[k?"addClass":"removeClass"](f)}else if(d==="undefined"||d==="boolean"){this.className&&c.data(this,
"__className__",this.className);this.className=this.className||a===false?"":c.data(this,"__className__")||""}})},hasClass:function(a){a=" "+a+" ";for(var b=0,d=this.length;b<d;b++)if((" "+this[b].className+" ").replace(sa," ").indexOf(a)>-1)return true;return false},val:function(a){if(!arguments.length){var b=this[0];if(b){if(c.nodeName(b,"option")){var d=b.attributes.value;return!d||d.specified?b.value:b.text}if(c.nodeName(b,"select")){var e=b.selectedIndex;d=[];var f=b.options;b=b.type==="select-one";
if(e<0)return null;var h=b?e:0;for(e=b?e+1:f.length;h<e;h++){var l=f[h];if(l.selected&&(c.support.optDisabled?!l.disabled:l.getAttribute("disabled")===null)&&(!l.parentNode.disabled||!c.nodeName(l.parentNode,"optgroup"))){a=c(l).val();if(b)return a;d.push(a)}}return d}if(ta.test(b.type)&&!c.support.checkOn)return b.getAttribute("value")===null?"on":b.value;return(b.value||"").replace(Sa,"")}return B}var k=c.isFunction(a);return this.each(function(o){var x=c(this),r=a;if(this.nodeType===1){if(k)r=
a.call(this,o,x.val());if(r==null)r="";else if(typeof r==="number")r+="";else if(c.isArray(r))r=c.map(r,function(C){return C==null?"":C+""});if(c.isArray(r)&&ta.test(this.type))this.checked=c.inArray(x.val(),r)>=0;else if(c.nodeName(this,"select")){var A=c.makeArray(r);c("option",this).each(function(){this.selected=c.inArray(c(this).val(),A)>=0});if(!A.length)this.selectedIndex=-1}else this.value=r}})}});c.extend({attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},
attr:function(a,b,d,e){if(!a||a.nodeType===3||a.nodeType===8)return B;if(e&&b in c.attrFn)return c(a)[b](d);e=a.nodeType!==1||!c.isXMLDoc(a);var f=d!==B;b=e&&c.props[b]||b;var h=Ta.test(b);if((b in a||a[b]!==B)&&e&&!h){if(f){b==="type"&&Ua.test(a.nodeName)&&a.parentNode&&c.error("type property can't be changed");if(d===null)a.nodeType===1&&a.removeAttribute(b);else a[b]=d}if(c.nodeName(a,"form")&&a.getAttributeNode(b))return a.getAttributeNode(b).nodeValue;if(b==="tabIndex")return(b=a.getAttributeNode("tabIndex"))&&
b.specified?b.value:Va.test(a.nodeName)||Wa.test(a.nodeName)&&a.href?0:B;return a[b]}if(!c.support.style&&e&&b==="style"){if(f)a.style.cssText=""+d;return a.style.cssText}f&&a.setAttribute(b,""+d);if(!a.attributes[b]&&a.hasAttribute&&!a.hasAttribute(b))return B;a=!c.support.hrefNormalized&&e&&h?a.getAttribute(b,2):a.getAttribute(b);return a===null?B:a}});var X=/\.(.*)$/,ia=/^(?:textarea|input|select)$/i,La=/\./g,Ma=/ /g,Xa=/[^\w\s.|`]/g,Ya=function(a){return a.replace(Xa,"\\$&")},ua={focusin:0,focusout:0};
c.event={add:function(a,b,d,e){if(!(a.nodeType===3||a.nodeType===8)){if(c.isWindow(a)&&a!==E&&!a.frameElement)a=E;if(d===false)d=U;else if(!d)return;var f,h;if(d.handler){f=d;d=f.handler}if(!d.guid)d.guid=c.guid++;if(h=c.data(a)){var l=a.nodeType?"events":"__events__",k=h[l],o=h.handle;if(typeof k==="function"){o=k.handle;k=k.events}else if(!k){a.nodeType||(h[l]=h=function(){});h.events=k={}}if(!o)h.handle=o=function(){return typeof c!=="undefined"&&!c.event.triggered?c.event.handle.apply(o.elem,
arguments):B};o.elem=a;b=b.split(" ");for(var x=0,r;l=b[x++];){h=f?c.extend({},f):{handler:d,data:e};if(l.indexOf(".")>-1){r=l.split(".");l=r.shift();h.namespace=r.slice(0).sort().join(".")}else{r=[];h.namespace=""}h.type=l;if(!h.guid)h.guid=d.guid;var A=k[l],C=c.event.special[l]||{};if(!A){A=k[l]=[];if(!C.setup||C.setup.call(a,e,r,o)===false)if(a.addEventListener)a.addEventListener(l,o,false);else a.attachEvent&&a.attachEvent("on"+l,o)}if(C.add){C.add.call(a,h);if(!h.handler.guid)h.handler.guid=
d.guid}A.push(h);c.event.global[l]=true}a=null}}},global:{},remove:function(a,b,d,e){if(!(a.nodeType===3||a.nodeType===8)){if(d===false)d=U;var f,h,l=0,k,o,x,r,A,C,J=a.nodeType?"events":"__events__",w=c.data(a),I=w&&w[J];if(w&&I){if(typeof I==="function"){w=I;I=I.events}if(b&&b.type){d=b.handler;b=b.type}if(!b||typeof b==="string"&&b.charAt(0)==="."){b=b||"";for(f in I)c.event.remove(a,f+b)}else{for(b=b.split(" ");f=b[l++];){r=f;k=f.indexOf(".")<0;o=[];if(!k){o=f.split(".");f=o.shift();x=RegExp("(^|\\.)"+
c.map(o.slice(0).sort(),Ya).join("\\.(?:.*\\.)?")+"(\\.|$)")}if(A=I[f])if(d){r=c.event.special[f]||{};for(h=e||0;h<A.length;h++){C=A[h];if(d.guid===C.guid){if(k||x.test(C.namespace)){e==null&&A.splice(h--,1);r.remove&&r.remove.call(a,C)}if(e!=null)break}}if(A.length===0||e!=null&&A.length===1){if(!r.teardown||r.teardown.call(a,o)===false)c.removeEvent(a,f,w.handle);delete I[f]}}else for(h=0;h<A.length;h++){C=A[h];if(k||x.test(C.namespace)){c.event.remove(a,r,C.handler,h);A.splice(h--,1)}}}if(c.isEmptyObject(I)){if(b=
w.handle)b.elem=null;delete w.events;delete w.handle;if(typeof w==="function")c.removeData(a,J);else c.isEmptyObject(w)&&c.removeData(a)}}}}},trigger:function(a,b,d,e){var f=a.type||a;if(!e){a=typeof a==="object"?a[c.expando]?a:c.extend(c.Event(f),a):c.Event(f);if(f.indexOf("!")>=0){a.type=f=f.slice(0,-1);a.exclusive=true}if(!d){a.stopPropagation();c.event.global[f]&&c.each(c.cache,function(){this.events&&this.events[f]&&c.event.trigger(a,b,this.handle.elem)})}if(!d||d.nodeType===3||d.nodeType===
8)return B;a.result=B;a.target=d;b=c.makeArray(b);b.unshift(a)}a.currentTarget=d;(e=d.nodeType?c.data(d,"handle"):(c.data(d,"__events__")||{}).handle)&&e.apply(d,b);e=d.parentNode||d.ownerDocument;try{if(!(d&&d.nodeName&&c.noData[d.nodeName.toLowerCase()]))if(d["on"+f]&&d["on"+f].apply(d,b)===false){a.result=false;a.preventDefault()}}catch(h){}if(!a.isPropagationStopped()&&e)c.event.trigger(a,b,e,true);else if(!a.isDefaultPrevented()){var l;e=a.target;var k=f.replace(X,""),o=c.nodeName(e,"a")&&k===
"click",x=c.event.special[k]||{};if((!x._default||x._default.call(d,a)===false)&&!o&&!(e&&e.nodeName&&c.noData[e.nodeName.toLowerCase()])){try{if(e[k]){if(l=e["on"+k])e["on"+k]=null;c.event.triggered=true;e[k]()}}catch(r){}if(l)e["on"+k]=l;c.event.triggered=false}}},handle:function(a){var b,d,e,f;d=[];var h=c.makeArray(arguments);a=h[0]=c.event.fix(a||E.event);a.currentTarget=this;b=a.type.indexOf(".")<0&&!a.exclusive;if(!b){e=a.type.split(".");a.type=e.shift();d=e.slice(0).sort();e=RegExp("(^|\\.)"+
d.join("\\.(?:.*\\.)?")+"(\\.|$)")}a.namespace=a.namespace||d.join(".");f=c.data(this,this.nodeType?"events":"__events__");if(typeof f==="function")f=f.events;d=(f||{})[a.type];if(f&&d){d=d.slice(0);f=0;for(var l=d.length;f<l;f++){var k=d[f];if(b||e.test(k.namespace)){a.handler=k.handler;a.data=k.data;a.handleObj=k;k=k.handler.apply(this,h);if(k!==B){a.result=k;if(k===false){a.preventDefault();a.stopPropagation()}}if(a.isImmediatePropagationStopped())break}}}return a.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
fix:function(a){if(a[c.expando])return a;var b=a;a=c.Event(b);for(var d=this.props.length,e;d;){e=this.props[--d];a[e]=b[e]}if(!a.target)a.target=a.srcElement||t;if(a.target.nodeType===3)a.target=a.target.parentNode;if(!a.relatedTarget&&a.fromElement)a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement;if(a.pageX==null&&a.clientX!=null){b=t.documentElement;d=t.body;a.pageX=a.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0);a.pageY=a.clientY+(b&&b.scrollTop||
d&&d.scrollTop||0)-(b&&b.clientTop||d&&d.clientTop||0)}if(a.which==null&&(a.charCode!=null||a.keyCode!=null))a.which=a.charCode!=null?a.charCode:a.keyCode;if(!a.metaKey&&a.ctrlKey)a.metaKey=a.ctrlKey;if(!a.which&&a.button!==B)a.which=a.button&1?1:a.button&2?3:a.button&4?2:0;return a},guid:1E8,proxy:c.proxy,special:{ready:{setup:c.bindReady,teardown:c.noop},live:{add:function(a){c.event.add(this,Y(a.origType,a.selector),c.extend({},a,{handler:Ka,guid:a.handler.guid}))},remove:function(a){c.event.remove(this,
Y(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,d){if(c.isWindow(this))this.onbeforeunload=d},teardown:function(a,b){if(this.onbeforeunload===b)this.onbeforeunload=null}}}};c.removeEvent=t.removeEventListener?function(a,b,d){a.removeEventListener&&a.removeEventListener(b,d,false)}:function(a,b,d){a.detachEvent&&a.detachEvent("on"+b,d)};c.Event=function(a){if(!this.preventDefault)return new c.Event(a);if(a&&a.type){this.originalEvent=a;this.type=a.type}else this.type=a;this.timeStamp=
c.now();this[c.expando]=true};c.Event.prototype={preventDefault:function(){this.isDefaultPrevented=ca;var a=this.originalEvent;if(a)if(a.preventDefault)a.preventDefault();else a.returnValue=false},stopPropagation:function(){this.isPropagationStopped=ca;var a=this.originalEvent;if(a){a.stopPropagation&&a.stopPropagation();a.cancelBubble=true}},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=ca;this.stopPropagation()},isDefaultPrevented:U,isPropagationStopped:U,isImmediatePropagationStopped:U};
var va=function(a){var b=a.relatedTarget;try{for(;b&&b!==this;)b=b.parentNode;if(b!==this){a.type=a.data;c.event.handle.apply(this,arguments)}}catch(d){}},wa=function(a){a.type=a.data;c.event.handle.apply(this,arguments)};c.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){c.event.special[a]={setup:function(d){c.event.add(this,b,d&&d.selector?wa:va,a)},teardown:function(d){c.event.remove(this,b,d&&d.selector?wa:va)}}});if(!c.support.submitBubbles)c.event.special.submit={setup:function(){if(this.nodeName.toLowerCase()!==
"form"){c.event.add(this,"click.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="submit"||d==="image")&&c(b).closest("form").length){a.liveFired=B;return la("submit",this,arguments)}});c.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,d=b.type;if((d==="text"||d==="password")&&c(b).closest("form").length&&a.keyCode===13){a.liveFired=B;return la("submit",this,arguments)}})}else return false},teardown:function(){c.event.remove(this,".specialSubmit")}};if(!c.support.changeBubbles){var V,
xa=function(a){var b=a.type,d=a.value;if(b==="radio"||b==="checkbox")d=a.checked;else if(b==="select-multiple")d=a.selectedIndex>-1?c.map(a.options,function(e){return e.selected}).join("-"):"";else if(a.nodeName.toLowerCase()==="select")d=a.selectedIndex;return d},Z=function(a,b){var d=a.target,e,f;if(!(!ia.test(d.nodeName)||d.readOnly)){e=c.data(d,"_change_data");f=xa(d);if(a.type!=="focusout"||d.type!=="radio")c.data(d,"_change_data",f);if(!(e===B||f===e))if(e!=null||f){a.type="change";a.liveFired=
B;return c.event.trigger(a,b,d)}}};c.event.special.change={filters:{focusout:Z,beforedeactivate:Z,click:function(a){var b=a.target,d=b.type;if(d==="radio"||d==="checkbox"||b.nodeName.toLowerCase()==="select")return Z.call(this,a)},keydown:function(a){var b=a.target,d=b.type;if(a.keyCode===13&&b.nodeName.toLowerCase()!=="textarea"||a.keyCode===32&&(d==="checkbox"||d==="radio")||d==="select-multiple")return Z.call(this,a)},beforeactivate:function(a){a=a.target;c.data(a,"_change_data",xa(a))}},setup:function(){if(this.type===
"file")return false;for(var a in V)c.event.add(this,a+".specialChange",V[a]);return ia.test(this.nodeName)},teardown:function(){c.event.remove(this,".specialChange");return ia.test(this.nodeName)}};V=c.event.special.change.filters;V.focus=V.beforeactivate}t.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(e){e=c.event.fix(e);e.type=b;return c.event.trigger(e,null,e.target)}c.event.special[b]={setup:function(){ua[b]++===0&&t.addEventListener(a,d,true)},teardown:function(){--ua[b]===
0&&t.removeEventListener(a,d,true)}}});c.each(["bind","one"],function(a,b){c.fn[b]=function(d,e,f){if(typeof d==="object"){for(var h in d)this[b](h,e,d[h],f);return this}if(c.isFunction(e)||e===false){f=e;e=B}var l=b==="one"?c.proxy(f,function(o){c(this).unbind(o,l);return f.apply(this,arguments)}):f;if(d==="unload"&&b!=="one")this.one(d,e,f);else{h=0;for(var k=this.length;h<k;h++)c.event.add(this[h],d,l,e)}return this}});c.fn.extend({unbind:function(a,b){if(typeof a==="object"&&!a.preventDefault)for(var d in a)this.unbind(d,
a[d]);else{d=0;for(var e=this.length;d<e;d++)c.event.remove(this[d],a,b)}return this},delegate:function(a,b,d,e){return this.live(b,d,e,a)},undelegate:function(a,b,d){return arguments.length===0?this.unbind("live"):this.die(b,null,d,a)},trigger:function(a,b){return this.each(function(){c.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){var d=c.Event(a);d.preventDefault();d.stopPropagation();c.event.trigger(d,b,this[0]);return d.result}},toggle:function(a){for(var b=arguments,d=
1;d<b.length;)c.proxy(a,b[d++]);return this.click(c.proxy(a,function(e){var f=(c.data(this,"lastToggle"+a.guid)||0)%d;c.data(this,"lastToggle"+a.guid,f+1);e.preventDefault();return b[f].apply(this,arguments)||false}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var ya={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};c.each(["live","die"],function(a,b){c.fn[b]=function(d,e,f,h){var l,k=0,o,x,r=h||this.selector;h=h?this:c(this.context);if(typeof d===
"object"&&!d.preventDefault){for(l in d)h[b](l,e,d[l],r);return this}if(c.isFunction(e)){f=e;e=B}for(d=(d||"").split(" ");(l=d[k++])!=null;){o=X.exec(l);x="";if(o){x=o[0];l=l.replace(X,"")}if(l==="hover")d.push("mouseenter"+x,"mouseleave"+x);else{o=l;if(l==="focus"||l==="blur"){d.push(ya[l]+x);l+=x}else l=(ya[l]||l)+x;if(b==="live"){x=0;for(var A=h.length;x<A;x++)c.event.add(h[x],"live."+Y(l,r),{data:e,selector:r,handler:f,origType:l,origHandler:f,preType:o})}else h.unbind("live."+Y(l,r),f)}}return this}});
c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){c.fn[b]=function(d,e){if(e==null){e=d;d=null}return arguments.length>0?this.bind(b,d,e):this.trigger(b)};if(c.attrFn)c.attrFn[b]=true});E.attachEvent&&!E.addEventListener&&c(E).bind("unload",function(){for(var a in c.cache)if(c.cache[a].handle)try{c.event.remove(c.cache[a].handle.elem)}catch(b){}});
(function(){function a(g,i,n,m,p,q){p=0;for(var u=m.length;p<u;p++){var y=m[p];if(y){var F=false;for(y=y[g];y;){if(y.sizcache===n){F=m[y.sizset];break}if(y.nodeType===1&&!q){y.sizcache=n;y.sizset=p}if(y.nodeName.toLowerCase()===i){F=y;break}y=y[g]}m[p]=F}}}function b(g,i,n,m,p,q){p=0;for(var u=m.length;p<u;p++){var y=m[p];if(y){var F=false;for(y=y[g];y;){if(y.sizcache===n){F=m[y.sizset];break}if(y.nodeType===1){if(!q){y.sizcache=n;y.sizset=p}if(typeof i!=="string"){if(y===i){F=true;break}}else if(k.filter(i,
[y]).length>0){F=y;break}}y=y[g]}m[p]=F}}}var d=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e=0,f=Object.prototype.toString,h=false,l=true;[0,0].sort(function(){l=false;return 0});var k=function(g,i,n,m){n=n||[];var p=i=i||t;if(i.nodeType!==1&&i.nodeType!==9)return[];if(!g||typeof g!=="string")return n;var q,u,y,F,M,N=true,O=k.isXML(i),D=[],R=g;do{d.exec("");if(q=d.exec(R)){R=q[3];D.push(q[1]);if(q[2]){F=q[3];
break}}}while(q);if(D.length>1&&x.exec(g))if(D.length===2&&o.relative[D[0]])u=L(D[0]+D[1],i);else for(u=o.relative[D[0]]?[i]:k(D.shift(),i);D.length;){g=D.shift();if(o.relative[g])g+=D.shift();u=L(g,u)}else{if(!m&&D.length>1&&i.nodeType===9&&!O&&o.match.ID.test(D[0])&&!o.match.ID.test(D[D.length-1])){q=k.find(D.shift(),i,O);i=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]}if(i){q=m?{expr:D.pop(),set:C(m)}:k.find(D.pop(),D.length===1&&(D[0]==="~"||D[0]==="+")&&i.parentNode?i.parentNode:i,O);u=q.expr?k.filter(q.expr,
q.set):q.set;if(D.length>0)y=C(u);else N=false;for(;D.length;){q=M=D.pop();if(o.relative[M])q=D.pop();else M="";if(q==null)q=i;o.relative[M](y,q,O)}}else y=[]}y||(y=u);y||k.error(M||g);if(f.call(y)==="[object Array]")if(N)if(i&&i.nodeType===1)for(g=0;y[g]!=null;g++){if(y[g]&&(y[g]===true||y[g].nodeType===1&&k.contains(i,y[g])))n.push(u[g])}else for(g=0;y[g]!=null;g++)y[g]&&y[g].nodeType===1&&n.push(u[g]);else n.push.apply(n,y);else C(y,n);if(F){k(F,p,n,m);k.uniqueSort(n)}return n};k.uniqueSort=function(g){if(w){h=
l;g.sort(w);if(h)for(var i=1;i<g.length;i++)g[i]===g[i-1]&&g.splice(i--,1)}return g};k.matches=function(g,i){return k(g,null,null,i)};k.matchesSelector=function(g,i){return k(i,null,null,[g]).length>0};k.find=function(g,i,n){var m;if(!g)return[];for(var p=0,q=o.order.length;p<q;p++){var u,y=o.order[p];if(u=o.leftMatch[y].exec(g)){var F=u[1];u.splice(1,1);if(F.substr(F.length-1)!=="\\"){u[1]=(u[1]||"").replace(/\\/g,"");m=o.find[y](u,i,n);if(m!=null){g=g.replace(o.match[y],"");break}}}}m||(m=i.getElementsByTagName("*"));
return{set:m,expr:g}};k.filter=function(g,i,n,m){for(var p,q,u=g,y=[],F=i,M=i&&i[0]&&k.isXML(i[0]);g&&i.length;){for(var N in o.filter)if((p=o.leftMatch[N].exec(g))!=null&&p[2]){var O,D,R=o.filter[N];D=p[1];q=false;p.splice(1,1);if(D.substr(D.length-1)!=="\\"){if(F===y)y=[];if(o.preFilter[N])if(p=o.preFilter[N](p,F,n,y,m,M)){if(p===true)continue}else q=O=true;if(p)for(var j=0;(D=F[j])!=null;j++)if(D){O=R(D,p,j,F);var s=m^!!O;if(n&&O!=null)if(s)q=true;else F[j]=false;else if(s){y.push(D);q=true}}if(O!==
B){n||(F=y);g=g.replace(o.match[N],"");if(!q)return[];break}}}if(g===u)if(q==null)k.error(g);else break;u=g}return F};k.error=function(g){throw"Syntax error, unrecognized expression: "+g;};var o=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(g){return g.getAttribute("href")}},relative:{"+":function(g,i){var n=typeof i==="string",m=n&&!/\W/.test(i);n=n&&!m;if(m)i=i.toLowerCase();m=0;for(var p=g.length,q;m<p;m++)if(q=g[m]){for(;(q=q.previousSibling)&&q.nodeType!==1;);g[m]=n||q&&q.nodeName.toLowerCase()===
i?q||false:q===i}n&&k.filter(i,g,true)},">":function(g,i){var n,m=typeof i==="string",p=0,q=g.length;if(m&&!/\W/.test(i))for(i=i.toLowerCase();p<q;p++){if(n=g[p]){n=n.parentNode;g[p]=n.nodeName.toLowerCase()===i?n:false}}else{for(;p<q;p++)if(n=g[p])g[p]=m?n.parentNode:n.parentNode===i;m&&k.filter(i,g,true)}},"":function(g,i,n){var m,p=e++,q=b;if(typeof i==="string"&&!/\W/.test(i)){m=i=i.toLowerCase();q=a}q("parentNode",i,p,g,m,n)},"~":function(g,i,n){var m,p=e++,q=b;if(typeof i==="string"&&!/\W/.test(i)){m=
i=i.toLowerCase();q=a}q("previousSibling",i,p,g,m,n)}},find:{ID:function(g,i,n){if(typeof i.getElementById!=="undefined"&&!n)return(g=i.getElementById(g[1]))&&g.parentNode?[g]:[]},NAME:function(g,i){if(typeof i.getElementsByName!=="undefined"){for(var n=[],m=i.getElementsByName(g[1]),p=0,q=m.length;p<q;p++)m[p].getAttribute("name")===g[1]&&n.push(m[p]);return n.length===0?null:n}},TAG:function(g,i){return i.getElementsByTagName(g[1])}},preFilter:{CLASS:function(g,i,n,m,p,q){g=" "+g[1].replace(/\\/g,
"")+" ";if(q)return g;q=0;for(var u;(u=i[q])!=null;q++)if(u)if(p^(u.className&&(" "+u.className+" ").replace(/[\t\n]/g," ").indexOf(g)>=0))n||m.push(u);else if(n)i[q]=false;return false},ID:function(g){return g[1].replace(/\\/g,"")},TAG:function(g){return g[1].toLowerCase()},CHILD:function(g){if(g[1]==="nth"){var i=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(g[2]==="even"&&"2n"||g[2]==="odd"&&"2n+1"||!/\D/.test(g[2])&&"0n+"+g[2]||g[2]);g[2]=i[1]+(i[2]||1)-0;g[3]=i[3]-0}g[0]=e++;return g},ATTR:function(g,i,n,
m,p,q){i=g[1].replace(/\\/g,"");if(!q&&o.attrMap[i])g[1]=o.attrMap[i];if(g[2]==="~=")g[4]=" "+g[4]+" ";return g},PSEUDO:function(g,i,n,m,p){if(g[1]==="not")if((d.exec(g[3])||"").length>1||/^\w/.test(g[3]))g[3]=k(g[3],null,null,i);else{g=k.filter(g[3],i,n,true^p);n||m.push.apply(m,g);return false}else if(o.match.POS.test(g[0])||o.match.CHILD.test(g[0]))return true;return g},POS:function(g){g.unshift(true);return g}},filters:{enabled:function(g){return g.disabled===false&&g.type!=="hidden"},disabled:function(g){return g.disabled===
true},checked:function(g){return g.checked===true},selected:function(g){return g.selected===true},parent:function(g){return!!g.firstChild},empty:function(g){return!g.firstChild},has:function(g,i,n){return!!k(n[3],g).length},header:function(g){return/h\d/i.test(g.nodeName)},text:function(g){return"text"===g.type},radio:function(g){return"radio"===g.type},checkbox:function(g){return"checkbox"===g.type},file:function(g){return"file"===g.type},password:function(g){return"password"===g.type},submit:function(g){return"submit"===
g.type},image:function(g){return"image"===g.type},reset:function(g){return"reset"===g.type},button:function(g){return"button"===g.type||g.nodeName.toLowerCase()==="button"},input:function(g){return/input|select|textarea|button/i.test(g.nodeName)}},setFilters:{first:function(g,i){return i===0},last:function(g,i,n,m){return i===m.length-1},even:function(g,i){return i%2===0},odd:function(g,i){return i%2===1},lt:function(g,i,n){return i<n[3]-0},gt:function(g,i,n){return i>n[3]-0},nth:function(g,i,n){return n[3]-
0===i},eq:function(g,i,n){return n[3]-0===i}},filter:{PSEUDO:function(g,i,n,m){var p=i[1],q=o.filters[p];if(q)return q(g,n,i,m);else if(p==="contains")return(g.textContent||g.innerText||k.getText([g])||"").indexOf(i[3])>=0;else if(p==="not"){i=i[3];n=0;for(m=i.length;n<m;n++)if(i[n]===g)return false;return true}else k.error("Syntax error, unrecognized expression: "+p)},CHILD:function(g,i){var n=i[1],m=g;switch(n){case "only":case "first":for(;m=m.previousSibling;)if(m.nodeType===1)return false;if(n===
"first")return true;m=g;case "last":for(;m=m.nextSibling;)if(m.nodeType===1)return false;return true;case "nth":n=i[2];var p=i[3];if(n===1&&p===0)return true;var q=i[0],u=g.parentNode;if(u&&(u.sizcache!==q||!g.nodeIndex)){var y=0;for(m=u.firstChild;m;m=m.nextSibling)if(m.nodeType===1)m.nodeIndex=++y;u.sizcache=q}m=g.nodeIndex-p;return n===0?m===0:m%n===0&&m/n>=0}},ID:function(g,i){return g.nodeType===1&&g.getAttribute("id")===i},TAG:function(g,i){return i==="*"&&g.nodeType===1||g.nodeName.toLowerCase()===
i},CLASS:function(g,i){return(" "+(g.className||g.getAttribute("class"))+" ").indexOf(i)>-1},ATTR:function(g,i){var n=i[1];n=o.attrHandle[n]?o.attrHandle[n](g):g[n]!=null?g[n]:g.getAttribute(n);var m=n+"",p=i[2],q=i[4];return n==null?p==="!=":p==="="?m===q:p==="*="?m.indexOf(q)>=0:p==="~="?(" "+m+" ").indexOf(q)>=0:!q?m&&n!==false:p==="!="?m!==q:p==="^="?m.indexOf(q)===0:p==="$="?m.substr(m.length-q.length)===q:p==="|="?m===q||m.substr(0,q.length+1)===q+"-":false},POS:function(g,i,n,m){var p=o.setFilters[i[2]];
if(p)return p(g,n,i,m)}}},x=o.match.POS,r=function(g,i){return"\\"+(i-0+1)},A;for(A in o.match){o.match[A]=RegExp(o.match[A].source+/(?![^\[]*\])(?![^\(]*\))/.source);o.leftMatch[A]=RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[A].source.replace(/\\(\d+)/g,r))}var C=function(g,i){g=Array.prototype.slice.call(g,0);if(i){i.push.apply(i,g);return i}return g};try{Array.prototype.slice.call(t.documentElement.childNodes,0)}catch(J){C=function(g,i){var n=0,m=i||[];if(f.call(g)==="[object Array]")Array.prototype.push.apply(m,
g);else if(typeof g.length==="number")for(var p=g.length;n<p;n++)m.push(g[n]);else for(;g[n];n++)m.push(g[n]);return m}}var w,I;if(t.documentElement.compareDocumentPosition)w=function(g,i){if(g===i){h=true;return 0}if(!g.compareDocumentPosition||!i.compareDocumentPosition)return g.compareDocumentPosition?-1:1;return g.compareDocumentPosition(i)&4?-1:1};else{w=function(g,i){var n,m,p=[],q=[];n=g.parentNode;m=i.parentNode;var u=n;if(g===i){h=true;return 0}else if(n===m)return I(g,i);else if(n){if(!m)return 1}else return-1;
for(;u;){p.unshift(u);u=u.parentNode}for(u=m;u;){q.unshift(u);u=u.parentNode}n=p.length;m=q.length;for(u=0;u<n&&u<m;u++)if(p[u]!==q[u])return I(p[u],q[u]);return u===n?I(g,q[u],-1):I(p[u],i,1)};I=function(g,i,n){if(g===i)return n;for(g=g.nextSibling;g;){if(g===i)return-1;g=g.nextSibling}return 1}}k.getText=function(g){for(var i="",n,m=0;g[m];m++){n=g[m];if(n.nodeType===3||n.nodeType===4)i+=n.nodeValue;else if(n.nodeType!==8)i+=k.getText(n.childNodes)}return i};(function(){var g=t.createElement("div"),
i="script"+(new Date).getTime(),n=t.documentElement;g.innerHTML="<a name='"+i+"'/>";n.insertBefore(g,n.firstChild);if(t.getElementById(i)){o.find.ID=function(m,p,q){if(typeof p.getElementById!=="undefined"&&!q)return(p=p.getElementById(m[1]))?p.id===m[1]||typeof p.getAttributeNode!=="undefined"&&p.getAttributeNode("id").nodeValue===m[1]?[p]:B:[]};o.filter.ID=function(m,p){var q=typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id");return m.nodeType===1&&q&&q.nodeValue===p}}n.removeChild(g);
n=g=null})();(function(){var g=t.createElement("div");g.appendChild(t.createComment(""));if(g.getElementsByTagName("*").length>0)o.find.TAG=function(i,n){var m=n.getElementsByTagName(i[1]);if(i[1]==="*"){for(var p=[],q=0;m[q];q++)m[q].nodeType===1&&p.push(m[q]);m=p}return m};g.innerHTML="<a href='#'></a>";if(g.firstChild&&typeof g.firstChild.getAttribute!=="undefined"&&g.firstChild.getAttribute("href")!=="#")o.attrHandle.href=function(i){return i.getAttribute("href",2)};g=null})();t.querySelectorAll&&
function(){var g=k,i=t.createElement("div");i.innerHTML="<p class='TEST'></p>";if(!(i.querySelectorAll&&i.querySelectorAll(".TEST").length===0)){k=function(m,p,q,u){p=p||t;m=m.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!u&&!k.isXML(p))if(p.nodeType===9)try{return C(p.querySelectorAll(m),q)}catch(y){}else if(p.nodeType===1&&p.nodeName.toLowerCase()!=="object"){var F=p.getAttribute("id"),M=F||"__sizzle__";F||p.setAttribute("id",M);try{return C(p.querySelectorAll("#"+M+" "+m),q)}catch(N){}finally{F||
p.removeAttribute("id")}}return g(m,p,q,u)};for(var n in g)k[n]=g[n];i=null}}();(function(){var g=t.documentElement,i=g.matchesSelector||g.mozMatchesSelector||g.webkitMatchesSelector||g.msMatchesSelector,n=false;try{i.call(t.documentElement,"[test!='']:sizzle")}catch(m){n=true}if(i)k.matchesSelector=function(p,q){q=q.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(p))try{if(n||!o.match.PSEUDO.test(q)&&!/!=/.test(q))return i.call(p,q)}catch(u){}return k(q,null,null,[p]).length>0}})();(function(){var g=
t.createElement("div");g.innerHTML="<div class='test e'></div><div class='test'></div>";if(!(!g.getElementsByClassName||g.getElementsByClassName("e").length===0)){g.lastChild.className="e";if(g.getElementsByClassName("e").length!==1){o.order.splice(1,0,"CLASS");o.find.CLASS=function(i,n,m){if(typeof n.getElementsByClassName!=="undefined"&&!m)return n.getElementsByClassName(i[1])};g=null}}})();k.contains=t.documentElement.contains?function(g,i){return g!==i&&(g.contains?g.contains(i):true)}:t.documentElement.compareDocumentPosition?
function(g,i){return!!(g.compareDocumentPosition(i)&16)}:function(){return false};k.isXML=function(g){return(g=(g?g.ownerDocument||g:0).documentElement)?g.nodeName!=="HTML":false};var L=function(g,i){for(var n,m=[],p="",q=i.nodeType?[i]:i;n=o.match.PSEUDO.exec(g);){p+=n[0];g=g.replace(o.match.PSEUDO,"")}g=o.relative[g]?g+"*":g;n=0;for(var u=q.length;n<u;n++)k(g,q[n],m);return k.filter(p,m)};c.find=k;c.expr=k.selectors;c.expr[":"]=c.expr.filters;c.unique=k.uniqueSort;c.text=k.getText;c.isXMLDoc=k.isXML;
c.contains=k.contains})();var Za=/Until$/,$a=/^(?:parents|prevUntil|prevAll)/,ab=/,/,Na=/^.[^:#\[\.,]*$/,bb=Array.prototype.slice,cb=c.expr.match.POS;c.fn.extend({find:function(a){for(var b=this.pushStack("","find",a),d=0,e=0,f=this.length;e<f;e++){d=b.length;c.find(a,this[e],b);if(e>0)for(var h=d;h<b.length;h++)for(var l=0;l<d;l++)if(b[l]===b[h]){b.splice(h--,1);break}}return b},has:function(a){var b=c(a);return this.filter(function(){for(var d=0,e=b.length;d<e;d++)if(c.contains(this,b[d]))return true})},
not:function(a){return this.pushStack(ma(this,a,false),"not",a)},filter:function(a){return this.pushStack(ma(this,a,true),"filter",a)},is:function(a){return!!a&&c.filter(a,this).length>0},closest:function(a,b){var d=[],e,f,h=this[0];if(c.isArray(a)){var l,k={},o=1;if(h&&a.length){e=0;for(f=a.length;e<f;e++){l=a[e];k[l]||(k[l]=c.expr.match.POS.test(l)?c(l,b||this.context):l)}for(;h&&h.ownerDocument&&h!==b;){for(l in k){e=k[l];if(e.jquery?e.index(h)>-1:c(h).is(e))d.push({selector:l,elem:h,level:o})}h=
h.parentNode;o++}}return d}l=cb.test(a)?c(a,b||this.context):null;e=0;for(f=this.length;e<f;e++)for(h=this[e];h;)if(l?l.index(h)>-1:c.find.matchesSelector(h,a)){d.push(h);break}else{h=h.parentNode;if(!h||!h.ownerDocument||h===b)break}d=d.length>1?c.unique(d):d;return this.pushStack(d,"closest",a)},index:function(a){if(!a||typeof a==="string")return c.inArray(this[0],a?c(a):this.parent().children());return c.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var d=typeof a==="string"?c(a,b||this.context):
c.makeArray(a),e=c.merge(this.get(),d);return this.pushStack(!d[0]||!d[0].parentNode||d[0].parentNode.nodeType===11||!e[0]||!e[0].parentNode||e[0].parentNode.nodeType===11?e:c.unique(e))},andSelf:function(){return this.add(this.prevObject)}});c.each({parent:function(a){return(a=a.parentNode)&&a.nodeType!==11?a:null},parents:function(a){return c.dir(a,"parentNode")},parentsUntil:function(a,b,d){return c.dir(a,"parentNode",d)},next:function(a){return c.nth(a,2,"nextSibling")},prev:function(a){return c.nth(a,
2,"previousSibling")},nextAll:function(a){return c.dir(a,"nextSibling")},prevAll:function(a){return c.dir(a,"previousSibling")},nextUntil:function(a,b,d){return c.dir(a,"nextSibling",d)},prevUntil:function(a,b,d){return c.dir(a,"previousSibling",d)},siblings:function(a){return c.sibling(a.parentNode.firstChild,a)},children:function(a){return c.sibling(a.firstChild)},contents:function(a){return c.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:c.makeArray(a.childNodes)}},function(a,
b){c.fn[a]=function(d,e){var f=c.map(this,b,d);Za.test(a)||(e=d);if(e&&typeof e==="string")f=c.filter(e,f);f=this.length>1?c.unique(f):f;if((this.length>1||ab.test(e))&&$a.test(a))f=f.reverse();return this.pushStack(f,a,bb.call(arguments).join(","))}});c.extend({filter:function(a,b,d){if(d)a=":not("+a+")";return b.length===1?c.find.matchesSelector(b[0],a)?[b[0]]:[]:c.find.matches(a,b)},dir:function(a,b,d){var e=[];for(a=a[b];a&&a.nodeType!==9&&(d===B||a.nodeType!==1||!c(a).is(d));){a.nodeType===1&&
e.push(a);a=a[b]}return e},nth:function(a,b,d){b=b||1;for(var e=0;a;a=a[d])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){for(var d=[];a;a=a.nextSibling)a.nodeType===1&&a!==b&&d.push(a);return d}});var za=/ jQuery\d+="(?:\d+|null)"/g,$=/^\s+/,Aa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Ba=/<([\w:]+)/,db=/<tbody/i,eb=/<|&#?\w+;/,Ca=/<(?:script|object|embed|option|style)/i,Da=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/\=([^="'>\s]+\/)>/g,P={option:[1,
"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};P.optgroup=P.option;P.tbody=P.tfoot=P.colgroup=P.caption=P.thead;P.th=P.td;if(!c.support.htmlSerialize)P._default=[1,"div<div>","</div>"];c.fn.extend({text:function(a){if(c.isFunction(a))return this.each(function(b){var d=
c(this);d.text(a.call(this,b,d.text()))});if(typeof a!=="object"&&a!==B)return this.empty().append((this[0]&&this[0].ownerDocument||t).createTextNode(a));return c.text(this)},wrapAll:function(a){if(c.isFunction(a))return this.each(function(d){c(this).wrapAll(a.call(this,d))});if(this[0]){var b=c(a,this[0].ownerDocument).eq(0).clone(true);this[0].parentNode&&b.insertBefore(this[0]);b.map(function(){for(var d=this;d.firstChild&&d.firstChild.nodeType===1;)d=d.firstChild;return d}).append(this)}return this},
wrapInner:function(a){if(c.isFunction(a))return this.each(function(b){c(this).wrapInner(a.call(this,b))});return this.each(function(){var b=c(this),d=b.contents();d.length?d.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){c(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){c.nodeName(this,"body")||c(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.appendChild(a)})},
prepend:function(){return this.domManip(arguments,true,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,this)});else if(arguments.length){var a=c(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,false,function(b){this.parentNode.insertBefore(b,
this.nextSibling)});else if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,c(arguments[0]).toArray());return a}},remove:function(a,b){for(var d=0,e;(e=this[d])!=null;d++)if(!a||c.filter(a,[e]).length){if(!b&&e.nodeType===1){c.cleanData(e.getElementsByTagName("*"));c.cleanData([e])}e.parentNode&&e.parentNode.removeChild(e)}return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++)for(b.nodeType===1&&c.cleanData(b.getElementsByTagName("*"));b.firstChild;)b.removeChild(b.firstChild);
return this},clone:function(a){var b=this.map(function(){if(!c.support.noCloneEvent&&!c.isXMLDoc(this)){var d=this.outerHTML,e=this.ownerDocument;if(!d){d=e.createElement("div");d.appendChild(this.cloneNode(true));d=d.innerHTML}return c.clean([d.replace(za,"").replace(fb,'="$1">').replace($,"")],e)[0]}else return this.cloneNode(true)});if(a===true){na(this,b);na(this.find("*"),b.find("*"))}return b},html:function(a){if(a===B)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(za,""):null;
else if(typeof a==="string"&&!Ca.test(a)&&(c.support.leadingWhitespace||!$.test(a))&&!P[(Ba.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Aa,"<$1></$2>");try{for(var b=0,d=this.length;b<d;b++)if(this[b].nodeType===1){c.cleanData(this[b].getElementsByTagName("*"));this[b].innerHTML=a}}catch(e){this.empty().append(a)}}else c.isFunction(a)?this.each(function(f){var h=c(this);h.html(a.call(this,f,h.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(c.isFunction(a))return this.each(function(b){var d=
c(this),e=d.html();d.replaceWith(a.call(this,b,e))});if(typeof a!=="string")a=c(a).detach();return this.each(function(){var b=this.nextSibling,d=this.parentNode;c(this).remove();b?c(b).before(a):c(d).append(a)})}else return this.pushStack(c(c.isFunction(a)?a():a),"replaceWith",a)},detach:function(a){return this.remove(a,true)},domManip:function(a,b,d){var e,f,h,l=a[0],k=[];if(!c.support.checkClone&&arguments.length===3&&typeof l==="string"&&Da.test(l))return this.each(function(){c(this).domManip(a,
b,d,true)});if(c.isFunction(l))return this.each(function(x){var r=c(this);a[0]=l.call(this,x,b?r.html():B);r.domManip(a,b,d)});if(this[0]){e=l&&l.parentNode;e=c.support.parentNode&&e&&e.nodeType===11&&e.childNodes.length===this.length?{fragment:e}:c.buildFragment(a,this,k);h=e.fragment;if(f=h.childNodes.length===1?h=h.firstChild:h.firstChild){b=b&&c.nodeName(f,"tr");f=0;for(var o=this.length;f<o;f++)d.call(b?c.nodeName(this[f],"table")?this[f].getElementsByTagName("tbody")[0]||this[f].appendChild(this[f].ownerDocument.createElement("tbody")):
this[f]:this[f],f>0||e.cacheable||this.length>1?h.cloneNode(true):h)}k.length&&c.each(k,Oa)}return this}});c.buildFragment=function(a,b,d){var e,f,h;b=b&&b[0]?b[0].ownerDocument||b[0]:t;if(a.length===1&&typeof a[0]==="string"&&a[0].length<512&&b===t&&!Ca.test(a[0])&&(c.support.checkClone||!Da.test(a[0]))){f=true;if(h=c.fragments[a[0]])if(h!==1)e=h}if(!e){e=b.createDocumentFragment();c.clean(a,b,e,d)}if(f)c.fragments[a[0]]=h?e:1;return{fragment:e,cacheable:f}};c.fragments={};c.each({appendTo:"append",
prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){c.fn[a]=function(d){var e=[];d=c(d);var f=this.length===1&&this[0].parentNode;if(f&&f.nodeType===11&&f.childNodes.length===1&&d.length===1){d[b](this[0]);return this}else{f=0;for(var h=d.length;f<h;f++){var l=(f>0?this.clone(true):this).get();c(d[f])[b](l);e=e.concat(l)}return this.pushStack(e,a,d.selector)}}});c.extend({clean:function(a,b,d,e){b=b||t;if(typeof b.createElement==="undefined")b=b.ownerDocument||
b[0]&&b[0].ownerDocument||t;for(var f=[],h=0,l;(l=a[h])!=null;h++){if(typeof l==="number")l+="";if(l){if(typeof l==="string"&&!eb.test(l))l=b.createTextNode(l);else if(typeof l==="string"){l=l.replace(Aa,"<$1></$2>");var k=(Ba.exec(l)||["",""])[1].toLowerCase(),o=P[k]||P._default,x=o[0],r=b.createElement("div");for(r.innerHTML=o[1]+l+o[2];x--;)r=r.lastChild;if(!c.support.tbody){x=db.test(l);k=k==="table"&&!x?r.firstChild&&r.firstChild.childNodes:o[1]==="<table>"&&!x?r.childNodes:[];for(o=k.length-
1;o>=0;--o)c.nodeName(k[o],"tbody")&&!k[o].childNodes.length&&k[o].parentNode.removeChild(k[o])}!c.support.leadingWhitespace&&$.test(l)&&r.insertBefore(b.createTextNode($.exec(l)[0]),r.firstChild);l=r.childNodes}if(l.nodeType)f.push(l);else f=c.merge(f,l)}}if(d)for(h=0;f[h];h++)if(e&&c.nodeName(f[h],"script")&&(!f[h].type||f[h].type.toLowerCase()==="text/javascript"))e.push(f[h].parentNode?f[h].parentNode.removeChild(f[h]):f[h]);else{f[h].nodeType===1&&f.splice.apply(f,[h+1,0].concat(c.makeArray(f[h].getElementsByTagName("script"))));
d.appendChild(f[h])}return f},cleanData:function(a){for(var b,d,e=c.cache,f=c.event.special,h=c.support.deleteExpando,l=0,k;(k=a[l])!=null;l++)if(!(k.nodeName&&c.noData[k.nodeName.toLowerCase()]))if(d=k[c.expando]){if((b=e[d])&&b.events)for(var o in b.events)f[o]?c.event.remove(k,o):c.removeEvent(k,o,b.handle);if(h)delete k[c.expando];else k.removeAttribute&&k.removeAttribute(c.expando);delete e[d]}}});var Ea=/alpha\([^)]*\)/i,gb=/opacity=([^)]*)/,hb=/-([a-z])/ig,ib=/([A-Z])/g,Fa=/^-?\d+(?:px)?$/i,
jb=/^-?\d/,kb={position:"absolute",visibility:"hidden",display:"block"},Pa=["Left","Right"],Qa=["Top","Bottom"],W,Ga,aa,lb=function(a,b){return b.toUpperCase()};c.fn.css=function(a,b){if(arguments.length===2&&b===B)return this;return c.access(this,a,b,true,function(d,e,f){return f!==B?c.style(d,e,f):c.css(d,e)})};c.extend({cssHooks:{opacity:{get:function(a,b){if(b){var d=W(a,"opacity","opacity");return d===""?"1":d}else return a.style.opacity}}},cssNumber:{zIndex:true,fontWeight:true,opacity:true,
zoom:true,lineHeight:true},cssProps:{"float":c.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,d,e){if(!(!a||a.nodeType===3||a.nodeType===8||!a.style)){var f,h=c.camelCase(b),l=a.style,k=c.cssHooks[h];b=c.cssProps[h]||h;if(d!==B){if(!(typeof d==="number"&&isNaN(d)||d==null)){if(typeof d==="number"&&!c.cssNumber[h])d+="px";if(!k||!("set"in k)||(d=k.set(a,d))!==B)try{l[b]=d}catch(o){}}}else{if(k&&"get"in k&&(f=k.get(a,false,e))!==B)return f;return l[b]}}},css:function(a,b,d){var e,f=c.camelCase(b),
h=c.cssHooks[f];b=c.cssProps[f]||f;if(h&&"get"in h&&(e=h.get(a,true,d))!==B)return e;else if(W)return W(a,b,f)},swap:function(a,b,d){var e={},f;for(f in b){e[f]=a.style[f];a.style[f]=b[f]}d.call(a);for(f in b)a.style[f]=e[f]},camelCase:function(a){return a.replace(hb,lb)}});c.curCSS=c.css;c.each(["height","width"],function(a,b){c.cssHooks[b]={get:function(d,e,f){var h;if(e){if(d.offsetWidth!==0)h=oa(d,b,f);else c.swap(d,kb,function(){h=oa(d,b,f)});if(h<=0){h=W(d,b,b);if(h==="0px"&&aa)h=aa(d,b,b);
if(h!=null)return h===""||h==="auto"?"0px":h}if(h<0||h==null){h=d.style[b];return h===""||h==="auto"?"0px":h}return typeof h==="string"?h:h+"px"}},set:function(d,e){if(Fa.test(e)){e=parseFloat(e);if(e>=0)return e+"px"}else return e}}});if(!c.support.opacity)c.cssHooks.opacity={get:function(a,b){return gb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var d=a.style;d.zoom=1;var e=c.isNaN(b)?"":"alpha(opacity="+b*100+")",f=
d.filter||"";d.filter=Ea.test(f)?f.replace(Ea,e):d.filter+" "+e}};if(t.defaultView&&t.defaultView.getComputedStyle)Ga=function(a,b,d){var e;d=d.replace(ib,"-$1").toLowerCase();if(!(b=a.ownerDocument.defaultView))return B;if(b=b.getComputedStyle(a,null)){e=b.getPropertyValue(d);if(e===""&&!c.contains(a.ownerDocument.documentElement,a))e=c.style(a,d)}return e};if(t.documentElement.currentStyle)aa=function(a,b){var d,e,f=a.currentStyle&&a.currentStyle[b],h=a.style;if(!Fa.test(f)&&jb.test(f)){d=h.left;
e=a.runtimeStyle.left;a.runtimeStyle.left=a.currentStyle.left;h.left=b==="fontSize"?"1em":f||0;f=h.pixelLeft+"px";h.left=d;a.runtimeStyle.left=e}return f===""?"auto":f};W=Ga||aa;if(c.expr&&c.expr.filters){c.expr.filters.hidden=function(a){var b=a.offsetHeight;return a.offsetWidth===0&&b===0||!c.support.reliableHiddenOffsets&&(a.style.display||c.css(a,"display"))==="none"};c.expr.filters.visible=function(a){return!c.expr.filters.hidden(a)}}var mb=c.now(),nb=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
ob=/^(?:select|textarea)/i,pb=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,qb=/^(?:GET|HEAD)$/,Ra=/\[\]$/,T=/\=\?(&|$)/,ja=/\?/,rb=/([?&])_=[^&]*/,sb=/^(\w+:)?\/\/([^\/?#]+)/,tb=/%20/g,ub=/#.*$/,Ha=c.fn.load;c.fn.extend({load:function(a,b,d){if(typeof a!=="string"&&Ha)return Ha.apply(this,arguments);else if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var f=a.slice(e,a.length);a=a.slice(0,e)}e="GET";if(b)if(c.isFunction(b)){d=b;b=null}else if(typeof b===
"object"){b=c.param(b,c.ajaxSettings.traditional);e="POST"}var h=this;c.ajax({url:a,type:e,dataType:"html",data:b,complete:function(l,k){if(k==="success"||k==="notmodified")h.html(f?c("<div>").append(l.responseText.replace(nb,"")).find(f):l.responseText);d&&h.each(d,[l.responseText,k,l])}});return this},serialize:function(){return c.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?c.makeArray(this.elements):this}).filter(function(){return this.name&&
!this.disabled&&(this.checked||ob.test(this.nodeName)||pb.test(this.type))}).map(function(a,b){var d=c(this).val();return d==null?null:c.isArray(d)?c.map(d,function(e){return{name:b.name,value:e}}):{name:b.name,value:d}}).get()}});c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){c.fn[b]=function(d){return this.bind(b,d)}});c.extend({get:function(a,b,d,e){if(c.isFunction(b)){e=e||d;d=b;b=null}return c.ajax({type:"GET",url:a,data:b,success:d,dataType:e})},
getScript:function(a,b){return c.get(a,null,b,"script")},getJSON:function(a,b,d){return c.get(a,b,d,"json")},post:function(a,b,d,e){if(c.isFunction(b)){e=e||d;d=b;b={}}return c.ajax({type:"POST",url:a,data:b,success:d,dataType:e})},ajaxSetup:function(a){c.extend(c.ajaxSettings,a)},ajaxSettings:{url:location.href,global:true,type:"GET",contentType:"application/x-www-form-urlencoded",processData:true,async:true,xhr:function(){return new E.XMLHttpRequest},accepts:{xml:"application/xml, text/xml",html:"text/html",
script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},ajax:function(a){var b=c.extend(true,{},c.ajaxSettings,a),d,e,f,h=b.type.toUpperCase(),l=qb.test(h);b.url=b.url.replace(ub,"");b.context=a&&a.context!=null?a.context:b;if(b.data&&b.processData&&typeof b.data!=="string")b.data=c.param(b.data,b.traditional);if(b.dataType==="jsonp"){if(h==="GET")T.test(b.url)||(b.url+=(ja.test(b.url)?"&":"?")+(b.jsonp||"callback")+"=?");else if(!b.data||
!T.test(b.data))b.data=(b.data?b.data+"&":"")+(b.jsonp||"callback")+"=?";b.dataType="json"}if(b.dataType==="json"&&(b.data&&T.test(b.data)||T.test(b.url))){d=b.jsonpCallback||"jsonp"+mb++;if(b.data)b.data=(b.data+"").replace(T,"="+d+"$1");b.url=b.url.replace(T,"="+d+"$1");b.dataType="script";var k=E[d];E[d]=function(m){if(c.isFunction(k))k(m);else{E[d]=B;try{delete E[d]}catch(p){}}f=m;c.handleSuccess(b,w,e,f);c.handleComplete(b,w,e,f);r&&r.removeChild(A)}}if(b.dataType==="script"&&b.cache===null)b.cache=
false;if(b.cache===false&&l){var o=c.now(),x=b.url.replace(rb,"$1_="+o);b.url=x+(x===b.url?(ja.test(b.url)?"&":"?")+"_="+o:"")}if(b.data&&l)b.url+=(ja.test(b.url)?"&":"?")+b.data;b.global&&c.active++===0&&c.event.trigger("ajaxStart");o=(o=sb.exec(b.url))&&(o[1]&&o[1].toLowerCase()!==location.protocol||o[2].toLowerCase()!==location.host);if(b.dataType==="script"&&h==="GET"&&o){var r=t.getElementsByTagName("head")[0]||t.documentElement,A=t.createElement("script");if(b.scriptCharset)A.charset=b.scriptCharset;
A.src=b.url;if(!d){var C=false;A.onload=A.onreadystatechange=function(){if(!C&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){C=true;c.handleSuccess(b,w,e,f);c.handleComplete(b,w,e,f);A.onload=A.onreadystatechange=null;r&&A.parentNode&&r.removeChild(A)}}}r.insertBefore(A,r.firstChild);return B}var J=false,w=b.xhr();if(w){b.username?w.open(h,b.url,b.async,b.username,b.password):w.open(h,b.url,b.async);try{if(b.data!=null&&!l||a&&a.contentType)w.setRequestHeader("Content-Type",
b.contentType);if(b.ifModified){c.lastModified[b.url]&&w.setRequestHeader("If-Modified-Since",c.lastModified[b.url]);c.etag[b.url]&&w.setRequestHeader("If-None-Match",c.etag[b.url])}o||w.setRequestHeader("X-Requested-With","XMLHttpRequest");w.setRequestHeader("Accept",b.dataType&&b.accepts[b.dataType]?b.accepts[b.dataType]+", */*; q=0.01":b.accepts._default)}catch(I){}if(b.beforeSend&&b.beforeSend.call(b.context,w,b)===false){b.global&&c.active--===1&&c.event.trigger("ajaxStop");w.abort();return false}b.global&&
c.triggerGlobal(b,"ajaxSend",[w,b]);var L=w.onreadystatechange=function(m){if(!w||w.readyState===0||m==="abort"){J||c.handleComplete(b,w,e,f);J=true;if(w)w.onreadystatechange=c.noop}else if(!J&&w&&(w.readyState===4||m==="timeout")){J=true;w.onreadystatechange=c.noop;e=m==="timeout"?"timeout":!c.httpSuccess(w)?"error":b.ifModified&&c.httpNotModified(w,b.url)?"notmodified":"success";var p;if(e==="success")try{f=c.httpData(w,b.dataType,b)}catch(q){e="parsererror";p=q}if(e==="success"||e==="notmodified")d||
c.handleSuccess(b,w,e,f);else c.handleError(b,w,e,p);d||c.handleComplete(b,w,e,f);m==="timeout"&&w.abort();if(b.async)w=null}};try{var g=w.abort;w.abort=function(){w&&Function.prototype.call.call(g,w);L("abort")}}catch(i){}b.async&&b.timeout>0&&setTimeout(function(){w&&!J&&L("timeout")},b.timeout);try{w.send(l||b.data==null?null:b.data)}catch(n){c.handleError(b,w,null,n);c.handleComplete(b,w,e,f)}b.async||L();return w}},param:function(a,b){var d=[],e=function(h,l){l=c.isFunction(l)?l():l;d[d.length]=
encodeURIComponent(h)+"="+encodeURIComponent(l)};if(b===B)b=c.ajaxSettings.traditional;if(c.isArray(a)||a.jquery)c.each(a,function(){e(this.name,this.value)});else for(var f in a)da(f,a[f],b,e);return d.join("&").replace(tb,"+")}});c.extend({active:0,lastModified:{},etag:{},handleError:function(a,b,d,e){a.error&&a.error.call(a.context,b,d,e);a.global&&c.triggerGlobal(a,"ajaxError",[b,a,e])},handleSuccess:function(a,b,d,e){a.success&&a.success.call(a.context,e,d,b);a.global&&c.triggerGlobal(a,"ajaxSuccess",
[b,a])},handleComplete:function(a,b,d){a.complete&&a.complete.call(a.context,b,d);a.global&&c.triggerGlobal(a,"ajaxComplete",[b,a]);a.global&&c.active--===1&&c.event.trigger("ajaxStop")},triggerGlobal:function(a,b,d){(a.context&&a.context.url==null?c(a.context):c.event).trigger(b,d)},httpSuccess:function(a){try{return!a.status&&location.protocol==="file:"||a.status>=200&&a.status<300||a.status===304||a.status===1223}catch(b){}return false},httpNotModified:function(a,b){var d=a.getResponseHeader("Last-Modified"),
e=a.getResponseHeader("Etag");if(d)c.lastModified[b]=d;if(e)c.etag[b]=e;return a.status===304},httpData:function(a,b,d){var e=a.getResponseHeader("content-type")||"",f=b==="xml"||!b&&e.indexOf("xml")>=0;a=f?a.responseXML:a.responseText;f&&a.documentElement.nodeName==="parsererror"&&c.error("parsererror");if(d&&d.dataFilter)a=d.dataFilter(a,b);if(typeof a==="string")if(b==="json"||!b&&e.indexOf("json")>=0)a=c.parseJSON(a);else if(b==="script"||!b&&e.indexOf("javascript")>=0)c.globalEval(a);return a}});
if(E.ActiveXObject)c.ajaxSettings.xhr=function(){if(E.location.protocol!=="file:")try{return new E.XMLHttpRequest}catch(a){}try{return new E.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}};c.support.ajax=!!c.ajaxSettings.xhr();var ea={},vb=/^(?:toggle|show|hide)$/,wb=/^([+\-]=)?([\d+.\-]+)(.*)$/,ba,pa=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];c.fn.extend({show:function(a,b,d){if(a||a===0)return this.animate(S("show",
3),a,b,d);else{d=0;for(var e=this.length;d<e;d++){a=this[d];b=a.style.display;if(!c.data(a,"olddisplay")&&b==="none")b=a.style.display="";b===""&&c.css(a,"display")==="none"&&c.data(a,"olddisplay",qa(a.nodeName))}for(d=0;d<e;d++){a=this[d];b=a.style.display;if(b===""||b==="none")a.style.display=c.data(a,"olddisplay")||""}return this}},hide:function(a,b,d){if(a||a===0)return this.animate(S("hide",3),a,b,d);else{a=0;for(b=this.length;a<b;a++){d=c.css(this[a],"display");d!=="none"&&c.data(this[a],"olddisplay",
d)}for(a=0;a<b;a++)this[a].style.display="none";return this}},_toggle:c.fn.toggle,toggle:function(a,b,d){var e=typeof a==="boolean";if(c.isFunction(a)&&c.isFunction(b))this._toggle.apply(this,arguments);else a==null||e?this.each(function(){var f=e?a:c(this).is(":hidden");c(this)[f?"show":"hide"]()}):this.animate(S("toggle",3),a,b,d);return this},fadeTo:function(a,b,d,e){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,d,e)},animate:function(a,b,d,e){var f=c.speed(b,
d,e);if(c.isEmptyObject(a))return this.each(f.complete);return this[f.queue===false?"each":"queue"](function(){var h=c.extend({},f),l,k=this.nodeType===1,o=k&&c(this).is(":hidden"),x=this;for(l in a){var r=c.camelCase(l);if(l!==r){a[r]=a[l];delete a[l];l=r}if(a[l]==="hide"&&o||a[l]==="show"&&!o)return h.complete.call(this);if(k&&(l==="height"||l==="width")){h.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY];if(c.css(this,"display")==="inline"&&c.css(this,"float")==="none")if(c.support.inlineBlockNeedsLayout)if(qa(this.nodeName)===
"inline")this.style.display="inline-block";else{this.style.display="inline";this.style.zoom=1}else this.style.display="inline-block"}if(c.isArray(a[l])){(h.specialEasing=h.specialEasing||{})[l]=a[l][1];a[l]=a[l][0]}}if(h.overflow!=null)this.style.overflow="hidden";h.curAnim=c.extend({},a);c.each(a,function(A,C){var J=new c.fx(x,h,A);if(vb.test(C))J[C==="toggle"?o?"show":"hide":C](a);else{var w=wb.exec(C),I=J.cur()||0;if(w){var L=parseFloat(w[2]),g=w[3]||"px";if(g!=="px"){c.style(x,A,(L||1)+g);I=(L||
1)/J.cur()*I;c.style(x,A,I+g)}if(w[1])L=(w[1]==="-="?-1:1)*L+I;J.custom(I,L,g)}else J.custom(I,C,"")}});return true})},stop:function(a,b){var d=c.timers;a&&this.queue([]);this.each(function(){for(var e=d.length-1;e>=0;e--)if(d[e].elem===this){b&&d[e](true);d.splice(e,1)}});b||this.dequeue();return this}});c.each({slideDown:S("show",1),slideUp:S("hide",1),slideToggle:S("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){c.fn[a]=function(d,e,f){return this.animate(b,
d,e,f)}});c.extend({speed:function(a,b,d){var e=a&&typeof a==="object"?c.extend({},a):{complete:d||!d&&b||c.isFunction(a)&&a,duration:a,easing:d&&b||b&&!c.isFunction(b)&&b};e.duration=c.fx.off?0:typeof e.duration==="number"?e.duration:e.duration in c.fx.speeds?c.fx.speeds[e.duration]:c.fx.speeds._default;e.old=e.complete;e.complete=function(){e.queue!==false&&c(this).dequeue();c.isFunction(e.old)&&e.old.call(this)};return e},easing:{linear:function(a,b,d,e){return d+e*a},swing:function(a,b,d,e){return(-Math.cos(a*
Math.PI)/2+0.5)*e+d}},timers:[],fx:function(a,b,d){this.options=b;this.elem=a;this.prop=d;if(!b.orig)b.orig={}}});c.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this);(c.fx.step[this.prop]||c.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a=parseFloat(c.css(this.elem,this.prop));return a&&a>-1E4?a:0},custom:function(a,b,d){function e(l){return f.step(l)}
var f=this,h=c.fx;this.startTime=c.now();this.start=a;this.end=b;this.unit=d||this.unit||"px";this.now=this.start;this.pos=this.state=0;e.elem=this.elem;if(e()&&c.timers.push(e)&&!ba)ba=setInterval(h.tick,h.interval)},show:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.show=true;this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur());c(this.elem).show()},hide:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.hide=true;
this.custom(this.cur(),0)},step:function(a){var b=c.now(),d=true;if(a||b>=this.options.duration+this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;for(var e in this.options.curAnim)if(this.options.curAnim[e]!==true)d=false;if(d){if(this.options.overflow!=null&&!c.support.shrinkWrapBlocks){var f=this.elem,h=this.options;c.each(["","X","Y"],function(k,o){f.style["overflow"+o]=h.overflow[k]})}this.options.hide&&c(this.elem).hide();if(this.options.hide||
this.options.show)for(var l in this.options.curAnim)c.style(this.elem,l,this.options.orig[l]);this.options.complete.call(this.elem)}return false}else{a=b-this.startTime;this.state=a/this.options.duration;b=this.options.easing||(c.easing.swing?"swing":"linear");this.pos=c.easing[this.options.specialEasing&&this.options.specialEasing[this.prop]||b](this.state,a,0,1,this.options.duration);this.now=this.start+(this.end-this.start)*this.pos;this.update()}return true}};c.extend(c.fx,{tick:function(){for(var a=
c.timers,b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||c.fx.stop()},interval:13,stop:function(){clearInterval(ba);ba=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){c.style(a.elem,"opacity",a.now)},_default:function(a){if(a.elem.style&&a.elem.style[a.prop]!=null)a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit;else a.elem[a.prop]=a.now}}});if(c.expr&&c.expr.filters)c.expr.filters.animated=function(a){return c.grep(c.timers,function(b){return a===
b.elem}).length};var xb=/^t(?:able|d|h)$/i,Ia=/^(?:body|html)$/i;c.fn.offset="getBoundingClientRect"in t.documentElement?function(a){var b=this[0],d;if(a)return this.each(function(l){c.offset.setOffset(this,a,l)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);try{d=b.getBoundingClientRect()}catch(e){}var f=b.ownerDocument,h=f.documentElement;if(!d||!c.contains(h,b))return d||{top:0,left:0};b=f.body;f=fa(f);return{top:d.top+(f.pageYOffset||c.support.boxModel&&
h.scrollTop||b.scrollTop)-(h.clientTop||b.clientTop||0),left:d.left+(f.pageXOffset||c.support.boxModel&&h.scrollLeft||b.scrollLeft)-(h.clientLeft||b.clientLeft||0)}}:function(a){var b=this[0];if(a)return this.each(function(x){c.offset.setOffset(this,a,x)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);c.offset.initialize();var d,e=b.offsetParent,f=b.ownerDocument,h=f.documentElement,l=f.body;d=(f=f.defaultView)?f.getComputedStyle(b,null):b.currentStyle;
for(var k=b.offsetTop,o=b.offsetLeft;(b=b.parentNode)&&b!==l&&b!==h;){if(c.offset.supportsFixedPosition&&d.position==="fixed")break;d=f?f.getComputedStyle(b,null):b.currentStyle;k-=b.scrollTop;o-=b.scrollLeft;if(b===e){k+=b.offsetTop;o+=b.offsetLeft;if(c.offset.doesNotAddBorder&&!(c.offset.doesAddBorderForTableAndCells&&xb.test(b.nodeName))){k+=parseFloat(d.borderTopWidth)||0;o+=parseFloat(d.borderLeftWidth)||0}e=b.offsetParent}if(c.offset.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"){k+=
parseFloat(d.borderTopWidth)||0;o+=parseFloat(d.borderLeftWidth)||0}d=d}if(d.position==="relative"||d.position==="static"){k+=l.offsetTop;o+=l.offsetLeft}if(c.offset.supportsFixedPosition&&d.position==="fixed"){k+=Math.max(h.scrollTop,l.scrollTop);o+=Math.max(h.scrollLeft,l.scrollLeft)}return{top:k,left:o}};c.offset={initialize:function(){var a=t.body,b=t.createElement("div"),d,e,f,h=parseFloat(c.css(a,"marginTop"))||0;c.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",
height:"1px",visibility:"hidden"});b.innerHTML="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";a.insertBefore(b,a.firstChild);d=b.firstChild;e=d.firstChild;f=d.nextSibling.firstChild.firstChild;this.doesNotAddBorder=e.offsetTop!==5;this.doesAddBorderForTableAndCells=
f.offsetTop===5;e.style.position="fixed";e.style.top="20px";this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15;e.style.position=e.style.top="";d.style.overflow="hidden";d.style.position="relative";this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5;this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==h;a.removeChild(b);c.offset.initialize=c.noop},bodyOffset:function(a){var b=a.offsetTop,d=a.offsetLeft;c.offset.initialize();if(c.offset.doesNotIncludeMarginInBodyOffset){b+=parseFloat(c.css(a,
"marginTop"))||0;d+=parseFloat(c.css(a,"marginLeft"))||0}return{top:b,left:d}},setOffset:function(a,b,d){var e=c.css(a,"position");if(e==="static")a.style.position="relative";var f=c(a),h=f.offset(),l=c.css(a,"top"),k=c.css(a,"left"),o=e==="absolute"&&c.inArray("auto",[l,k])>-1;e={};var x={};if(o)x=f.position();l=o?x.top:parseInt(l,10)||0;k=o?x.left:parseInt(k,10)||0;if(c.isFunction(b))b=b.call(a,d,h);if(b.top!=null)e.top=b.top-h.top+l;if(b.left!=null)e.left=b.left-h.left+k;"using"in b?b.using.call(a,
e):f.css(e)}};c.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),d=this.offset(),e=Ia.test(b[0].nodeName)?{top:0,left:0}:b.offset();d.top-=parseFloat(c.css(a,"marginTop"))||0;d.left-=parseFloat(c.css(a,"marginLeft"))||0;e.top+=parseFloat(c.css(b[0],"borderTopWidth"))||0;e.left+=parseFloat(c.css(b[0],"borderLeftWidth"))||0;return{top:d.top-e.top,left:d.left-e.left}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||t.body;a&&!Ia.test(a.nodeName)&&
c.css(a,"position")==="static";)a=a.offsetParent;return a})}});c.each(["Left","Top"],function(a,b){var d="scroll"+b;c.fn[d]=function(e){var f=this[0],h;if(!f)return null;if(e!==B)return this.each(function(){if(h=fa(this))h.scrollTo(!a?e:c(h).scrollLeft(),a?e:c(h).scrollTop());else this[d]=e});else return(h=fa(f))?"pageXOffset"in h?h[a?"pageYOffset":"pageXOffset"]:c.support.boxModel&&h.document.documentElement[d]||h.document.body[d]:f[d]}});c.each(["Height","Width"],function(a,b){var d=b.toLowerCase();
c.fn["inner"+b]=function(){return this[0]?parseFloat(c.css(this[0],d,"padding")):null};c.fn["outer"+b]=function(e){return this[0]?parseFloat(c.css(this[0],d,e?"margin":"border")):null};c.fn[d]=function(e){var f=this[0];if(!f)return e==null?null:this;if(c.isFunction(e))return this.each(function(l){var k=c(this);k[d](e.call(this,l,k[d]()))});if(c.isWindow(f))return f.document.compatMode==="CSS1Compat"&&f.document.documentElement["client"+b]||f.document.body["client"+b];else if(f.nodeType===9)return Math.max(f.documentElement["client"+
b],f.body["scroll"+b],f.documentElement["scroll"+b],f.body["offset"+b],f.documentElement["offset"+b]);else if(e===B){f=c.css(f,d);var h=parseFloat(f);return c.isNaN(h)?f:h}else return this.css(d,typeof e==="string"?e:e+"px")}})})(window);
	
	/**
	 * jQuery BASE64 functions
	 * 
	 * 	<code>
	 * 		Encodes the given data with base64. 
	 * 		String $.base64Encode ( String str )
	 *		<br />
	 * 		Decodes a base64 encoded data.
	 * 		String $.base64Decode ( String str )
	 * 	</code>
	 * 
	 * Encodes and Decodes the given data in base64.
	 * This encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean, such as mail bodies.
	 * Base64-encoded data takes about 33% more space than the original data. 
	 * This javascript code is used to encode / decode data using base64 (this encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean). Script is fully compatible with UTF-8 encoding. You can use base64 encoded data as simple encryption mechanism.
	 * If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag). 
	 * This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
	 * 
	 * Example
	 * 	Code
	 * 		<code>
	 * 			$.base64Encode("I'm Persian."); 
	 * 		</code>
	 * 	Result
	 * 		<code>
	 * 			"SSdtIFBlcnNpYW4u"
	 * 		</code>
	 * 	Code
	 * 		<code>
	 * 			$.base64Decode("SSdtIFBlcnNpYW4u");
	 * 		</code>
	 * 	Result
	 * 		<code>
	 * 			"I'm Persian."
	 * 		</code>
	 * 
	 * @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
	 * @link http://www.semnanweb.com/jquery-plugin/base64.html
	 * @see http://www.webtoolkit.info/
	 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
	 * @param {jQuery} {base64Encode:function(input))
	 * @param {jQuery} {base64Decode:function(input))
	 * @return string
	 */
	
	(function($){
		
		var keyString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		
		var uTF8Encode = function(string) {
			string = string.replace(/\x0d\x0a/g, "\x0a");
			var output = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					output += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					output += String.fromCharCode((c >> 6) | 192);
					output += String.fromCharCode((c & 63) | 128);
				} else {
					output += String.fromCharCode((c >> 12) | 224);
					output += String.fromCharCode(((c >> 6) & 63) | 128);
					output += String.fromCharCode((c & 63) | 128);
				}
			}
			return output;
		};
		
		var uTF8Decode = function(input) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while ( i < input.length ) {
				c = input.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if ((c > 191) && (c < 224)) {
					c2 = input.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = input.charCodeAt(i+1);
					c3 = input.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
		
		$.extend({
			base64Encode: function(input) {
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;
				input = uTF8Encode(input);
				while (i < input.length) {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output = output + keyString.charAt(enc1) + keyString.charAt(enc2) + keyString.charAt(enc3) + keyString.charAt(enc4);
				}
				return output;
			},
			base64Decode: function(input) {
				var output = "";
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				while (i < input.length) {
					enc1 = keyString.indexOf(input.charAt(i++));
					enc2 = keyString.indexOf(input.charAt(i++));
					enc3 = keyString.indexOf(input.charAt(i++));
					enc4 = keyString.indexOf(input.charAt(i++));
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					output = output + String.fromCharCode(chr1);
					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}
				}
				output = uTF8Decode(output);
				return output;
			}
		});
	})(jQuery);/*
 * history 1.0 - Plugin for jQuery
 *
 *
 * IE8 is supporting onhashchange event
 * http://msdn.microsoft.com/en-us/library/cc288209(VS.85).aspx
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *   jquery.js
 *
 *  Copyright (c) 2008 Oleg Slobodskoi (ajaxsoft.de)
 */

;(function($){


$.fn.history = function( option ) {
    var    args = Array.prototype.slice.call(arguments, 1);
    return this.each(function() {
        var instance = $.data(window, 'history') || $.data( window, 'history', new hist()).init();

        typeof option == 'string' ? instance[option].apply( this, args ) : instance.bind(this, option);
    });

};

function hist() {
    var self = this,
        IE67 = $.browser.msie && parseInt($.browser.version) < 8 ? true : false,
        IE8 = $.browser.msie && parseInt($.browser.version) >= 8 ? true : false,
        $iframe,
        $listeners,
        interval;
	var gHash = null;
	var giHash = null;

    this.init = function() {
        if ( IE67 ) $iframe = $('<iframe style="display: none;" class="x-history-iframe" src="PortalIs/Blank" />').appendTo(document.body);

        self.value = top.location.hash.replace('#','');

        if ( IE67 ) {
            checkIFrame();
        } else  if ( !IE8 ){
            gHash = top.location.hash;
            interval = setInterval(function() {
                var newHash = top.location.hash;
                if (newHash !== gHash) {
                    gHash = newHash;
                    change(gHash);
                };
            }, 50);
        };
        return self;
    };

    this.bind = function(elem, callback) {
        $listeners = !$listeners ?  $(elem) : $listeners.add(elem);
        $(elem).bind('hashchange', IE8 ? function(e){
            change(top.location.hash);
            callback.apply(elem, [$.Event(e), self]);
        } : callback );
    };

    this.unbind = function() {
        delete $listeners[$listeners.index(this)];
        $(this).unbind('hashchange');
    };

    this.add = function( value, params ) {
        self.params = params;
        top.location.hash = value;
		gHash = value;
        IE67 && updateIFrame(value)
        change(value);
    };

    this.forward = function() {
        history.go(1);
    };

    this.back = function() {
        history.go(-1);
    };


    this.destroy = function() {
        clearInterval(interval);
        $iframe && $iframe.remove();
        $listeners.unbind('hashchange');
        $.removeData(window, 'history');
    };


    function checkIFrame()
    {
        giHash = iDoc().location.hash;
        gHash = top.location.hash;

        interval = setInterval(function () {
            var newiHash = iDoc().location.hash,
                newHash = top.location.hash;

            if (newiHash !== giHash)
			{
                giHash = newiHash;
                change(giHash);
                top.location.hash = giHash;
                gHash = giHash;
            } else if (newHash !== gHash) {
                gHash = newHash;
                updateIFrame(newHash);
            }

        }, 50);

    };

    function change(value) {
        self.value = value.replace('#','');
        !IE8 && $.event.trigger('hashchange', [self]);
    };

    function updateIFrame(value) {
        iDoc().open();
        iDoc().close();
		giHash = value;
		gHash = value;
        iDoc().location.hash = value;
    };

    function iDoc() {
        return $iframe[0].contentWindow.document;
    };

};


})(jQuery);
window.WEBAPP_NAME = PORTAL_IS.CONF.WEBAPP_NAME;
window.ACTION_EXT = '';
window.DEFAULT_DATE_FORMAT = "d/m/y";
// TODO:This should be replaced with ResourceType
//=============================================================================================
window.__AppType = function() // DEPRECATED.
{
	this.FILE 	= 0;
	this.WEB 	= 1;
	this.MAIL 	= 2;
}
//=============================================================================================


// Resource types - enumeration.
//=============================================================================================
window.__ResourceType = function()
{
	// Todo: Match this enum with the backend's.
	this.UNKNOWN    = 0;
	this.FILE       = 1;
	this.WEB        = 2;
	this.MAIL       = 3;
	this.NATIVE     = 4;
	this.CITRIX     = 5;
	this.DIVIDER    = 6;
}
//=============================================================================================


//=============================================================================================
window.__ActionType = function()
{
	this.ADD 	= 0;
	this.EDIT 	= 1;
	this.DELETE	= 2;
}
//=============================================================================================


//=============================================================================================
window.Realm = function()
{

    m_name		                  = null;
	m_displayName	              = null;
	m_type	                      = null;
	m_authnInstructionMessageId	  = null;
	m_authnInstructionMessage	  = null;
}
//=============================================================================================


//=============================================================================================
window.__BrowserType = function()
{
	this.UNKNOWN	= 0;
	this.IE 		= 1;
	this.FIREFOX 	= 2;
	this.SAFARI		= 3;
	this.OPERA 		= 4;
	this.SCM 		= 5; // Secure Client Mobile.
	this.CHROME     = 6;
	// TODO: Check for other browser types.
}
//=============================================================================================


//=============================================================================================
window.__OSType = function()
{
	this.UNKNOWN	= 0;
	this.WIN_XP 	= 1;
	this.WIN_VISTA 	= 2;
	this.OTHER_WIN  = 3;
	this.MAC		= 4;
	this.LINUX      = 5;
	this.MOBILE		= 6; // TODO: Make this more granular.
}
//=============================================================================================


// Browser detection.
//=============================================================================================
window.BrowserDetails = function()
{
	this.browserType;
	this.browserVersion;
	this.osType;
	this.isJavaSupported;

	this.init = function()
	{
		this.browserType 		= this.detectBrowserType();
		this.browserVersion     = this.detectBrowserVersion();
		this.osType				= this.detectOSType();
		this.isJavaSupported	= this.detectJavaSupport();
	}

	this.isMobile = function()
	{
		var userAgent = window.navigator.userAgent.toLowerCase();
		
		return (userAgent.indexOf("ipod") >=0 || userAgent.indexOf("iphone") >=0 || userAgent.indexOf("android") >=0 || userAgent.indexOf("windows phone") >=0);
	}

	this.detectBrowserType = function()
	{
		//TODO: Recheck implementation.
		var browserType = BrowserType.UNKNOWN;

        var userAgent = window.navigator.userAgent;

		if(userAgent.indexOf("MSIE ") >= 0)
		{
			browserType = BrowserType.IE; // If Internet Explorer version 4.7 or higher set IE.
		}
		else if(userAgent.indexOf("Firefox") >= 0)
		{
			browserType = BrowserType.FIREFOX;
		}
		else if(userAgent.indexOf("Chrome") >= 0)
		{
			browserType = BrowserType.CHROME;
		}
		else if(userAgent.indexOf("Opera") >= 0)
		{
			browserType = BrowserType.OPERA;
		}
		else if(userAgent.indexOf("Safari") >= 0 && userAgent.indexOf("Chrome") < 0)
		{
			browserType = BrowserType.SAFARI;
		}

		return browserType;
	}

	this.detectBrowserVersion = function()
	{
		var version = 0.0;
		var userAgent = window.navigator.userAgent;
		
		switch(this.browserType)
		{
			case BrowserType.IE:
				version = parseFloat(userAgent.match(/MSIE ([0-9]+\.[0-9]*)/)[1]);
			break;
			case BrowserType.FIREFOX:
				version = parseFloat(userAgent.match(/Firefox\/([0-9]+(\.[0-9]*)?)/)[1]);
			break;
			case BrowserType.CHROME:
				version = parseFloat(userAgent.match(/Chrome\/([0-9]+(\.[0-9]*)?)/)[1]);
			break;
			case BrowserType.OPERA:
				version = parseFloat(userAgent.match(/Opera\/([0-9]+(\.[0-9]*)?)/)[1]);
			break;
			case BrowserType.SAFARI:
				version = parseFloat(userAgent.match(/Version\/([0-9]+(\.[0-9]*)?)/)[1]);
			break;
		}
		return version;
	}

	this.detectOSType = function()
	{
		//TODO: Implement.
		return OSType.WIN_XP;
	}

	this.detectJavaSupport = function()
	{
		//TODO: Implement.
		return true;
	}

	this.isWinOS = function()
	{
		var isWinOS = false;
		
		if (    (this.osType == OSType.WIN_XP)
			||  (this.osType == OSType.WIN_VISTA)
			||  (this.osType == OSType.OTHER_WIN) )
		{
			isWinOS = true;
		}

		return isWinOS;

	}
	
	this.isPngSupported = function()
	{
		return (this.detectBrowserType() != BrowserType.IE || this.detectBrowserVersion() > 6);
	}

	// Try to detect
	this.isFirebugAvailable = function()
	{
		var isFirebugAvailable = false;
		try
		{
			isFirebugAvailable = ( (this.detectBrowserType() == BrowserType.FIREFOX) && (window.console) && (window.console.firebug != '') );
		}
		catch(e)
		{
			// Do nothing.
		}

		return isFirebugAvailable;
	}
}
//=============================================================================================


// Portal status.
//=============================================================================================
window.PortalStatus = function()
{
    this.css        = '';
    this.script     = '';
    this.content    = '';
    // TODO: Consider providing filenames to be loaded by the client side instead of server side inclusion.
}
//=============================================================================================


//=============================================================================================
// Callback object.
window.Callback = function(copyCallback)
{
    // "Copy constructor" of callback.
	if (copyCallback != undefined)
	{
		copyCallbcak = new Callback()
		copyCallbcak.callbackId         = callback.callbackId;
		copyCallbcak.methodReference    = callback.methodReference;
		copyCallbcak.thisArgument       = callback.thisArgument;
		copyCallbcak.args               = callback.args;
		return copyCallback;
	}

	this.callbackId         = "";   // A unique identifier of the callback. This is the ID
									// by which the callback will be called.

	this.methodReference    = null; // The required method reference to be invoked.

	this.thisArgument       = null;   // Optional: An extra argrument to hold the "this" reference
									  // of the method.
									  // Please read about JavaScript Call() and Apply() for more information.

	this.args               = new Array();

	this.call = function()
	{
		if (this.methodReference != null)
		{
			try
			{
				this.methodReference.apply(this.thisArgument, this.args);
			}
			catch(e)
			{
				DEBUG.out("Callback call failed.", DEBUG.ERROR,  e);
			}
		}
	}
}
//=============================================================================================



//=============================================================================================

window.__PortalErrorType = function()
{
    this.GENERAL	= 0;
    this.NETWORK_TIMEOUT 	= 1;
	this.LOGOUT	= 3; //logout when user confirms the error message
}


// PortalException object.
window.PortalException = function()
{
	this.status 	= -1;
	this.errMsg 	= "";
	this.logRefId 	= -1;
	this.portalErrorType = PortalErrorType.GENERAL;
}
//=============================================================================================


window.AppType 	        = new __AppType();// DEPRECATED
window.ResourceType	    = new __ResourceType();
window.ActionType 	    = new __ActionType();
window.BrowserType      = new __BrowserType();
window.OSType 		    = new __OSType();
window.PortalErrorType  = new __PortalErrorType();

window.browserDetails 	= new BrowserDetails();
browserDetails.init();


// Set namespace.
__AJAX_MGR = function()
{
	this.customTimeoutHandler = null;

   	//=============================================================================================
	this.getXmlHttpObject = function()
	{
		var xhr;
		if (window.XMLHttpRequest) // (Native XMLHTTPRequest) IE7, Mozilla, Safari, ...
		{
			xhr = new XMLHttpRequest();
			if (xhr.overrideMimeType)
			{
				// set type accordingly to anticipated content type
				xhr.overrideMimeType('text/html');
			}
		}
		else if (window.ActiveXObject) // IE6.x (and below)
		{
			try
			{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e)
			{
				try
				{
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e)
				{
					//DEBUG.out("Cannot create XMLHTTP instance.", DEBUG.ERROR, e);
				}
			}
		}

		if (!xhr)
		{
			return null;
		}

		return xhr;
	}
	//=============================================================================================

	//=============================================================================================
	this.sendAsyncReq = function(url, parameters, callback, errorHandler, timeoutHandler, defaultErrorMsg, method, contentType)
	{
		DEBUG.out('PORTAL_IS.AJAX_MGR.sendAsyncReq: pinging timeout managers.');
	
		//First things first, notifying timeout managers.
		if (typeof PORTAL_IS.TOOLS.notifiedTimeoutManagerPool !== 'undefined')
		{
			for (i = 0; i < PORTAL_IS.TOOLS.notifiedTimeoutManagerPool.length; i++)
			{
				var timeoutManager = PORTAL_IS.TOOLS.notifiedTimeoutManagerPool[i];
				
				timeoutManager.notifyNetworkActivity();
			}
		}
	
	
	
	
		DEBUG.out('PORTAL_IS.AJAX_MGR.sendAsyncReq: Submitting form asynchronous, URL:'+url);

		var isTimedOut = false;

		// Input validations and setting defaults.
		if (isNothingness(parameters))
		{
			parameters = '';
		}

		if (isNothingness(callback))
		{
			callback = new Callback();
		}

		if (isNothingness(errorHandler))
		{
			errorHandler = genericErrorHandler;
		}

		if (isNothingness(timeoutHandler))
		{
			timeoutHandler = genericTimeoutHandler;
		}

		if (isNothingness(method))
		{
			method = "POST";
		}

		if (isNothingness(contentType))
		{
			contentType = "application/x-www-form-urlencoded";
		}

		// Set Ajax object.
		var xhr = this.getXmlHttpObject();
        if (isNothingness(xhr))
        {
            checkError(xhr, errorHandler, timeoutHandler);
        	return;
		}

		// Set headers.
		xhr.open(method, url, true);
		xhr.setRequestHeader("Content-type", contentType);
		xhr.setRequestHeader("Content-length", parameters.length);
		xhr.setRequestHeader("Connection", "close");

        // Timeout vars.
        var reqTimeout, preTimeout;

        //.........................................................................................
		// In some cases (FF+FireBug bugs) ready state change function is not being called so we're getting false timeouts.
		// In order to detect these false timeouts we schedule a check much earlier than the timout value.
		preemptiveTimeout = function()
		{
			if (xhr.readyState == 4)
			{
				DEBUG.out('[preemptiveTimeout] Try to resume normal flow.', DEBUG.ERROR);

				// Check for errors.
				checkError(xhr, errorHandler, timeoutHandler);

				// Cleartimeouts.
				clearTimeout(reqTimeout);
				clearTimeout(preTimeout);

				// Concatenate the request's status and response.
				callback.args = [xhr.status, xhr.responseText].concat(callback.args);

				// Call to callback method.
				callback.call();
            	return true;
			}
			return true;
		}
        //.........................................................................................

        //.........................................................................................
		// This function will be called after an amount of time considered as timeout.
		// Checks if not false timeout (see preemptiveTimeout() for details).
		handleTimeout = function()
		{
			DEBUG.out('[handleTimeout] ReadyState:' + xhr.readyState, DEBUG.ERROR);
			// Check is we got here while the request has already arrived.
			// Seen somtimes that the onreadystatechange function is not being called. So we check for ourselves.
            if (xhr.readyState == 4)
			{
				DEBUG.out('[handleTimeout - timeout with state == 4] Try to resume normal flow.', DEBUG.ERROR);

				// Check for errors.
				checkError(xhr, errorHandler, timeoutHandler);

				// Cleartimeouts.
				if (browserDetails.isFirebugAvailable())
				{
					clearTimeout(preTimeout);
				}

				clearTimeout(reqTimeout);
				
				DEBUG.out('PORTAL_IS.AJAX_MGR.sendAsyncReq: Timeout ('+reqTimeout+') cleared for URL:' + url);

				// Concatenate the request's status and response.
				callback.args = [xhr.status, xhr.responseText].concat(callback.args);

				// Call to callback method.
				callback.call();
				
            	return;
			}

			isTimedOut = true;
			DEBUG.out('[handleTimeout] Ajax request timeout detected. Aborting request for URL:' + url, DEBUG.ERROR);
			xhr.abort();

			// Cleartimeouts.
            DEBUG.out('[handleTimeout] PORTAL_IS.AJAX_MGR.sendAsyncReq: Timeout ('+reqTimeout+') cleared for URL:' + url, DEBUG.ERROR);
			clearTimeout(reqTimeout);
			
			// Cleartimeouts.
			if (browserDetails.isFirebugAvailable())
			{
				clearTimeout(preTimeout);
			}

			var portalException = new PortalException();
			portalException.portalErrorType = PortalErrorType.NETWORK_TIMEOUT;
			portalException.errMsg = "Network communication error.";
			portalException.errMsg += ( isNothingness(defaultErrorMsg) ? "" : "\n" + defaultErrorMsg );			

			errorHandler(portalException, callback);
		}
        //.........................................................................................


        //.........................................................................................
		// Async Ajax impel.
		xhr.onreadystatechange=function()
		{
			DEBUG.out('XmlHttpRequest::onreadystatechange [xhr.readyState = ' + xhr.readyState + '] for url:' + url);

			if (isTimedOut)
			{
				DEBUG.out('XmlHttpRequest::onreadystatechange [xhr.readyState = ' + xhr.readyState + '] for url:' + url + 'Already timed out. Stop flow.');
				return;
			}

			switch (xhr.readyState)
			{
				case 1: // (Open) Response is ready.				

					// Set timeouts.
					if(this.customTimeoutHandler == null)
					{
						reqTimeout = setTimeout(handleTimeout, PORTAL_IS.CONF.AJAX_REQ_TIMEOUT);
					}
					else
					{
						// If there is a custom timeout handler defined, use it.
						reqTimeout = setTimeout(customTimeoutHandler, PORTAL_IS.CONF.AJAX_REQ_TIMEOUT);
					}

                	// Clear timeouts.
					if (browserDetails.isFirebugAvailable())
					{
						preTimeout = setTimeout(preemptiveTimeout, Math.ceil(PORTAL_IS.CONF.AJAX_REQ_TIMEOUT/10));
					}                	
                	
                	DEBUG.out('PORTAL_IS.AJAX_MGR.sendAsyncReq: Timeout ('+reqTimeout+') set for URL:' + url);
				break;

				case 4: // (Loaded) Response is ready.
				    // Cleartimeouts.
					clearTimeout(reqTimeout);

					if (browserDetails.isFirebugAvailable())
					{
						clearTimeout(preTimeout);
					}

					// Check for errors.
					checkError(xhr, errorHandler, timeoutHandler);

					DEBUG.out('PORTAL_IS.AJAX_MGR.sendAsyncReq: Timeout ('+reqTimeout+') cleared for URL:' + url);
					
					// Concatenate the request's status and response.
					callback.args = [xhr.status, xhr.responseText].concat(callback.args);

					// Call to callback method.
					callback.call();
					
				break;

				default:
					// Do nothing.
				break;
			}
		}
        //.........................................................................................

        // Send the request.
		xhr.send(parameters);
	}
	//=============================================================================================
}


PORTAL_IS.AJAX_MGR = new __AJAX_MGR();




// Set namespace.
window.PORTAL_IS.TOOLS = {}

// Debug object.
//=============================================================================================
function __Debug()
{
	// Debug levels.
	this.INFORMATIVE	= 10;
	this.WARNING 		= 20;
    this.ERROR 			= 50;
    this.DEBUG			= 70;
    this.OFF			= 100;

    // Maximum size of log stack.
    this.MAX_STACK_SIZE = PORTAL_IS.CONF.MAX_STACK_SIZE;

	// Collect debug output without creating a window or printing it.
	this.QUIET_MODE = PORTAL_IS.CONF.QUIET_MODE
	
    this.DEBUG_LEVEL = PORTAL_IS.CONF.DEBUG_LEVEL;
    this.DEBUG_DEFUALT 	= this.INFORMATIVE;

    this.debugWindow		= null;
    this.debugConsoleDiv	= null;
    this.debugBuffer		= "";
    this.debugLine			= 0;
    this.debugStack			= new Array();
    this.dumpped			= false;

    // The debug window (console-like).
	this.out = function (msg, type, exception)
	{
		if ((type == undefined) || (type == null))
		{
			type = this.DEBUG_DEFUALT;
		}

        if (type >=  this.DEBUG_LEVEL)
		{		
			// create a log entety.
			var logEnt = new DebugLogEntety();
			logEnt.msg			= msg;
			logEnt.type			= type;
			logEnt.exception	= exception;
			logEnt.time			= new Date();			

			// Remove first elements as long as the stack is not smaller than it's max size.
			while (this.debugStack.length >= this.MAX_STACK_SIZE)
			{
				this.debugStack.shift();
			}

			this.debugStack.push(logEnt);

			// If quiet mode is off, and the debug window is available, print to debug window.
			if ((!this.QUIET_MODE) && (this.debugWindow != null) && (this.debugConsoleDiv != null))
			{
				this.debugConsoleDiv.innerHTML += this.formatMessage(logEnt);				
			}
		}
	}


	this.init = function()
	{
        var windowParams = "";

        if ((this.DEBUG_LEVEL < this.OFF) && (!this.QUIET_MODE))
        {
            this.debugWindow = window.open(getURL("js/Debug"), "Debug", windowParams);

            if ((this.debugWindow == false)||(this.debugWindow == undefined)||(this.debugWindow == null))
            {
                DEBUG.out('Cannot locate debug window.', DEBUG.ERROR);
            }
            else
            {
				try
				{
					this.debugConsoleDiv = this.debugWindow.document.getElementById('debugConsoleDiv');
				}
				catch(e)
				{
					this.debugConsoleDiv = null;
				}
            }
        }
	}


	this.dump = function()
	{
		this.QUIET_MODE = false; 			// Turn quiet mode off.
		this.init();						// Create window and HTML elements.
		var userDetails = "";
		userDetails += "<b>User Details</b><br>_______________________________________________________________________________________________________________<br>";
		userDetails += "<b>User Agent</b>: <i>" 		+ navigator.userAgent 		+ "</i><br>";
		userDetails += "<b>Platform</b>: <i>" 			+ navigator.platform 		+ "</i><br>";
		userDetails += "<b>Browser Language</b>: <i>" 	+ navigator.browserLanguage + "</i><br>";
		userDetails += "<b>User Language</b>: <i>" 		+ navigator.userLanguage 	+ "</i><br>";
		userDetails += "<b>Window Location</b>: <i>" 	+ window.location 			+ "</i><br>";
		userDetails += "<b>Cookies</b>: <i>" 			+ document.cookie 			+ "</i><br>";
        userDetails += "_______________________________________________________________________________________________________________<br>";
        userDetails += "Debug output dumped.<br>"+userDetails;
        this.out(userDetails);
		setTimeout("alert('Debug output dumped.');DEBUG.actualDump()", 5);	// Must output somthing in order for the buffer to be dumped to window.
	}


	this.actualDump = function()
	{
		var i=0;
		try
		{
			for (i=0; i<this.debugStack.length; i++)
			{
				if (!isNothingness(this.debugStack[i]))
				{
					this.debugConsoleDiv.innerHTML += this.formatMessage(this.debugStack[i]);
				}
			}
		}
		catch(e)
		{
			setTimeout("DEBUG.actualDump();", 5);
		}
	}



	this.formatMessage = function(logEnt, useHTMLFormat)
	{
		useHTMLFormat = useHTMLFormat != false; // Make true default.
		var output="";
		//var date = new Date();

		if (useHTMLFormat)
		{
			output += 	'<div class="'+( ( (this.debugLine++) % 2 == 0 ) ? 'debug_even_line':'debug_odd_line')+'">';

			// Output line number and timestamp.
			output +=		'[<i>' + logEnt.time.getHours() + ':' + logEnt.time.getMinutes() + ':' + logEnt.time.getSeconds() + '.' + logEnt.time.getMilliseconds() + '</i>]';
			output +=		'&nbsp;&nbsp;&nbsp;';

			// Output message acording to it's type.
			switch (logEnt.type)
			{
				case this.ERROR:
					output += '<span class="debug_error">'+logEnt.msg;
					if ((logEnt.exception != undefined) && (logEnt.exception != null))
					{
						if (logEnt.exception.description != undefined)
						{output += '<br><i><b>description:</b>'+logEnt.exception.description+'</i>';}

						if (logEnt.exception.message != undefined)
						{output += '<br><i><b>message:</b>'+logEnt.exception.message+'</i>';}

						if ((logEnt.exception.filename != undefined) && (logEnt.exception.lineNumber != undefined))
						{output += '<br><i><b>line #:</b>'+logEnt.exception.lineNumber+'<b> at </b>'+logEnt.exception.filename+'</i>';}

						// TODO: Add stack trace print.
					}
					output += '</span>';
				break;

				default:
					output += logEnt.msg;
				break;
			}

			output +=	'</div>';
		}
		else // if (useHTMLFormat)
		{
        	// Output line number and timestamp.
			output +=		'[' + logEnt.time.getHours() + ':' + logEnt.time.getMinutes() + ':' + logEnt.time.getSeconds() + '.' + logEnt.time.getMilliseconds() + ']  ';

			// Output message acording to it's type.
			switch (logEnt.type)
			{
				case this.ERROR:
					output += '[ERROR]'+logEnt.msg;
					if ((logEnt.exception != undefined) && (logEnt.exception != null))
					{
						if (logEnt.exception.description != undefined)
						{output += '\nDescription: '+logEnt.exception.description;}

						if (logEnt.exception.message != undefined)
						{output += '\nMessage:'+logEnt.exception.message;}

						if ((logEnt.exception.filename != undefined) && (logEnt.exception.lineNumber != undefined))
						{output += '\nLine #:'+logEnt.exception.lineNumber+' at '+logEnt.exception.filename;}

						// TODO: Add stack trace print.
					}
				break;

				default:
					output += logEnt.msg;
				break;
			}
		}

		return output;
	}


	// Check if debug is on or not (quietMode is considered on).
	// Returns true if debug is no or false otherwise.
	this.isActive = function()
	{
		var isActive = false;
	 	if ((this.DEBUG_LEVEL < this.OFF) && (!this.QUIET_MODE))
	 	{
			isActive = true;
		}

		return isActive;
	}


	// Send client error report to the server (sends the client denug logs).
	// Note that this may not send the report immidiatly but ask the user for confirmation and other
	// information.
	// This is an empty method and should be overridden by each portal.
	// Params:
	// callback		- Callback to be called post the error reporting.
	this.sendErrorReport = function(callback)
	{
		// Override me.
		DEBUG.out("DEBUG.sendErrorReport was not overridden, empty implementation os used.", DEBUG.ERROR);
	}


	this.showErrorReport = function(callback)
	{
		// Override me.
		DEBUG.out("DEBUG.showErrorReport was not overridden, empty implementation os used.", DEBUG.ERROR);
	}


	this.compileErrorReport = function()
	{
		var errorReport = ""

		var userDetails = "";
		userDetails += "User Details_______________________________________________________________________________________________________________\n";
		userDetails += "User Agent: " 			+ navigator.userAgent + "\n";
		userDetails += "Platform: " 			+ navigator.platform + "\n";
		userDetails += "Browser Language: " 	+ navigator.browserLanguage + "\n";
		userDetails += "User Language: " 		+ navigator.userLanguage + "\n";
		userDetails += "Window Location: " 		+ window.location + "\n";
		userDetails += "Cookies: " 				+ document.cookie + "\n";
        userDetails += "_______________________________________________________________________________________________________________\n";

        errorReport += "CLIENT REPORT - START _______________________________________________________________________________________________________________\n";
        errorReport += userDetails;

		try
		{
			for (i=0; i<this.debugStack.length; i++)
			{
				if (!isNothingness(this.debugStack[i]))
				{
					errorReport += this.formatMessage(this.debugStack[i], false) + "\n";
				}
			}
		}
		catch(e){}

		errorReport += "CLIENT REPORT - END _______________________________________________________________________________________________________________\n\n";

		return errorReport;
	}
}
//=============================================================================================


// Debug log entety.
//=============================================================================================
window.DebugLogEntety = function()
{
	this.msg		= "";
	this.type		= DEBUG.INFORMATIVE;
	this.exception	= null;
	this.time		= null;
}
//=============================================================================================


// Action response object.
//=============================================================================================
function ActionResponse()
{
	this.context;
	this.type;
	this.message;
	this.opaque;
	this.nextStateId;
}
//=============================================================================================


// Dynamically load JavaScript file.
// param: sFileName <String>	- Script name to be loaded, just the name, no path or extensions.
//								  Example: loadScriptFile("Credentials");
//=============================================================================================
function loadScriptFile(sFileName, errorHandler, timeoutHandler)
{
	var sAbsoluteScriptFile = getURL("js/"+sFileName);
	loadScriptFileFromAbsoluteUrl(sAbsoluteScriptFile);
}

function loadScriptFileFromAbsoluteUrl (sAbsoluteScriptFile, errorHandler, timeoutHandler)
{
	DEBUG.out('Dynamically load script: '+sAbsoluteScriptFile);
	var ajx = GetXmlHttpObject();
	ajx.open("GET", sAbsoluteScriptFile, false); // false=synch
	ajx.send(null);
    // Check for errors.
	checkError(ajx, errorHandler, timeoutHandler);

	if (ajx.status == 200)
	{
    	var newScript = ajx.responseText;
    	//DEBUG.out("Received:\n<hr>"+newScript+"<hr>");
    	try{
        	window.eval(newScript);
    	}
    	catch(e)
    	{
    		DEBUG.out("Error while loading script into window.<br>", DEBUG.ERROR, e);
    	}
	}
	else
	{
		DEBUG.out('Loading '+sAbsoluteScriptFile+' failed.', DEBUG.ERROR);
	}
}
//=============================================================================================


// Dynamically load CSS file.
// param: sFileName <String>	- CSS name to be loaded, just the name, no path or extensions.
//								  Example: loadCSS("Credentials");
//=============================================================================================
function loadCSS(sFileName, errorHandler, timeoutHandler)
{
//todo: take webapp name from resource bundle

	//var sAbsoluteCSSFile = WEBAPP_NAME+"/css/"+sFileName+ACTION_EXT;
	var sAbsoluteCSSFile = getURL("css/"+sFileName);
	DEBUG.out('Dynamically load css: '+sAbsoluteCSSFile);
	var ajx = GetXmlHttpObject();
	ajx.open("GET", sAbsoluteCSSFile, false); // false=synch
	ajx.send(null);

	// Do not check for errors when loading CSS.

	if (ajx.status == 200)
	{
    	var newCSS = ajx.responseText;
    	//DEBUG.out("Received:\n<hr>"+newCSS+"<hr>");
    	try
    	{
    		var oLink = window.document.createElement("link")
			oLink.href 		= sAbsoluteCSSFile;
			oLink.rel 		= "stylesheet";
			oLink.type 		= "text/css";
			oLink.media 	= 'screen';
			oLink.title 	= 'dynamicLoadedSheet';
			window.document.getElementsByTagName("head")[0].appendChild(oLink);
    	}
    	catch(e)
    	{
    		DEBUG.out("Error while loading CSS into window.", DEBUG.ERROR, e);
    	}
	}
	else
	{
		DEBUG.out('Loading '+sAbsoluteCSSFile+' failed.', DEBUG.ERROR);
	}
}

//function loadPreLoginCSS(sFileName)
//{
//<!--todo: take webapp name from resource bundle-->
//	var sAbsoluteCSSFile = getURL("css/" + sFileName);
//	DEBUG.out('Dynamically load pre login css: '+sAbsoluteCSSFile);
//
//	try
//	{
//		var oLink = window.document.createElement("link");
//		oLink.href 		= sAbsoluteCSSFile;
//		oLink.rel 		= "stylesheet";
//		oLink.type 		= "text/css";
//		oLink.media 	= 'screen';
//		oLink.title 	= 'dynamicLoadedSheet';
//		window.document.getElementsByTagName("head")[0].appendChild(oLink);
//	}
//	catch(e)
//	{
//		DEBUG.out("Error while loading CSS into window.", DEBUG.ERROR, e);
//	}
//}
//=============================================================================================


// Dynamically load HTML content into a desired DIV element. In case both DIV identifier and handler
// are provided, the handler will be used.
// param: sContentName <String>	- Content name to be loaded, just the name, no path or extensions.
//								  Example: loadCSS("Credentials");
// param: [sDivID] <String>		- The desired DIV identifier in the DOM.
// param: [sDivHand] <DIV>		- The desired DIV handler in the DOM.
//=============================================================================================
function loadContentIntoDiv(sContentName, sDivID, sDivHand, errorHandler, timeoutHandler)
{
//todo: take webapp name from resource bundle
	//var sAbsoluteContentFile = WEBAPP_NAME+"/"+sContentName+ACTION_EXT;
	var sAbsoluteContentFile = sContentName;

    DEBUG.out('Dynamically load content: '+sAbsoluteContentFile);
    var oDiv = null;
	if (sDivHand != undefined)
	{oDiv = sDivHand;}
	else
	{oDiv = document.getElementById(sDivID);}

	var ajx = GetXmlHttpObject();

	if ((ajx != null) && (oDiv != null))
	{
		ajx.open("GET", sAbsoluteContentFile, false); // false=synch
		ajx.send(null);

		// Check for errors.
		checkError(ajx, errorHandler, timeoutHandler);

		if (ajx.status == 200)
		{
			var sResponseText = ajx.responseText;
			oDiv.innerHTML = sResponseText;
		}
		else
		{
			DEBUG.out("Loading content into div ["+sDivID+"] failed.\nStatus: "+ajx.status+" \n", DEBUG.ERROR);
		}
	}
	else
	{
		DEBUG.out("Error while loading content into div ["+sDivID+"].\n", DEBUG.ERROR);
	}
}
//=============================================================================================




// Get the url from an action name.
// The returned url is absolute (to root, not including host, port or scheme).
// param: url <String>		- The required action name.
//=============================================================================================
function getURL(url)
{
	return PORTAL_IS.TOOLS.getURL(url);
	//return WEBAPP_NAME + '/' + actionName + ACTION_EXT;
}

PORTAL_IS.TOOLS.getURL = function(url)
{
	var XSRFToken = PORTAL_IS.CONF.MULTI_PORTALS.XSRF_TOKEN;

	return  	  ((PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_PATH == "") ? ("") : ("/" + PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_PATH))
				+ ((PORTAL_IS.CONF.WEBAPP_NAME == "") ? ("") : ("/" + PORTAL_IS.CONF.WEBAPP_NAME ) )
				+ (((XSRFToken.length > 0) && (XSRFToken.charAt(0) != "/")) ? ("/" + XSRFToken) : ("" + XSRFToken))
				+ (((url.length > 0) && (url.charAt(0) != "/")) ? ("/" + url) : ("" + url))
				+ ACTION_EXT;
}
//=============================================================================================


// Get the url from an action name.
// param: actionName <String>		- The required action name.
//=============================================================================================
PORTAL_IS.TOOLS.getFullURL = function(actionName)
{
	var port = "";
	var fullUrl = "";

	// Add port only when needed.
	if 	(	((PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_SCHEME.toLowerCase() == "https") && (PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_PORT != 443))
			||
			((PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_SCHEME.toLowerCase() == "http") && (PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_PORT != 80))
		)
	{
		port = ":" + PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_PORT;
	}

	// Construct full url.
	fullUrl = 		PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_SCHEME + "://"
				+   PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_HOST
				+	port
				+	"/" + PORTAL_IS.CONF.MULTI_PORTALS.EXTERNAL_PATH
				+	((PORTAL_IS.CONF.MULTI_PORTALS.XSRF_TOKEN == "") ? ("/" + PORTAL_IS.CONF.MULTI_PORTALS.XSRF_TOKEN ) : ("") )
				+	"/" + actionName + ACTION_EXT;

	return fullUrl;
}
//=============================================================================================

// Generates and return an XMLHTTPRequest object.
//=============================================================================================
function GetXmlHttpObject()
{
	return PORTAL_IS.AJAX_MGR.getXmlHttpObject();	
}
//=============================================================================================


// Synchronously submit a form using a XMLHTTPRequest method.
// param: url <String>			- The URL to which the request will be send to.
// param: [parameters] <String>	- The parameters string of the form. String In canse none are provided
//                                an empty string will be sent.
// param: [method] <String>		- The method to submit a request by (e.g, POST, GET). In canse
//                                none are provided POST will be used.
// return: <String>				- XMLHTTPRequest responseText, empty string in case response
//								  is not OK (other then 200).
//=============================================================================================
function submitForm(url, parameters, method, errorHandler, timeoutHandler)
{
	DEBUG.out('Submitting form:<br>URL:'+url+'<br>Params:'+parameters);

	var sResponseText = '';

	if (parameters == undefined)
	{
		parameters = '';
	}

	if (method == undefined)
	{
		method = 'POST';
	}

	var xhr = GetXmlHttpObject();

	xhr.open(method, url, false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", parameters.length);
    xhr.setRequestHeader("Connection", "close");

    xhr.send(parameters);

	// Check for errors.
	checkError(xhr, errorHandler, timeoutHandler);

    if (xhr.status == 200)
	{
		sResponseText = xhr.responseText;
	}
	else
	{
		DEBUG.out('Submitting form failed:<br>'+xhr.status, DEBUG.ERROR);
	}

	return sResponseText;
}


// ************ DEPRECATED ************ Use PORTAL_IS.AJAX_MGR.sendAsyncReq() instead.
// Asynchronously send a request using a XMLHTTPRequest method.
// The request will be sent with the provided parameters. Upon completing the request a callback function will be called.
// The callback function recieves the response status (e.g. 200, 404 or 401), the resoponse body and any additional parameters-
// received in the callbackParams.
// param: url <String>			        - The URL to which the request will be send to.
// param: [parameters] <String>	        - The parameters string of the form. String In canse none are provided
//                                        an empty string will be sent.
// param: [method] <String>		        - The method to submit a request by (e.g, POST, GET). In canse
//                                        none are provided POST will be used.
// param: [callback] <Function>         - The callback object to be called on completion.
// return: <Void>				        - nothing.
//=============================================================================================
// ************ DEPRECATED ************ Use PORTAL_IS.AJAX_MGR.sendAsyncReq() instead.
function sendAsynchronousRequest(url, parameters, callbackMethod, callbackThis, callbackParams, errorHandler, timeoutHandler)
{
    callback = new Callback();

    if (!isNothingness(callbackMethod))
	{
		callback.methodReference = callbackMethod;
	}

	if (!isNothingness(callbackThis))
	{
		callback.thisArgument = callbackThis;
	}

	if (!isNothingness(callbackParams))
	{
		callback.args = callbackParams;
	}

    PORTAL_IS.AJAX_MGR.sendAsyncReq(url, parameters, callback, errorHandler, timeoutHandler);
}

// ************ DEPRECATED ************ Use PORTAL_IS.AJAX_MGR.sendAsyncReq() instead.
// A wrapper for the sendAsynchronousRequest function just with callback object instead of three args.
function sendAsyncReq(url, parameters, callback, errorHandler, timeoutHandler)
{
	PORTAL_IS.AJAX_MGR.sendAsyncReq(url, parameters, callback, errorHandler, timeoutHandler)
}
//=============================================================================================




// Synchronously send a request using a XMLHTTPRequest method.
// The request will be sent with the provided parameters. Upon completing the request the result will be returned.
// The callback function recieves the response status (e.g. 200, 404 or 401), the resoponse body and any additional parameters-
// received in the callbackParams.
// param: url <String>			        - The URL to which the request will be send to.
// param: [parameters] <String>	        - The parameters string of the form. String In canse none are provided
//                                        an empty string will be sent.
// param: [method] <String>		        - The method to submit a request by (e.g, POST, GET). In canse
//                                        none are provided POST will be used.
// param: [callback] <Function>         - The callback function to be called on complete. The callback function will be called
//                                        with the results as the first parameter. The following parameters (callbackParams) will be
//                                        appended.
// param: [callbackThis] <Function>     - The callback function 'this' reference.
// param: [callbackParams] <Function>   - Array of argument to be passed to the callback along with the result. Allowing the caller
//                                        to chain parameters to the callback function.
// return: <Void>				        - nothing.
//=============================================================================================
function sendSynchronousRequest(url, parameters, errorHandler, timeoutHandler)
{
	//DEBUG.out('Submitting form asynchronous:<br>URL:'+url+'<br>Params:'+parameters+'<br>callback:'+callback);
	DEBUG.out('Submitting form synchronously, URL:'+url);

	var sResponseText = '';

	if (parameters == undefined)
	{
		parameters = '';
	}

	var method = 'POST';

    // Set Ajax object.
	var xhr = GetXmlHttpObject();

	xhr.open(method, url, false);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", parameters.length);
    xhr.setRequestHeader("Connection", "close");

	xhr.send(parameters);

	// Check for errors.
	checkError(xhr, errorHandler, timeoutHandler);

    if (xhr.status == 200)
	{
		sResponseText = xhr.responseText;
	}
	else
	{
		DEBUG.out('Submitting form synchronously, failed:<br>'+xhr.status, DEBUG.ERROR);
	}

	return sResponseText;
}
//=============================================================================================


// Flatten Javascript object to a string of key=value separated by "&" (HTTP post).
// param: obj <Object>			- The required object.
// return: <String>
//=============================================================================================
function flattenObject(obj)
{
	var objString = "";

	for (member in obj)
	{
		objString += "&"+member+"="+encodeURIComponent(obj[member]);
	}

	// Cuts the first "&" char.
	if (objString.length > 1)
	{objString = objString.substr(1, objString.length);}

	return objString;
}
//=============================================================================================


// Tells whether a state is secured.
//=============================================================================================
//function isStateSecure(state)
//{
//	var secured = false;
//
//    // TODO: this differentiation should be change.
//    if (state == "MainPortal" ||
//        state == "ISW" ||
//        state == "IswEntry" ||
//        state == "AdvancedPage" ||
//        state == "AlternatePortal")
//    {
//        secured = true;
//    }
//
//    return secured;
//}
//=============================================================================================


// Rendering functions - CSS, Content and JavaScript
//=============================================================================================
function evaluateJavaScript(script)
{
	// Evaluate JavaScript Code.
	try
	{
		window.eval(script);
	}
	catch(e)
	{
		DEBUG.out("Error while loading script into window.<br>", DEBUG.ERROR, e);
	}
}

function evaluateCSS(cssText, source)
{
	//Not needed, all CSS loaded in one Blob file.
	var oLink = window.document.createElement("link")
	oLink.href 		= source;
	oLink.rel 		= "stylesheet";
	oLink.type 		= "text/css";
	oLink.media 	= 'screen';
	oLink.title 	= 'dynamicLoadedSheet';
	window.document.getElementsByTagName("head")[0].appendChild(oLink);
}

function evaluateHTMLContent(htmlContent, destinationRef)
{
	if ((destinationRef == undefined) || (destinationRef == null))
	{
	    DEBUG.out("Retrieving default container DOM reference...");
	    destinationRef = document.getElementById("portal_main_view");
	}

	destinationRef.innerHTML = htmlContent;
}


// Change the portal's language and reloads the portal content.
// param: newLanguage <String>		- Desired new languge.
//=============================================================================================
function changePortalLanguage(newLanguage , portalContext)
{
	DEBUG.out("Change portal language to: "+newLanguage+". context:" + portalContext);
    var sAbsoluteURL = getURL( "ChangeLanguage");
    var parameters = 'requestedLanguagePack='+newLanguage;
    submitForm(sAbsoluteURL, parameters);

    // Todo: The rendering is done async. so provide a progress indicator.     
    //renderState(200, portalContext);
    viewManager.gotoNextState();
}
//=============================================================================================


// Display progress indicator.
//=============================================================================================
function __showProgressIndicator()
{
	DEBUG.out("Show progress indicator.");
	setTimeout('__showProgressIndicator();', 1);
}

function showProgressIndicator()
{
	DEBUG.out("__Show progress indicator.");
	//window.document.getElementById("PortalScreenShader").className = "screenShaderShow";
	window.document.getElementById("portalUserInteraction").className = "userInteractionDivShow";
}
//=============================================================================================


// Hide progress indicator.
//=============================================================================================
function __hideProgressIndicator()
{
	DEBUG.out("Hide progress indicator.");
	setTimeout('__hideProgressIndicator();', 1);
}

function hideProgressIndicator()
{
	DEBUG.out("__Hide progress indicator.");
	window.document.getElementById("PortalScreenShader").className = "screenShaderHide";
	window.document.getElementById("portalUserInteraction").className = "userInteractionDivHide";
}
//=============================================================================================



function getSNXController()
{
	var newSNXController = null;
	try
	{
		newSNXController = new SnxController();
	}
	catch(e)
	{
		DEBUG.out('Error while retrieving SNX controller.', DEBUG.ERROR, e);
	}

	return newSNXController;
}

function getISWController()
{
	return null;
}

function getICSController()
{
	return null;
}

function getCShellController()
{
	return null;
}

var DEBUG = new __Debug();
DEBUG.init();
DEBUG.out('JavaScript Tools loaded.');

// =======================================================================================
Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};
// =======================================================================================

// =======================================================================================
function convertToGmt(date)
{
	var d = new Date(date * 1000);
    var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	var hour = d.getHours(), hourt;
	if ( hour > 11 ) {
		hour = hour==12 ? 12 : hour - 12;
		hourt = 1;
	} else {
		hour = hour==0 ? 12 : hour;
		hourt = 0;
	}

    var dateStr = shortDays[d.getDay()] + " " + (d.getMonth()+1) + "/" + (d.getDate()) + "/" + d.getFullYear() + " ";
	dateStr += (hour<10 ? '0' : '') + hour + ':' + (d.getMinutes()<10 ? '0' : '') +  d.getMinutes() + ' ' + (hourt==1 ? 'PM' : 'AM') + ' ';

	return dateStr;
}
// =======================================================================================

// =======================================================================================
function GetDomainName(str)
{
    domain =  str.match(/@(\w|\.)*/);
    if (domain==null) return null;
    return domain[0];
}
// =======================================================================================

// =======================================================================================

function getImageName(extentionName)
{
    var extentionsImages = new Array("bat","bmp","c","cpp","cs","dat","dll","doc","docx", "eml","enf","exe","gif","gz","h","hpp","html","ini","jpg", "js","mid","mov","mp3","msg","pdf","png","ppt","pptx","rar", "rtf","txt","vb","xls","xlsx","zip");
    for (i=0; i<extentionsImages.length; i++)
    {
        if (extentionsImages[i] == extentionName)
            return extentionName;
    }
    return 'default';
}

// =======================================================================================

PORTAL_IS.MESSAGE_TYPE = {};
PORTAL_IS.MESSAGE_TYPE.Attention = 0;
PORTAL_IS.MESSAGE_TYPE.Confirmation = 1;
PORTAL_IS.MESSAGE_TYPE.Display = 2;

PORTAL_IS.TOOLS.errorMsgShown = false;

// Display Portal Message.
//=============================================================================================
function showPortalMessage(message, postHandler, messageType, noHTMLEncode, showIcons)
{
	var showButton = true;
	
	DEBUG.out("Show Portal Message.");
    if (PORTAL_IS.TOOLS.isErrorMsgShown())
	{
		DEBUG.out("showPortalMessage - Error message is already displayed, aborting...", DEBUG.ERROR);
		return;
	}
	
	if (isNothingness(postHandler))
	{
		DEBUG.out("showPortalMessage - postHandler set to default.");
		postHandler = hidePortalMessage;
	}

	if (isNothingness(messageType))
	{
		DEBUG.out("showPortalMessage - iconType set to default.");
		messageType = PORTAL_IS.MESSAGE_TYPE.Attention;
	}
	
	if(messageType == PORTAL_IS.MESSAGE_TYPE.Display)
		showButton = false;

	// Shade window's background.
    window.document.getElementById("PortalScreenShader").className 	= "screenShaderShow";		// Show screen shader.
	window.document.getElementById("portal_main_view").className 	= "div_expanded_shaded";	// Show screen shader.

	// Show appropriate buttons.
	if(showButton)
		window.document.getElementById("portalMessage_ok_button_container").className 			= "show";
	else
		window.document.getElementById("portalMessage_ok_button_container").className 			= "hide";
	window.document.getElementById("portalMessage_bool_button_container").className 		= "hide";
	window.document.getElementById("portalMessage_submit_button_container").className 		= "hide";

	// Show appropriate box regions.
	window.document.getElementById("portalMessage_title_container_row").className 			= "portalMessage_title show";
	window.document.getElementById("portalMessage_container").className 					= "show";
	window.document.getElementById("portalMessage_textarea_container_row").className 		= "hide";
	window.document.getElementById("portalMessage_submessage_container_row").className 		= "hide";
	window.document.getElementById("portalMessage_validation_message_container_row").className	= "hide";

	if(showIcons === undefined)
		showIcons = true;
	
	// Set messages contents.
	if(noHTMLEncode != true)
		//Encode the message.
		window.document.getElementById("portalMessage_container").innerHTML 			= HTMLEncode(message);
	else
		//No message encoding - content is raw HTML.
		window.document.getElementById("portalMessage_container").innerHTML 			= message;
	window.document.getElementById("portalMessage_submessage_container").innerHTML 	= "";
	//window.document.getElementById("portalMessage_textarea").value 					= "";

	// Set icon and title.
	var imageTag = "";
	var title = "";
	switch (messageType)
	{
		case PORTAL_IS.MESSAGE_TYPE.Confirmation:
			if(showIcons)
				imageTag = draw_img_tag(getURL("images/confirmation.png"));
			title = PORTAL_IS.L10N.L10N_Obj.getStr("MSGBOX_TITLE_CONFIRMATION");
		break;

		default: // == PORTAL_IS.MESSAGE_TYPE.Attention
			if(showIcons)
				imageTag = draw_img_tag(getURL("images/attention.png"));
			title = PORTAL_IS.L10N.L10N_Obj.getStr("MSGBOX_TITLE_ATTENTION");
		break;
	}

	window.document.getElementById("portalMessage_title_container").innerHTML = "<table cellpadding=\"0px\" cellspacing=\"0px\"><tr><td>" + imageTag + "</td><td>&nbsp;" + HTMLEncode(title) + "</td></tr></table>";

	window.document.getElementById("portalMessage").className = "portalMessageDivShow";	// Show message box.

	window.document.getElementById("portalMessage_button").onclick = postHandler; // Assign action to the Ok button.
}
//=============================================================================================

// Display Portal Confirmation Message.
//=============================================================================================
function showPortalConfirmationMessage(message, yesPostHandler, noPostHandler)
{
	DEBUG.out("Show Portal Message.");
	if (PORTAL_IS.TOOLS.isErrorMsgShown())
	{
		DEBUG.out("showPortalConfirmationMessage - Error message is already displayed, aborting...", DEBUG.ERROR);
		return;
	}

	if ((yesPostHandler == undefined) || (yesPostHandler == null))
	{
		yesPostHandler = hidePortalMessage;
	}

	if ((noPostHandler == undefined) || (noPostHandler == null))
	{
		noPostHandler = hidePortalMessage;
	}


	// Shade window's background.
    window.document.getElementById("PortalScreenShader").className 	= "screenShaderShow";		// Show screen shader.
	window.document.getElementById("portal_main_view").className 	= "div_expanded_shaded";	// Show screen shader.

	// Show appropriate buttons.
	window.document.getElementById("portalMessage_ok_button_container").className 		= "hide";
	window.document.getElementById("portalMessage_bool_button_container").className 	= "show";
	window.document.getElementById("portalMessage_submit_button_container").className 	= "hide";

	// Show appropriate box regions.
	window.document.getElementById("portalMessage_title_container_row").className 			= "portalMessage_title show";
	window.document.getElementById("portalMessage_container").className 					= "show";
	window.document.getElementById("portalMessage_textarea_container_row").className 		= "hide";
	window.document.getElementById("portalMessage_submessage_container_row").className 		= "hide";
	window.document.getElementById("portalMessage_validation_message_container_row").className	= "hide";

	// Set messages contents.
	window.document.getElementById("portalMessage_container").innerHTML 			= HTMLEncode(message);
	window.document.getElementById("portalMessage_submessage_container").innerHTML 	= "&nbsp;";

	// Set icon and title.
	imageTag = draw_img_tag(getURL("images/attention.png"));
	title = "Confirmation";
	window.document.getElementById("portalMessage_title_container").innerHTML = "<table cellpadding=\"0px\" cellspacing=\"0px\"><tr><td>" + imageTag + "</td><td>&nbsp;" + HTMLEncode(title) + "</td></tr></table>";

	window.document.getElementById("portalMessage_yes_button").onclick = yesPostHandler;			// Assign action to the Yes button.
	window.document.getElementById("portalMessage_no_button").onclick = noPostHandler;				// Assign action to the No button.

	window.document.getElementById("portalMessage").className = "portalMessageDivShow";	// Show error message box.
}
//=============================================================================================

// Hide Portal Error Message.
//=============================================================================================
function hidePortalMessage()
{
	DEBUG.out("Hide Portal Message.");
	window.document.getElementById("PortalScreenShader").className = "screenShaderHide";
	window.document.getElementById("portal_main_view").className = "div_expanded";		// Hide screen shader.

	window.document.getElementById("portalMessage").className = "portalMessageDivHide";
	window.document.getElementById("portalMessage_container").innerHTML = "";

	PORTAL_IS.TOOLS.enableAllMessageBoxes();
}
//=============================================================================================

// Display Portal Error Message.
//=============================================================================================
function renderErrorMessage(portalException)
{

	// TODO: Localize.
	
	var msg = "";
	if (portalException.errMsg == "") // Unknown error.
	{
		msg += PORTAL_IS.L10N.L10N_Obj.getStr("DEFAULT_GENERIC_CLIENT_ERROR");
	}
	else
	{
		// TODO: Handle msgId for localization.
		msg += portalException.errMsg;
		msg += "\n\n";
	}

	/*
	// Disabled, do not show status.
	if (parseInt(portalException.status) >= 0)
	{
		msg += "Status: "+portalException.status+"\n";
	}
	*/

	if (portalException.logRefId.length > 0)
	{
		msg += PORTAL_IS.L10N.L10N_Obj.getStr("LOG_REFERENCE_ID") + portalException.logRefId+"\n";
	}

	return msg;
}
//=============================================================================================

// Display Portal Error Message.
//=============================================================================================
function showPortalErrorMessage(portalException, postErrorHandler, hideButton)
{
	var showButton = true;
	
	if(hideButton == true)
		showButton = false;

	DEBUG.out("Show Portal Error Message.");
    if (PORTAL_IS.TOOLS.isErrorMsgShown())
	{
		DEBUG.out("showPortalErrorMessage - Error message is already displayed, aborting...", DEBUG.ERROR);
		return;
	}

	// Hide any opened boxes.
    PORTAL_IS.TOOLS.hideGeneralContainer();
    PORTAL_IS.TOOLS.hideDialog();
    hidePortalMessage();
    hidePortalErrorMessage();

	// Set error flag. 
	PORTAL_IS.TOOLS.errorMsgShown = true;

	if ((postErrorHandler == undefined) || (postErrorHandler == null))
	{
		postErrorHandler = genericPostErrorHandler;
	}
	
	//the portalException is set in order to check with it the exception status id in genericPostErrorHandler
	window.document.getElementById("portalErrorMessage_button").portalException = portalException;
	window.document.getElementById("portalErrorMessage_button").onclick = postErrorHandler;	// Assign action to the Ok button.
	window.document.getElementById("PortalErrorScreenShader").className = "screenErrorShaderShow";	// Show screen shader.
	window.document.getElementById("portal_main_view").className = "div_expanded_shaded";	// Show screen shader.

	// Set content of the error message.
	window.document.getElementById("portalErrorMessage_title_container_row").className = "portalMessage_title show";	
	//window.document.getElementById("portalErrorMessage_Icon_container").innerHTML = ;
	window.document.getElementById("portalErrorMessage_title_container").innerHTML = draw_img_tag(getURL("/images/attention.png")) + "&nbsp;" + PORTAL_IS.L10N.L10N_Obj.getStr("MSGBOX_TITLE_ERROR");
	window.document.getElementById("portalErrorMessage_container").innerHTML = HTMLEncode(renderErrorMessage(portalException));

	// Show error message box.
	window.document.getElementById("portalErrorMessage").className = "portalErrorMessageDivShow";
	
	if(!showButton)
		window.document.getElementById("portalMessage_error_button_container").className = "hide";

	if (DEBUG.isActive())
	{
		DEBUG.out("Show report error link.");

		// Show report error link.
		window.document.getElementById("portalMessage_error_report_container").className = "show";

		// Assign action to the link.
		reportHandler = function()
		{
			DEBUG.out("Report error link handler called.");

			DEBUG.out("Hide error message.");
			hidePortalErrorMessage();

			var postReportCallback = new Callback();
			postReportCallback.methodReference    = postErrorHandler;
			postReportCallback.thisArgument       = null;
			postReportCallback.args               = [];

			DEBUG.showErrorReport(postReportCallback);
		}
		window.document.getElementById("portalMessage_error_report_link").onclick = reportHandler;
	}
}
//=============================================================================================

// Hide progress indicator.
//=============================================================================================
function hidePortalErrorMessage()
{
	DEBUG.out("Hide Portal Error Message.");
	window.document.getElementById("PortalErrorScreenShader").className = "screenShaderHide";

	// Hide backgroud shader only if no other message boxes are opened.
	if (!PORTAL_IS.TOOLS.isOpenMessageBoxes())
	{
		window.document.getElementById("portal_main_view").className = "div_expanded";		// Hide screen shader.
	}

	window.document.getElementById("portalErrorMessage_title_container_row").className = "portalMessage_title hide";
	window.document.getElementById("portalErrorMessage").className = "portalErrorMessageDivHide";
	window.document.getElementById("portalErrorMessage_container").innerHTML = "";

	// Enable other boxes in case they were open.
	PORTAL_IS.TOOLS.enableAllMessageBoxes();

	// Hide report error link.
	window.document.getElementById("portalMessage_error_report_container").className = "hide";

	// Set error flag. 
	PORTAL_IS.TOOLS.errorMsgShown = false;
}
//=============================================================================================

// Display general container.
// html argument should not be escaped.
//=============================================================================================
PORTAL_IS.TOOLS.showGeneralContainer = function(title, html)
{
	DEBUG.out("Show Portal General Container.");

    if (PORTAL_IS.TOOLS.isErrorMsgShown())
	{
		DEBUG.out("showGeneralContainer - Error message is already displayed, aborting...", DEBUG.ERROR);
		return;
	}

	// Shade window's background.
    window.document.getElementById("PortalScreenShader").className 	= "screenShaderShow";		// Show screen shader.
	window.document.getElementById("portal_main_view").className 	= "div_expanded_shaded";	// Show screen shader.

	// Write html content and title into container.
	window.document.getElementById("portalGeneralContainer_container").innerHTML = html;
	window.document.getElementById("portalGeneralContainer_title_container").innerHTML = HTMLEncode(title);

	// Show container.
	window.document.getElementById("portalGeneralContainer").className = "portalMessageDivShow";	// Show message box.
}
//=============================================================================================

// Hide general container.
//=============================================================================================
PORTAL_IS.TOOLS.hideGeneralContainer = function()
{
	DEBUG.out("Hide Portal General Container.");

	window.document.getElementById("PortalScreenShader").className = "screenShaderHide";
	window.document.getElementById("portal_main_view").className = "div_expanded";		// Hide screen shader.

	window.document.getElementById("portalGeneralContainer").className = "portalMessageDivHide";

	// Clear html content and title.
	window.document.getElementById("portalGeneralContainer_container").innerHTML = "";
	window.document.getElementById("portalGeneralContainer_title_container").innerHTML = "";
}
//=============================================================================================

//=============================================================================================
// Show dialog will call the submit callback (when submitted) with the input text as firts argument following by -
// the callback's argument.
PORTAL_IS.TOOLS.showDialog = function(message, subMessage, defaultText, title, submitCallback, cancelCallback, validatorStack, singleLine, height, width, isError)
{
	DEBUG.out("PORTAL_IS.TOOLS.showDialog in.");

	if (isNothingness(isError))
	{
		isError = false;
	}

	// If not error and error already shown, do not show dialog.
	if ( !isError && PORTAL_IS.TOOLS.isErrorMsgShown() )
	{
		DEBUG.out("PORTAL_IS.TOOLS.showDialog - Error message is already displayed, aborting...", DEBUG.ERROR);
		return;
	}

	if (isNothingness(submitCallback))
	{
		DEBUG.out("PORTAL_IS.TOOLS.showDialog - submitCallback set to default.");
		submitCallback = new Callback();
		submitCallback.methodReference 	= PORTAL_IS.TOOLS.hideDialog();
	}

	if (isNothingness(cancelCallback))
	{
		DEBUG.out("PORTAL_IS.TOOLS.showDialog - cancelCallback set to default.");
		cancelCallback = new Callback();
		cancelCallback.methodReference 	= PORTAL_IS.TOOLS.hideDialog();
	}

	if (isNothingness(validatorStack))
	{
		DEBUG.out("PORTAL_IS.TOOLS.showDialog - validator set to default.");
		validatorStack = new PORTAL_IS.VALIDATOR.ValidatorStack();
	}

	if (singleLine != true)
	{
		DEBUG.out("PORTAL_IS.TOOLS.showDialog - singleLine set to default.");
		singleLine = false;
	}

	if (isNothingness(height))
	{
		DEBUG.out("PORTAL_IS.TOOLS.showDialog - height set to default.");
		height = 130;
	}

		if (isNothingness(width))
	{
		DEBUG.out("PORTAL_IS.TOOLS.showDialog - width set to default.");
		width = 370;
	}

    // Shade window's background.
    window.document.getElementById("PortalScreenShader").className 	= "screenShaderShow";		// Show screen shader.
	window.document.getElementById("portal_main_view").className 	= "div_expanded_shaded";	// Show screen shader.

	// Show appropriate buttons.
	window.document.getElementById("portalMessage_ok_button_container").className 				= "hide";
	window.document.getElementById("portalMessage_bool_button_container").className 			= "hide";
	window.document.getElementById("portalMessage_submit_button_container").className 			= "show";

	// Add textarea/input
	textareaHTML = "";
	if (!singleLine)
	{
		textareaHTML = "<textarea id=\"portalMessage_textarea\" rows=\"7\" cols=\"50\"></textarea>";
	}
	else
	{
		textareaHTML = "<input type=\"text\" id=\"portalMessage_textarea\"></input>";
	}

	window.document.getElementById("portalMessage_textarea_container").innerHTML				= textareaHTML;

	// Show appropriate box regions.
	window.document.getElementById("portalMessage_title_container_row").className 				= "portalMessage_title show";
	window.document.getElementById("portalMessage_container").className 						= "show";
	window.document.getElementById("portalMessage_textarea_container_row").className 			= "show";
	window.document.getElementById("portalMessage_submessage_container_row").className 			= "show";
	window.document.getElementById("portalMessage_validation_message_container_row").className	= "show";
	if (!singleLine)
	{
		window.document.getElementById("portalMessage_textarea").style.height					= height+"px";
	}
	window.document.getElementById("portalMessage_textarea").style.width						= width+"px";

	// Set messages contents.
	window.document.getElementById("portalMessage_container").innerHTML 						= HTMLEncode(message);
	window.document.getElementById("portalMessage_submessage_container").innerHTML 				= HTMLEncode(subMessage);
	window.document.getElementById("portalMessage_textarea").value 								= defaultText;
	window.document.getElementById("portalMessage_validation_message_container").innerHTML		= "&nbsp;";

	// Set title.
	window.document.getElementById("portalMessage_title_container").innerHTML = HTMLEncode(title);

	// Set focus.
	// For some reason IE6 fails to set focus, probably the dom element is not ready yet.
	// Set timeout and try to focus a second later.
	// At any case surround with try-catch to avoid exceptions here.
	setTimeout('try{window.document.getElementById("portalMessage_textarea").focus();}catch(e){}', 1000);

	// Create and assign callbacks to buttons.
    submitHandler = function()
    {
    	DEBUG.out("submitHandler called.");

        // Validate content.
        var validity = validatorStack.evaluate(window.document.getElementById("portalMessage_textarea").value);

        if (validity.isValid)
        {
        	// Concatenate the input text with the callback arguments.
			submitCallback.args = [window.document.getElementById("portalMessage_textarea").value].concat(submitCallback.args);

			// Clear fields.
			window.document.getElementById("portalMessage_validation_message_container").innerHTML	= "";
			window.document.getElementById("portalMessage_validation_message_container_row").className	= "hide";

			// Call callback.
    		submitCallback.call();
    		PORTAL_IS.TOOLS.hideDialog();
    	}
    	else
    	{
    		DEBUG.out("PORTAL_IS.TOOLS.showDialog - Input text is not valid.");
    		window.document.getElementById("portalMessage_validation_message_container").innerHTML = HTMLEncode(validity.message);
    		window.document.getElementById("portalMessage_validation_message_container_row").className	= "show";
		}
	}

	cancelHandler = function()
    {
    	DEBUG.out("cancelHandler called.");
    	cancelCallback.call();
    	PORTAL_IS.TOOLS.hideDialog();
	}

    if (singleLine)
    {
		window.document.getElementById("portalMessage_textarea").onkeypress = function(evn)
		{
			if ((window.event && window.event.keyCode == 13) || (evn && evn.keyCode == 13))
			{
				submitHandler();
			}
		}
	}

	window.document.getElementById("portalMessage_submit_button").onclick = submitHandler;
	window.document.getElementById("portalMessage_cancel_button").onclick = cancelHandler;

	// Show message box.
	window.document.getElementById("portalMessage").className = "portalMessageDivShow";	// Show error message box.
}
//=============================================================================================


//=============================================================================================
PORTAL_IS.TOOLS.hideDialog = function()
{
	hidePortalMessage();
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.TOOLS.disableAllMessageBoxes = function()
{
	// Disable other boxes in case they are opened.
	if (window.document.getElementById("portalUserInteraction") != null
		&& window.document.getElementById("portalUserInteraction").className == "userInteractionDivShow")
	{
		window.document.getElementById("portalUserInteraction").className = "userInteractionDivDisabled";
	}

	if (window.document.getElementById("portalMessage") != null
		&& window.document.getElementById("portalMessage").className == "portalMessageDivShow")
	{
		window.document.getElementById("portalMessage").className = "portalMessageDivDisabled";
	}

	if (window.document.getElementById("portalGeneralContainer") != null
		&& window.document.getElementById("portalGeneralContainer").className == "portalMessageDivShow")
	{
		window.document.getElementById("portalGeneralContainer").className = "portalMessageDivDisabled";
	}
}
//=============================================================================================

//=============================================================================================
PORTAL_IS.TOOLS.enableAllMessageBoxes = function()
{
	// Disable other boxes in case they are opened.
	if (window.document.getElementById("portalUserInteraction") != null
		&& window.document.getElementById("portalUserInteraction").className == "userInteractionDivDisabled")
	{
		window.document.getElementById("portalUserInteraction").className = "userInteractionDivShow";
	}

	if (window.document.getElementById("portalMessage") != null
		&& window.document.getElementById("portalMessage").className == "portalMessageDivDisabled")
	{
		window.document.getElementById("portalMessage").className = "portalMessageDivShow";
	}

	if (window.document.getElementById("portalGeneralContainer") != null
		&& window.document.getElementById("portalGeneralContainer").className == "portalMessageDivDisabled")
	{
		window.document.getElementById("portalGeneralContainer").className = "portalMessageDivShow";
	}
}
//=============================================================================================


// Check is any message boxes (not error) are opened.
//=============================================================================================
PORTAL_IS.TOOLS.isOpenMessageBoxes = function()
{
	var isOpenMessageBoxes = false;
	// Disable other boxes in case they are opened.
	if (	(window.document.getElementById("portalUserInteraction") != null
				&& (window.document.getElementById("portalUserInteraction").className == "userInteractionDivDisabled"))
			||	(window.document.getElementById("portalMessage") != null
				&& (window.document.getElementById("portalMessage").className == "portalMessageDivDisabled"))
			||	(window.document.getElementById("portalGeneralContainer") != null
				&& (window.document.getElementById("portalGeneralContainer").className == "portalMessageDivDisabled"))
		)
	{
		isOpenMessageBoxes = true;
	}

	return isOpenMessageBoxes;
}
//=============================================================================================


// Check is error message box is opened.
//=============================================================================================
PORTAL_IS.TOOLS.isErrorMsgShown = function()
{
	return PORTAL_IS.TOOLS.errorMsgShown;
}
//=============================================================================================

// Set a cookie.
// param: name <String>     - The cookie name.
// param: value <String>    - The cookie value.
// param: expires <int>     - The cookie life time in seconds (the cookie will expire in [expires] seconds).
/************************* todo: beautification ********************/
function setCookie(name, value, expires, path, domain, secure) {
  if ( expires )
  {
    expires = expires * 1000;
  }
  var today = new Date();
  var expires_date = new Date( today.getTime() + (expires) );
  var curCookie = name + "=" + encodeURIComponent(value) +
      ((expires) ? "; expires=" + expires_date.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}

function deleteCookie(name, path)
{
    document.cookie = name + "=" +
        ((path) ? "; path=" + path : "");

}


/*
  name - name of the desired cookie
  return string containing value of specified cookie or null
  if cookie does not exist
*/

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}
// Disable all child elements (within a specific form) of a certain parent.
// param: containingFormId <String>  - The containing form ID.
// param: parentId <String>    - Parent ID.
//=============================================================================================
 disable_child_elements  = function(containingFormId, parentId)
 {
    var disableChildElementsError = false;
    try
    {
        var oForm = document.getElementById(containingFormId);
        var formElementCount = oForm.length;
        for (var i=0; i<formElementCount; i++)
        {
            var element = oForm.elements[i];
            if (element.getAttribute('parent') == parentId )
            {
            // Disable all the children-elements of parentId.
            element.disabled = true;

            // Disable children of each element.
            disable_child_elements(containingFormId, element.id);
            }
        }
        var spanList = oForm.getElementsByTagName("span");
        for(var j=0; j<spanList.length; j++)
        {
           var spanElement = spanList[j];
           if(spanElement.getAttribute("perentForText"))
           {
            if(spanElement.getAttribute("perentForText")== parentId)
            {
                spanElement.className = "textDisable";
            }
           }
        }
    }
    catch(e)
    {
        disableChildElementsError = true;
    }
    if (disableChildElementsError)
    {
       DEBUG.out('Disable child elements of: '+parentId+' in form: '+containingFormId+' failed.',DEBUG.ERROR);
    }
 }

//=============================================================================================

// enable all child elements (within a specific form) of a specific parent. For each element
// (according to the sub-trees) enable it to it's previous state (checked/unchecked),using the 'is_selected'
// attribute, and proceeds enabling it's childs accordingly (relevant mainly to radio element for which 'is_selected' = checked/unchecked).
// param: containingFormId <String>  - The containing form ID.
// param: parentId <String>    - Parent ID.
//=============================================================================================
 enable_child_elements  = function(containingFormId, parentId)
 {
    try
    {
        var oForm = document.getElementById(containingFormId);
        var formElementCount = oForm.length;
        for (var i=0; i<formElementCount; i++)
        {
            var element = oForm.elements[i];
            if (element.getAttribute('parent') == parentId )
            {

                // By default enable all.
				element.disabled = false;

                // Disable all direct children which their attribute of keepDisabled is set to TRUE.
                if ( (element.getAttribute('keepDisabled')) && (element.getAttribute('keepDisabled').toLowerCase() == "true") )
                {
                	element.disabled = true;
                }

                //checking whether the element is a radio or a checkbox cause then it
               // may have children to call the enable on them
                if (element.type == "radio" || element.type == "checkbox")
                {
                    if (element.checked)
                    {
                       // enable childs of elements that were checked".
                        enable_child_elements(containingFormId, element.id);
                    }
                }
            }
        }

        var spanList = oForm.getElementsByTagName("span");
        for(var j=0; j<spanList.length; j++)
        {
           var spanElement = spanList[j];
           if(spanElement.getAttribute("perentForText"))
           {
            if(spanElement.getAttribute("perentForText")== parentId)
            {
                spanElement.className = "textEnable";
            }
           }
        }
    }
    catch(e)
    {
        DEBUG.out('Enable child elements of: '+parentId+' in form: '+containingFormId+' failed.',DEBUG.ERROR);
    }
 }
//=============================================================================================


// Create image tag.
//===============================================================================================================
function draw_img_tag(src)
{
	var output = '';

	if (!browserDetails.isPngSupported())
	{
		output = "<div style=\" width:100%; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='image');\">&nbsp;</div>";
	}
	else
	{
		output = "<img src="+src+">";
	}

	return output;
}
//===============================================================================================================

// Create image tag but in IE6 wraps in inline-block span instead of div, which allows it to be inline in text.
//===============================================================================================================
function draw_img_tag_span(src)
{
	var output = '';

	if (!browserDetails.isPngSupported())
	{
		output = "<span style=\"display: inline-block; width:100%; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='image');\">&nbsp;</span>";
	}
	else
	{
		output = "<img src="+src+">";
	}

	return output;
}
//===============================================================================================================


// In case browser is IE  5.5 <= ver < 7 rotate the documet's images and fix the PNGs to make
// them transparent.
//=============================================================================================
function fixIEPngImages()
{
	DEBUG.out("Fix PNGs.");

    var arVersion = navigator.appVersion.split("MSIE")
	var version = parseFloat(arVersion[1])

	if ((version >= 5.5) && (document.body.filters))
	{
	   for(var i=0; i<document.images.length; i++)
	   {
		  var img = document.images[i]
		  var imgName = img.src.toUpperCase()
		  if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
		  {
			 var imgID = (img.id) ? "id='" + img.id + "' " : ""
			 var imgClass = (img.className) ? "class='" + img.className + "' " : ""
			 var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
			 var imgStyle = "display:inline-block;" + img.style.cssText
			 if (img.align == "left") imgStyle = "float:left;" + imgStyle
			 if (img.align == "right") imgStyle = "float:right;" + imgStyle
			 if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
			 var strNewHTML = "<span " + imgID + imgClass + imgTitle
			 + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
			 + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
			 + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>"
			 img.outerHTML = strNewHTML
			 i = i-1
		  }
	   }
	}
}
//=============================================================================================


// Iterate on the form and retrieve it's fields parameters and construct a POST string.
// Encrypts password fields according to "encrytPasswords" and if JS_RSA.js was included
// Default of encrytPasswords is true (if not passed to the function)
//=============================================================================================
function getFormParams(formId,encrytPasswords)
{
    DEBUG.out('Get form params for: '+formId);
    var getFormParamsError = false;
    var parameters = "";
    var count = 0;
    var element, value;
	
	if (typeof encrytPasswords == "undefined")	// default of encrytPasswords is true
	{
		encrytPasswords = true;
	}
	
    try
    {
        oForm = document.getElementById(formId);
        iFormElementCount = oForm.length;
        for (var i=0; i<iFormElementCount; i++)
        {
            element = oForm.elements[i];
            if ( (element.getAttribute('cpname') != undefined) && (element.getAttribute('cpname') != "") )
            {
                if (element.type == 'radio')
                {
                    DEBUG.out('checked =  "' + element.checked);
                }
                if (element.type != 'radio' || element.checked == true)
                {
                    if (count++>0)
                    {
                        parameters += "&";
                    }

                    value = element.value;
					
					/*
					The following requires JS_RSA.jsp to be included
					in another html or js file (e.g. JS_Authentication)
					window.cpRSAobj is declared in JS_RSA.jsp
					*/
					
                    if ((element.type == 'password') && encrytPasswords && (window.cpRSAobj))
                    {
                        value = window.cpRSAobj.encrypt(value);
                        DEBUG.out('Enc password\n' + value);
                    }

                    parameters += element.getAttribute('cpname')+"="+encodeURIComponent(value);

                }
            }

        }
    }
    catch(e)
    {
        getFormParamsError = true;
        DEBUG.out('Get form params failed.', DEBUG.ERROR, e);
    }

    return parameters;
}
//=============================================================================================


// Create a progress indicatior thingy.
//=============================================================================================
ProgressIndicator = function()
{
    this.m_width = 10;
    this.m_speed = 5; //Value range 1-10
    this.m_id	= "progressIndicator";
    this.m_index	= 0;
    this.m_size	= this.m_width*2;
    this.m_cease = false;
    this.m_domElement = null;

    this.draw_table = function()
    {
        var output = "<table id=\""+this.m_id+"_table\" class=\"progressIndicator\">";

        output += "<tr>";
        for (i=0; i<this.m_width; i++)
        {
            output += "<td id=\""+this.m_id+"_td_"+i+"\" class=\"progressIndicator\"></td>";
        }
        output += "</tr>";

        index = 0;
        output += "<tr>";
        for (i=0; i<this.m_width; i++)
        {
            output += "<td id=\""+this.m_id+"_td_"+(this.m_size-i-1)+"\" class=\"progressIndicator\"></td>";
        }
        output += "</tr>";

        output += "</table>";
        this.m_domElement.innerHTML = output;
    }


    this.clear_table = function()
    {
        this.m_domElement.innerHTML = "";
    }


    this.shift = function()
    {
        var j=0;
        var opacity = 1;
        for (i=0; i<(this.m_size); i++)
        {
            j = (this.m_index+i) % this.m_size;

            opacity = (i/this.m_size*2);

            if (opacity>1)
            {
                opacity = 0;
            }

            try
            {
                document.getElementById(this.m_id+"_td_"+j).style.MozOpacity=opacity;
                document.getElementById(this.m_id+"_td_"+j).style.filter = "alpha(Opacity="+(opacity*100)+"); ";
            }
            catch(e)
            {
                return;
            }
        }

        this.m_index++;
        if (!this.m_cease)
        {
            setTimeout("try{"+this.m_id+".shift();}catch(e){}", 150-(this.m_speed*10));
        }
    }


    this.start = function(name, container, speed, width)
    {
        this.m_id 		= name;
        this.m_speed 	= speed;
        this.m_width 	= width;
        this.m_size		= this.m_width*2;
        this.m_index	= 0;
        this.m_domElement = container;

        try
        {
            this.m_domElement.innerHTML = "";
        }
        catch(e)
        {
            //alert('Cannot find container.');
            return;
        }

        this.draw_table();
        this.shift();
    }

    this.stop = function()
    {
        this.m_cease = true;
        this.clear_table();
    }

}
//=============================================================================================

// Close page warning message - function.
//=============================================================================================
showCloseWarningMessage    = true; // Will the warning message will be shown at all.
operativeClientCount       = 0;    // Count how many clients required the warning to be shown.

pageClosingWarning = function()
{
	if ((showCloseWarningMessage) && (operativeClientCount > 0))
	{
		return PORTAL_IS.L10N.L10N_Obj.getStr("KEEP_ALIVE_CLOSE_WINDOW_WARNING");
	}
	else
	{
		return;
	}
}

disablePageClosingWarning = function()
{
	showCloseWarningMessage = false;
}

enablePageClosingWarning = function()
{
	showCloseWarningMessage = true;
}

pageClosingWarningRegisterClient = function()
{
	operativeClientCount++;
}

pageClosingWarningUnregisterClient = function()
{
	operativeClientCount--;
}
//=============================================================================================

// Keep Alive + popup blocker
//=============================================================================================
assumePopupBlocker = function()
{
	onunload=null;
	onbeforeunload=null;
	var sid = getCookie("NACSID");
	// if we think popup blocker was detected, we add a cookie indicating that.
	// this cookie will be read when the keep alive page is loaded, and if exists - 
	// window.open will be called.
	setCookie("cpnacportal_popup_blocker", sid , 30);
	
}


// Detect Caps Lock
//=============================================================================================
capsDetect = function(e, divName)
{
	DEBUG.out("capsDetect, e:"+e+", div:"+divName);
	
	//if the browser did not pass event information to the handler, check in window.event
	if( !e ) { e = window.event; } if( !e ) { return; }
	//what (case sensitive in good browsers) key was pressed
	//this uses all three techniques for checking, just in case
	var theKey = 0;
	if( e.which ) { theKey = e.which; } //Netscape 4+, etc.
	else if( e.keyCode ) { theKey = e.keyCode; } //Internet Explorer, etc.
	else if( e.charCode ) { theKey = e.charCode } //Gecko - probably not needed
	//was the shift key was pressed
	var theShift = false;
	if( e.shiftKey ) { theShift = e.shiftKey; } //Internet Explorer, etc.
	else if( e.modifiers )
	{ //Netscape 4
		//check the third bit of the modifiers value (says if SHIFT is pressed)
		if( e.modifiers & 4 )
		{ //bitwise AND
		  theShift = true;
		}
	}

	//if upper case, check if shift is not pressed
	// or, if lower case, check if shift is pressed
	if (( theKey > 64 && theKey < 91 && !theShift ) || ( theKey > 96 && theKey < 123 && theShift ))
	{
		document.getElementById(divName).className="capsLockWarning_show";
		//HideCapsDiv(false);
	}
//
//	//if lower case, check if shift is pressed
//	else if( theKey > 96 && theKey < 123 && theShift )
//	{
//		//HideCapsDiv(false);
//	}
	else
	{
		document.getElementById(divName).className="capsLockWarning_hide";
		//Hide caps note ;
		//HideCapsDiv(true);
	}
}
//=============================================================================================



// Generic error handlers.
//=============================================================================================
window.genericErrorHandler = function(portalException, callback)
{
	if ((portalException == undefined) || (portalException == null))
	{
		portalException = new PortalException();
	}

	if (isNothingness(callback))
	{
		callback = new Callback();
	}

    // Quite mode, just send error to log.
    DEBUG.out("Unhandled generic error: "+portalException.errMsg + ", Log reference ID:"+portalException.logRefId, DEBUG.ERROR);

    callback.call();
    
    return true;	// This is required for the execption to stop from being passed to the browser. 
}

window.genericTimeoutHandler = function(portalException)
{
	if ((portalException == undefined) || (portalException == null))
	{
		portalException = new PortalException();
	}
	
	// Quite mode, just send error to log.
    DEBUG.out("Unhandled timeout generic error: "+portalException.errMsg + ", Log reference ID:"+portalException.logRefId, DEBUG.ERROR);
}
//=============================================================================================


// Check respons error (e.g. not HTTP 200 OK status code).
//=============================================================================================
window.checkError = function(xhr, errorHandler, timeoutHandler)
{
	var allOk = true;

	// Set default timeout error handler (is no argument is proided).
	if ((timeoutHandler == undefined) || (timeoutHandler == null))
	{
		timeoutHandler = genericTimeoutHandler;
	}

	// Set default general error handler (is no argument is proided).
	if ((errorHandler == undefined) || (errorHandler == null))
	{
		errorHandler = genericErrorHandler;
	}

	// If the XML HTTP Request itself is faulty, throw a general error.
	if (isNothingness(xhr))
	{
		DEBUG.out("Unknown error", DEBUG.ERROR);
		var portalException = new PortalException();
		portalException.status 		= -1;
		portalException.errMsg 		= "Unknown error.";
		portalException.logRefId 	= -1;

		errorHandler(portalException);
		allOk = false;
	}

	if ((allOk) && (xhr.status != 200))
	{
		allOk = false;

		// Try to parse the response.
		try
		{
			var portalException = JSON.parse(xhr.responseText);
			if ( isNothingness(portalException.status) || isNothingness(portalException.errMsg) || isNothingness(portalException.logRefId))
			{
				throw("Returned error is of unexpected format (not JSON, of PortalException)");
			}
		}
		catch(e)
		{
			DEBUG.out("Returned error is of unexpected format (not JSON, of PortalException)", DEBUG.ERROR, e);
			var portalException = new PortalException();
		}

		// Check specific error code (401, 500 etc.).
		if (xhr.status == 401)  // Session timeout.
		{
			DEBUG.out("Error 401, Log reference ID:"+portalException.logRefId, DEBUG.ERROR);
			timeoutHandler(portalException);
		}
		else // Default general error (!200).
		{
			DEBUG.out("Error !200, Log reference ID:"+portalException.logRefId, DEBUG.ERROR);
			errorHandler(portalException);
		}

	}

	return allOk;
}
//=============================================================================================


// Encode a string to HTML enteties.
//=============================================================================================
// The function returns an array mapping of character to HTML entity.
// Arguments:
//
// [int		charsHandlingMethod]					Enables ignoring certain chars. See description inside the function body for explanation.
//												Default: 0 (ignoring none).
function getHTMLSpecialCharactersArray(charsHandlingMethod)
{

	if(typeof charsHandlingMethod === "undefined")
		charsHandlingMethod = 0;
	/**
	* Char to ignore	| ASCII	| Method bit	|
	* ------------------------------------------|
	* Space				| 32	|	1			|
	* Tab				| 9		|	2			|
	* Ampersand			| 38	|	3			|
	*
	*
	* For example:
	* Ignoring both Space and Tab require the Method value to be set to 3 		(0011).
	* Ignoring only Ampersand require the Method value to be set to 4 			(0100).
	* Ignoring both Space and Ampersand require the Method value to be set to 5 (0101).
	* Ignoring none require the Method value to be set to 0 					(0000).
	*/

	// Setting defaults
	if (isNothingness(charsHandlingMethod))
{
		charsHandlingMethod = 0;
	}

	ignoreChr_space	= (charsHandlingMethod & 1) === 1;
	ignoreChr_tab 	= (charsHandlingMethod & 2) === 1;
	ignoreChr_amp 	= (charsHandlingMethod & 4) === 1;
		
	// In order to avoid initializing of the array each time we store it in the global scope
	// and create one only if none exists.
	if (window.___CP_HTMLSpecialCharactersArray___ == undefined || window.___CP_HTMLSpecialCharactersArray___ == null)
	{
		HTMLSpecialCharactersArray = new Array();
		if (!ignoreChr_tab) HTMLSpecialCharactersArray[9] = '&nbsp;&nbsp;&nbsp;&nbsp;';
		if (!ignoreChr_space) HTMLSpecialCharactersArray[32] = '&nbsp;';
		HTMLSpecialCharactersArray[34] = '&quot;';
		if (!ignoreChr_amp) HTMLSpecialCharactersArray[38] = '&amp;';
		HTMLSpecialCharactersArray[39] = '&#039;';
		HTMLSpecialCharactersArray[60] = '&lt;';
		HTMLSpecialCharactersArray[62] = '&gt;';
		HTMLSpecialCharactersArray[160] = '&nbsp;';
		HTMLSpecialCharactersArray[161] = '&iexcl;';
		HTMLSpecialCharactersArray[162] = '&cent;';
		HTMLSpecialCharactersArray[163] = '&pound;';
		HTMLSpecialCharactersArray[164] = '&curren;';
		HTMLSpecialCharactersArray[165] = '&yen;';
		HTMLSpecialCharactersArray[166] = '&brvbar;';
		HTMLSpecialCharactersArray[167] = '&sect;';
		HTMLSpecialCharactersArray[168] = '&uml;';
		HTMLSpecialCharactersArray[169] = '&copy;';
		HTMLSpecialCharactersArray[170] = '&ordf;';
		HTMLSpecialCharactersArray[171] = '&laquo;';
		HTMLSpecialCharactersArray[172] = '&not;';
		HTMLSpecialCharactersArray[173] = '&shy;';
		HTMLSpecialCharactersArray[174] = '&reg;';
		HTMLSpecialCharactersArray[175] = '&macr;';
		HTMLSpecialCharactersArray[176] = '&deg;';
		HTMLSpecialCharactersArray[177] = '&plusmn;';
		HTMLSpecialCharactersArray[178] = '&sup2;';
		HTMLSpecialCharactersArray[179] = '&sup3;';
		HTMLSpecialCharactersArray[180] = '&acute;';
		HTMLSpecialCharactersArray[181] = '&micro;';
		HTMLSpecialCharactersArray[182] = '&para;';
		HTMLSpecialCharactersArray[183] = '&middot;';
		HTMLSpecialCharactersArray[184] = '&cedil;';
		HTMLSpecialCharactersArray[185] = '&sup1;';
		HTMLSpecialCharactersArray[186] = '&ordm;';
		HTMLSpecialCharactersArray[187] = '&raquo;';
		HTMLSpecialCharactersArray[188] = '&frac14;';
		HTMLSpecialCharactersArray[189] = '&frac12;';
		HTMLSpecialCharactersArray[190] = '&frac34;';
		HTMLSpecialCharactersArray[191] = '&iquest;';
		HTMLSpecialCharactersArray[192] = '&Agrave;';
		HTMLSpecialCharactersArray[193] = '&Aacute;';
		HTMLSpecialCharactersArray[194] = '&Acirc;';
		HTMLSpecialCharactersArray[195] = '&Atilde;';
		HTMLSpecialCharactersArray[196] = '&Auml;';
		HTMLSpecialCharactersArray[197] = '&Aring;';
		HTMLSpecialCharactersArray[198] = '&AElig;';
		HTMLSpecialCharactersArray[199] = '&Ccedil;';
		HTMLSpecialCharactersArray[200] = '&Egrave;';
		HTMLSpecialCharactersArray[201] = '&Eacute;';
		HTMLSpecialCharactersArray[202] = '&Ecirc;';
		HTMLSpecialCharactersArray[203] = '&Euml;';
		HTMLSpecialCharactersArray[204] = '&Igrave;';
		HTMLSpecialCharactersArray[205] = '&Iacute;';
		HTMLSpecialCharactersArray[206] = '&Icirc;';
		HTMLSpecialCharactersArray[207] = '&Iuml;';
		HTMLSpecialCharactersArray[208] = '&ETH;';
		HTMLSpecialCharactersArray[209] = '&Ntilde;';
		HTMLSpecialCharactersArray[210] = '&Ograve;';
		HTMLSpecialCharactersArray[211] = '&Oacute;';
		HTMLSpecialCharactersArray[212] = '&Ocirc;';
		HTMLSpecialCharactersArray[213] = '&Otilde;';
		HTMLSpecialCharactersArray[214] = '&Ouml;';
		HTMLSpecialCharactersArray[215] = '&times;';
		HTMLSpecialCharactersArray[216] = '&Oslash;';
		HTMLSpecialCharactersArray[217] = '&Ugrave;';
		HTMLSpecialCharactersArray[218] = '&Uacute;';
		HTMLSpecialCharactersArray[219] = '&Ucirc;';
		HTMLSpecialCharactersArray[220] = '&Uuml;';
		HTMLSpecialCharactersArray[221] = '&Yacute;';
		HTMLSpecialCharactersArray[222] = '&THORN;';
		HTMLSpecialCharactersArray[223] = '&szlig;';
		HTMLSpecialCharactersArray[224] = '&agrave;';
		HTMLSpecialCharactersArray[225] = '&aacute;';
		HTMLSpecialCharactersArray[226] = '&acirc;';
		HTMLSpecialCharactersArray[227] = '&atilde;';
		HTMLSpecialCharactersArray[228] = '&auml;';
		HTMLSpecialCharactersArray[229] = '&aring;';
		HTMLSpecialCharactersArray[230] = '&aelig;';
		HTMLSpecialCharactersArray[231] = '&ccedil;';
		HTMLSpecialCharactersArray[232] = '&egrave;';
		HTMLSpecialCharactersArray[233] = '&eacute;';
		HTMLSpecialCharactersArray[234] = '&ecirc;';
		HTMLSpecialCharactersArray[235] = '&euml;';
		HTMLSpecialCharactersArray[236] = '&igrave;';
		HTMLSpecialCharactersArray[237] = '&iacute;';
		HTMLSpecialCharactersArray[238] = '&icirc;';
		HTMLSpecialCharactersArray[239] = '&iuml;';
		HTMLSpecialCharactersArray[240] = '&eth;';
		HTMLSpecialCharactersArray[241] = '&ntilde;';
		HTMLSpecialCharactersArray[242] = '&ograve;';
		HTMLSpecialCharactersArray[243] = '&oacute;';
		HTMLSpecialCharactersArray[244] = '&ocirc;';
		HTMLSpecialCharactersArray[245] = '&otilde;';
		HTMLSpecialCharactersArray[246] = '&ouml;';
		HTMLSpecialCharactersArray[247] = '&divide;';
		HTMLSpecialCharactersArray[248] = '&oslash;';
		HTMLSpecialCharactersArray[249] = '&ugrave;';
		HTMLSpecialCharactersArray[250] = '&uacute;';
		HTMLSpecialCharactersArray[251] = '&ucirc;';
		HTMLSpecialCharactersArray[252] = '&uuml;';
		HTMLSpecialCharactersArray[253] = '&yacute;';
		HTMLSpecialCharactersArray[254] = '&thorn;';
		HTMLSpecialCharactersArray[255] = '&yuml;';

		window.___CP_HTMLSpecialCharactersArray___ = HTMLSpecialCharactersArray;
		}
	return window.___CP_HTMLSpecialCharactersArray___;
}
//=============================================================================================



// Encode each character which have a matching HTML entity in the ___CP_HTMLSpecialCharactersArray___ array.
//=============================================================================================
function HTMLEncode(str, nl2br, HTMLSpecialCharactersArray)
{
	if (isNothingness(str))
	{
		return "";
	}

    // Parse all input as string.
	str = String(str);

	// By default, nl2br set to true.
 	if (nl2br != false)
 	{
 		nl2br = true;
 	}

	if (isNothingness(HTMLSpecialCharactersArray))
	{
		HTMLSpecialCharactersArray = getHTMLSpecialCharactersArray();
	}
	
 	var output = "";

	for (var i=0; i<str.length; i++)
	{
		// Check if there's a matching HTML entity in the array.
    	if ( (HTMLSpecialCharactersArray[str.charCodeAt(i)] != undefined) && (HTMLSpecialCharactersArray[str.charCodeAt(i)] != null) )
		{
			output += HTMLSpecialCharactersArray[str.charCodeAt(i)];
		}
		// If char is CR
		else if ( (nl2br) && (str.charCodeAt(i) == 10) )
		{
			output += "<br>";
		}
		// If char pair is CR NL
		else if ( (nl2br) && ((str.charCodeAt(i)) == 13) && (i+1<str.length) && ((str.charCodeAt(i+1)) == 10) )
		{
			output += "<br>";
			i++; // Advance and exrta character as it's a pair.
		}
		// If char pair is NL CR (reversed).
		else if ( (nl2br) && ((str.charCodeAt(i)) == 10) && (i+1<str.length) && ((str.charCodeAt(i+1)) == 13) )
		{
			output += "<br>";
			i++; // Advance and exrta character as it's a pair.
		}
		else
		{
			output += str.charAt(i);
		}
    }

    return output;
}
//=============================================================================================


function isNothingness(variable)
{
	if ((variable == null) || (variable == undefined))
	{
		return true;
	}

	return false;
}


//=============================================================================================
// Assign default browser execption interceptor to a JS function.
window.onerror = genericErrorHandler;
//=============================================================================================

// =======================================================================================
function convertToGmt(date)
{
	var d = new Date(date * 1000);
    var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	var hour = d.getHours(), hourt;
	if ( hour > 11 ) {
		hour = hour==12 ? 12 : hour - 12;
		hourt = 1;
	} else {
		hour = hour==0 ? 12 : hour;
		hourt = 0;
	}

    var dateStr = shortDays[d.getDay()] + " " + (d.getMonth()+1) + "/" + (d.getDate()) + "/" + d.getFullYear() + " ";
	dateStr += (hour<10 ? '0' : '') + hour + ':' + (d.getMinutes()<10 ? '0' : '') +  d.getMinutes() + ' ' + (hourt==1 ? 'PM' : 'AM') + ' ';

	return dateStr;
}
// =======================================================================================

// Show form's progress indicator.
	//=============================================================================================
	function show_authn_progress_indicator(formId)
	{
    	DEBUG.out('Show progress indicator for form: '+formId);
		var showProgressIndicatorError = false;
		try
		{
		    window.authProgressIndicator = new ProgressIndicator();
	        authProgressIndicator.start("authProgressIndicator", document.getElementById("authentication_progress_indicator"), 10, 5);
			document.getElementById("authentication_progress_message").style.display='block';
		}
		catch(e)
		{
			showProgressIndicatorError = true;
			DEBUG.out('Show progress indicator failed.\n', DEBUG.ERROR, e);
		}

		return showProgressIndicatorError;
	}
	//=============================================================================================

	// Hide form's progress indicator.
	//=============================================================================================
	function hide_authn_progress_indicator(formId)
	{
    	DEBUG.out('Hide progress indicator for form: '+formId);
		var hideProgressIndicatorError = false;
		try
		{
		    authProgressIndicator.stop();
			document.getElementById("authentication_progress_message").style.display='none';
		}
		catch(e)
		{
			hideProgressIndicatorError = true;
			DEBUG.out('Hide progress indicator failed.\n', DEBUG.ERROR, e);
		}

		return hideProgressIndicatorError;
	}


//=============================================================================================
PORTAL_IS.TOOLS.addNamespace = function(namespace)
{
	DEBUG.out("Adding namespace [" + namespace + "].\n");
    try
    {
		eval("window." + namespace + " = {};");
	}
	catch(e)
	{
		DEBUG.out("Adding namespace [" + namespace + "] failed.\n", DEBUG.ERROR, e);
	}
}
//=============================================================================================

//TODO: Change namespace to different than TOOLS.

PORTAL_IS.TOOLS.notifiedTimeoutManagerVector = [];

PORTAL_IS.TOOLS.registerTimeoutManagerNotification = function(manager)
{
	PORTAL_IS.TOOLS.notifiedTimeoutManagerVector[PORTAL_IS.TOOLS.notifiedTimeoutManagerVector.length] = manager;
}

PORTAL_IS.TOOLS.TimeoutManagerCallback = [];

PORTAL_IS.TOOLS.TimeoutManager = function(duration, callback, name)
{
	//Call the JSON constructor.
	this.constructor(duration, callback, name)
};
PORTAL_IS.TOOLS.TimeoutManager.prototype =
{
	timerID: -1,
	duration: 0,
	name: "unknown",
	//Creates a new instance of TimeoutManager.
	constructor: function(duration, callback, name)
	{
		this.duration = duration;
		this.name = name;
		PORTAL_IS.TOOLS.TimeoutManagerCallback[this.name] = callback;
	},
	//Starts the timer.
	start: function()
	{
		if(this.timerID != -1)
			return;
		
		var milisecs = this.duration * 1000;
		this.timerID = setTimeout("PORTAL_IS.TOOLS.TimeoutManagerCallback['" + this.name + "']();", milisecs);
			
		DEBUG.out("PORTAL_IS.TOOLS.TimeoutManager: Timeout manager '" + this.name + "' started for " + this.duration + " seconds.");
	},
	//Stops the timer.
	stop: function()
	{
		if(this.timerID == -1)
			return;
			
		clearTimeout(this.timerID);
		this.timerID = -1;
			
		DEBUG.out("PORTAL_IS.TOOLS.TimeoutManager: Timeout manager '" + this.name + "' stopped.");
	},
	//Pings the timer - the timer will be restarted.
	notifyNetworkActivity: function()
	{
		if(this.timerID == -1)
			return;
		
		this.stop();
		this.start();

		DEBUG.out("PORTAL_IS.TOOLS.TimeoutManager: Timeout manager '" + this.name + "' notified.");
	}
};


// prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;
// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
  rng_pool[rng_pptr++] ^= x & 255;
  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
  rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if(rng_pool == null) {
  rng_pool = new Array();
  rng_pptr = 0;
  var t;
  if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for(t = 0; t < z.length; ++t)
      rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
  }  
  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
    t = Math.floor(65536 * Math.random());
    rng_pool[rng_pptr++] = t >>> 8;
    rng_pool[rng_pptr++] = t & 255;
  }
  rng_pptr = 0;
  rng_seed_time();
  //rng_seed_int(window.screenX);
  //rng_seed_int(window.screenY);
}

function rng_get_byte() {
  if(rng_state == null) {
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
      rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
    //rng_pool = null;
  }
  // TODO: allow reseeding after first request
  return rng_state.next();
}

function rng_get_bytes(ba) {
  var i;
  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
// Depends on jsbn.js and rng.js

// convert a (hex) string to a bignum object
function parseBigInt(str,r) {
  return new BigInteger(str,r);
}

function linebrk(s,n) {
  var ret = "";
  var i = 0;
  while(i + n < s.length) {
    ret += s.substring(i,i+n) + "\n";
    i += n;
  }
  return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
  if(b < 0x10)
    return "0" + b.toString(16);
  else
    return b.toString(16);
}

// *************** custom addition - begin *****************/
// PKCS#1 (type 1,FF) pad input string s to n bytes, and return a bigint
// Custom addition to origianl rsa.js
function pkcs1pad1(s,n) {
  
  if(n < s.length + 11) {
	alert("Message too long for RSA");
	return null;
  }
  
  var ba = new Array();

   ba[--n] = 0; // as if adding null to the string to be padded

  var i = s.length - 1;
  while(i >= 0 && n > 0) ba[--n] = s.charCodeAt(i--);
  ba[--n] = 0;
  
  while(n > 2) { 
	ba[--n] = 0xFF;
  }
  ba[--n] = 1;
  ba[--n] = 0;
  
  return new BigInteger(ba);
}
// *************** custom addition - end ******************/


// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
  if(n < s.length + 11) {
    //alert("Message too long for RSA");	    // **** custom addition - line commented
    return null;
  }
  var ba = new Array();

    // *************** custom addition - begin *****************/
   ba[--n] = 0; // as if adding null to the string to be padded
    // *************** custom addition - end ******************/

  var i = s.length - 1;
  while(i >= 0 && n > 0) ba[--n] = s.charCodeAt(i--);
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;

    // *************** custom addition - begin ******************/
    this.publicKeyInit = false;
    // *************** custom addition - end ******************/
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);

    // *************** custom addition - begin ******************/
    this.publicKeyInit = true; // custom addition
    // *************** custom addition - end ******************/

  }
  else
  {
    //alert("Invalid RSA public key");     // **** custom addition - line commented
      this.publicKeyInit = false; // custom addition
  }
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// *************** custom addition - begin ******************/
// Return the PKCS#1 RSA encryption of "text" according to specific pad type and len
// Custom addition to original rsa.js
function RSAEncryptEx(text,padType,padLen) {
	
  var m;
  switch (padType)
  {
	case 1:
		m = pkcs1pad1(text,padLen);
		break;
	
	case 2:
		m = pkcs1pad2(text,padLen);
		break;
	
	default:
		return null;
  }
  
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}
// *************** custom addition - end ******************/


// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
RSAKey.prototype.encryptEx = RSAEncryptEx;	// custom addition to original rsa.js
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;
/* ********************* END OF JSBN/RSA CODE *************************** */

window.cpRSA = function()
{
    //this.ENCRYPT_LENGTH = 128;
    //this.PKCS1_PADDING_TYPE = 1;	// 1 - FF, 2 - Random

    this.isPublicKeySet = false;
    this.m = "";	// part of public key
    this.e = "";	// part of public key
    this.token = null;    // if login requires to encrypt password with token

    this.oRSAkey = null;

    /* ***************************************************************** */
    this.initPublicKey = function()
    {
        this.oRSAkey = new RSAKey();	// jsbn library

        DEBUG.out('RSA: calling server to get public key.');
        sendAsynchronousRequest('RSASettings','',this.savePublicKey,this);
    }
    /* ***************************************************************** */

    /* ***************************************************************** */
    this.isReadyToEncrypt = function()
    {
        return this.isPublicKeySet;      
    }
    /* ***************************************************************** */

    /* ***************************************************************** */
    this.savePublicKey = function(xhrStatus, xhrResponse)
    {
        if (xhrStatus != 200)
        {
            DEBUG.out('RSA: get Settings failed. ('+xhrStatus+')', DEBUG.ERROR);
            this.isPublicKeySet = false;
            //alert("RSA Error!");
            return;
        }

        var rsaJSONObj = JSON.parse(xhrResponse);

        this.m = rsaJSONObj.m;
        this.e = rsaJSONObj.e;

        if (!isNothingness(rsaJSONObj.loginToken))
        {
            this.token = rsaJSONObj.loginToken;
        }

        // init inner rsa object
        this.oRSAkey.setPublic(this.m,this.e);

        // making sure rsa settngs are valid
        this.isPublicKeySet = this.oRSAkey.publicKeyInit;
        if (!this.isPublicKeySet)
        {
            DEBUG.out('savePublicKey: RSA public key invalid!\nm(' + this.m +')\ne(' + this.e + ')',DEBUG.ERROR);
        }
    }
    /* ***************************************************************** */


    /* ***************************************************************** */
    this.updatePublicKey = function(e, m)
    {        
        this.m = m;
        this.e = e;

        // init inner rsa object
        this.oRSAkey.setPublic(this.m,this.e);

        // making sure rsa settngs are valid
        this.isPublicKeySet = this.oRSAkey.publicKeyInit;
        if (!this.isPublicKeySet)
        {
            DEBUG.out('updatePublicKey: RSA public key invalid!\nm(' + this.m +')\ne(' + this.e + ')',DEBUG.ERROR);
        }
    }
    /* ***************************************************************** */


    /* ***************************************************************** */
    this.encrypt = function(text)
    {
    	// Try update keys from cookies.
    	var e = getCookie("RSASetting_e");
    	var m = getCookie("RSASetting_m");
        if ((!isNothingness(e)) && (!isNothingness(m)))
        {
        	DEBUG.out('Update RSA keys from cookie.');
        	this.updatePublicKey(e, m);
		}

        if (!this.isPublicKeySet)	// did you call this.initPublicKey?
        {
            DEBUG.out('Did you call initPublicKey? Did it fail?',DEBUG.ERROR);
            return "";
        }

        // supporting utf8 by replacing the chars with their
        // matching utf8 representation.
        // this way the encryption which uses the byte (and not char)
        // represenation will handle utf8 correctly
        text = unescape( encodeURIComponent( text ) );

        if (!isNothingness(this.token))
        {
            text = this.token + text;    
        }

        // call the ecryption itself
        var value = this.oRSAkey.encrypt(text);  //uses random padding

		// this is needed to match CheckPoint's string_to_bytes() 
		// reverse pairs of hex digits: A1B9 --> B9A1
			
        if (value.length > 2)
        {
            var newPass = "";
            for (var j=value.length-2; j>=0; j=j-2)
            {
                newPass = newPass.concat(value.substr(j,2));
            }
            value = newPass;
        }

        return value;
    }
    /* ***************************************************************** */

}

//Load RSA only if required.
if(typeof noJSCrypto == "undefined")
{
	window.cpRSAobj = new cpRSA();
	window.cpRSAobj.initPublicKey();
}

// Set namespace.
PORTAL_IS.VALIDATOR = {};

//=============================================================================================
PORTAL_IS.VALIDATOR.Validity = function()
{
	this.isValid = true;
	this.message = "";
	this.opaque = null;
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.ValidatorStack = function()
{
	this.validatorStack = new Array();
	this.invalidMessage = "";

	// Add valkidator to the stack.
	this.add = function(validator)
	{
		this.validatorStack.push(validator);
	}

	// Empty the validator stack.
	this.clear = function()
	{
		this.validatorStack = new Array();
	}

	// Set a single message for invalidity. The message will override any of the validators'
	// messages.
	this.setInvalidMessage = function(message)
	{
		this.invalidMessage = message;
	}

	// Evaluate the stack. Retutn a Validity object.
	this.evaluate = function(value)
	{
		var validity = new PORTAL_IS.VALIDATOR.Validity();

		var i;
		var validatorStackSize = this.validatorStack.length;

		// Check each validator.
		for (i=0; ((validity.isValid)&&(i<validatorStackSize)); i++)
		{
			validity = this.validatorStack[i].validate(value);
		}

		// In case of invalidation and a message is assigned to the stack override the message with the stack's one.
		if ((!validity.isValid) && (this.invalidMessage != ""))
		{
        	validity.message = this.invalidMessage;
		}

		// Return validity.
		return validity;
	}
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.Validator = function()
{
	// PRIVATE: (try not to use these methods).
	// The method used to validate the value. This method should return a PORTAL_IS.VALIDATOR.Validity object
	// representing the validity of the values as well as a message representing a reason for
	// being invalid.
	// OVERRIDE THIS METHOD WITH YOUR IMPLEMENTATION.
	this.validatingMethod = function(value, messageArr, argArr){return new PORTAL_IS.VALIDATOR.Validity();};

	// Arguments array to be passed to the validating method for a more generic usage (e.g. upper and lower range).
	this.argArr = new Array();

	// This message array should hold possible messages for various validation results.
	this.messageArr = new Array();


	// PUBLIC:
	// This function should be used to perform the validation.
	this.validate = function(value)
	{
		return this.validatingMethod(value, this.messageArr, this.argArr);
	}

	// Set arguments array to be passed to the validating method.
	this.setArgArr = function(argArr)
	{
		this.argArr = argArr;
	}

	// Assign message and matching id.
	this.setMessage = function(id, msg)
	{
		this.messageArr[id] = msg;
	}
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.IsNotEmpty = function()
{
	this.validatingMethod = function(value)
	{
		var validity = new PORTAL_IS.VALIDATOR.Validity();

		// Check validity.
		validity.isValid = (!isNothingness(value) && (value.length >= 1));

		// Assign messages.
		if (!validity.isValid)
		{
			validity.message = this.messageArr[0];
		}

		// Extra stuff.

		// Return validity.
		return validity;
	}

	// Set defaults.
	this.setMessage(0, "Value may not be empty.");
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.IsUnderMaxLength = function()
{
	// args=[max length, inclusive]
	// defaults: [0, true]

	this.validatingMethod = function(value)
	{
		var validity = new PORTAL_IS.VALIDATOR.Validity();

		var inclusive = (isNothingness(this.argArr[1]) ?  true : this.argArr[1] );

		// Check validity.
		validity.isValid = (!isNothingness(value) && ( inclusive ? (value.length <= this.argArr[0]) : (value.length < this.argArr[0]) ));

		// Assign messages.
		if (!validity.isValid)
		{
			validity.message = this.messageArr[0];
		}

		// Extra stuff.

		// Return validity.
		return validity;
	}

	// Set defaults.
	this.setMessage(0, "Value length should be under :"+this.argArr[1]);
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.IsNumeric = function()
{
	this.validatingMethod = function(value)
	{
		var validity = new PORTAL_IS.VALIDATOR.Validity();

		// Check validity.
		validity.isValid = !isNaN(value);

		// Assign messages.
		if (!validity.isValid)
		{
			validity.message = this.messageArr[0];
		}

		// Extra stuff.

		// Return validity.
		return validity;
	}

	// Set defaults.
	this.setMessage(0, "Value must be numeric.");
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.IsInteger = function()
{
	this.validatingMethod= function(value)
	{
		var validity = new PORTAL_IS.VALIDATOR.Validity();

		// Check validity.
		validity = new PORTAL_IS.VALIDATOR.IsNumeric().validate(value); // Check if numeric.

		if (validity.isValid)
		{
			validity.isValid = (parseInt(value) == value);

			// Assign messages.
			if (!validity.isValid)
			{
				validity.message = this.messageArr[0];
			}
		}

		// Return validity.
		return validity;
	}

	// Set defaults.
	this.setMessage(0, "Value must be an integer.");
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.IsNumberInRange = function()
{
	// args=[lower, upper, inclusive]
	// To ommit any of the limits pass null.
	// Examples:
	// 		value >  0 => arge=[0, null, false]
	// 		value <= 0 => arge=[null, 0, true]
	// Default args: [ null, null, false]
	this.validatingMethod= function(value)
	{
		if (isNothingness(this.argArr))
		{
			this.argArr = [null, null, false];
		}
		var lowerLimit 	= (isNothingness(this.argArr[0]) ? null : this.argArr[0]);
		var upperLimit 	= (isNothingness(this.argArr[1]) ? null : this.argArr[1]);
		var inclusive	= (this.argArr[2] == true);

		var validity = new PORTAL_IS.VALIDATOR.Validity();

		// Check validity.
		validity = new PORTAL_IS.VALIDATOR.IsNumeric().validate(value); // Check if numeric.

		if ((!isNothingness(this.argArr[0])) && (validity.isValid))
		{
			if (!(validity.isValid = (inclusive ? (value >= this.argArr[0]) : (value > this.argArr[0])) ))
			{
				// Assign messages.
				validity.message = this.messageArr[0];
			}
		}

		// Check validity.
		if ((!isNothingness(this.argArr[1])) && (validity.isValid))
		{
			if (!(validity.isValid = (inclusive ? (value <= this.argArr[1]) : (value < this.argArr[1])) ))
			{
				// Assign messages.
				validity.message = this.messageArr[1];
			}
		}

		// Return validity.
		return validity;
	}

	// Set defaults.
	this.setMessage(0, "Value is below valid range.");
	this.setMessage(1, "Value is above valid range.");
	this.setArgArr([null, null, false]); // Set no range and exclusive.
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.IsPositiveNumber = function()
{
	// Set defaults.
	this.setMessage(0, "Value must be a positive integer.");
	this.setArgArr([0, null, false]); // ==> value > 0
}
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.IsNegativeNumber = function()
{
	// Set defaults.
	this.setMessage(0, "Value must be a negative integer.");
	this.setArgArr([null, 0, false]); // ==> value < 0
}
//=============================================================================================



//=============================================================================================
// Extend Validator.
PORTAL_IS.VALIDATOR.IsNotEmpty.prototype 		= new PORTAL_IS.VALIDATOR.Validator();
PORTAL_IS.VALIDATOR.IsUnderMaxLength.prototype 	= new PORTAL_IS.VALIDATOR.Validator();
PORTAL_IS.VALIDATOR.IsNumeric.prototype 		= new PORTAL_IS.VALIDATOR.Validator();
PORTAL_IS.VALIDATOR.IsInteger.prototype 		= new PORTAL_IS.VALIDATOR.Validator();
PORTAL_IS.VALIDATOR.IsNumberInRange.prototype	= new PORTAL_IS.VALIDATOR.Validator();

// Extend others validators.
PORTAL_IS.VALIDATOR.IsPositiveNumber.prototype = new PORTAL_IS.VALIDATOR.IsNumberInRange();
PORTAL_IS.VALIDATOR.IsNegativeNumber.prototype = new PORTAL_IS.VALIDATOR.IsNumberInRange();
//=============================================================================================



//=============================================================================================
PORTAL_IS.VALIDATOR.evaluateValidatorStack = function(validatorStack, value)
{
	var validity = new PORTAL_IS.VALIDATOR.Validity();
	
	var i;
	var validatorStackSize = validatorStack.length;

	for (i=0; ((validity.isValid)&&(i<validatorStackSize)); i++)
	{
		validity = validatorStack[i].validate(value);
	}

	// Return validity.
	return validity;
}
//=============================================================================================






// Portal IS's view manager.
window.ViewManager = function()
{
	// Initialize view manager.
	//=============================================================================================
	this.init = function()
	{
		DEBUG.out("ViewManager::init");

		// Bind history change handler.
		$(window).bind('hashchange', viewManager.handleHistoryChange);        
	}
	//=============================================================================================



	// Hash to view mapping, enables us to set display another value than the actual view name.
	//==================================================================================================================
	this.hashViewMap = new Array();

	// Set default view and hash, override if you will:
	this.hashViewMap_defaultView = "Init";
	this.hashViewMap_defaultHash = "Init";

	//              Hash name									View name
	//________________________________________________________________________________________________________________
	/*
	Example:
	this.hashViewMap["Init"]								=	"Init";
	this.hashViewMap["Authentication"]						=	"Authentication";
	this.hashViewMap["SingleIncidentReview"]				=	"SingleIncidentReview";
	this.hashViewMap["SenderListAllQuarantinedEmails"]		=	"SenderListAllQuarantinedEmails";
	this.hashViewMap["MainWithMenuView"]					=	"MainWithMenuView";
	this.hashViewMap["Menu"]								=	"Menu";
	this.hashViewMap["Logout"]								=	"Logout";
	this.hashViewMap["MainView"]							=	"MainView";
	this.hashViewMap["Error"]								=	"Error";
	*/

	// Get View name from Hash name.
	this.hash2View = function(hash)
	{
		var view = this.hashViewMap[hash];

		if (isNothingness(view))
		{
			view = this.hashViewMap_defaultView;
		}
		return view;
	}


	// Get Hash name from View name.
	this.view2Hash = function(view)
	{
		var hash = this.hashViewMap_defaultHash;
		for (key in this.hashViewMap)
		{
			if (this.hashViewMap[key] == view)
			{
				var hash = key;
			}
		}
		return hash;
	}
	//==================================================================================================================



	// HASH/HISTORY RELATED METHODS
	// _________________________________________________________________________________________________________________


	// Return the address hash, unparsed.
	//=============================================================================================
	this.getAddressHash = function()
	{
		return top.location.hash.replace('#','');
	}
	//=============================================================================================


    // Handle history changes (back/reload).
    // OVERRIDE ME.
	//=============================================================================================
	this.handleHistoryChange = function(e, ui)
	{
		DEBUG.out("ViewManager::handleHistoryChange, unhandled hash change.");
	}
	//=============================================================================================


	//==================================================================================================================
	this.generateHash = function(view, data)
    {
    	var outputStr = "";
        var dataStr = "";

		dataStr = "/"+$.base64Encode(JSON.stringify(data));

		outputStr = "#"+this.view2Hash(view) + dataStr;

		return outputStr;
    }
    //==================================================================================================================

	//==================================================================================================================
	this.parseHash = function()
	{
		var hash = this.getAddressHash();

		var hashObj = {};
        hashObj.view = null;
        hashObj.data = {};

        var splitPoint = hash.indexOf("/");

        if (splitPoint > -1)
        {
        	hashObj.view = hash.substr(0, splitPoint);

        	if (hash.length > splitPoint)
			{
				try
				{
					hashObj.data = JSON.parse($.base64Decode(hash.substring(splitPoint+1, hash.length)));
				}
				catch (e)
				{
					DEBUG.out('ViewManager::parseHash Error while parsing hash data.', DEBUG.ERROR, e);
				}
			}
		}
		else if (hash != "")
		{
		    hashObj.view = this.hash2View(hash);
		}

		return hashObj;
	}
	//==================================================================================================================


	//==================================================================================================================
	this.changeHash = function(view, data, quietly)
	{
		DEBUG.out('ViewManager::changeHash.');


		if (isNothingness(quietly))
		{
			quietly = false;
		}

		if (quietly)
		{
			DEBUG.out('ViewManager::changeHash, Changing hash quietly.');
			viewManager.ignoreHashChange = true;
		}

		$(window).history('add', this.generateHash(view, data));
	}
	//==================================================================================================================
}	