/*  perljs v0.3.2 https://github.com/bcowgill/perljs
    Brent Cowgill <brent.cowgill@workshare.com> (http://github.com/bcowgill)
    The Unlicense http://unlicense.org/
*/
(function(root, factory) {
    "use strict";
    if ("function" === typeof define && define.amd) {
        void 0;
        define([], factory);
    } else if ("object" === typeof module && module.exports) {
        void 0;
        module.exports = factory();
    } else {
        void 0;
        root.perljs = factory();
    }
})(this, function() {
    "use strict";
    var perljs = {
        name: "perljs"
    };
    perljs.version = "0.3.2";
    perljs._console = console;
    perljs._valueMap = {
        "null": null,
        undefined: void 0,
        undef: void 0,
        empty: "",
        "true": true,
        "false": false,
        NaN: NaN,
        Infinity: 1 / 0,
        "-Infinity": -(1 / 0)
    };
    perljs._value = function(string) {
        var value = string;
        if (!/^function|object|array$/.test(typeof string)) {
            value = Number(string);
            if (isNaN(value)) value = string in perljs._valueMap ? perljs._valueMap[string] : string;
        }
        return value;
    };
    perljs._stringify = function(mixed) {
        if ("function" === typeof mixed) return perljs._stringify(mixed());
        if (null === mixed || void 0 === mixed || "number" === typeof mixed && (isNaN(mixed) || mixed === 1 / 0 || mixed === -(1 / 0))) mixed = ""; else if ("object" !== typeof mixed) mixed = mixed.toString();
        return mixed;
    };
    perljs.q = function(string, open, close) {
        open = open || "'";
        close = close || open;
        if (Array.isArray(string)) return perljs.qA(string, open, close);
        if ("object" === typeof string && null !== string) return perljs.qO(string, open, close);
        return open + perljs._stringify(string) + close;
    };
    perljs.qq = function(string, open, close) {
        return perljs.q(string, open || '"', close);
    };
    perljs.qw = function(string) {
        return string.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/g);
    };
    perljs.qA = function(aArray, open, close) {
        var aNewArray = [];
        aArray.forEach(function(value) {
            aNewArray.push(perljs.q(value, open, close));
        });
        return aNewArray;
    };
    perljs.qqA = function(aArray, open, close) {
        return perljs.qA(aArray, open || '"', close);
    };
    perljs.qO = function(oObject, open, close) {
        var oNewObject = {};
        Object.keys(oObject).forEach(function(key) {
            oNewObject[key] = perljs.q(oObject[key], open, close);
        });
        return oNewObject;
    };
    perljs.qqO = function(oObject, open, close) {
        return perljs.qO(oObject, open || '"', close);
    };
    perljs.qwm = function(string) {
        var oMap = {}, key;
        perljs.qw(string).forEach(function(keyValue) {
            if ("undefined" === typeof key) key = keyValue; else {
                oMap[key] = perljs._value(keyValue);
                key = void 0;
            }
        });
        if ("undefined" !== typeof key) {
            oMap[key] = void 0;
            perljs._console.warn("Odd number of elements in hash assignment from " + perljs.q(string));
        }
        return oMap;
    };
    perljs.mapFromString = perljs.qwm;
    perljs.mapFromArray = function(aArray) {
        var oMap = {}, key;
        aArray = aArray || [];
        aArray.forEach(function(keyValue) {
            if ("undefined" === typeof key) key = String(keyValue); else {
                oMap[key] = keyValue;
                key = void 0;
            }
        });
        if ("undefined" !== typeof key) {
            oMap[key] = void 0;
            perljs._console.warn("Odd number of elements in hash assignment from [" + aArray.join(", ") + "]");
        }
        return oMap;
    };
    perljs.reverseMap = function(oMap, fn) {
        var oReverseMap = {};
        fn = fn || function(value) {
            return value;
        };
        Object.keys(oMap).forEach(function(key) {
            oReverseMap[fn(oMap[key], oReverseMap)] = perljs._value(key);
        });
        return oReverseMap;
    };
    perljs.makeMap = function(aArray, defaultValue) {
        var fn, oMap = {}, truth = function() {
            return true;
        }, fnDefaultValue = function() {
            return defaultValue;
        };
        aArray = aArray || [];
        fn = "undefined" === typeof defaultValue ? truth : "function" === typeof defaultValue ? defaultValue : fnDefaultValue;
        aArray.forEach(function(key) {
            oMap[String(key)] = fn(key);
        });
        return oMap;
    };
    perljs.x = function(token, repeat) {
        var idx, string = "";
        token = perljs._stringify(token);
        if (isNaN(repeat)) perljs._console.warn("Argument " + perljs.qq(repeat) + " isn't numeric in repeat .x()");
        repeat = parseInt(repeat);
        for (idx = 0; idx < repeat; idx += 1) string += token;
        return string;
    };
    return perljs;
});