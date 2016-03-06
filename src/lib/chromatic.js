// jquery.event.move
//
// 1.3.6
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:   Page coordinates of pointer.
// startX:
// startY:  Page coordinates of pointer at movestart.
// distX:
// distY:  Distance the pointer has moved since movestart.
// deltaX:
// deltaY:  Distance the finger has moved since last event.
// velocityX:
// velocityY:  Average velocity over last few events.


(function (module) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], module);
	} else {
		// Browser globals
		module(jQuery);
	}
})(function(jQuery, undefined){

	var // Number of pixels a pressed pointer travels before movestart
	    // event is fired.
	    threshold = 6,

	    add = jQuery.event.add,

	    remove = jQuery.event.remove,

	    // Just sugar, so we can have arguments in the same order as
	    // add and remove.
	    trigger = function(node, type, data) {
	    	jQuery.event.trigger(type, data, node);
	    },

	    // Shim for requestAnimationFrame, falling back to timer. See:
	    // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	    requestFrame = (function(){
	    	return (
	    		window.requestAnimationFrame ||
	    		window.webkitRequestAnimationFrame ||
	    		window.mozRequestAnimationFrame ||
	    		window.oRequestAnimationFrame ||
	    		window.msRequestAnimationFrame ||
	    		function(fn, element){
	    			return window.setTimeout(function(){
	    				fn();
	    			}, 25);
	    		}
	    	);
	    })(),

	    ignoreTags = {
	    	textarea: true,
	    	input: true,
	    	select: true,
	    	button: true
	    },

	    mouseevents = {
	    	move: 'mousemove',
	    	cancel: 'mouseup dragstart',
	    	end: 'mouseup'
	    },

	    touchevents = {
	    	move: 'touchmove',
	    	cancel: 'touchend',
	    	end: 'touchend'
	    };


	// Constructors

	function Timer(fn){
		var callback = fn,
		    active = false,
		    running = false;

		function trigger(time) {
			if (active){
				callback();
				requestFrame(trigger);
				running = true;
				active = false;
			}
			else {
				running = false;
			}
		}

		this.kick = function(fn) {
			active = true;
			if (!running) { trigger(); }
		};

		this.end = function(fn) {
			var cb = callback;

			if (!fn) { return; }

			// If the timer is not running, simply call the end callback.
			if (!running) {
				fn();
			}
			// If the timer is running, and has been kicked lately, then
			// queue up the current callback and the end callback, otherwise
			// just the end callback.
			else {
				callback = active ?
					function(){ cb(); fn(); } :
					fn ;

				active = true;
			}
		};
	}


	// Functions

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function preventDefault(e) {
		e.preventDefault();
	}

	function preventIgnoreTags(e) {
		// Don't prevent interaction with form elements.
		if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

		e.preventDefault();
	}

	function isLeftButton(e) {
		// Ignore mousedowns on any button other than the left (or primary)
		// mouse button, or when a modifier key is pressed.
		return (e.which === 1 && !e.ctrlKey && !e.altKey);
	}

	function identifiedTouch(touchList, id) {
		var i, l;

		if (touchList.identifiedTouch) {
			return touchList.identifiedTouch(id);
		}

		// touchList.identifiedTouch() does not exist in
		// webkit yet… we must do the search ourselves...

		i = -1;
		l = touchList.length;

		while (++i < l) {
			if (touchList[i].identifier === id) {
				return touchList[i];
			}
		}
	}

	function changedTouch(e, event) {
		var touch = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		// Chrome Android (at least) includes touches that have not
		// changed in e.changedTouches. That's a bit annoying. Check
		// that this touch has changed.
		if (touch.pageX === event.pageX && touch.pageY === event.pageY) { return; }

		return touch;
	}


	// Handlers that decide when the first movestart is triggered

	function mousedown(e){
		var data;

		if (!isLeftButton(e)) { return; }

		data = {
			target: e.target,
			startX: e.pageX,
			startY: e.pageY,
			timeStamp: e.timeStamp
		};

		add(document, mouseevents.move, mousemove, data);
		add(document, mouseevents.cancel, mouseend, data);
	}

	function mousemove(e){
		var data = e.data;

		checkThreshold(e, data, e, removeMouse);
	}

	function mouseend(e) {
		removeMouse();
	}

	function removeMouse() {
		remove(document, mouseevents.move, mousemove);
		remove(document, mouseevents.cancel, mouseend);
	}

	function touchstart(e) {
		var touch, template;

		// Don't get in the way of interaction with form elements.
		if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

		touch = e.changedTouches[0];

		// iOS live updates the touch objects whereas Android gives us copies.
		// That means we can't trust the touchstart object to stay the same,
		// so we must copy the data. This object acts as a template for
		// movestart, move and moveend event objects.
		template = {
			target: touch.target,
			startX: touch.pageX,
			startY: touch.pageY,
			timeStamp: e.timeStamp,
			identifier: touch.identifier
		};

		// Use the touch identifier as a namespace, so that we can later
		// remove handlers pertaining only to this touch.
		add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
		add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
	}

	function touchmove(e){
		var data = e.data,
		    touch = changedTouch(e, data);

		if (!touch) { return; }

		checkThreshold(e, data, touch, removeTouch);
	}

	function touchend(e) {
		var template = e.data,
		    touch = identifiedTouch(e.changedTouches, template.identifier);

		if (!touch) { return; }

		removeTouch(template.identifier);
	}

	function removeTouch(identifier) {
		remove(document, '.' + identifier, touchmove);
		remove(document, '.' + identifier, touchend);
	}


	// Logic for deciding when to trigger a movestart.

	function checkThreshold(e, template, touch, fn) {
		var distX = touch.pageX - template.startX,
		    distY = touch.pageY - template.startY;

		// Do nothing if the threshold has not been crossed.
		if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

		triggerStart(e, template, touch, distX, distY, fn);
	}

	function handled() {
		// this._handled should return false once, and after return true.
		this._handled = returnTrue;
		return false;
	}

	function flagAsHandled(e) {
		e._handled();
	}

	function triggerStart(e, template, touch, distX, distY, fn) {
		var node = template.target,
		    touches, time;

		touches = e.targetTouches;
		time = e.timeStamp - template.timeStamp;

		// Create a movestart object with some special properties that
		// are passed only to the movestart handlers.
		template.type = 'movestart';
		template.distX = distX;
		template.distY = distY;
		template.deltaX = distX;
		template.deltaY = distY;
		template.pageX = touch.pageX;
		template.pageY = touch.pageY;
		template.velocityX = distX / time;
		template.velocityY = distY / time;
		template.targetTouches = touches;
		template.finger = touches ?
			touches.length :
			1 ;

		// The _handled method is fired to tell the default movestart
		// handler that one of the move events is bound.
		template._handled = handled;

		// Pass the touchmove event so it can be prevented if or when
		// movestart is handled.
		template._preventTouchmoveDefault = function() {
			e.preventDefault();
		};

		// Trigger the movestart event.
		trigger(template.target, template);

		// Unbind handlers that tracked the touch or mouse up till now.
		fn(template.identifier);
	}


	// Handlers that control what happens following a movestart

	function activeMousemove(e) {
		var timer = e.data.timer;

		e.data.touch = e;
		e.data.timeStamp = e.timeStamp;
		timer.kick();
	}

	function activeMouseend(e) {
		var event = e.data.event,
		    timer = e.data.timer;

		removeActiveMouse();

		endEvent(event, timer, function() {
			// Unbind the click suppressor, waiting until after mouseup
			// has been handled.
			setTimeout(function(){
				remove(event.target, 'click', returnFalse);
			}, 0);
		});
	}

	function removeActiveMouse(event) {
		remove(document, mouseevents.move, activeMousemove);
		remove(document, mouseevents.end, activeMouseend);
	}

	function activeTouchmove(e) {
		var event = e.data.event,
		    timer = e.data.timer,
		    touch = changedTouch(e, event);

		if (!touch) { return; }

		// Stop the interface from gesturing
		e.preventDefault();

		event.targetTouches = e.targetTouches;
		e.data.touch = touch;
		e.data.timeStamp = e.timeStamp;
		timer.kick();
	}

	function activeTouchend(e) {
		var event = e.data.event,
		    timer = e.data.timer,
		    touch = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		removeActiveTouch(event);
		endEvent(event, timer);
	}

	function removeActiveTouch(event) {
		remove(document, '.' + event.identifier, activeTouchmove);
		remove(document, '.' + event.identifier, activeTouchend);
	}


	// Logic for triggering move and moveend events

	function updateEvent(event, touch, timeStamp, timer) {
		var time = timeStamp - event.timeStamp;

		event.type = 'move';
		event.distX =  touch.pageX - event.startX;
		event.distY =  touch.pageY - event.startY;
		event.deltaX = touch.pageX - event.pageX;
		event.deltaY = touch.pageY - event.pageY;

		// Average the velocity of the last few events using a decay
		// curve to even out spurious jumps in values.
		event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
		event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
		event.pageX =  touch.pageX;
		event.pageY =  touch.pageY;
	}

	function endEvent(event, timer, fn) {
		timer.end(function(){
			event.type = 'moveend';

			trigger(event.target, event);

			return fn && fn();
		});
	}


	// jQuery special event definition

	function setup(data, namespaces, eventHandle) {
		// Stop the node from being dragged
		//add(this, 'dragstart.move drag.move', preventDefault);

		// Prevent text selection and touch interface scrolling
		//add(this, 'mousedown.move', preventIgnoreTags);

		// Tell movestart default handler that we've handled this
		add(this, 'movestart.move', flagAsHandled);

		// Don't bind to the DOM. For speed.
		return true;
	}

	function teardown(namespaces) {
		remove(this, 'dragstart drag', preventDefault);
		remove(this, 'mousedown touchstart', preventIgnoreTags);
		remove(this, 'movestart', flagAsHandled);

		// Don't bind to the DOM. For speed.
		return true;
	}

	function addMethod(handleObj) {
		// We're not interested in preventing defaults for handlers that
		// come from internal move or moveend bindings
		if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
			return;
		}

		// Stop the node from being dragged
		add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);

		// Prevent text selection and touch interface scrolling
		add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
	}

	function removeMethod(handleObj) {
		if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
			return;
		}

		remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
		remove(this, 'mousedown.' + handleObj.guid);
	}

	jQuery.event.special.movestart = {
		setup: setup,
		teardown: teardown,
		add: addMethod,
		remove: removeMethod,

		_default: function(e) {
			var event, data;

			// If no move events were bound to any ancestors of this
			// target, high tail it out of here.
			if (!e._handled()) { return; }

			function update(time) {
				updateEvent(event, data.touch, data.timeStamp);
				trigger(e.target, event);
			}

			event = {
				target: e.target,
				startX: e.startX,
				startY: e.startY,
				pageX: e.pageX,
				pageY: e.pageY,
				distX: e.distX,
				distY: e.distY,
				deltaX: e.deltaX,
				deltaY: e.deltaY,
				velocityX: e.velocityX,
				velocityY: e.velocityY,
				timeStamp: e.timeStamp,
				identifier: e.identifier,
				targetTouches: e.targetTouches,
				finger: e.finger
			};

			data = {
				event: event,
				timer: new Timer(update),
				touch: undefined,
				timeStamp: undefined
			};

			if (e.identifier === undefined) {
				// We're dealing with a mouse
				// Stop clicks from propagating during a move
				add(e.target, 'click', returnFalse);
				add(document, mouseevents.move, activeMousemove, data);
				add(document, mouseevents.end, activeMouseend, data);
			}
			else {
				// We're dealing with a touch. Stop touchmove doing
				// anything defaulty.
				e._preventTouchmoveDefault();
				add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
				add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
			}
		}
	};

	jQuery.event.special.move = {
		setup: function() {
			// Bind a noop to movestart. Why? It's the movestart
			// setup that decides whether other move events are fired.
			add(this, 'movestart.move', jQuery.noop);
		},

		teardown: function() {
			remove(this, 'movestart.move', jQuery.noop);
		}
	};

	jQuery.event.special.moveend = {
		setup: function() {
			// Bind a noop to movestart. Why? It's the movestart
			// setup that decides whether other move events are fired.
			add(this, 'movestart.moveend', jQuery.noop);
		},

		teardown: function() {
			remove(this, 'movestart.moveend', jQuery.noop);
		}
	};

	add(document, 'mousedown.move', mousedown);
	add(document, 'touchstart.move', touchstart);

	// Make jQuery copy touch event properties over to the jQuery event
	// object, if they are not already listed. But only do the ones we
	// really need. IE7/8 do not have Array#indexOf(), but nor do they
	// have touch events, so let's assume we can ignore them.
	if (typeof Array.prototype.indexOf === 'function') {
		(function(jQuery, undefined){
			var props = ["changedTouches", "targetTouches"],
			    l = props.length;

			while (l--) {
				if (jQuery.event.props.indexOf(props[l]) === -1) {
					jQuery.event.props.push(props[l]);
				}
			}
		})(jQuery);
	};
});

