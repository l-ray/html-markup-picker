// JavaScript Document


function removeBGColor(rootNode) {

	var tmpNode2 = rootNode.childNodes;

	if (tmpNode2 != undefined ) {
    for (var i=0; i < tmpNode2.length; i++) {
  		if (tmpNode2[i].nodeType == 1) {
  			tmpNode2[i].removeAttribute("style","");
  			tmpNode2[i].removeAttribute("bgcolor","");
  			removeBGColor(tmpNode2[i]);
  		}
  	}
  }
}

