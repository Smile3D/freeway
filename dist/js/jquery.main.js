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

// in view port init
function initInViewport() {
  jQuery('.viewport-section').itemInViewport({});
}

function initFormValidation() {
  jQuery('.form').formValidation({
    errorClass: 'input-error',
    errorFormClass: 'form-error',
    successSendClass: 'form-sended',
    pageSuccessSendClass: 'form-success-sended'
  });
}


function initContactForm() {
  var successSendClass = 'form-sended';
  var pageSuccessSendClass = 'form-success-sended';

  jQuery('.form').each(function() {
    var form = jQuery(this);

    var hideMessage = function() {
      form.removeClass(successSendClass).css({
        minHeight: ''
      }).trigger('reset');

      jQuery('html').removeClass(pageSuccessSendClass);
    };

    var closeHandler = function(e) {
      e.preventDefault();
      hideMessage();
    };

    form.on('click', '.message-block .close', closeHandler);
    form.on('click', '.overlay', closeHandler);
  });
}

/*
 * jQuery form validation plugin
 */
;(function($) {
  'use strict';

  var FormValidation = (function() {
    var Validator = function($field, $fields) {
      this.$field = $field;
      this.$fields = $fields;
    };

    Validator.prototype = {
      reg: {
        email: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$',
        number: '^[0-9]+$'
      },

      checkField: function() {
        return {
          state: this.run(),
          $fields: this.$field.add(this.additionalFields)
        }
      },

      run: function() {
        var fieldType;

        switch (this.$field.get(0).tagName.toUpperCase()) {
          case 'SELECT':
            fieldType = 'select';
            break;

          case 'TEXTAREA':
            fieldType = 'text';
            break;

          default:
            fieldType = this.$field.data('type') || this.$field.attr('type');
        }

        var functionName = 'check_' + fieldType;
        var state = true;

        if ($.isFunction(this[functionName])) {
          state = this[functionName]();

          if (state && this.$field.data('confirm')) {
            state = this.check_confirm();
          }
        }

        return state;
      },

      check_email: function() {
        var value = this.getValue();
        var required = this.$field.data('required');
        var requiredOrValue = required || value.length;

        if ((requiredOrValue && !this.check_regexp(value, this.reg.email))) {
          return false;
        }

        return requiredOrValue ? true : null;
      },

      check_number: function() {
        var value = this.getValue();
        var required = this.$field.data('required');
        var isNumber = this.check_regexp(value, this.reg.number);
        var requiredOrValue = required || value.length;

        if (requiredOrValue && !isNumber) {
          return false;
        }

        var min = this.$field.data('min');
        var max = this.$field.data('max');
        value = +value;

        if ((min && (value < min || !isNumber)) || (max && (value > max || !isNumber))) {
          return false;
        }

        return (requiredOrValue || min || max) ? true : null;
      },

      check_password: function() {
        return this.check_text();
      },

      check_text: function() {
        var value = this.getValue();
        var required = this.$field.data('required');

        if (this.$field.data('required') && !value.length) {
          return false;
        }

        var min = +this.$field.data('min');
        var max = +this.$field.data('max');

        if ((min && value.length < min) || (max && value.length > max)) {
          return false;
        }

        var regExp = this.$field.data('regexp');

        if (regExp && !this.check_regexp(value, regExp)) {
          return false;
        }

        return (required || min || max || regExp) ? true : null;
      },

      check_confirm: function() {
        var value = this.getValue();
        var $confirmFields = this.$fields.filter('[data-confirm="' + this.$field.data('confirm') + '"]');
        var confirmState = true;

        for (var i = $confirmFields.length - 1; i >= 0; i--) {
          if ($confirmFields.eq(i).val() !== value || !value.length) {
            confirmState = false;
            break;
          }
        }

        this.additionalFields = $confirmFields;

        return confirmState;
      },

      check_select: function() {
        var required = this.$field.data('required');

        if (required && this.$field.get(0).selectedIndex === 0) {
          return false;
        }

        return required ? true : null;
      },

      check_radio: function() {
        var $fields = this.$fields.filter('[name="' + this.$field.attr('name') + '"]');
        var required = this.$field.data('required');

        if (required && !$fields.filter(':checked').length) {
          return false;
        }

        this.additionalFields = $fields;

        return required ? true : null;
      },

      check_checkbox: function() {
        var required = this.$field.data('required');

        if (required && !this.$field.prop('checked')) {
          return false;
        }

        return required ? true : null;
      },

      check_at_least_one: function() {
        var $fields = this.$fields.filter('[data-name="' + this.$field.data('name') + '"]');

        if (!$fields.filter(':checked').length) {
          return false;
        }

        this.additionalFields = $fields;

        return true;
      },

      check_regexp: function(val, exp) {
        return new RegExp(exp).test(val);
      },

      getValue: function() {
        if (this.$field.data('trim')) {
          this.$field.val($.trim(this.$field.val()));
        }

        return this.$field.val();
      }
    };

    var publicClass = function(form, options) {
      this.$form = $(form).attr('novalidate', 'novalidate');
      this.options = options;
    };

    publicClass.prototype = {
      buildSelector: function(input) {
        return ':input:not(' + this.options.skipDefaultFields + (this.options.skipFields ? ',' + this.options.skipFields : '') + ')';
      },

      init: function() {
        this.fieldsSelector = this.buildSelector(':input');

        this.$form
          .on('submit', this.submitHandler.bind(this))
          .on('keyup blur', this.fieldsSelector, this.changeHandler.bind(this))
          .on('change', this.buildSelector('select'), this.changeHandler.bind(this))
          .on('focus', this.fieldsSelector, this.focusHandler.bind(this));
      },

      submitHandler: function(e) {
        var self = this;
        var $fields = this.getFormFields();

        this.getClassTarget($fields)
            .removeClass(this.options.errorClass + ' ' + this.options.successClass);

        this.setFormState(true);

        $fields.each(function(i, input) {
          var $field = $(input);
          var $classTarget = self.getClassTarget($field);

          // continue iteration if $field has error class already
          if ($classTarget.hasClass(self.options.errorClass)) {
            return;
          }

          self.setState(new Validator($field, $fields).checkField());
        });

        return this.checkSuccess($fields, e);
      },

      checkSuccess: function($fields, e) {
        var self = this;
        var success = this.getClassTarget($fields || this.getFormFields())
                  .filter('.' + this.options.errorClass).length === 0;

        if (e && success && this.options.successSendClass) {
          e.preventDefault();

          $.ajax({
            url: this.$form.removeClass(this.options.successSendClass).attr('action') || '/',
            type: this.$form.attr('method') || 'POST',
            data: this.$form.serialize(),
            success: function() {
              self.$form.addClass(self.options.successSendClass);
              $('html').addClass(self.options.pageSuccessSendClass);
            }
          });
        }

        this.setFormState(success);

        return success;
      },

      changeHandler: function(e) {
        var $field = $(e.target);

        if ($field.data('interactive')) {
          this.setState(new Validator($field, this.getFormFields()).checkField());
        }

        this.checkSuccess();
      },

      focusHandler: function(e) {
        var $field = $(e.target);

        this.getClassTarget($field)
          .removeClass(this.options.errorClass + ' ' + this.options.successClass);

        this.checkSuccess();
      },

      setState: function(result) {
        this.getClassTarget(result.$fields)
          .toggleClass(this.options.errorClass, result.state !== null && !result.state)
          .toggleClass(this.options.successClass, result.state !== null && this.options.successClass && !!result.state);
      },

      setFormState: function(state) {
        if (this.options.errorFormClass) {
          this.$form.toggleClass(this.options.errorFormClass, !state);
        }
      },

      getClassTarget: function($input) {
        return (this.options.addClassToParent ? $input.closest(this.options.addClassToParent) : $input);
      },

      getFormFields: function() {
        return this.$form.find(this.fieldsSelector);
      }
    };

    return publicClass;
  }());

  $.fn.formValidation = function(options) {
    options = $.extend({}, {
      errorClass: 'input-error',
      pageSuccessSendClass: '',
      successClass: '',
      errorFormClass: '',
      addClassToParent: '',
      skipDefaultFields: ':button, :submit, :image, :hidden, :reset',
      skipFields: '',
      successSendClass: ''
    }, options);

    return this.each(function() {
      new FormValidation(this, options).init();
    });
  };
}(jQuery));

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