// jQuery.event.swipe
// 0.5
// Stephen Band

// Dependencies
// jQuery.event.move 1.2

// One of swipeleft, swiperight, swipeup or swipedown is triggered on
// moveend, when the move has covered a threshold ratio of the dimension
// of the target node, or has gone really fast. Threshold and velocity
// sensitivity changed with:
//
// jQuery.event.special.swipe.settings.threshold
// jQuery.event.special.swipe.settings.sensitivity

(function (module) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], module);
	} else {
		// Browser globals
		module(jQuery);
	}
})(function(jQuery, undefined){
	var add = jQuery.event.add,

	    remove = jQuery.event.remove,

	    // Just sugar, so we can have arguments in the same order as
	    // add and remove.
	    trigger = function(node, type, data) {
	    	jQuery.event.trigger(type, data, node);
	    },

	    settings = {
	    	// Ratio of distance over target finger must travel to be
	    	// considered a swipe.
	    	threshold: 0.4,
	    	// Faster fingers can travel shorter distances to be considered
	    	// swipes. 'sensitivity' controls how much. Bigger is shorter.
	    	sensitivity: 6
	    };

	function moveend(e) {
		var w, h, event;

		w = e.currentTarget.offsetWidth;
		h = e.currentTarget.offsetHeight;

		// Copy over some useful properties from the move event
		event = {
			distX: e.distX,
			distY: e.distY,
			velocityX: e.velocityX,
			velocityY: e.velocityY,
			finger: e.finger
		};

		// Find out which of the four directions was swiped
		if (e.distX > e.distY) {
			if (e.distX > -e.distY) {
				if (e.distX/w > settings.threshold || e.velocityX * e.distX/w * settings.sensitivity > 1) {
					event.type = 'swiperight';
					trigger(e.currentTarget, event);
				}
			}
			else {
				if (-e.distY/h > settings.threshold || e.velocityY * e.distY/w * settings.sensitivity > 1) {
					event.type = 'swipeup';
					trigger(e.currentTarget, event);
				}
			}
		}
		else {
			if (e.distX > -e.distY) {
				if (e.distY/h > settings.threshold || e.velocityY * e.distY/w * settings.sensitivity > 1) {
					event.type = 'swipedown';
					trigger(e.currentTarget, event);
				}
			}
			else {
				if (-e.distX/w > settings.threshold || e.velocityX * e.distX/w * settings.sensitivity > 1) {
					event.type = 'swipeleft';
					trigger(e.currentTarget, event);
				}
			}
		}
	}

	function getData(node) {
		var data = jQuery.data(node, 'event_swipe');

		if (!data) {
			data = { count: 0 };
			jQuery.data(node, 'event_swipe', data);
		}

		return data;
	}

	jQuery.event.special.swipe =
	jQuery.event.special.swipeleft =
	jQuery.event.special.swiperight =
	jQuery.event.special.swipeup =
	jQuery.event.special.swipedown = {
		setup: function( data, namespaces, eventHandle ) {
			var data = getData(this);

			// If another swipe event is already setup, don't setup again.
			if (data.count++ > 0) { return; }

			add(this, 'moveend', moveend);

			return true;
		},

		teardown: function() {
			var data = getData(this);

			// If another swipe event is still setup, don't teardown.
			if (--data.count > 0) { return; }

			remove(this, 'moveend', moveend);

			return true;
		},

		settings: settings
	};
});

