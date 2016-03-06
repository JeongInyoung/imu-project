/**
* When I noticed the growing popularity of JS-Slide and JS-Fade effects I have
* decide to develop a plugin for jQuery. This plugin will help you to add thise
* effects to the site in more simple way.
* Note: If the mousewheel plugin has been included on the page then the slider will
* also respond to the mouse wheel.
*
* @name jQuery ulSlide plugin
* @license GPL
* @version 1.39
* @date September 17, 2010
* @category jQuery plugin
* @author Kotelnitskiy Evgeniy (evgennniy@gmail.com)
* @copyright (c) 2010 Kotelnitskiy Evgeniy (http://4coder.info/en/)
* @example Visit http://4coder.info/en/jquery-ulslide-2/ for more informations about this jQuery plugin
*/
ulslide_last_id = 0;
(function($) {
	jQuery.fn.ulslide = function(settings) {
		var thisObj = this;
		if (thisObj.length == 0) return false;
		var thisEl = thisObj[0];
		if (! jQuery(thisEl).attr('id')) {
			ulslide_last_id ++;
			jQuery(thisEl).attr('id', 'ulslide-' + ulslide_last_id);
		}
		var id = jQuery(thisEl).attr('id');

	// Settings
	settings = jQuery.extend({
		axis: 'x', // x, y
		direction: 'f', // f, b
		affect: 'slide', // slide, fade
		duration: 600,
		width: thisObj.width(),
		height: 'auto', //auto
		statusbar: false,
		padding: 20,
		lionpage: 1,
		autoslide: false,
		current: 0,
		bnext: false,
		bprev: false,
		navigator: false,
		print_current: false,
		mousewheel: false,
		onAnimate: function(settings, thisEl){}
	},settings);


	settings['prev'] = settings['current'];
	settings['count'] = jQuery('> li', thisObj).length;
	jQuery('> li', thisObj).each(function(i){
		var liel = jQuery(this);
		liel.addClass('slide-node slide-node-'+i);
		liel.css("position", 'absolute');
		// liel.css("width", settings['width']);
		// liel.css("overflow", "hidden");
		// liel.css("background-size", "cover");
		if (i == settings['current']){
			liel.css("top", '0');
			liel.css("left", '0');
		}
		else{
			liel.css("top", '0');
			liel.css("left", -(settings['width']));
		}
	});

	// thisObj.css("list-style", "none");
	// thisObj.css("padding", "0");
	// thisObj.css("position", "relative");
	// thisObj.css("overflow", "hidden");
	// thisObj.css("width", settings['width']);
	// if (settings['height'] == 'auto'){
	// 	thisObj.css("height", jQuery('> li:eq('+settings['current']+')', thisObj).height());
	// }
	// else thisObj.css("height", settings['height']);
	// settings['prevHeight'] = settings['height'];

	// statusbar
	if (settings['statusbar']){
		settings['img_count'] = this.find('img').length;
		if (settings['img_count']){
			thisObj.append('<li class="ulslide-statusbar" id="'+id+'-statusbar" style="width:'+settings['width']+'px; ><span>Loading...</span></li>'); //position: absolute; padding:0; margin:0; height:'+thisObj.css("height")+'; "
		}
		settings['img_loaded'] = 0;
		this.find('img').each(function(){
			if (this.complete) {
				settings['img_loaded'] ++;
			}
			else {
				jQuery(this).load(function(){
					settings['img_loaded'] ++;
					//alert(settings['img_loaded'] + ' of ' + settings['img_count']);
					//jQuery('#'+id+'-statusbar').html('Loading... (' + settings['img_loaded'] + ' of ' + settings['img_count'] + ')');
					jQuery('#'+id+'-statusbar').html('Loading...');
					if (settings['img_loaded'] == settings['img_count']){
						jQuery('#'+id+'-statusbar').remove();
						thisEl.ready = true;
					}
				});
			}
			//alert(settings['img_loaded'] + ' of ' + settings['img_count']);
			//jQuery('#'+id+'-statusbar').html('Loading... (' + settings['img_loaded'] + ' of ' + settings['img_count'] + ')');
			jQuery('#'+id+'-statusbar').html('Loading...');
			if (settings['img_loaded'] == settings['img_count']){
				jQuery('#'+id+'-statusbar').remove();
				thisEl.ready = true;
			}
		});
	}


	function getSlide(num) {
		return jQuery('> li:eq('+num+')', thisObj);
	}

	function next() {
		settings['direction'] = 'f';
		var c = thisEl.uslCurrent();
		if (c + 1 < settings['count']) {
			thisEl.uslCurrent(c + 1);
		} else {
			thisEl.uslCurrent(0);
		}
		thisEl.uslRefresh();
	}

	function prev() {
		settings['direction'] = 'b';
		var c = thisEl.uslCurrent();
		if (c > 0) {
			thisEl.uslCurrent(c - 1);
		} else {
			thisEl.uslCurrent(settings['count'] - 1);
		}
		thisEl.uslRefresh();
	}

	if (settings['height'] == 'auto')
		thisEl.currentHeight = getSlide(settings['current']).height();
	else thisEl.currentHeight = settings['height'];

	thisEl.uslCurrent = function(new_value){
		if (new_value == undefined){
			return settings['current'];
		}
		else{
			settings['current'] = new_value;
			return new_value;
		}
	}

	thisEl.autoslideNext = function(){
		if (settings['current'] < settings['count'] - 1) settings['current'] ++;
		else settings['current'] = 0;
		this.uslRefresh();
	};

	thisEl.initAutoslide = function(){
		if (settings['TimeoutID']) clearTimeout(settings['TimeoutID']);
		settings['TimeoutID'] = setTimeout("jQuery('#"+jQuery(thisEl).attr('id')+"')[0].autoslideNext()", settings['autoslide']);
	};

	thisEl.clearAutoslide = function(){
		if (settings['TimeoutID']) {
			clearTimeout(settings['TimeoutID']);
		}
	};

	thisEl.uslRefresh = function(){
		if (! thisEl.ready) {
			setTimeout("jQuery('#"+jQuery(thisEl).attr('id')+"')[0].uslRefresh()", 200);
			return;
		}
		thisEl.ready = false;

		thisEl.clearAutoslide();
		var prev = getSlide(settings['prev']);
		var current = getSlide(settings['current']);

		if (settings['height'] == 'auto') {
			thisEl.currentHeight = getSlide(settings['current']).height();
			settings['prevHeight'] = getSlide(settings['prev']).height();
		}

		if (settings['affect'] == 'slide'){
			if (settings['axis'] == 'x'){
				if (settings['prev'] != settings['current']){
					if (settings['direction'] == 'f'){
						prev.animate({
							'left': -(settings['width'])
						}, settings['duration']);
						current.css('left', settings['width']);
					}
					else{
						prev.animate({
							'left': settings['width']
						}, settings['duration']);
						current.css('left', -(settings['width']));
					}
				}
				current.animate({
					'left': 0
				}, settings['duration'], function(){
					thisEl.ready = true;
				});
			}
			else {
				if (settings['prev'] != settings['current']){
					if (settings['direction'] == 'f'){
						prev.animate({
							'top': thisEl.currentHeight
						}, settings['duration'], function(){
							prev.css('left', -(settings['width']));
						});
						current.css('top', -(settings['prevHeight']));
					}
					else{
						prev.animate({
							'top': -(thisEl.currentHeight)
						}, settings['duration'], function(){
							prev.css('left', -(settings['width']));
						});
						current.css('top', settings['prevHeight']);
					}
				}
				current.css('left', 0);
				current.animate({
					'top': 0
				}, settings['duration'], function(){
					thisEl.ready = true;
				});
			}
		}
		else if (settings['affect'] == 'fade'){
			if (settings['prev'] != settings['current']){
				current.css('display', 'none');
				current.css('z-index', 2);
				current.css('left', 0);
				current.css('top', 0);
				prev.css('z-index', 1);
				prev.fadeOut(settings['duration'], function(){
					prev.css('display', 'none');
					current.fadeIn(settings['duration'], function(){
						thisEl.ready = true;
					});
				});
			}
			else thisEl.ready = true;
		}

		// if (settings['height'] == 'auto') {
		// 	thisObj.animate({
		// 		'height': thisEl.currentHeight
		// 	}, settings['duration']);
		// }

		if (settings['print_current']) {
			jQuery(settings['print_current']).html(settings['current'] + 1);
		}

		settings['prev'] = settings['current'];
		if (settings['autoslide']) thisEl.initAutoslide();
		settings['onAnimate'](settings, thisEl);
		thisEl.uslRefreshClasses();
		//settings['affect'] = (settings['affect'] == 'slide') ? 'fade' : 'slide'; // slide, fade
	};

	thisEl.uslRefreshClasses = function(){
		if (settings['count'] > 1){
			if (settings['bnext']) jQuery(settings['bnext']).addClass('active');
			if (settings['bprev']) jQuery(settings['bprev']).addClass('active');
		}
		if (settings['navigator']){
			jQuery(settings['navigator']).removeClass('usl-current');
			jQuery(settings['navigator'] + '.usl-navigator-'+thisEl.uslCurrent()).addClass('usl-current');
			jQuery(settings['navigator']).parent().removeClass('active');
			jQuery(settings['navigator'] + '.usl-navigator-'+thisEl.uslCurrent()).parent().addClass('active');
		}
	};

	if (settings['bnext']){
		$(settings['bnext']).click(function(){
			next();
			return false;
		});
	}

	if (settings['bprev']){
		$(settings['bprev']).click(function(){
			prev();
			return false;
		});
	}

	if (settings['navigator']){
		var navigator = jQuery(settings['navigator']);
		navigator.each(function(index){
			this.usl_navigator_index = index;
			jQuery(this).addClass('usl-navigator-' + index);
		});

		navigator.click(function(){
			var c = this.usl_navigator_index;
			if ((c < settings['count']) && (c != thisEl.uslCurrent())) {
				if (c > thisEl.uslCurrent()) settings['direction'] = 'f';
				else settings['direction'] = 'b';
				thisEl.uslCurrent(c);
				thisEl.uslRefresh();
			}
			return false;
		});
	}

	/*
	 * If the mousewheel plugin has been included on the page then
	 * the slider will also respond to the mouse wheel.
	 */
	 if (settings['mousewheel']) {
	 	thisObj.bind(
	 		'mousewheel',
	 		function (event, delta) {
	 			if (thisEl.ready) {
	 				if (delta < 0) {
	 					next();
	 				}
	 				else {
	 					prev();
	 				}
	 			}
	 			return false;
	 		}
	 		);
	 }

	 if (! settings['statusbar']) thisEl.ready = true;
	 thisEl.uslRefresh();

	};
})(jQuery);
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

