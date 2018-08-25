var scene = document.getElementById('scene');
var parallaxInstance = new Parallax(scene);

var scene = document.getElementById('scene-1');
var parallaxInstance = new Parallax(scene);

var scene = document.getElementById('scene-2');
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

// in view port init
function initInViewport() {
  jQuery('.viewport-section').itemInViewport({});
}


/*
 * jQuery In Viewport plugin
 */
;(function($, $win) {
  'use strict';

  var ScrollDetector = (function() {
    var data = {};

    return {
      init: function() {
        var self = this;

        this.addHolder('win', $win);

        $win.on('load.blockInViewport resize.blockInViewport orientationchange.blockInViewport', function() {
          $.each(data, function(holderKey, holderData) {
            self.calcHolderSize(holderData);

            $.each(holderData.items, function(itemKey, itemData) {
              self.calcItemSize(itemKey, itemData);
            });
          });
        });
      },

      addHolder: function(holderKey, $holder) {
        var self = this;
        var holderData =  {
          holder: $holder,
          items: {},
          props: {
            height: 0,
            scroll: 0
          }
        };

        data[holderKey] = holderData;

        $holder.on('scroll.blockInViewport', function() {
          self.calcHolderScroll(holderData);

          $.each(holderData.items, function(itemKey, itemData) {
            self.calcItemScroll(itemKey, itemData);
          });
        });

        this.calcHolderSize(data[holderKey]);
      },

      calcHolderSize: function(holderData) {
        var holderOffset = window.self !== holderData.holder[0] ? holderData.holder.offset() : 0;

        holderData.props.height = holderData.holder.get(0) === window ? (window.innerHeight || document.documentElement.clientHeight) : holderData.holder.outerHeight();
        holderData.props.offset = holderOffset ? holderOffset.top : 0;

        this.calcHolderScroll(holderData);
      },

      calcItemSize: function(itemKey, itemData) {
        itemData.offset = itemData.$el.offset().top - itemData.holderProps.props.offset;
        itemData.height = itemData.$el.outerHeight();

        this.calcItemScroll(itemKey, itemData);
      },

      calcHolderScroll: function(holderData) {
        holderData.props.scroll = holderData.holder.scrollTop();
      },

      calcItemScroll: function(itemKey, itemData) {
        var itemInViewPortFromUp;
        var itemInViewPortFromDown;
        var itemOutViewPort;
        var holderProps = itemData.holderProps.props;

        switch (itemData.options.visibleMode) {
          case 1:
            itemInViewPortFromDown = itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height < holderProps.scroll + holderProps.height;
            itemInViewPortFromUp   = itemData.offset > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2;
            break;

          case 2:
            itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height / 2 < holderProps.scroll + holderProps.height);
            itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height / 2 > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
            break;

          case 3:
            itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset < holderProps.scroll + holderProps.height);
            itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
            break;

          default:
            itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + Math.min(itemData.options.visibleMode, itemData.height) < holderProps.scroll + holderProps.height);
            itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height - Math.min(itemData.options.visibleMode, itemData.height) > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
            break;
        }


        if (itemInViewPortFromUp && itemInViewPortFromDown) {
          if (!itemData.state) {
            itemData.state = true;
            itemData.$el.addClass(itemData.options.activeClass)
                .trigger('in-viewport', true);

            if (itemData.options.once || ($.isFunction(itemData.options.onShow) && itemData.options.onShow(itemData))) {
              delete itemData.holderProps.items[itemKey];
            }
          }
        } else {
          itemOutViewPort = itemData.offset < holderProps.scroll + holderProps.height && itemData.offset + itemData.height > holderProps.scroll;

          if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
            itemData.state = false;
            itemData.$el.removeClass(itemData.options.activeClass)
                .trigger('in-viewport', false);
          }
        }
      },

      addItem: function(el, options) {
        var itemKey = 'item' + this.getRandomValue();
        var newItem = {
          $el: $(el),
          options: options
        };
        var holderKeyDataName = 'in-viewport-holder';

        var $holder = newItem.$el.closest(options.holder);
        var holderKey = $holder.data(holderKeyDataName);

        if (!$holder.length) {
          holderKey = 'win';
        } else if (!holderKey) {
          holderKey = 'holder' + this.getRandomValue();
          $holder.data(holderKeyDataName, holderKey);

          this.addHolder(holderKey, $holder);
        }

        newItem.holderProps = data[holderKey];

        data[holderKey].items[itemKey] = newItem;

        this.calcItemSize(itemKey, newItem);
      },

      getRandomValue: function() {
        return (Math.random() * 100000).toFixed(0);
      },

      destroy: function() {
        $win.off('.blockInViewport');

        $.each(data, function(key, value) {
          value.holder.off('.blockInViewport');

          $.each(value.items, function(key, value) {
            value.$el.removeClass(value.options.activeClass);
            value.$el.get(0).itemInViewportAdded = null;
          });
        });

        data = {};
      }
    };
  }());

  ScrollDetector.init();

  $.fn.itemInViewport = function(options) {
    options = $.extend({
      activeClass: 'in-viewport',
      once: true,
      holder: '',
      visibleMode: 1 // 1 - full block, 2 - half block, 3 - immediate, 4... - custom
    }, options);

    return this.each(function() {
      if (this.itemInViewportAdded) {
        return;
      }

      this.itemInViewportAdded = true;

      ScrollDetector.addItem(this, options);
    });
  };
}(jQuery, jQuery(window)));


$("#phone").intlTelInput();
new WOW().init();
initInViewport();