//     keymaster.js
//     (c) 2011-2013 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.

;(function(global){
  var k,
    _handlers = {},
    _mods = { 16: false, 18: false, 17: false, 91: false },
    _scope = 'all',
    // modifier keys
    _MODIFIERS = {
      '⇧': 16, shift: 16,
      '⌥': 18, alt: 18, option: 18,
      '⌃': 17, ctrl: 17, control: 17,
      '⌘': 91, command: 91
    },
    // special keys
    _MAP = {
      backspace: 8, tab: 9, clear: 12,
      enter: 13, 'return': 13,
      esc: 27, escape: 27, space: 32,
      left: 37, up: 38,
      right: 39, down: 40,
      del: 46, 'delete': 46,
      home: 36, end: 35,
      pageup: 33, pagedown: 34,
      ',': 188, '.': 190, '/': 191,
      '`': 192, '-': 189, '=': 187,
      ';': 186, '\'': 222,
      '[': 219, ']': 221, '\\': 220
    },
    code = function(x){
      return _MAP[x] || x.toUpperCase().charCodeAt(0);
    },
    _downKeys = [];

  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

  // IE doesn't support Array#indexOf, so have a simple replacement
  function index(array, item){
    var i = array.length;
    while(i--) if(array[i]===item) return i;
    return -1;
  }

  // for comparing mods before unassignment
  function compareArray(a1, a2) {
    if (a1.length != a2.length) return false;
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
  }

  var modifierMap = {
      16:'shiftKey',
      18:'altKey',
      17:'ctrlKey',
      91:'metaKey'
  };
  function updateModifierKey(event) {
      for(k in _mods) _mods[k] = event[modifierMap[k]];
  };

  // handle keydown event
  function dispatch(event) {
    var key, handler, k, i, modifiersMatch, scope;
    key = event.keyCode;

    if (index(_downKeys, key) == -1) {
        _downKeys.push(key);
    }

    // if a modifier key, set the key.<modifierkeyname> property to true and return
    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
    if(key in _mods) {
      _mods[key] = true;
      // 'assignKey' from inside this closure is exported to window.key
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
      return;
    }
    updateModifierKey(event);

    // see if we need to ignore the keypress (filter() can can be overridden)
    // by default ignore key presses if a select, textarea, or input is focused
    if(!assignKey.filter.call(this, event)) return;

    // abort if no potentially matching shortcuts found
    if (!(key in _handlers)) return;

    scope = getScope();

    // for each potential shortcut
    for (i = 0; i < _handlers[key].length; i++) {
      handler = _handlers[key][i];

      // see if it's in the current scope
      if(handler.scope == scope || handler.scope == 'all'){
        // check if modifiers match if any
        modifiersMatch = handler.mods.length > 0;
        for(k in _mods)
          if((!_mods[k] && index(handler.mods, +k) > -1) ||
            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
        // call the handler and stop the event if neccessary
        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
          if(handler.method(event, handler)===false){
            if(event.preventDefault) event.preventDefault();
              else event.returnValue = false;
            if(event.stopPropagation) event.stopPropagation();
            if(event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    }
  };

  // unset modifier keys on keyup
  function clearModifier(event){
    var key = event.keyCode, k,
        i = index(_downKeys, key);

    // remove key from _downKeys
    if (i >= 0) {
        _downKeys.splice(i, 1);
    }

    if(key == 93 || key == 224) key = 91;
    if(key in _mods) {
      _mods[key] = false;
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
    }
  };

  function resetModifiers() {
    for(k in _mods) _mods[k] = false;
    for(k in _MODIFIERS) assignKey[k] = false;
  };

  // parse and assign shortcut
  function assignKey(key, scope, method){
    var keys, mods;
    keys = getKeys(key);
    if (method === undefined) {
      method = scope;
      scope = 'all';
    }

    // for each shortcut
    for (var i = 0; i < keys.length; i++) {
      // set modifier keys if any
      mods = [];
      key = keys[i].split('+');
      if (key.length > 1){
        mods = getMods(key);
        key = [key[key.length-1]];
      }
      // convert to keycode and...
      key = key[0]
      key = code(key);
      // ...store handler
      if (!(key in _handlers)) _handlers[key] = [];
      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
    }
  };

  // unbind all handlers for given key in current scope
  function unbindKey(key, scope) {
    var multipleKeys, keys,
      mods = [],
      i, j, obj;

    multipleKeys = getKeys(key);

    for (j = 0; j < multipleKeys.length; j++) {
      keys = multipleKeys[j].split('+');

      if (keys.length > 1) {
        mods = getMods(keys);
      }

      key = keys[keys.length - 1];
      key = code(key);

      if (scope === undefined) {
        scope = getScope();
      }
      if (!_handlers[key]) {
        return;
      }
      for (i = 0; i < _handlers[key].length; i++) {
        obj = _handlers[key][i];
        // only clear handlers if correct scope and mods match
        if (obj.scope === scope && compareArray(obj.mods, mods)) {
          _handlers[key][i] = {};
        }
      }
    }
  };

  // Returns true if the key with code 'keyCode' is currently down
  // Converts strings into key codes.
  function isPressed(keyCode) {
      if (typeof(keyCode)=='string') {
        keyCode = code(keyCode);
      }
      return index(_downKeys, keyCode) != -1;
  }

  function getPressedKeyCodes() {
      return _downKeys.slice(0);
  }

  function filter(event){
    var tagName = (event.target || event.srcElement).tagName;
    // ignore keypressed in any elements that support keyboard data input
    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
  }

  // initialize key.<modifier> to false
  for(k in _MODIFIERS) assignKey[k] = false;

  // set current scope (default 'all')
  function setScope(scope){ _scope = scope || 'all' };
  function getScope(){ return _scope || 'all' };

  // delete all handlers for a given scope
  function deleteScope(scope){
    var key, handlers, i;

    for (key in _handlers) {
      handlers = _handlers[key];
      for (i = 0; i < handlers.length; ) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);
        else i++;
      }
    }
  };

  // abstract key logic for assign and unassign
  function getKeys(key) {
    var keys;
    key = key.replace(/\s/g, '');
    keys = key.split(',');
    if ((keys[keys.length - 1]) == '') {
      keys[keys.length - 2] += ',';
    }
    return keys;
  }

  // abstract mods logic for assign and unassign
  function getMods(key) {
    var mods = key.slice(0, key.length - 1);
    for (var mi = 0; mi < mods.length; mi++)
    mods[mi] = _MODIFIERS[mods[mi]];
    return mods;
  }

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if(object.attachEvent)
      object.attachEvent('on'+event, function(){ method(window.event) });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
  addEvent(document, 'keyup', clearModifier);

  // reset modifiers to false whenever the window is (re)focused.
  addEvent(window, 'focus', resetModifiers);

  // store previously defined key
  var previousKey = global.key;

  // restore previously defined key and return reference to our key object
  function noConflict() {
    var k = global.key;
    global.key = previousKey;
    return k;
  }

  // set window.key and window.key.set/get/deleteScope, and the default filter
  global.key = assignKey;
  global.key.setScope = setScope;
  global.key.getScope = getScope;
  global.key.deleteScope = deleteScope;
  global.key.filter = filter;
  global.key.isPressed = isPressed;
  global.key.getPressedKeyCodes = getPressedKeyCodes;
  global.key.noConflict = noConflict;
  global.key.unbind = unbindKey;

  if(typeof module !== 'undefined') module.exports = assignKey;

})(this);

var ArrayProto, nativeForEach, nativeIsArray, nativeMap, nativeReduce,
  __hasProp = {}.hasOwnProperty;

if (typeof _ === "undefined" || _ === null) {
  this._ = {};
  ArrayProto = Array.prototype;
  nativeForEach = ArrayProto.forEach;
  nativeMap = ArrayProto.map;
  nativeReduce = ArrayProto.reduce;
  nativeIsArray = Array.isArray;
  _.isObject = function(obj) {
    var type;
    type = typeof obj;
    return type === "function" || type === "object" && !!obj;
  };
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };
  _.each = function(obj, iterator, context) {
    var e, i, key, val, _i, _ref;
    try {
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (_.isNumber(obj.length)) {
        for (i = _i = 0, _ref = obj.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          iterator.call(context, obj[i], i, obj);
        }
      } else {
        for (key in obj) {
          if (!__hasProp.call(obj, key)) continue;
          val = obj[key];
          iterator.call(context, val, key, obj);
        }
      }
    } catch (_error) {
      e = _error;
    }
    return obj;
  };
  _.map = function(obj, iterator, context) {
    var results;
    if (nativeMap && obj.map === nativeMap) {
      return obj.map(iterator, context);
    }
    results = [];
    _.each(obj, function(value, index, list) {
      return results.push(iterator.call(context, value, index, list));
    });
    return results;
  };
  _.reduce = function(obj, iterator, memo, context) {
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) {
        iterator = _.bind(iterator, context);
      }
      return obj.reduce(iterator, memo);
    }
    _.each(obj, function(value, index, list) {
      return memo = iterator.call(context, memo, value, index, list);
    });
    return memo;
  };
  _.isArray = nativeIsArray || function(obj) {
    return !!(obj && obj.concat && obj.unshift && !obj.callee);
  };
  _.max = function(obj, iterator, context) {
    var result;
    if (!iterator && _.isArray(obj)) {
      return Math.max.apply(Math, obj);
    }
    result = {
      computed: -Infinity
    };
    _.each(obj, function(value, index, list) {
      var computed;
      computed = iterator ? iterator.call(context, value, index, list) : value;
      return computed >= result.computed && (result = {
        value: value,
        computed: computed
      });
    });
    return result.value;
  };
  _.min = function(obj, iterator, context) {
    var result;
    if (!iterator && _.isArray(obj)) {
      return Math.min.apply(Math, obj);
    }
    result = {
      computed: Infinity
    };
    _.each(obj, function(value, index, list) {
      var computed;
      computed = iterator ? iterator.call(context, value, index, list) : value;
      return computed < result.computed && (result = {
        value: value,
        computed: computed
      });
    });
    return result.value;
  };
  _.now = Date.now || function() {
    return new Date().getTime();
  };
  _.throttle = function(func, wait, options) {
    var args, context, later, previous, result, timeout;
    context = void 0;
    args = void 0;
    result = void 0;
    timeout = null;
    previous = 0;
    options || (options = {});
    later = function() {
      previous = (options.leading === false ? 0 : _.now());
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now, remaining;
      now = _.now();
      if (!previous && options.leading === false) {
        previous = now;
      }
      remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else {
        if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
      }
      return result;
    };
  };
  _.debounce = function(func, wait, immediate) {
    var args, context, later, result, timeout, timestamp;
    timeout = void 0;
    args = void 0;
    context = void 0;
    timestamp = void 0;
    result = void 0;
    later = function() {
      var last;
      last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };
    return function() {
      var callNow;
      context = this;
      args = arguments;
      timestamp = _.now();
      callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    };
  };
}

