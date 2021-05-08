






;(function (root, factory) {
	
	'use strict'
	
	if (typeof define === 'function' && define.amd) {
		
		define([], factory)
	} else if (typeof module === 'object' && module.exports) {
		
		
		
		module.exports = factory()
	} else {
		
		root.perljs = factory()
	}
})(this, function () {
	'use strict'

	
	
	
	var singleQuote = "'"
	
	var perljs = { name: 'perljs' }

	perljs.version = '0.3.9'
	perljs.VERSION = perljs.version 

	
	perljs._console = console

	
	function truth() {
		return true
	}

	
	perljs._valueMap = {
		
		null: null,
		undefined: void 0,
		undef: void 0, 
		empty: '', 
		
		true: true,
		false: false,
		NaN: Number.NaN,
		Infinity: Number.POSITIVE_INFINITY,
		'-Infinity': Number.NEGATIVE_INFINITY,
	}

	
	perljs._value = function (string) {
		var value = string
		if (!/^function|object|array$/.test(typeof string)) {
			value = Number(string)
			if (Number.isNaN(value)) {
				value =
					string in perljs._valueMap
						? perljs._valueMap[string]
						: string
			}
		}
		return value
	}

	
	perljs._stringify = function (mixed) {
		
		if ('function' === typeof mixed) {
			return perljs._stringify(mixed())
		}
		if (
			mixed === null ||
			mixed === undefined ||
			('number' === typeof mixed &&
				(Number.isNaN(mixed) ||
					mixed === Number.POSITIVE_INFINITY ||
					mixed === Number.NEGATIVE_INFINITY))
		) {
			mixed = ''
		}
		
		else if ('object' !== typeof mixed) {
			mixed = mixed.toString()
		}
		return mixed
	}

	
	perljs.q = function (string, open, close) {
		
		open = open || singleQuote
		close = close || open
		if (Array.isArray(string)) {
			return perljs.qA(string, open, close)
		}
		if ('object' === typeof string && string !== null) {
			return perljs.qO(string, open, close)
		}
		return open + perljs._stringify(string) + close
	}

	
	perljs.qq = function (string, open, close) {
		return perljs.q(string, open || '"', close)
	}

	
	perljs.qw = function (string) {
		return string.replace(/^\s+/, '').replace(/\s+$/, '').split(/\s+/g)
	}

	
	perljs.qA = function (aArray, open, close) {
		var aNewArray = []
		aArray.forEach(function (value) {
			aNewArray.push(perljs.q(value, open, close))
		})
		return aNewArray
	}

	
	perljs.qqA = function (aArray, open, close) {
		return perljs.qA(aArray, open || '"', close)
	}

	
	perljs.qO = function (oObject, open, close) {
		var oNewObject = {}
		Object.keys(oObject).forEach(function (key) {
			oNewObject[key] = perljs.q(oObject[key], open, close)
		})
		return oNewObject
	}

	
	perljs.qqO = function (oObject, open, close) {
		return perljs.qO(oObject, open || '"', close)
	}

	
	perljs.qwm = function (string) {
		var oMap = {},
			key
		perljs.qw(string).forEach(function (keyValue) {
			if ('undefined' === typeof key) {
				key = keyValue
			} else {
				oMap[key] = perljs._value(keyValue)
				key = void 0
			}
		})
		if ('undefined' !== typeof key) {
			oMap[key] = void 0
			perljs._console.warn(
				'Odd number of elements in ' +
					'hash assignment from ' +
					perljs.q(string)
			)
		}
		return oMap
	}
	
	perljs.mapFromString = perljs.qwm

	
	perljs.mapFromArray = function (aArray) {
		var oMap = {},
			key
		aArray = aArray || []
		aArray.forEach(function (keyValue) {
			if ('undefined' === typeof key) {
				key = String(keyValue)
			} else {
				oMap[key] = keyValue
				key = void 0
			}
		})
		if ('undefined' !== typeof key) {
			oMap[key] = void 0
			perljs._console.warn(
				'Odd number of elements in hash assignment from [' +
					aArray.join(', ') +
					']'
			)
		}
		return oMap
	}

	
	perljs.reverseMap = function (oMap, function_) {
		var oReverseMap = {}
		function_ =
			function_ ||
			function (value) {
				return value
			}
		Object.keys(oMap).forEach(function (key) {
			oReverseMap[function_(oMap[key], oReverseMap)] = perljs._value(key)
		})
		return oReverseMap
	}

	
	perljs.makeMap = function (aArray, defaultValue) {
		
		var function_,
			oMap = {},
			functionDefaultValue = function () {
				return defaultValue
			}
		aArray = aArray || []
		
		
		function_ =
			'undefined' === typeof defaultValue
				? truth
				: 'function' === typeof defaultValue
				? defaultValue
				: functionDefaultValue
		
		aArray.forEach(function (key) {
			oMap[String(key)] = function_(key)
		})
		return oMap
	}

	
	perljs.x = function (token, repeat) {
		var index,
			string = ''
		token = perljs._stringify(token)
		
		
		if (isNaN(repeat)) {
			perljs._console.warn(
				'Argument ' +
					perljs.qq(repeat) +
					' isn’t numeric in repeat .x()'
			)
		}
		repeat = Number.parseInt(repeat)
		for (index = 0; index < repeat; index += 1) {
			string += token
		}
		return string
	}

	

	return perljs
})
