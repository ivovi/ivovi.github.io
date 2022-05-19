document.addEventListener('scroll', function(scroll) {
	if(window.pageYOffset < 150) {
		$(".scroll_arrow").css("opacity", "1");
	} else {
		$(".scroll_arrow").css("opacity", "0");
	}
});

$(".collapsible_arrow").eq(1).toggle();
var collapsibles = document.getElementsByClassName("collapsible");

for(var i = 0; i < collapsibles.length; i++) {
	collapsibles[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if(content.style.display === "block") {
			content.style.display = "none";
			this.style.borderRadius = "15px";
			$(".collapsible_arrow").toggle();
		} else {
			content.style.display = "block";
			this.style.borderRadius = "15px 15px 0px 0px";
			var scrollPos = $(".canvas_border").offset().top - 10;
			window.scrollTo({top: scrollPos, behavior: "smooth"});
			$(".collapsible_arrow").toggle();
		}
	});
}

$(function() {
	resizeCanvas();
});

$(window).on('resize', function() {
	resizeCanvas();
});

function convertRemToPixels(rem) {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function resizeCanvas() {
	var canvas = $("#unity-canvas");
	var windowWidth = document.body.clientWidth;
	// Add padding and margin for game container object (from sides of screen to content).
	var outsideBoundarySides = parseInt($(".game_container").css("paddingRight").replace("px", ""));
	outsideBoundarySides = outsideBoundarySides + parseInt($(".game_container").css("marginRight").replace("px", ""));
	// Add padding from side of collapsible content to canvas.
	outsideBoundarySides = outsideBoundarySides + parseInt($(".collapsible_content").css("paddingRight").replace("px", ""));
	// Double to include the left side as well.
	outsideBoundarySides = outsideBoundarySides * 2;
	// Work out canvas width (also subtract 10 for border size).
	var expectedCanvasWidth = windowWidth - outsideBoundarySides - 10;
	// Compare to max allowed width
	if(expectedCanvasWidth > 1280) {
		expectedCanvasWidth = 1280;
	}
	if(canvas.width() != expectedCanvasWidth) {
		canvas.width(expectedCanvasWidth);
		// Calculate canvas height using aspect ratio.
		var canvasHeight = (expectedCanvasWidth / 10) * 7;
		canvas.height(canvasHeight);
	}
}

var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var warningBanner = document.querySelector("#unity-warning");

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
function unityShowBanner(msg, type) {
	function updateBannerVisibility() {
	  warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
	}
	var div = document.createElement('div');
	div.innerHTML = msg;
	warningBanner.appendChild(div);
	if (type == 'error') {
		div.style = 'background: red; padding: 10px;';
	} else {
		if (type == 'warning') {
			div.style = 'background: yellow; padding: 10px;';
		}
		setTimeout(function() {
			warningBanner.removeChild(div);
			updateBannerVisibility();
		}, 5000);
	}
	updateBannerVisibility();
}

var buildUrl = "mazerace";
      var loaderUrl = buildUrl + "/mazerace.loader.js";
      var config = {
        dataUrl: buildUrl + "/mazerace.data.unityweb",
        frameworkUrl: buildUrl + "/mazerace.framework.js.unityweb",
        codeUrl: buildUrl + "/mazerace.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "ivovi",
        productName: "MazeRace",
        productVersion: "1.2",
        showBanner: unityShowBanner,
      };

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
	container.className = "unity-mobile";
	// Avoid draining fillrate performance on mobile devices,
	// and default/override low DPI mode on mobile browsers.
	config.devicePixelRatio = 1;
	unityShowBanner('WebGL builds are not supported on mobile devices.');
}
loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
	createUnityInstance(canvas, config, (progress) => {
		progressBarFull.style.width = 100 * progress + "%";
	}).then((unityInstance) => {
		loadingBar.style.display = "none";
	}).catch((message) => {
		alert(message);
	});
};
document.body.appendChild(script);

document.addEventListener('wheel', onScroll, false);
document.addEventListener('mousemove', onMouse, false);
var content = document.getElementsByClassName('unity-desktop');

function onMouse() { content[0].style['pointer-events'] = 'auto'; }
function onScroll() { content[0].style['pointer-events'] = 'none'; }