(function() {
  var _linear_partition, _scrollbar_width,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Chromatic = this.Chromatic || {};

  _linear_partition = (function() {
    var _cache;
    _cache = {};
    return function(seq, k) {
      var ans, i, j, key, l, m, n, q, r, ref, ref1, ref2, ref3, s, solution, table, x, y;
      key = seq.join() + k;
      if (_cache[key]) {
        return _cache[key];
      }
      n = seq.length;
      if (k <= 0) {
        return [];
      }
      if (k > n) {
        return seq.map(function(x) {
          return [x];
        });
      }
      table = (function() {
        var l, ref, results;
        results = [];
        for (y = l = 0, ref = n; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
          results.push((function() {
            var q, ref1, results1;
            results1 = [];
            for (x = q = 0, ref1 = k; 0 <= ref1 ? q < ref1 : q > ref1; x = 0 <= ref1 ? ++q : --q) {
              results1.push(0);
            }
            return results1;
          })());
        }
        return results;
      })();
      solution = (function() {
        var l, ref, results;
        results = [];
        for (y = l = 0, ref = n - 1; 0 <= ref ? l < ref : l > ref; y = 0 <= ref ? ++l : --l) {
          results.push((function() {
            var q, ref1, results1;
            results1 = [];
            for (x = q = 0, ref1 = k - 1; 0 <= ref1 ? q < ref1 : q > ref1; x = 0 <= ref1 ? ++q : --q) {
              results1.push(0);
            }
            return results1;
          })());
        }
        return results;
      })();
      for (i = l = 0, ref = n; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
        table[i][0] = seq[i] + (i ? table[i - 1][0] : 0);
      }
      for (j = q = 0, ref1 = k; 0 <= ref1 ? q < ref1 : q > ref1; j = 0 <= ref1 ? ++q : --q) {
        table[0][j] = seq[0];
      }
      for (i = r = 1, ref2 = n; 1 <= ref2 ? r < ref2 : r > ref2; i = 1 <= ref2 ? ++r : --r) {
        for (j = s = 1, ref3 = k; 1 <= ref3 ? s < ref3 : s > ref3; j = 1 <= ref3 ? ++s : --s) {
          m = _.min((function() {
            var ref4, results, t;
            results = [];
            for (x = t = 0, ref4 = i; 0 <= ref4 ? t < ref4 : t > ref4; x = 0 <= ref4 ? ++t : --t) {
              results.push([_.max([table[x][j - 1], table[i][0] - table[x][0]]), x]);
            }
            return results;
          })(), function(o) {
            return o[0];
          });
          table[i][j] = m[0];
          solution[i - 1][j - 1] = m[1];
        }
      }
      n = n - 1;
      k = k - 2;
      ans = [];
      while (k >= 0) {
        ans = [
          (function() {
            var ref4, ref5, results, t;
            results = [];
            for (i = t = ref4 = solution[n - 1][k] + 1, ref5 = n + 1; ref4 <= ref5 ? t < ref5 : t > ref5; i = ref4 <= ref5 ? ++t : --t) {
              results.push(seq[i]);
            }
            return results;
          })()
        ].concat(ans);
        n = solution[n - 1][k];
        k = k - 1;
      }
      return _cache[key] = [
        (function() {
          var ref4, results, t;
          results = [];
          for (i = t = 0, ref4 = n + 1; 0 <= ref4 ? t < ref4 : t > ref4; i = 0 <= ref4 ? ++t : --t) {
            results.push(seq[i]);
          }
          return results;
        })()
      ].concat(ans);
    };
  })();

  _scrollbar_width = (function() {
    var _cache;
    _cache = null;
    return function() {
      var div, w1, w2;
      if (_cache) {
        return _cache;
      }
      div = $("<div style=\"width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;\"><div style=\"height:100px;\"></div></div>");
      $(document.body).append(div);
      w1 = $("div", div).innerWidth();
      div.css("overflow-y", "auto");
      w2 = $("div", div).innerWidth();
      $(div).remove();
      return _cache = w1 - w2;
    };
  })();

  Chromatic.GalleryView = (function() {
    function GalleryView(el, photos, options) {
      this.zoom = bind(this.zoom, this);
      this.layout = bind(this.layout, this);
      this.lazyLoad = bind(this.lazyLoad, this);
      this.calculateAspectRatios = bind(this.calculateAspectRatios, this);
      if (el[0] === document.body) {
        this.el = $('<div class="chromatic-gallery-full"/>');
        $(el).append(this.el);
      } else {
        this.el = $(el).addClass('chromatic-gallery');
      }
      this.photos = _.map(photos, function(p) {
        if (_.isObject(p)) {
          return p;
        } else {
          return {
            small: p
          };
        }
      });
      this.zoom_view = new Chromatic.ZoomView(this.photos, options);
      this.photo_views = _.map(this.photos, (function(_this) {
        return function(photo) {
          return new Chromatic.GalleryPhotoView(_this, photo, options);
        };
      })(this));
      this.ideal_height = parseInt(this.el.children().first().css('height'));
      $(window).on('resize', _.debounce(this.layout, 100));
      this.el.on('scroll', _.throttle(this.lazyLoad, 100));
      if (!!this.photos[0].aspect_ratio) {
        this.layout();
      } else {
        this.calculateAspectRatios();
      }
    }

    GalleryView.prototype.calculateAspectRatios = function() {
      var layout;
      layout = _.after(this.photos.length, this.layout);
      return _.each(this.photo_views, function(p) {
        return p.load(layout);
      });
    };

    GalleryView.prototype.lazyLoad = function() {
      var threshold, viewport_bottom, viewport_top;
      threshold = 1000;
      viewport_top = this.el.scrollTop() - threshold;
      viewport_bottom = (this.el.height() || $(window).height()) + this.el.scrollTop() + threshold;
      return _.each(this.photo_views, (function(_this) {
        return function(photo_view) {
          if (photo_view.top < viewport_bottom && photo_view.bottom > viewport_top) {
            return photo_view.load();
          } else {
            return photo_view.unload();
          }
        };
      })(this));
    };

    GalleryView.prototype.layout = function() {
      var ideal_height, index, partition, rows, summed_width, viewport_width, weights;
      $(document.body).css('overflowY', 'scroll');
      viewport_width = this.el[0].getBoundingClientRect().width - parseInt(this.el.css('paddingLeft')) - parseInt(this.el.css('paddingRight'));
      if (this.el[0].offsetWidth > this.el[0].scrollWidth) {
        viewport_width = viewport_width - _scrollbar_width();
      }
      $(document.body).css('overflowY', 'auto');
      ideal_height = this.ideal_height || parseInt((this.el.height() || $(window).height()) / 2);
      summed_width = _.reduce(this.photos, (function(sum, p) {
        return sum += p.aspect_ratio * ideal_height;
      }), 0);
      rows = Math.round(summed_width / viewport_width);
      if (rows < 1) {
        _.each(this.photos, (function(_this) {
          return function(photo, i) {
            return _this.photo_views[i].resize(parseInt(ideal_height * photo.aspect_ratio), ideal_height);
          };
        })(this));
      } else {
        weights = _.map(this.photos, function(p) {
          return parseInt(p.aspect_ratio * 100);
        });
        partition = _linear_partition(weights, rows);
        index = 0;
        _.each(partition, (function(_this) {
          return function(row) {
            var row_buffer, summed_ars;
            row_buffer = [];
            _.each(row, function(p, i) {
              return row_buffer.push(_this.photos[index + i]);
            });
            summed_ars = _.reduce(row_buffer, (function(sum, p) {
              return sum += p.aspect_ratio;
            }), 0);
            summed_width = 0;
            _.each(row_buffer, function(p, i) {
              var height, width;
              width = i === row_buffer.length - 1 ? viewport_width - summed_width : parseInt(viewport_width / summed_ars * p.aspect_ratio);
              height = parseInt(viewport_width / summed_ars);
              _this.photo_views[index + i].resize(width, height);
              return summed_width += width;
            });
            return index += row.length;
          };
        })(this));
      }
      return this.lazyLoad();
    };

    GalleryView.prototype.zoom = function(photo) {
      return this.zoom_view.show(photo);
    };

    return GalleryView;

  })();

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Chromatic = this.Chromatic || {};

  Chromatic.GalleryPhotoView = (function() {
    function GalleryPhotoView(parent, photo, options) {
      this.zoom = bind(this.zoom, this);
      this.unload = bind(this.unload, this);
      this.load = bind(this.load, this);
      this.parent = parent;
      this.photo = photo;
      this.el = $('<div class="chromatic-gallery-photo"/>');
      parent.el.append(this.el);
      this.el.on('click', this.zoom);
    }

    GalleryPhotoView.prototype.load = function(callback) {
      var image;
      if (this.loaded) {
        return;
      }
      image = new Image();
      image.onload = (function(_this) {
        return function() {
          _this.photo.aspect_ratio = image.width / image.height;
          if (callback) {
            callback();
          }
          _this.el.css('backgroundImage', "url(" + _this.photo.small + ")");
          return _this.loaded = true;
        };
      })(this);
      return image.src = this.photo.small;
    };

    GalleryPhotoView.prototype.unload = function() {
      this.el.css('backgroundImage', "");
      return this.loaded = false;
    };

    GalleryPhotoView.prototype.zoom = function() {
      return this.parent.zoom(this.photo);
    };

    GalleryPhotoView.prototype.resize = function(width, height) {
      this.el.css({
        width: width - parseInt(this.el.css('marginLeft')) - parseInt(this.el.css('marginRight')),
        height: height - parseInt(this.el.css('marginTop')) - parseInt(this.el.css('marginBottom'))
      });
      this.top = this.el.position().top;
      return this.bottom = this.top + this.el.height();
    };

    return GalleryPhotoView;

  })();

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Chromatic = this.Chromatic || {};

  $.extend($.easing, {
    easeOutCirc: function(x, t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    }
  });

  jQuery.event.special.swipe.settings.sensitivity = 100;

  Chromatic.ZoomView = (function() {
    function ZoomView(photos, options) {
      this.cancel = bind(this.cancel, this);
      this.move = bind(this.move, this);
      this.layout = bind(this.layout, this);
      this.hideArrows = bind(this.hideArrows, this);
      this.showArrows = bind(this.showArrows, this);
      this.showPrevious = bind(this.showPrevious, this);
      this.showNext = bind(this.showNext, this);
      this.show = bind(this.show, this);
      this.close = bind(this.close, this);
      this.el = $('<div class="chromatic-zoom"/>');
      this.el.html("<div class=\"chromatic-zoom-arrow-left\"></div><div class=\"chromatic-zoom-arrow-right\"></div>");
      this.photos = photos;
      $(document.body).append(this.el);
      this.el.hide().on('click swipeup', this.close).on('mousemove mouseenter', this.showArrows).on('mouseleave', this.hideArrows).on('click', '.chromatic-zoom-arrow-left', this.showPrevious).on('swiperight', this.showPrevious).on('click', '.chromatic-zoom-arrow-right', this.showNext).on('swipeleft', this.showNext).on('move', this.move).on('swipecanceled', this.cancel);
      this._debouncedLayout = _.debounce(((function(_this) {
        return function() {
          return _this.layout();
        };
      })(this)), 100);
    }

    ZoomView.prototype.close = function() {
      $(document.body).css('overflowY', 'auto');
      clearTimeout(this.arrows_timer);
      key.unbind('esc');
      key.unbind('enter');
      key.unbind('up');
      key.unbind('left');
      key.unbind('j');
      key.unbind('right');
      key.unbind('k');
      return this.el.fadeOut(500, (function(_this) {
        return function() {
          _this.previous_zoom_photo_view.remove();
          _this.current_zoom_photo_view.remove();
          _this.next_zoom_photo_view.remove();
          _this.previous_zoom_photo_view = null;
          _this.current_zoom_photo_view = null;
          return _this.next_zoom_photo_view = null;
        };
      })(this));
    };

    ZoomView.prototype.show = function(photo) {
      var next, previous;
      $(document.body).css('overflowY', 'hidden');
      key('esc, enter, up', this.close);
      key('left, k', _.debounce(this.showPrevious, 100, true));
      key('right, j', _.debounce(this.showNext, 100, true));
      $(window).on('resize orientationchange', this._debouncedLayout);
      this.hideArrows(false);
      this.el.fadeIn(500);
      if (this.previous_zoom_photo_view) {
        this.previous_zoom_photo_view.remove();
      }
      if (this.current_zoom_photo_view) {
        this.current_zoom_photo_view.remove();
      }
      if (this.next_zoom_photo_view) {
        this.next_zoom_photo_view.remove();
      }
      previous = this.photos[this.photos.indexOf(photo) - 1] || this.photos[this.photos.length - 1];
      this.current = photo;
      next = this.photos[this.photos.indexOf(photo) + 1] || this.photos[0];
      this.previous_zoom_photo_view = new Chromatic.ZoomPhotoView(this, previous);
      this.current_zoom_photo_view = new Chromatic.ZoomPhotoView(this, this.current);
      this.next_zoom_photo_view = new Chromatic.ZoomPhotoView(this, next);
      this.layout();
      return this.el.show();
    };

    ZoomView.prototype.showNext = function(e) {
      var next;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "keydown") {
          this.hideArrows();
        } else {
          this.showArrows();
        }
      }
      this.previous_zoom_photo_view.remove();
      this.previous_zoom_photo_view = null;
      this.previous_zoom_photo_view = this.current_zoom_photo_view;
      this.current_zoom_photo_view = this.next_zoom_photo_view;
      this.current = this.photos[this.photos.indexOf(this.current) + 1] || this.photos[0];
      next = this.photos[this.photos.indexOf(this.current) + 1] || this.photos[0];
      this.next_zoom_photo_view = new Chromatic.ZoomPhotoView(this, next);
      this.previous_zoom_photo_view.layout('previous', 0, true);
      this.current_zoom_photo_view.layout('current', 0, true);
      return this.next_zoom_photo_view.layout('next', 0, false);
    };

    ZoomView.prototype.showPrevious = function(e) {
      var previous;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "keydown") {
          this.hideArrows();
        } else {
          this.showArrows();
        }
      }
      this.next_zoom_photo_view.remove();
      this.next_zoom_photo_view = null;
      this.next_zoom_photo_view = this.current_zoom_photo_view;
      this.current_zoom_photo_view = this.previous_zoom_photo_view;
      this.current = this.photos[this.photos.indexOf(this.current) - 1] || this.photos[this.photos.length - 1];
      previous = this.photos[this.photos.indexOf(this.current) - 1] || this.photos[this.photos.length - 1];
      this.previous_zoom_photo_view = new Chromatic.ZoomPhotoView(this, previous);
      this.next_zoom_photo_view.layout('next', 0, true);
      this.current_zoom_photo_view.layout('current', 0, true);
      return this.previous_zoom_photo_view.layout('previous', 0, false);
    };

    ZoomView.prototype.showArrows = function() {
      this.el.find(".chromatic-zoom-arrow-left, .chromatic-zoom-arrow-right").stop().animate({
        opacity: 1
      }, 200);
      clearTimeout(this.arrows_timer);
      return this.arrows_timer = window.setTimeout(((function(_this) {
        return function() {
          return _this.hideArrows(true);
        };
      })(this)), 3000);
    };

    ZoomView.prototype.hideArrows = function(animated) {
      return this.el.find(".chromatic-zoom-arrow-left, .chromatic-zoom-arrow-right").animate({
        opacity: 0.01
      }, animated != null ? animated : {
        1000: 0
      });
    };

    ZoomView.prototype.layout = function(offset, animated) {
      if (offset == null) {
        offset = 0;
      }
      this.current_zoom_photo_view.layout('current', offset, animated);
      this.previous_zoom_photo_view.layout('previous', offset, animated);
      return this.next_zoom_photo_view.layout('next', offset, animated);
    };

    ZoomView.prototype.move = function(e) {
      return this.layout(e.distX, false);
    };

    ZoomView.prototype.cancel = function(e) {
      return this.layout(0, true);
    };

    return ZoomView;

  })();

}).call(this);

