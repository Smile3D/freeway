var scene = document.getElementById('scene');
var parallaxInstance = new Parallax(scene);

var scene = document.getElementById('scene-1');
var parallaxInstance = new Parallax(scene);

var scene = document.getElementById('scene-2');
var parallaxInstance = new Parallax(scene);

var scene = document.getElementById('scene-3');
var parallaxInstance = new Parallax(scene);

var telInput = $("#phone"),
  errorMsg = $("#error-msg"),
  validMsg = $("#valid-msg");

telInput.intlTelInput({
	defaultCountry: 'auto',
	separateDialCode  : false,
	nationalMode      : false,
	initialCountry    : 'auto',
	geoIpLookup: function (callback) {
	$.get("https://ipinfo.io", function () {
	}, "jsonp").always(function (resp) {
		var countryCode = (resp && resp.country) ? resp.country : "";
		callback(countryCode);
			});
		},
	preferredCountries: ['ua', 'ru', 'by', 'kz'],
	utilsScript: "js/utils.js"
});

telInput.blur(function() {
  if ($.trim(telInput.val())) {
    if (telInput.intlTelInput("isValidNumber")) {
      validMsg.removeClass("hide");
    } else {
      telInput.addClass("error");
      errorMsg.removeClass("hide");
      validMsg.addClass("hide");
    }
  }
});

telInput.keydown(function() {
  telInput.removeClass("error");
  errorMsg.addClass("hide");
  validMsg.addClass("hide");
});

var wow = new WOW(
  {
    boxClass:     'wow',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       0,          // distance to the element when triggering the animation (default is 0)
    mobile:       true,       // trigger animations on mobile devices (default is true)
    live:         true,       // act on asynchronously loaded content (default is true)
    callback:     function(box) {
      // the callback is fired every time an animation is started
      // the argument that is passed in is the DOM node being animated
    },
    scrollContainer: null // optional scroll container selector, otherwise use window
  }
);
wow.init();

$("#phone").intlTelInput();
new WOW().init();
