    (function() {
		var prefix = "file:///home/lray/workspace/javascript/HtmlMarkupPicker/WebContent/";
    	var jsToBeLoaded = [
				"lib/prototype.js",
				"js/model/class.XPathElement.js",
				"js/model/class.XPathElementCollection.js",
				"js/model/class.PatternTreeElement.js",
				"js/model/class.ClickContext.js",
				"js/model/class.AbstractClickState.js",
				"js/model/class.AbstractTypeStrategy.js",
				"js/model/class.ClickStateSelect.js",
				"js/model/class.ClickStateValidate.js",
				"js/model/class.ClickStateEdit.js",
				"js/model/func.getXPathForNode.js",
				"js/model/func.viewUtils.js"
	];
	
		var headTag = document.getElementsByTagName("script")[0];
		for (var i=0; i<jsToBeLoaded.length; i++) {
			var scriptTag =	document.createElement("script");
			scriptTag.type="text/javascript";
			scriptTag.src=prefix+jsToBeLoaded[i];
			scriptTag.async=false;
			scriptTag.onerror=function(e){console.log("error:"+e.message);};
			headTag.parentNode.insertBefore(scriptTag,headTag);
		}
		
		var initScriptTag = document.createElement("script");
		initScriptTag.type="text/javascript";
		headTag.parentNode.insertBefore(document.createTextNode("document.observe(\"dom:loaded\", function() {initCS();	});"),document.getElementsByTagName("script")[12]);
		
		headTag.appendChild(initScriptTag);
		
	})();

    var documentRoot;

    var aPathInAction;

    var aPathForValidation;    

    var aPathBeingSaved;

    var activePatternTreeElement;
  
    var bDebug = false;

    var myMappingDocument;

    var clickContext;

    var SELECT_FRAME = "example1";

    var VALIDATION_FRAME = "example2";

    var MERGE_FRAME = "exampleFrame";

function initCS() {
   var body = $(document.getElementsByTagName("body")[0]);
   var domTree = $A(body.childElements());
   body.insert({top:new Element("div",{id:MERGE_FRAME})});
   body.insert({top:new Element("div",{id:SELECT_FRAME})});
   body.insert({top:new Element("div",{id:VALIDATION_FRAME})});
   body.insert({top:new Element("div",{id:"generalization"})});
   body.insert({top:new Element("div",{id:"xPathToString",style:"clear:both;"})});
   body.insert({top:new Element("div",{id:"generalizationControl"})});
   body.insert({top:new Element("div",{id:"xPathToStringControl",style:"clear:both;"})});
   body.insert({top:new Element("div",{id:"treeNode"})});
   body.insert({top:new Element("div",{id:"hint"}).insert("<h1>Schritte</h1><ol>"+
	"<li>gewuenschten Bereich auswaehlen/anklicken. Dieser wird daraufhin markiert und invertiert.Klickstatus wechselt zu &apos;passiv&apos;.</li>"+
	"<li>weiteren geweunschten Bereich auswaehlen, durch den der eigentliche Klickpfad berechnet wird</li>"+
	"<li>Auswahl, welcher Typ ausgewaehlt wurde, sowie Benamung (Datum/Event/Location)</li>"+
	"<li>Einspeichern in Markierungsbaum</li></ol>")});
   
   domTree.each(function(n){$("exampleFrame").insert(n);});

//    var markedText;
     
//     var hResults = new $H();

	
  myMappingDocument = new PatternTreeElement();

	myMappingDocument.setName("ROOT");
  	myMappingDocument.setXPathCollection(new XPathElementCollection(new XPathElement("html"),new XPathElement("body")));	


  myMappingDocument.setDocument($(MERGE_FRAME));

  
  activePatternTreeElement = myMappingDocument;

	clickContext = new ClickContext(activePatternTreeElement);
	myMappingDocument.setContext(clickContext);

myMappingDocument.setDocument($(MERGE_FRAME));

documentRoot = activePatternTreeElement.getDocument();


$('treeNode').appendChild(myMappingDocument.paint());

  clickContext.setSelectState();
}