(function() {
  var _is_css_blur_supported,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Chromatic = this.Chromatic || {};

  _is_css_blur_supported = (function() {
    var _supported;
    _supported = 'dontknow';
    return function() {
      var el;
      if (_supported !== 'dontknow') {
        return _supported;
      }
      el = $('<div/>');
      $(document.body).append(el);
      el[0].style.webkitFilter = "grayscale(1)";
      _supported = window.getComputedStyle(el[0]).webkitFilter === "grayscale(1)";
      el.remove();
      return _supported;
    };
  })();

  Chromatic.ZoomPhotoView = (function() {
    function ZoomPhotoView(parent, photo, options) {
      this.layout = bind(this.layout, this);
      this.render = bind(this.render, this);
      this.remove = bind(this.remove, this);
      this.photo = photo;
      this.el = $('<div/>');
      this.render();
      parent.el.append(this.el);
    }

    ZoomPhotoView.prototype.remove = function(photo) {
      return this.el.remove();
    };

    ZoomPhotoView.prototype.render = function() {
      var big_img;
      this.photo_el = $('<div class="chromatic-zoom-photo"></div>');
      this.grain_el = $('<div class="chromatic-zoom-grain"></div>');
      this.background_el = $('<div class="chromatic-zoom-background"></div>');
      if (this.photo.big) {
        big_img = new Image();
        big_img.onload = (function(_this) {
          return function() {
            return _this.photo_el.css('backgroundImage', "url(" + _this.photo.big + ")");
          };
        })(this);
        big_img.src = this.photo.big;
      }
      this.photo_el.css('backgroundImage', "url(" + this.photo.small + ")");
      if (this.photo.blur) {
        this.background_el.css('backgroundImage', "url(" + this.photo.blur + ")");
      } else if (_is_css_blur_supported()) {
        this.background_el.addClass('chromatic-zoom-background-blur').css('backgroundImage', "url(" + this.photo.small + ")");
      }
      this.el.append(this.photo_el, this.grain_el, this.background_el);
      return this;
    };

    ZoomPhotoView.prototype.layout = function(pos, offset, animated) {
      var container, height, left, opacity, width;
      if (offset == null) {
        offset = 0;
      }
      container = $(window);
      if (container.width() / container.height() > this.photo.aspect_ratio) {
        height = container.height();
        width = container.height() * this.photo.aspect_ratio;
      } else {
        height = container.width() / this.photo.aspect_ratio;
        width = container.width();
      }
      this.photo_el.css({
        height: height,
        width: width,
        top: (container.height() - height) / 2
      });
      left = (function() {
        switch (pos) {
          case 'previous':
            return -width - 20 + offset;
          case 'current':
            return (container.width() - width) / 2 + offset;
          case 'next':
            return container.width() + 20 + offset;
        }
      })();
      opacity = (function() {
        switch (pos) {
          case 'current':
            return 1 - Math.abs(offset) / container.width() * 2;
          case 'previous':
            return 0 + offset / container.width() * 2;
          case 'next':
            return 0 - offset / container.width() * 2;
        }
      })();
      if (animated) {
        this.photo_el.stop().animate({
          left: left
        }, 600, 'easeOutCirc');
        this.grain_el.stop().animate({
          opacity: opacity
        }, 600, 'easeOutCirc');
        return this.background_el.stop().animate({
          opacity: opacity
        }, 600, 'easeOutCirc');
      } else {
        this.photo_el.css('left', left);
        this.grain_el.css('opacity', opacity);
        return this.background_el.css('opacity', opacity);
      }
    };

    return ZoomPhotoView;

  })();

}).call(this);

(function() {
  $.fn.extend({
    chromatic: function(photos, options) {
      new Chromatic.GalleryView(this, photos, options);
      return this;
    }
  });

}).call(this);
