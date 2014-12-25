/**
 * jQuery Viewport Plugin
 * Copyright 2013, Juerg Lehni
 * http://juerglehni.com
 *
 * Based on jQuery Bullseye v1.0
 * Copyright 2010, Mickel Andersson
 * http://pixeltango.com
 */

/**
 * Installs or deinstalls the viewport behavior on the given DOM nodes,
 * triggering 'viewport:enter' events when the node enters the viewport, and 
 * 'viewport:leave' when it disappears again.
 * @param {Boolean} [install=true] controls whether the behavior is to be
 * installed or deinstalled.
 */
jQuery.fn.viewport = function(install) {
    var focusedKey = 'viewport-focused',
        handlersKey = 'viewport-handlers',
        remove = install === false,
        viewport = $(window);

    return this.each(function() {
        var element = $(this),
            first = true;

        if (remove) {
            viewport.off(element.data(handlersKey));
            return;
        }

        function handler() {
            var elementWidth = element.outerWidth(),
                elementHeight = element.outerHeight(),
                viewportWidth = viewport.width(),
                viewportHeight = viewport.height(),

                scrollTop = viewport.scrollTop(),
                scrollLeft = viewport.scrollLeft(),
                scrollRight = scrollLeft + viewportWidth,
                scrollBottom = scrollTop + viewportHeight,

                left = element.offset().left,
                right = left + elementWidth,
                top = element.offset().top,
                bottom = top + elementHeight,
                // Evaluate if the target is inside the viewport
                outside = scrollBottom < top
                    || scrollTop > bottom
                    || scrollRight < left
                    || scrollLeft > right,
                focused = element.data(focusedKey);
            if (!first && outside && focused) {
                element.trigger('viewport:leave');
            } else if (!outside && !focused) {
                element.trigger('viewport:enter');
            }
            element.data(focusedKey, !outside);
            first = false;
        }
        var handlers = {
            scroll: handler,
            resize: handler
        };
        viewport.on(handlers);
        element.data(handlersKey, handlers);
        handler();
    });
};