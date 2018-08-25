var scene = document.getElementById('scene');
var parallaxInstance = new Parallax(scene);

var scene = document.getElementById('scene-1');
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

$("#phone").intlTelInput();