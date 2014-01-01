// ==UserScript==
// @name          MobyTools: sidebar links
// @author        Klaster_1
// @namespace     mobygames.com/mobytools
// @description   Adds cutom sections into sidebar
// @include       *.mobygames.com/*
// @version       1.0
// ==/UserScript==

(function updateSidebar () {
	"use strict";

	function appendTo (parent, node) {
		parent.appendChild(node);
		return parent;
	}
	function toNameData (object) {
		return Object.keys(object).map(function (name) {
			return {
				name: name,
				data: object[name]
			};
		}).pop();
	}
	function toGroupNode (group) {
		var div = document.createElement("div");
		div.classList.add("mmhBorder");
		div.innerHTML = "<div class=bulletMenu><h3 class=m5></h3><ul class=mmhBody></ul></div>";
		div.querySelector("h3").textContent = group.name;

		group.data
		.map(toNameData)
		.map(toLinkNode)
		.reduce(appendTo, div.querySelector("ul"));
	
		return div;
	}
	function toLinkNode (link) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.textContent = link.name;
		a.setAttribute("href", link.data);
		li.appendChild(a);
		return li;
	}
	function addGroups (groups) {
		groups
		.map(toNameData)
		.map(toGroupNode)
		.reduce(appendTo, document.querySelector("#lpContainer .leftPanel"));
	}

	addGroups([
		{"Links": [
			{"Approvals": "/user/sheet/view/approvals"},
			{"Forums": "/forums"},
			{"New Games": "/stats/recent_entries"}
		]}
	]);
})();