/* =============================================================

	Smooth Scroll v4.5
	Animate scrolling to anchor links, by Chris Ferdinandi.
	http://gomakethings.com

	Additional contributors:
	https://github.com/cferdinandi/smooth-scroll#contributors

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

window.smoothScroll = (function (window, document, undefined) {

	'use strict';

	// Default settings
	// Private {object} variable
	var _defaults = {
		speed: 500,
		easing: 'easeInOutCubic',
		offset: 0,
		updateURL: false,
		callbackBefore: function () {},
		callbackAfter: function () {}
	};

	// Merge default settings with user options
	// Private method
	// Returns an {object}
	var _mergeObjects = function ( original, updates ) {
		for (var key in updates) {
			original[key] = updates[key];
		}
		return original;
	};

	// Calculate the easing pattern
	// Private method
	// Returns a decimal number
	var _easingPattern = function ( type, time ) {
		if ( type == 'easeInQuad' ) return time * time; // accelerating from zero velocity
		if ( type == 'easeOutQuad' ) return time * (2 - time); // decelerating to zero velocity
		if ( type == 'easeInOutQuad' ) return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if ( type == 'easeInCubic' ) return time * time * time; // accelerating from zero velocity
		if ( type == 'easeOutCubic' ) return (--time) * time * time + 1; // decelerating to zero velocity
		if ( type == 'easeInOutCubic' ) return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if ( type == 'easeInQuart' ) return time * time * time * time; // accelerating from zero velocity
		if ( type == 'easeOutQuart' ) return 1 - (--time) * time * time * time; // decelerating to zero velocity
		if ( type == 'easeInOutQuart' ) return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		if ( type == 'easeInQuint' ) return time * time * time * time * time; // accelerating from zero velocity
		if ( type == 'easeOutQuint' ) return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		if ( type == 'easeInOutQuint' ) return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
		return time; // no easing, no acceleration
	};

	// Calculate how far to scroll
	// Private method
	// Returns an integer
	var _getEndLocation = function ( anchor, headerHeight, offset ) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = location - headerHeight - offset;
		if ( location >= 0 ) {
			return location;
		} else {
			return 0;
		}
	};

	// Determine the document's height
	// Private method
	// Returns an integer
	var _getDocumentHeight = function () {
		return Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
	};

	// Convert data-options attribute into an object of key/value pairs
	// Private method
	// Returns an {object}
	var _getDataOptions = function ( options ) {

		if ( options === null || options === undefined  ) {
			return {};
		} else {
			var settings = {}; // Create settings object
			options = options.split(';'); // Split into array of options

			// Create a key/value pair for each setting
			options.forEach( function(option) {
				option = option.trim();
				if ( option !== '' ) {
					option = option.split(':');
					settings[option[0]] = option[1].trim();
				}
			});

			return settings;
		}

	};

	// Update the URL
	// Private method
	// Runs functions
	var _updateURL = function ( anchor, url ) {
		if ( (url === true || url === 'true') && history.pushState ) {
			history.pushState( {pos:anchor.id}, '', anchor );
		}
	};

	// Start/stop the scrolling animation
	// Public method
	// Runs functions
	var animateScroll = function ( toggle, anchor, options, event ) {

		// Options and overrides
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		var overrides = _getDataOptions( toggle ? toggle.getAttribute('data-options') : null );
		var speed = parseInt(overrides.speed || options.speed, 10);
		var easing = overrides.easing || options.easing;
		var offset = parseInt(overrides.offset || options.offset, 10);
		var updateURL = overrides.updateURL || options.updateURL;

		// Selectors and variables
		var fixedHeader = document.querySelector('[data-scroll-header]'); // Get the fixed header
		var headerHeight = fixedHeader === null ? 0 : (fixedHeader.offsetHeight + fixedHeader.offsetTop); // Get the height of a fixed header if one exists
		var startLocation = window.pageYOffset; // Current location on the page
		var endLocation = _getEndLocation( document.querySelector(anchor), headerHeight, offset ); // Scroll to location
		var animationInterval; // interval timer
		var distance = endLocation - startLocation; // distance to travel
		var documentHeight = _getDocumentHeight();
		var timeLapsed = 0;
		var percentage, position;

		// Prevent default click event
		if ( toggle && toggle.tagName === 'A' && event ) {
			event.preventDefault();
		}

		// Update URL
		_updateURL(anchor, updateURL);

		// Stop the scroll animation when it reaches its target (or the bottom/top of page)
		// Private method
		// Runs functions
		var _stopAnimateScroll = function (position, endLocation, animationInterval) {
			var currentLocation = window.pageYOffset;
			if ( position == endLocation || currentLocation == endLocation || ( (window.innerHeight + currentLocation) >= documentHeight ) ) {
				clearInterval(animationInterval);
				options.callbackAfter( toggle, anchor ); // Run callbacks after animation complete
			}
		};

		// Loop scrolling animation
		// Private method
		// Runs functions
		var _loopAnimateScroll = function () {
			timeLapsed += 16;
			percentage = ( timeLapsed / speed );
			percentage = ( percentage > 1 ) ? 1 : percentage;
			position = startLocation + ( distance * _easingPattern(easing, percentage) );
			window.scrollTo( 0, Math.floor(position) );
			_stopAnimateScroll(position, endLocation, animationInterval);
		};

		// Set interval timer
		// Private method
		// Runs functions
		var _startAnimateScroll = function () {
			options.callbackBefore( toggle, anchor ); // Run callbacks before animating scroll
			animationInterval = setInterval(_loopAnimateScroll, 16);
		};

		// Reset position to fix weird iOS bug
		// https://github.com/cferdinandi/smooth-scroll/issues/45
		if ( window.pageYOffset === 0 ) {
			window.scrollTo( 0, 0 );
		}

		// Start scrolling animation
		_startAnimateScroll();

	};

	// Initialize Smooth Scroll
	// Public method
	// Runs functions
	var init = function ( options ) {

		// Feature test before initializing
		if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

			// Selectors and variables
			options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
			var toggles = document.querySelectorAll('[data-scroll]'); // Get smooth scroll toggles

			// When a toggle is clicked, run the click handler
			Array.prototype.forEach.call(toggles, function (toggle, index) {
				toggle.addEventListener('click', animateScroll.bind( null, toggle, toggle.getAttribute('href'), options ), false);
			});

		}

	};

	// Return public methods
	return {
		init: init,
		animateScroll: animateScroll
	};

})(window, document);

/**
 * selectFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {

	'use strict';

	/**
	 * based on from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
	 */
	function hasParent( e, p ) {
		if (!e) return false;
		var el = e.target||e.srcElement||e||false;
		while (el && el != p) {
			el = el.parentNode||false;
		}
		return (el!==false);
	};

	/**
	 * extend obj function
	 */
	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * SelectFx function
	 */
	function SelectFx( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	}

	/**
	 * SelectFx options
	 */
	SelectFx.prototype.options = {
		// if true all the links will open in a new tab.
		// if we want to be redirected when we click an option, we need to define a data-link attr on the option of the native select element
		newTab : true,
		// when opening the select element, the default placeholder (if any) is shown
		stickyPlaceholder : true,
		// callback when changing the value
		onChange : function( val ) { return false; }
	}

	/**
	 * init function
	 * initialize and cache some vars
	 */
	SelectFx.prototype._init = function() {
		// check if we are using a placeholder for the native select box
		// we assume the placeholder is disabled and selected by default
		var selectedOpt = this.el.querySelector( 'option[selected]' );
		this.hasDefaultPlaceholder = selectedOpt && selectedOpt.disabled;

		// get selected option (either the first option with attr selected or just the first option)
		this.selectedOpt = selectedOpt || this.el.querySelector( 'option' );

		// create structure
		this._createSelectEl();

		// all options
		this.selOpts = [].slice.call( this.selEl.querySelectorAll( 'li[data-option]' ) );

		// total options
		this.selOptsCount = this.selOpts.length;

		// current index
		this.current = this.selOpts.indexOf( this.selEl.querySelector( 'li.cs-selected' ) ) || -1;

		// placeholder elem
		this.selPlaceholder = this.selEl.querySelector( 'span.cs-placeholder' );

		// init events
		this._initEvents();
	}

	/**
	 * creates the structure for the select element
	 */
	SelectFx.prototype._createSelectEl = function() {
		var self = this, options = '', createOptionHTML = function(el) {
			var optclass = '', classes = '', link = '';

			if( el.selectedOpt && !this.foundSelected && !this.hasDefaultPlaceholder ) {
				classes += 'cs-selected ';
				this.foundSelected = true;
			}
			// extra classes
			if( el.getAttribute( 'data-class' ) ) {
				classes += el.getAttribute( 'data-class' );
			}
			// link options
			if( el.getAttribute( 'data-link' ) ) {
				link = 'data-link=' + el.getAttribute( 'data-link' );
			}

			if( classes !== '' ) {
				optclass = 'class="' + classes + '" ';
			}

			return '<li ' + optclass + link + ' data-option data-value="' + el.value + '"><span>' + el.textContent + '</span></li>';
		};

		[].slice.call( this.el.children ).forEach( function(el) {
			if( el.disabled ) { return; }

			var tag = el.tagName.toLowerCase();

			if( tag === 'option' ) {
				options += createOptionHTML(el);
			}
			else if( tag === 'optgroup' ) {
				options += '<li class="cs-optgroup"><span>' + el.label + '</span><ul>';
				[].slice.call( el.children ).forEach( function(opt) {
					options += createOptionHTML(opt);
				} )
				options += '</ul></li>';
			}
		} );

		var opts_el = '<div class="cs-options"><ul>' + options + '</ul></div>';
		this.selEl = document.createElement( 'div' );
		this.selEl.className = this.el.className;
		this.selEl.tabIndex = this.el.tabIndex;
		this.selEl.innerHTML = '<span class="cs-placeholder">' + this.selectedOpt.textContent + '</span>' + opts_el;
		this.el.parentNode.appendChild( this.selEl );
		this.selEl.appendChild( this.el );
	}

	/**
	 * initialize the events
	 */
	SelectFx.prototype._initEvents = function() {
		var self = this;

		// open/close select
		this.selPlaceholder.addEventListener( 'click', function() {
			self._toggleSelect();
		} );

		// clicking the options
		this.selOpts.forEach( function(opt, idx) {
			opt.addEventListener( 'click', function() {
				self.current = idx;
				self._changeOption();
				// close select elem
				self._toggleSelect();
			} );
		} );

		// close the select element if the target it´s not the select element or one of its descendants..
		document.addEventListener( 'click', function(ev) {
			var target = ev.target;
			if( self._isOpen() && target !== self.selEl && !hasParent( target, self.selEl ) ) {
				self._toggleSelect();
			}
		} );

		// keyboard navigation events
		this.selEl.addEventListener( 'keydown', function( ev ) {
			var keyCode = ev.keyCode || ev.which;

			switch (keyCode) {
				// up key
				case 38:
					ev.preventDefault();
					self._navigateOpts('prev');
					break;
				// down key
				case 40:
					ev.preventDefault();
					self._navigateOpts('next');
					break;
				// space key
				case 32:
					ev.preventDefault();
					if( self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1 ) {
						self._changeOption();
					}
					self._toggleSelect();
					break;
				// enter key
				case 13:
					ev.preventDefault();
					if( self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1 ) {
						self._changeOption();
						self._toggleSelect();
					}
					break;
				// esc key
				case 27:
					ev.preventDefault();
					if( self._isOpen() ) {
						self._toggleSelect();
					}
					break;
			}
		} );
	}

	/**
	 * navigate with up/dpwn keys
	 */
	SelectFx.prototype._navigateOpts = function(dir) {
		if( !this._isOpen() ) {
			this._toggleSelect();
		}

		var tmpcurrent = typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1 ? this.preSelCurrent : this.current;

		if( dir === 'prev' && tmpcurrent > 0 || dir === 'next' && tmpcurrent < this.selOptsCount - 1 ) {
			// save pre selected current - if we click on option, or press enter, or press space this is going to be the index of the current option
			this.preSelCurrent = dir === 'next' ? tmpcurrent + 1 : tmpcurrent - 1;
			// remove focus class if any..
			this._removeFocus();
			// add class focus - track which option we are navigating
			classie.add( this.selOpts[this.preSelCurrent], 'cs-focus' );
		}
	}

	/**
	 * open/close select
	 * when opened show the default placeholder if any
	 */
	SelectFx.prototype._toggleSelect = function() {
		// remove focus class if any..
		this._removeFocus();

		if( this._isOpen() ) {
			if( this.current !== -1 ) {
				// update placeholder text
				this.selPlaceholder.textContent = this.selOpts[ this.current ].textContent;
			}
			classie.remove( this.selEl, 'cs-active' );
		}
		else {
			if( this.hasDefaultPlaceholder && this.options.stickyPlaceholder ) {
				// everytime we open we wanna see the default placeholder text
				this.selPlaceholder.textContent = this.selectedOpt.textContent;
			}
			classie.add( this.selEl, 'cs-active' );
		}
	}

	/**
	 * change option - the new value is set
	 */
	SelectFx.prototype._changeOption = function() {
		// if pre selected current (if we navigate with the keyboard)...
		if( typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1 ) {
			this.current = this.preSelCurrent;
			this.preSelCurrent = -1;
		}

		// current option
		var opt = this.selOpts[ this.current ];

		// update current selected value
		this.selPlaceholder.textContent = opt.textContent;

		// change native select element´s value
		this.el.value = opt.getAttribute( 'data-value' );

		// remove class cs-selected from old selected option and add it to current selected option
		var oldOpt = this.selEl.querySelector( 'li.cs-selected' );
		if( oldOpt ) {
			classie.remove( oldOpt, 'cs-selected' );
		}
		classie.add( opt, 'cs-selected' );

		// if there´s a link defined
		if( opt.getAttribute( 'data-link' ) ) {
			// open in new tab?
			if( this.options.newTab ) {
				window.open( opt.getAttribute( 'data-link' ), '_blank' );
			}
			else {
				window.location = opt.getAttribute( 'data-link' );
			}
		}

		// callback
		this.options.onChange( this.el.value );
	}

	/**
	 * returns true if select element is opened
	 */
	SelectFx.prototype._isOpen = function(opt) {
		return classie.has( this.selEl, 'cs-active' );
	}

	/**
	 * removes the focus class from the option
	 */
	SelectFx.prototype._removeFocus = function(opt) {
		var focusEl = this.selEl.querySelector( 'li.cs-focus' )
		if( focusEl ) {
			classie.remove( focusEl, 'cs-focus' );
		}
	}

	/**
	 * add to global namespace
	 */
	window.SelectFx = SelectFx;

} )( window );

