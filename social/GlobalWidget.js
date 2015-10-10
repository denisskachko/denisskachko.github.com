window.zs = (function (zs) {
    zs.namespace = function () {
        var a = arguments, o = null, i, j, d;
        for (i = 0; i < a.length; i = i + 1) {
            d = a[i].split(".");
            o = window;
            for (j = 0; j < d.length; j = j + 1) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
        return o;
    };

    String.format = function () {
        var s = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }

        return s;
    };

    zs.settings = {
        offset: 100,
        clientWidthDlg: function () {
            var width = Math.round(window.zs.jQuery(document).width() / 1.5);
            return width;
        },

        clientHeightDlg: function () {
            var height = Math.round(window.zs.jQuery(document).height() / 1.2);
            return height;
        },
        confirmationOKConfig:
            {
                "OK": function () {
                    window.zs.jQuery(this).dialog("close");
                }
            },
        effect: 'slide'
        //The effect to be used. Possible values: 'blind', 'clip', 'drop', 'explode', 'fold', 'puff', 'slide', 'scale', 'size', 'pulsate'.
    };

    String.prototype.trunc =
        function (n, useWordBoundary) {
            var toLong = this.length > n,
                s_ = toLong ? this.substr(0, n - 1) : this;
            s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
            return toLong ? s_ + '...' : s_;
        };

    zs.GetValueById = function (elementId) {
        return window.zs.jQuery('#' + elementId).val();
    };

    zs.GetValueByName = function (elementName) {
        return window.zs.jQuery('[name=' + elementName + ']').val();
    };

    zs.infoErrorMsg = function (text, container, hide){
        return this.informationMessage(text, 'alert', false, container, hide);
    };

    zs.infoSuccessMsg = function (text, container, hide){
        return this.informationMessage(text, 'success', false, container, hide);
    };

	zs.informationMessage = function(text, classType, isAppend, container, hide) {
		if (!container) {
			if ($('#message').length === 0) {
				$('<div id=\'message\'></div>').appendTo('#containerContent');
			}
			var c = $('#message');
			container = c.fadeIn();
		} else {
			container.fadeIn(3000);
			container.empty();
		}

		if (hide) {
			container.fadeOut(3000);
			return;
		}

		isAppend = isAppend || false;
		var result;
		if (isAppend) {
			result = container.append('<div class="alert-box ' + classType + ' ]">' + text + '<a href="" class="close">&times;</a></div>');
		} else {
			result = container.html('<div class="alert-box ' + classType + ' ]">' + text + '<a href="" class="close">&times;</a></div>');
		}
		return result;
	};

    function InfoDialog(selectorValue, url, height, width, btnConfig, loadingContainer, attachId, titleText) {
        window.zs.jQuery(function () {
            window.zs.jQuery(selectorValue).each(function (i, element) {
                var id = window.zs.jQuery(element).attr("id");
                window.zs.jQuery(element).click(function (event) {
                    event.preventDefault();

                    var containerDiv = window.zs.jQuery("#infoDialog");
                    if (!containerDiv || containerDiv.length == 0) {
                        containerDiv = window.zs.jQuery('<div id="infoDialog"></div>').appendTo(document.body);
                    }
                    else {
                        containerDiv.empty();
                    }

                    window.zs.jQuery(containerDiv).dialog({
                        autoOpen: false,
                        draggable: true,
                        width: width || zs.settings.clientWidthDlg(),
                        height: height || zs.settings.clientHeightDlg(),
                        resizable: false,
                        title: titleText || 'Information',
                        modal: true,
                        open: function (event, ui) {
                            var addId = attachId || true;
                            var resultUrl = attachId ? (url + id) : url;
                            window.zs.jQuery(containerDiv).load(resultUrl);
                        },
                        buttons: btnConfig || zs.settings.confirmationOKConfig
                    });

                    window.zs.jQuery(containerDiv).dialog('open');

                    window.zs.jQuery(containerDiv).bind("keypress", function (e) {
                        if (e.keyCode == 13) {
                            return false;
                        }
                        return true;
                    });
                });
            });
        });
    }

	// todo : remove it if there is no use
    function EmebedDialog(selectorValue, url, containerSelector, attachId, cancelSelector) {
    	window.zs.jQuery(document).ready(function () {
    		var effect = zs.settings.effect;
    		var html = window.zs.jQuery(containerSelector).html();

    		window.zs.jQuery(cancelSelector).live('click', function () {
    			window.zs.jQuery(containerSelector).html(html);
    			window.zs.jQuery(containerSelector).show(effect);
    		});

    		window.zs.jQuery(selectorValue).live('click', function (event) {
    			event.preventDefault();
    			var element = window.zs.jQuery(event.currentTarget);
    			var id = window.zs.jQuery(element).attr('id');
    			var containerDiv = window.zs.jQuery(containerSelector);
    			var resultUrl = attachId ? (url + '/' + id) : url;

    			containerDiv.hide(effect);
    			containerDiv.load(resultUrl);
    			containerDiv.show(effect);

    			window.zs.jQuery(containerDiv).bind("keypress", function (e) {
    				if (e.keyCode == 13) {
    					return false;
    				}
    				return true;
    			});
    		});
    	});

    }

    return zs;
})(window.zs || {});


