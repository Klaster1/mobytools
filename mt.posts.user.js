// ==UserScript==
// @name          MobyTools: new posts
// @author        Klaster_1
// @namespace     mobygames.com/mobytools
// @description   Navigates between new forum posts, scrolls to the first new
// @include       *.mobygames.com/forums/dga,*/dgb,*/dgm,*
// @version       1.0
// ==/UserScript==

(function () {
	"use strict";

	var mode = document.querySelector("#dgViewModeSelector").textContent;

	if (mode === "threaded") {
		var all = [].slice.call(document.querySelectorAll(".dgFlatMessageHeader>b>a"));
		var unread = all.filter(function (a) {return !!a.nextElementSibling});

		all.forEach(function (a) {a.href = "#" + a.name});

		var goTo = function (array, direction) {
			if (!array || !array.length || !array[0]) return;

			var i = array.map(function (a) {return a.hash}).indexOf(location.hash);

			switch (direction) {
				case "next":
					i = array.length - 1 === i ? 0 : i + 1;
					break;
				case "prev":
					i = i === 0 ? array.length - 1 : i - 1;
					break;
				case "first":
					i = 0;
					break;
				case "current":
				default:
			}

			array[i].click();
		}

		document.addEventListener("keyup", function (e) {
			if (e.target.value) return;
			var array = e.shiftKey ? unread : all;

			if (e.which === 74) { // J
				goTo(array, "next");
			} else
			if (e.which === 75) { // K
				goTo(array, "prev");
			} else 
			if (e.which === 66) { // B
				goTo(array, "current");
			}
		});

		goTo(unread, "first");
	} else
	if (mode === "flat") {

	}
})();