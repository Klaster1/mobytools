// ==UserScript==
// @name          MobyTools: editor buttons
// @author        Klaster_1
// @namespace     mobygames.com/mobytools
// @description   Adds formatting buttons to text inputs
// @include       *.mobygames.com/*
// @version       2.0.1
// @downloadURL   https://raw.github.com/klaster1/mobytools/master/mt.editor.user.js
// @updateURL     https://raw.github.com/klaster1/mobytools/master/mt.editor.meta.js
// @icon          https://raw.github.com/klaster1/mobytools/master/images/icon.png
// ==/UserScript==

(function updateEditor () {
	"use strict";

	var Editor = (function () {
		var prototype = {
			simpleWrap: function (tag, bbcode) {
				return function () {
					var ta=this.element;
					var sel={start:ta.selectionStart,end:ta.selectionEnd,length:ta.selectionEnd-ta.selectionStart,text:ta.value.substr(ta.selectionStart,ta.selectionEnd-ta.selectionStart)};
					if(bbcode){var bl='[';var br=']'}else{bl='<';br='>'};
					ta.value=ta.value.substr(0,sel.start)+bl+tag+br+sel.text+bl+'/'+tag+br+ta.value.substr(sel.end);
				}
			},
			linkWrap: function (tag, property) {
				return function () {
					var ta=this.element;
					var sel={start:ta.selectionStart,end:ta.selectionEnd,length:ta.selectionEnd-ta.selectionStart,text:ta.value.substr(ta.selectionStart,ta.selectionEnd-ta.selectionStart)};
					var value='';
					var tagExist=false;
					var pattern=RegExp(property+'="(.*)"','i');
					if(tag=='moby') value=sel.text;
					if(sel.length>15&&RegExp('<(\/)?'+tag+'.*>','i').test(sel.text)){
						value=sel.text.match(pattern)[1];
						tagExist=true;
					};
					var tmp=prompt('Please enter the value of '+property+':',value);
					if(tmp==null) return;
					if(!tagExist) ta.value=ta.value.substr(0,sel.start)+'<'+tag+' '+property+'="'+tmp+'">'+sel.text+'</'+tag+'>'+ta.value.substr(sel.end)
					else ta.value=ta.value.substr(0,sel.start)+sel.text.replace(pattern,property+'="'+tmp+'"')+ta.value.substr(sel.end);
				}
			},
			listWrap:function(tag){
				return function () {
					var ta=this.element;
					var sel={start:ta.selectionStart,end:ta.selectionEnd,length:ta.selectionEnd-ta.selectionStart,text:ta.value.substr(ta.selectionStart,ta.selectionEnd-ta.selectionStart)};
					ta.value=ta.value.substr(0,sel.start)+'<'+tag+'>\n'+sel.text.replace(/(?:\n|^)(.*)/g,'\t<li>$1<\/li>\n')+'</'+tag+'>'+ta.value.substr(sel.end);
				}
			},
			tagSide:function(tag,side){
				return function () {
					var ta=this.element;
					var sel={start:ta.selectionStart,end:ta.selectionEnd,length:ta.selectionEnd-ta.selectionStart,text:ta.value.substr(ta.selectionStart,ta.selectionEnd-ta.selectionStart)};
					if(side=='left') ta.value=ta.value.substr(0,sel.start)+'<'+tag+'/>\n'+ta.value.substr(sel.start)
					else if(side=='right') ta.value=ta.value.substr(0,sel.end)+'\n<'+tag+'>\n'+ta.value.substr(sel.end);
				}
			},
			symbolWrap:function(left,right){
				return function () {
					var ta=this.element;
					var sel={start:ta.selectionStart,end:ta.selectionEnd,length:ta.selectionEnd-ta.selectionStart,text:ta.value.substr(ta.selectionStart,ta.selectionEnd-ta.selectionStart)};
					ta.value=ta.value.substr(0,sel.start)+left+sel.text+right+ta.value.substr(sel.end);
				}
			},
			toCssClass: function (string) {
				return string.toLowerCase().replace(/[^\w]/, "-");
			},
			createPanel: function createPanel () {
				var panel = document.createElement("div");
				panel.classList.add("mt-editor");
				buttons
				.map(this.makeButton.bind(this))
				.forEach(Node.prototype.appendChild.bind(panel));
				return panel;
			},
			makeButton: function makeButton (config) {
				var name = Object.keys(config)[0];
				var action = config[name];
				var button = document.createElement("button");
				button.type = "button";
				button.setAttribute("title", name);
				button.setAttribute("class", "mt-button mt-button-" + this.toCssClass(name));
				button.addEventListener("click", action.bind(this));
				return button;
			}
		};

		var buttons = [
			{"Bold"            : prototype.simpleWrap ("b")},
			{"Italic"          : prototype.simpleWrap ("i")},
			{"Paragraph"       : prototype.simpleWrap ("p")},
			{"Link"            : prototype.linkWrap   ("a","href")},
			{"Moby:Game"       : prototype.linkWrap   ("moby","game")},
			{"Moby:Developer"  : prototype.linkWrap   ("moby","developer")},
			{"Moby:Company"    : prototype.linkWrap   ("moby","company")},
			{"Header 1"        : prototype.simpleWrap ("h1")},
			{"Image"           : prototype.linkWrap   ("img","src")},
			{"Unordered list"  : prototype.listWrap   ("ul")},
			{"Ordered list"    : prototype.listWrap   ("ol")},
			{"Break"           : prototype.tagSide    ("br","right")},
			{"Horizontal line" : prototype.tagSide    ("hr","right")},
			{"Quote"           : prototype.simpleWrap ("Q","bbcode")},
			{"Title quotes"    : prototype.symbolWrap ("«","»")}
		];

		return function init (el) {
			var editor = Object.create(prototype);
			editor.element = el;
			el.parentNode.insertBefore(editor.createPanel(), el);
		}
	})();

	function addCSS (css) {
		var style = document.createElement("style");
		style.textContent = css.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
		document.head.appendChild(style);
	}

	[].forEach.call(document.querySelectorAll("textarea:not([rows='1'])"), Editor);

	addCSS(function() {/*
		.mt-button {
			display:inline-block;
			width:20px;
			height:20px;
			border:1px solid #EEE;
			background-color: white;
			background-repeat: no-repeat;
			background-position: center;
			cursor: pointer;
		}
		.mt-button:hover{
			background-color:#EEE;
		}
		.mt-button-bold{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAAB6SURBVHjaYvz//z8DNQETA5UBCy4JHS3tcgYGhg404XsMDAzpDAwMe65cu0oVFyoxMDDMpIaX0xkYGFYjGUqVMHyPRpMWhmhgJpprqRrLMxkYGASpGYaCDAwMxtQMQ6olbEGKEjaeSIElcKpFSic+AxkHfeFAdQMBAwCSSRbKoB5KxgAAAABJRU5ErkJggg==');
		}
		.mt-button-italic{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAABwSURBVHjaYvz//z8DNQETA5UBCz5JHS1tGLODgYGhHMoOu3Lt6mpKXWiMxD5LDS/DDHzPwMBwj1IDBaGYgZBhxBrogsTeQw0DlZDY76lt4FlqGGhMKwPfU8PLxqRECDEGIoffPWIMZBz0hQPVDQQMAPbBFxuxKc3qAAAAAElFTkSuQmCC');
		}
		.mt-button-paragraph{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAABBSURBVHjaYvz//z8DNQETA5XB4DeQhZACHS1trIF85dpVRmzijNSOFBZSXTbqwuHsQlwuorkLB39eBgAAAP//AwCYmSYTrQH0HAAAAABJRU5ErkJggg==');
		}
		.mt-button-link{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAAD4SURBVHjazJQxCsIwFIa/ivQCjp5B6NAITs4SR0Gchc5ewCm38AIiOCqdBcFBnXqGjl6gS1xeobapzeDgg0L65+fj5eW9BNZafhk9fhz9uhDsX+UyBBJgAUxEuwFHYAcUAHY1+A6UGAInIKrpU/nWwBzIfY4cAqnRKjJaYbRqGIxWEZCKtxOYGK1GXbUST+IDXFZ/tud7w1DRlp2XAozbQNXjy/7Yu21ctXPsFz7AZxvEkXXmAzz4NLDAG96gPnrB/hUCD2BktPrIqiyDaBkQ29Wg6AKWjZ0Cbe2TATMgr09K26XkQAxsgEtFv4oWu6bEmeHfvTbvAQA+5UnOCSr+OAAAAABJRU5ErkJggg==');
		}
		.mt-button-moby-game{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAADcSURBVHjazJSxDYMwEEUfUToqJCaAEbICaelo2IEaRoA2VMkApEhHCyOEFZiAiIqaNCBZJwxIociXLJ/O1vO/s2VjHEeO1ImDdTjwDGA8PxXgTbmW0HYpOg+olL1XQruOSjMGUiWf5f6QzK1bcuhQdBZwkQsLMIA4Ks37VsneElDkXLF/FehMQ8ra1UOhVnHYaJwCkPuDMce3UQ9sgGCK+xUzQVSaqWLC1ZXcCvjP77BX5jWHL3G4FtjsKHe+IGsL2IvSJbRW4vdeYKvpJ7k/ZECipB4SaPz9b/MdAJ1BOwZnZ7bgAAAAAElFTkSuQmCC');
		}
		.mt-button-moby-developer{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAAC2SURBVHjaYvz//z8DNQETA5UB1Q1kYWBgYGBc/nY3AwODC1TsHkOUiDLDsjcuDAwMu5HUuubyyIcyMDCkoZmxh4GBoWKS75ezuFyoxLDsjSADA4MxkY5yYWBgmEnIyy5EGOjKwMDwHu4IAgYqISvCA2AGCuIz8B6SC89SI5bPIkXQe2oYeA/NcIoNfI9Ev6eWl4n1riDWhI3FdTCv4zN0N7ZgYsJi4D0c4Ykv6VTAOIyDvrQBDADNLyrRxa1puQAAAABJRU5ErkJggg==');
		}
		.mt-button-moby-company{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAADpSURBVHjazJSxDcIwEEVfEB1VJCYII8AIoSQdTQago4YRSEs6BoCCjhZGwCPgCYLckDo0JjpZdpBQCr5k+XT2ff1/ZzlqmoY+MaBn9E44BIhOzyuQ2pwmH084VilwFXfn5OPb+jLaABsgtvkzsN0vXroldJBwrGJg6h6sL6MVsHPSSyABZl2WUx+hcIEl0DaefuthYpeLWMQm2EMHWihUAaUAlFk9+cT7JqxQCWvmpyl7FPrI8QzpIVoThRQasZs+HrbqsGu+DWjQUaA9pErEd2H30EWoA/2kzOoC2Do1RZnVbS76+9/mPQAxszv6aCa4rgAAAABJRU5ErkJggg==');
		}
		.mt-button-header-1{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAABxSURBVHjaYvz//z8DNQETA5UBC7qAjpb2XQYGBiUo15WBgWE3lD2LgYEhHcpWYmBgOMPAwCB45dpVRkpd6AK1RJAoFxIAu6EGUi0MXRkYGBgZGBjukWvgbhzi9+gWy0xEeHFg0+EINJBx0BcOVDcQMADp0hIueQixiwAAAABJRU5ErkJggg==');
		}
		.mt-button-image{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAADgSURBVHjazJRNS0JREIaf8Z7o3iteSWsRFWgLXfgb3AdCuM1f1y/pJ7RpHy2igiI/wvy455xxoRBIXBEO0WwGBubhneGdEVUlZJQIHGa78PT9tZfkRlqRQqAPrXCsLizwzduwwKEGBiYfD0STF0Q9Pqlhq+cs4zouOgRkf2D3rk9mFiAwt4api3mvdHg+6zFpX2OT40KgbBs7vy39ahsvhlfT5PG0z/jyikV2gYrh5qghO4GfswNU1wMqP3nTQh6l5OkJNirTGtwX+xCgluQ7NrUENwL3B6cXHCj//tusBgBLCUsGEx8SlAAAAABJRU5ErkJggg==');
		}
		.mt-button-unordered-list{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAABtSURBVHjaYvz//z8DNQETA5XB4DeQBZsg4/K3/7Wb7RivXLvKoKOljTWQr1y7yki0gQwMDIxXrl2FswfUywz////HwAzL3jBoa2phlSOEcXn5PyyMqBaGONjDOQxhXiU1DBlHXuEAAAAA//8DADsJjtXg16BAAAAAAElFTkSuQmCC');
		}
		.mt-button-ordered-list{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAABtSURBVHjaYvz//z8DNQETA5XB4DeQhYGBgYFx+Vt08f/azXaMV65dZdDR0sYayFeuXWXEaSABwEgNLzNS5GV84Mq1qxQZ+B/quv+wMBrwMGTBoZlRR0ub+mFIavghGwgPOzR64MOQcdCXNoABAMWmJS9SMKGLAAAAAElFTkSuQmCC');
		}
		.mt-button-break{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAABZSURBVHjaYvz//z8DNQETA5XB4DeQhZACxuVvkbl1/yOFm6jlwjoGBoZGanmZKMOINZBow4g1kJnasVzPwMDQRO1kQ7ShLCT4pp4YRYyjeZliAAAAAP//AwBCmQ+eDDIpVAAAAABJRU5ErkJggg==');
		}
		.mt-button-horizontal-line{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAABbSURBVHjaYvz//z8DNQETA5XB4DeQhZACHS1trIF85dpVRmzijNSOFBZSXTbwLmRc/pYkG/5HCjMS8jIjTcJQu9kOr0uv1h4aZLGMK1Zp7sLBn5cBAAAA//8DAEHGIxqWOhw2AAAAAElFTkSuQmCC');
		}
		.mt-button-quote{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAABSSURBVHjaYvz//z8DNQETA5UBioF5m3n+523m+T+oXMhCSIGOljZWF1+5dpWRLANxaSTZhbhcRrYLSXXZqAsHwIXEWkB1FzIO+tIGAAAA//8DAOnGKwUbnne7AAAAAElFTkSuQmCC');
		}
		.mt-button-title-quotes{
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAIcbAACL/wABAWIAAIFgAAB8zgAA66EAADguAAAjY55jPicAAAC5SURBVHja7JPNDcIwDIW/oi7AChyBWxihGYEVyAhlhDJCZmAEGIHcgCMrMEK4PEtRRIWEegNLlp7s57/YaXLOTCkzJpYfTNgaWC9Xpb0HzkASPsq+BQ6AAzphAK7322iHEZgrWZTtITV/EifWwY2djTo8ibgR2QmXclHCIPwEvHXYVmN2gAd2Uv9mgr0KpwL3Nv7kHdZv6EUeFGBLKaewZIOw/3Q2QVWdMMBCan4nThhdyv/rfS2vAQDc7zzjxdovmAAAAABJRU5ErkJggg==');		}
		}
	*/});
})();