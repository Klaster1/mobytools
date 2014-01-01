// ==UserScript==
// @name          MobyTools: fixed sidebar
// @author        Klaster_1
// @namespace     mobygames.com/mobytools
// @description   Makes sidebar always visible
// @include       *.mobygames.com/*
// @version       1.0
// ==/UserScript==

(function fixSidebar () {
	var sidebar = document.querySelector("#lpContainer .leftPanel");
	var content = document.querySelector(".docContents");

	// Pin it
	sidebar.parentNode.style.width = sidebar.getBoundingClientRect().width + "px";
	sidebar.style.position = "fixed";

	// Remove empty top space when scrolled
	function setTop () {
		var contentTop = content.getBoundingClientRect().top;
		sidebar.style.top = (contentTop > 0 ? contentTop : 0) + "px";
	}
	window.addEventListener("scroll", setTop);
	setTop();

	// Animate transitions
	sidebar.style.transition = "0.3s top";
})();