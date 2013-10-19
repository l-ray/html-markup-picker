

var TypeStrategyEnum = { "CONTAINER" : Number(0), "EVENT" : Number(1), "TITLE" : Number(2), "DATE" : Number(3), "TIME" : Number(4),   "LOCATION" : Number(5),  "DESCRIPTION" : Number(6), "PRICE" : Number(7) };
Object.freeze(TypeStrategyEnum);

var AbstractTypeStrategy = Class.create();

AbstractTypeStrategy.prototype = {
	initialize: function() {},
	returnPatternMarked: function(text) {
		try {		
			return text.replace(new RegExp("("+this.process(text)+")"),"<span class=\"marked\">$1</span>");
		} catch (e) {
			console.log("returnPatternMarked:"+e);			
			return text;
		};
	}

};

AbstractTypeStrategy.instanceFor = function(typeEnum) {
		switch (typeEnum) {
			case TypeStrategyEnum.DATE: return new DateTypeStrategy();
			case TypeStrategyEnum.TIME: return new TimeTypeStrategy();
			case TypeStrategyEnum.LOCATION: return new LocationTypeStrategy();
			case TypeStrategyEnum.PRICE: return new PriceTypeStrategy();
			default: return new DefaultTypeStrategy();
		}
	};


var DateTypeStrategy = Class.create(AbstractTypeStrategy, {
	
	process: function(text) {
		var dateFormats = $A();		
		// dd.mm.yyyy		
		dateFormats[0] =  /[0-9]{1,2}\.[0-1]?[0-9][\. ](19|20)?[0-9]{2}/;
		var regExStart = $A();
		for (var i=0; i < dateFormats.size(); i++) {
			regExStart = text.match(dateFormats[i]);
			if (regExStart != null && regExStart.size() > 0) {
				return regExStart[0];			
			}
		}
		throw "no date found";
	},
	toString: function() {
		return "DateTypeStrategy";
	}
});

var TimeTypeStrategy = Class.create(AbstractTypeStrategy, {
	process: function(text) {
		var formats = $A();		
		// Time with "Uhr"		
		formats[0] =  /[0-2]?[0-9](:[o0-9]{2})? *[Uu][Hh][Rr]/;
		formats[1] =  /[0-2]?[0-9]:[o0-9]{2}/;
		var regExStart = $A();
		for (var i=0; i < formats.size(); i++) {
			regExStart = text.match(formats[i]);
			if (regExStart != null && regExStart.size() > 0) {
				return regExStart[0];			
			}
		}
		throw "no time found";
	},
	toString: function() {
		return "TimeTypeStrategy";
	}
});

var LocationTypeStrategy = Class.create(AbstractTypeStrategy, {
	process: function(text) {
		return "Location"+text;
	},
	toString: function() {
		return "LocationTypeStrategy";
	}
});

var PriceTypeStrategy = Class.create(AbstractTypeStrategy, {
	process: function(text) {
		var formats = $A();		
		// Zahl mit anschließendem "euro" bzw. "€"		
		formats[0] =  /[1-9][0-9\,\. ]*([Ee][Uu][Rr][Oo]|€)/g;
		formats[1] = /for free/;
		var regExStart = $A();
		for (var i=0; i < formats.size(); i++) {
			regExStart = text.match(formats[i]);
			if (regExStart != null && regExStart.size() > 0) {
				return regExStart[0];			
			}
		}
		throw "no price found for:"+text;
	},
	toString: function() {
		return "PriceTypeStrategy";
	}
});

var DefaultTypeStrategy = Class.create(AbstractTypeStrategy, {
	process: function(text) {
		return "Default"+text;
	},
	toString: function() {
		return "DefaultTypeStrategy";
	}
});