(function() {
	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	} );
})();
/*! echo.js v1.6.0 | (c) 2014 @toddmotto | https://github.com/toddmotto/echo */
!function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):"object"==typeof exports?module.exports=e:t.echo=e(t)}(this,function(t){"use strict";var e,n,o,r,c,i={},l=function(){},a=function(t,e){var n=t.getBoundingClientRect();return n.right>=e.l&&n.bottom>=e.t&&n.left<=e.r&&n.top<=e.b},d=function(){(r||!n)&&(clearTimeout(n),n=setTimeout(function(){i.render(),n=null},o))};return i.init=function(n){n=n||{};var a=n.offset||0,u=n.offsetVertical||a,f=n.offsetHorizontal||a,s=function(t,e){return parseInt(t||e,10)};e={t:s(n.offsetTop,u),b:s(n.offsetBottom,u),l:s(n.offsetLeft,f),r:s(n.offsetRight,f)},o=s(n.throttle,250),r=n.debounce!==!1,c=!!n.unload,l=n.callback||l,i.render(),document.addEventListener?(t.addEventListener("scroll",d,!1),t.addEventListener("load",d,!1)):(t.attachEvent("onscroll",d),t.attachEvent("onload",d))},i.render=function(){for(var n,o,r=document.querySelectorAll("img[data-echo]"),d=r.length,u={l:0-e.l,t:0-e.t,b:(t.innerHeight||document.documentElement.clientHeight)+e.b,r:(t.innerWidth||document.documentElement.clientWidth)+e.r},f=0;d>f;f++)o=r[f],a(o,u)?(c&&o.setAttribute("data-echo-placeholder",o.src),o.src=o.getAttribute("data-echo"),c||o.removeAttribute("data-echo"),l(o,"load")):c&&(n=o.getAttribute("data-echo-placeholder"))&&(o.src=n,o.removeAttribute("data-echo-placeholder"),l(o,"unload"));d||i.detach()},i.detach=function(){document.removeEventListener?t.removeEventListener("scroll",d):t.detachEvent("onscroll",d),clearTimeout(n)},i});
/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version: 1.9.0
 *
 */
!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(f){function g(){var b=0;i.each(function(){var c=a(this);if(!j.skip_invisible||c.is(":visible"))if(a.abovethetop(this,j)||a.leftofbegin(this,j));else if(a.belowthefold(this,j)||a.rightoffold(this,j)){if(++b>j.failure_limit)return!1}else c.trigger("appear"),b=0})}var h,i=this,j={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!0,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return f&&(d!==f.failurelimit&&(f.failure_limit=f.failurelimit,delete f.failurelimit),d!==f.effectspeed&&(f.effect_speed=f.effectspeed,delete f.effectspeed),a.extend(j,f)),h=j.container===d||j.container===b?e:a(j.container),0===j.event.indexOf("scroll")&&h.bind(j.event,function(){return g()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,(c.attr("src")===d||c.attr("src")===!1)&&c.attr("src",j.placeholder),c.one("appear",function(){if(!this.loaded){if(j.appear){var d=i.length;j.appear.call(b,d,j)}a("<img />").bind("load",function(){var d=c.data(j.data_attribute);c.hide(),c.is("img")?c.attr("src",d):c.css("background-image","url('"+d+"')"),c[j.effect](j.effect_speed),b.loaded=!0;var e=a.grep(i,function(a){return!a.loaded});if(i=a(e),j.load){var f=i.length;j.load.call(b,f,j)}}).attr("src",c.data(j.data_attribute))}}),0!==j.event.indexOf("scroll")&&c.bind(j.event,function(){b.loaded||c.trigger("appear")})}),e.bind("resize",function(){g()}),/iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent&&b.originalEvent.persisted&&i.each(function(){a(this).trigger("appear")})}),a(c).ready(function(){g()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?(b.innerHeight?b.innerHeight:e.height())+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e.scrollLeft():a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollLeft():a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}(jQuery,window,document);
/**
 * SVGInjector v1.1.2 - Fast, caching, dynamic inline SVG DOM injection library
 * https://github.com/iconic/SVGInjector
 *
 * Copyright (c) 2014 Waybury <hello@waybury.com>
 * @license MIT
 */
!function(t,e){"use strict";function r(t){t=t.split(" ");for(var e={},r=t.length,n=[];r--;)e.hasOwnProperty(t[r])||(e[t[r]]=1,n.unshift(t[r]));return n.join(" ")}var n="file:"===t.location.protocol,i=e.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"),o=Array.prototype.forEach||function(t,e){if(void 0===this||null===this||"function"!=typeof t)throw new TypeError;var r,n=this.length>>>0;for(r=0;n>r;++r)r in this&&t.call(e,this[r],r,this)},a={},s=0,l=[],u=[],c={},f=function(t){return t.cloneNode(!0)},p=function(t,e){u[t]=u[t]||[],u[t].push(e)},d=function(t){for(var e=0,r=u[t].length;r>e;e++)!function(e){setTimeout(function(){u[t][e](f(a[t]))},0)}(e)},h=function(e,r){if(void 0!==a[e])a[e]instanceof SVGSVGElement?r(f(a[e])):p(e,r);else{if(!t.XMLHttpRequest)return r("Browser does not support XMLHttpRequest"),!1;a[e]={},p(e,r);var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4===i.readyState){if(404===i.status||null===i.responseXML)return r("Unable to load SVG file: "+e),n&&r("Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver."),r(),!1;if(!(200===i.status||n&&0===i.status))return r("There was a problem injecting the SVG: "+i.status+" "+i.statusText),!1;if(i.responseXML instanceof Document)a[e]=i.responseXML.documentElement;else if(DOMParser&&DOMParser instanceof Function){var t;try{var o=new DOMParser;t=o.parseFromString(i.responseText,"text/xml")}catch(s){t=void 0}if(!t||t.getElementsByTagName("parsererror").length)return r("Unable to parse SVG file: "+e),!1;a[e]=t.documentElement}d(e)}},i.open("GET",e),i.overrideMimeType&&i.overrideMimeType("text/xml"),i.send()}},v=function(e,n,a,u){var f=e.getAttribute("data-src")||e.getAttribute("src");if(!/\.svg/i.test(f))return void u("Attempted to inject a file with a non-svg extension: "+f);if(!i){var p=e.getAttribute("data-fallback")||e.getAttribute("data-png");return void(p?(e.setAttribute("src",p),u(null)):a?(e.setAttribute("src",a+"/"+f.split("/").pop().replace(".svg",".png")),u(null)):u("This browser does not support SVG and no PNG fallback was defined."))}-1===l.indexOf(e)&&(l.push(e),e.setAttribute("src",""),h(f,function(i){if("undefined"==typeof i||"string"==typeof i)return u(i),!1;var a=e.getAttribute("id");a&&i.setAttribute("id",a);var p=e.getAttribute("title");p&&i.setAttribute("title",p);var d=[].concat(i.getAttribute("class")||[],"injected-svg",e.getAttribute("class")||[]).join(" ");i.setAttribute("class",r(d));var h=e.getAttribute("style");h&&i.setAttribute("style",h);var v=[].filter.call(e.attributes,function(t){return/^data-\w[\w\-]*$/.test(t.name)});o.call(v,function(t){t.name&&t.value&&i.setAttribute(t.name,t.value)});for(var g,b=i.querySelectorAll("defs clipPath[id]"),m=0,y=b.length;y>m;m++){g=b[m].id+"-"+s;for(var A=i.querySelectorAll('[clip-path*="'+b[m].id+'"]'),w=0,S=A.length;S>w;w++)A[w].setAttribute("clip-path","url(#"+g+")");b[m].id=g}for(var x,j=i.querySelectorAll("defs mask[id]"),T=0,G=j.length;G>T;T++){x=j[T].id+"-"+s;for(var M=i.querySelectorAll('[mask*="'+j[T].id+'"]'),V=0,q=M.length;q>V;V++)M[V].setAttribute("mask","url(#"+x+")");j[T].id=x}i.removeAttribute("xmlns:a");for(var k,E,O=i.querySelectorAll("script"),L=[],P=0,X=O.length;X>P;P++)E=O[P].getAttribute("type"),E&&"application/ecmascript"!==E&&"application/javascript"!==E||(k=O[P].innerText||O[P].textContent,L.push(k),i.removeChild(O[P]));if(L.length>0&&("always"===n||"once"===n&&!c[f])){for(var F=0,N=L.length;N>F;F++)new Function(L[F])(t);c[f]=!0}e.parentNode.replaceChild(i,e),delete l[l.indexOf(e)],e=null,s++,u(i)}))},g=function(t,e,r){e=e||{};var n=e.evalScripts||"always",i=e.pngFallback||!1,a=e.each;if(void 0!==t.length){var s=0;o.call(t,function(e){v(e,n,i,function(e){a&&"function"==typeof a&&a(e),r&&t.length===++s&&r(s)})})}else t?v(t,n,i,function(e){a&&"function"==typeof a&&a(e),r&&r(1),t=null}):r&&r(0)};"object"==typeof module&&"object"==typeof module.exports?module.exports=exports=g:"function"==typeof define&&define.amd?define(function(){return g}):"object"==typeof t&&(t.SVGInjector=g)}(window,document);
//# sourceMappingURL=svg-injector.map.js