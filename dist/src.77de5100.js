// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/widgetsjs/dist/shim.js":[function(require,module,exports) {
"use strict";
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements v1. It sets new.target to the value of
 * this.constructor so that the native HTMLElement constructor can access the
 * current under-construction element's definition.
 */
function shim() {
    var _window = window;
    if (
    // No Reflect, no classes, no need for shim because native custom elements
    // require ES2015 classes or Reflect.
    _window.Reflect === undefined ||
        _window.customElements === undefined ||
        // The webcomponentsjs custom elements polyfill doesn't require
        // ES2015-compatible construction (`super()` or `Reflect.construct`).
        _window.customElements.polyfillWrapFlushCallback) {
        return;
    }
    var BuiltInHTMLElement = HTMLElement;
    _window.HTMLElement = /** @this {!Object} */ function HTMLElement() {
        return Reflect.construct(BuiltInHTMLElement, [], /** @type {!Function} */ (this.constructor));
    };
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
}
exports.shim = shim;

},{}],"../node_modules/widgetsjs/dist/utils.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global_refs = {};
function registerRef(ref, component) {
    global_refs[ref] = component;
}
exports.registerRef = registerRef;
function getRef(ref) {
    return global_refs[ref];
}
exports.getRef = getRef;
function useComponent(comp) {
    return {
        as: function (name) {
            customElements.define(name, comp);
        }
    };
}
exports.useComponent = useComponent;

},{}],"../node_modules/widgetsjs/dist/BaseComponent.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent = /** @class */ (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent() {
        var _this = _super.call(this) || this;
        _this.parentNodes = [];
        return _this;
    }
    BaseComponent.prototype.setup = function () {
        var _this = this;
        // collect the parentNodes
        var el = this;
        while (el.parentNode) {
            el = el.parentNode;
            this.parentNodes.push(el);
        }
        // check if the parser has already passed the end tag of the component
        // in which case this element, or one of its parents, should have a nextSibling
        // if not (no whitespace at all between tags and no nextElementSiblings either)
        // resort to DOMContentLoaded or load having triggered
        if ([this].concat(this.parentNodes).some(function (el) { return el.nextSibling; }) || document.readyState !== 'loading') {
            this.childrenAvailableCallback();
        }
        else {
            this.baseMutationObserver = new MutationObserver(function () {
                if ([_this].concat(_this.parentNodes).some(function (el) { return el.nextSibling; }) || document.readyState !== 'loading') {
                    _this.childrenAvailableCallback();
                    _this.baseMutationObserver.disconnect();
                }
            });
            this.baseMutationObserver.observe(this, { childList: true });
        }
    };
    BaseComponent.prototype.childrenAvailableCallback = function () { };
    return BaseComponent;
}(HTMLElement));
exports.BaseComponent = BaseComponent;

},{}],"../node_modules/widgetsjs/dist/component.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("./BaseComponent");
var utils_1 = require("./utils");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super.call(this) || this;
    }
    Component.prototype.childrenAvailableCallback = function () {
        if (this.getAttribute('$ref')) {
            utils_1.registerRef(this.getAttribute('$ref'), this.component);
        }
        this.widgetChildren = this.innerHTML;
    };
    Component.prototype.disconnectedCallback = function () {
        this.component.onDismount();
    };
    return Component;
}(BaseComponent_1.BaseComponent));
exports.Component = Component;

},{"./BaseComponent":"../node_modules/widgetsjs/dist/BaseComponent.js","./utils":"../node_modules/widgetsjs/dist/utils.js"}],"../node_modules/widgetsjs/dist/Widget.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("./component");
var utils_1 = require("./utils");
var Widget = /** @class */ (function (_super) {
    __extends(Widget, _super);
    function Widget(state, transformers) {
        var _this = _super.call(this) || this;
        _this.component = _this;
        _this.state = state;
        _this.transformers = transformers;
        transformers && _this.transformState(transformers, state);
        return _this;
    }
    Widget.prototype.transformState = function (transformers, state) {
        Object.getOwnPropertyNames(transformers).forEach(function (v) {
            state[v] = transformers[v](state[v]);
        });
    };
    Widget.prototype.$ref = function (name) {
        return utils_1.getRef(name);
    };
    Widget.prototype.$child = function (selector) {
        return this.root.querySelector(selector);
    };
    Widget.prototype.onMount = function () { };
    Widget.prototype.onDismount = function () { };
    Widget.prototype._render = function (state) {
        this.transformers && this.transformState(this.transformers, state);
        if (state) {
            this.state = state;
        }
        return this.render(state || this.state);
    };
    Widget.prototype.render = function (state) {
        return '';
    };
    return Widget;
}(component_1.Component));
exports.Widget = Widget;

},{"./component":"../node_modules/widgetsjs/dist/component.js","./utils":"../node_modules/widgetsjs/dist/utils.js"}],"../../../webjs/node_modules/node-libs-browser/node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = $getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  var args = [];

  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);

  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}
},{}],"../node_modules/diffhtml/dist/es/util/caches.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParserHookCache = exports.ReleaseHookCache = exports.SyncTreeHookCache = exports.CreateNodeHookCache = exports.CreateTreeHookCache = exports.MiddlewareCache = exports.TransitionCache = exports.NodeCache = exports.StateCache = void 0;
// Associates DOM Nodes with state objects.
const StateCache = new Map(); // Associates Virtual Tree Elements with DOM Nodes.

exports.StateCache = StateCache;
const NodeCache = new Map(); // Cache transition functions.

exports.NodeCache = NodeCache;
const TransitionCache = new Map(); // Caches all middleware. You cannot unset a middleware once it has been added.

exports.TransitionCache = TransitionCache;
const MiddlewareCache = new Set(); // Very specific caches used by middleware.

exports.MiddlewareCache = MiddlewareCache;
const CreateTreeHookCache = new Set();
exports.CreateTreeHookCache = CreateTreeHookCache;
const CreateNodeHookCache = new Set();
exports.CreateNodeHookCache = CreateNodeHookCache;
const SyncTreeHookCache = new Set();
exports.SyncTreeHookCache = SyncTreeHookCache;
const ReleaseHookCache = new Set();
exports.ReleaseHookCache = ReleaseHookCache;
const ParserHookCache = new Set();
exports.ParserHookCache = ParserHookCache;
},{}],"../node_modules/diffhtml/dist/es/util/pool.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// A modest size.
const size = 10000;
const free = new Set();
const allocate = new Set();
const protect = new Set();

const shape = () => ({
  rawNodeName: '',
  nodeName: '',
  nodeValue: '',
  nodeType: 1,
  key: '',
  childNodes: [],
  attributes: {}
}); // Creates a pool to query new or reused values from.


const memory = {
  free,
  allocated: allocate,
  protected: protect
}; // Prime the free memory pool with VTrees.

for (let i = 0; i < size; i++) {
  free.add(shape());
} // Cache the values object, we'll refer to this iterator which is faster
// than calling it every single time. It gets replaced once exhausted.


let freeValues = free.values(); // Cache VTree objects in a pool which is used to get

var _default = {
  size,
  memory,

  get() {
    const {
      value = shape(),
      done
    } = freeValues.next(); // This extra bit of work allows us to avoid calling `free.values()` every
    // single time an object is needed.

    if (done) {
      freeValues = free.values();
    }

    free.delete(value);
    allocate.add(value);
    return value;
  },

  protect(value) {
    allocate.delete(value);
    protect.add(value);
  },

  unprotect(value) {
    if (protect.has(value)) {
      protect.delete(value);
      free.add(value);
    }
  }

};
exports.default = _default;
},{}],"../node_modules/diffhtml/dist/es/tree/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTree;

var _caches = require("../util/caches.js");

var _pool = _interopRequireDefault(require("../util/pool.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  assign
} = Object;
const {
  isArray
} = Array;
const fragmentName = '#document-fragment';

function createTree(input, attributes, childNodes, ...rest) {
  // If no input was provided then we return an indication as such.
  if (!input) {
    return null;
  } // If the first argument is an array, we assume this is a DOM fragment and
  // the array are the childNodes.


  if (isArray(input)) {
    childNodes = [];

    for (let i = 0; i < input.length; i++) {
      const newTree = createTree(input[i]);

      if (!newTree) {
        continue;
      }

      const isFragment = newTree.nodeType === 11;

      if (typeof newTree.rawNodeName === 'string' && isFragment) {
        childNodes.push(...newTree.childNodes);
      } else {
        childNodes.push(newTree);
      }
    }

    return createTree(fragmentName, null, childNodes);
  }

  const isObject = typeof input === 'object'; // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.

  if (input && isObject && 'parentNode' in input) {
    let test = null;

    _caches.NodeCache.forEach((key, val) => {
      if (key === input) {
        test = val;
      }
    });

    if (test) {
      return test;
    }

    attributes = {};
    childNodes = []; // When working with a text node, simply save the nodeValue as the
    // initial value.

    if (input.nodeType === 3) {
      childNodes = input.nodeValue;
    } // Element types are the only kind of DOM node we care about attributes
    // from. Shadow DOM, Document Fragments, Text, Comment nodes, etc. can
    // ignore this.
    else if (input.nodeType === 1 && input.attributes.length) {
        attributes = {};

        for (let i = 0; i < input.attributes.length; i++) {
          const {
            name,
            value
          } = input.attributes[i]; // If the attribute's value is empty, seek out the property instead.

          if (value === '' && name in input) {
            attributes[name] = input[name];
            continue;
          }

          attributes[name] = value;
        }
      } // Get the child nodes from an Element or Fragment/Shadow Root.


    if (input.nodeType === 1 || input.nodeType === 11) {
      if (input.childNodes.length) {
        childNodes = [];

        for (let i = 0; i < input.childNodes.length; i++) {
          // Strip out leading and trailing empty text nodes.
          if ((i === 0 || i === input.childNodes.length - 1) && input.childNodes[i] && input.childNodes[i].nodeName === '#text' && !input.childNodes[i].nodeValue.trim()) continue;

          if (input.childNodes[i].nodeName === '#text') {
            childNodes.push(createTree(input.childNodes[i].cloneNode(true)));
          } else {
            childNodes.push(createTree(input.childNodes[i]));
          }
        }
      }
    }

    const vTree = createTree(input.nodeName, attributes, childNodes);

    _caches.NodeCache.set(vTree, input);

    return vTree;
  } // Assume any object value is a valid VTree object.


  if (isObject) {
    // Support JSX-like object shape.
    if ('children' in input && !('childNodes' in input)) {
      const nodeName = input.nodeName || input.elementName;
      return createTree(nodeName, input.attributes, input.children);
    }

    const visited = new Set();

    if (_caches.CreateTreeHookCache.size) {
      for (let i = 0; i < input.childNodes.length; i++) {
        const entry = input.childNodes[i];

        _caches.CreateTreeHookCache.forEach((fn, retVal) => {
          if (visited.has(entry)) {
            return;
          } // Invoke all the `createNodeHook` functions passing along this transaction
          // as the only argument. These functions must return valid vTree values.


          if (retVal = fn(entry)) {
            assign(entry, retVal);
          }

          visited.add(entry);
        });

        input.childNodes[i] = createTree(entry);
      }
    }

    _caches.CreateTreeHookCache.forEach((fn, retVal) => {
      // Invoke all the `createNodeHook` functions passing along this transaction
      // as the only argument. These functions must return valid vTree values.
      if (retVal = fn(input)) {
        assign(input, retVal);
      }
    });

    return input;
  } // Support JSX-style children being passed.


  if (rest.length) {
    childNodes = [childNodes, ...rest];
  } // Allocate a new VTree from the pool.


  const entry = _pool.default.get();

  const isTextNode = input === '#text';
  const isString = typeof input === 'string';
  entry.key = '';
  entry.rawNodeName = input;
  entry.nodeName = isString ? input.toLowerCase() : '#document-fragment';
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (isTextNode) {
    const nodes = arguments.length === 2 ? attributes : childNodes;
    const nodeValue = isArray(nodes) ? nodes.join('') : nodes;
    entry.nodeType = 3;
    entry.nodeValue = String(nodeValue || '');
    return entry;
  }

  if (input === fragmentName || typeof input !== 'string') {
    entry.nodeType = 11;
  } else if (input === '#comment') {
    entry.nodeType = 8;
  } else {
    entry.nodeType = 1;
  }

  const useAttributes = isArray(attributes) || typeof attributes !== 'object';
  const nodes = useAttributes ? attributes : childNodes;
  const nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (let i = 0; i < nodeArray.length; i++) {
      const newNode = nodeArray[i];
      const isNodeArray = isArray(newNode); // Merge in arrays.

      if (isNodeArray) {
        for (let i = 0; i < newNode.length; i++) {
          entry.childNodes.push(newNode[i]);
        }
      } // Skip over `null` nodes.
      else if (!newNode) {
          continue;
        } // Merge in fragments.
        else if (newNode.nodeType === 11 && typeof newNode.rawNodeName === 'string') {
            for (let i = 0; i < newNode.childNodes.length; i++) {
              entry.childNodes.push(newNode.childNodes[i]);
            }
          } // Assume objects are vTrees.
          else if (newNode && typeof newNode === 'object') {
              entry.childNodes.push(newNode);
            } // Cover generate cases where a user has indicated they do not want a
            // node from appearing.
            else if (newNode) {
                entry.childNodes.push(createTree('#text', null, newNode));
              }
    }
  }

  if (attributes && typeof attributes === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  } // If is a script tag and has a src attribute, key off that.


  if (entry.nodeName === 'script' && entry.attributes.src) {
    entry.key = String(entry.attributes.src);
  } // Set the `key` prop if passed as an attr, overrides `script[src]`.


  if (entry.attributes && 'key' in entry.attributes) {
    entry.key = String(entry.attributes.key);
  } // Only pass a vTree through once.


  const visited = new Set();

  _caches.CreateTreeHookCache.forEach((fn, retVal) => {
    if (visited.has(entry)) {
      return;
    } // Invoke all the `createNodeHook` functions passing along this transaction
    // as the only argument. These functions must return valid vTree values.


    if (retVal = fn(entry)) {
      assign(entry, retVal);
    }

    visited.add(entry);
  });

  return entry;
}
},{"../util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","../util/pool.js":"../node_modules/diffhtml/dist/es/util/pool.js"}],"../../../webjs/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/diffhtml/dist/es/util/process.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = typeof process !== 'undefined' ? process : {
  env: {
    NODE_ENV: 'development'
  }
};

exports.default = _default;
},{"process":"../../../webjs/node_modules/process/browser.js"}],"../node_modules/diffhtml/dist/es/tree/sync.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncTree;
exports.PATCH_TYPE = void 0;

var _caches = require("../util/caches.js");

var _process = _interopRequireDefault(require("../util/process.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const empty = {};
const keyNames = ['old', 'new'];
const PATCH_TYPE = {
  'SET_ATTRIBUTE': 0,
  'REMOVE_ATTRIBUTE': 1,
  'NODE_VALUE': 2,
  'INSERT_BEFORE': 3,
  'REPLACE_CHILD': 4,
  'REMOVE_CHILD': 5
}; // Compares how the new state should look to the old state and mutates it,
// while recording the changes along the way.

exports.PATCH_TYPE = PATCH_TYPE;

function syncTree(oldTree, newTree, patches = [], parentTree) {
  if (!oldTree) oldTree = empty;
  if (!newTree) newTree = empty;
  const oldNodeName = oldTree.nodeName;
  const isFragment = newTree.nodeType === 11;
  const isEmpty = oldTree === empty;
  const keysLookup = {
    old: new Map(),
    new: new Map()
  };

  if (undefined !== 'production') {
    if (newTree === empty) {
      throw new Error('Missing new Virtual Tree to sync changes from');
    } // FIXME: Causes issues w/ React, we need to normalize at a higher level.


    if (!isEmpty && oldNodeName !== newTree.nodeName && !isFragment) {
      throw new Error(`Sync failure, cannot compare ${newTree.nodeName} with ${oldNodeName}`);
    }
  } // Reduce duplicate logic by condensing old and new operations in a loop.


  for (let i = 0; i < keyNames.length; i++) {
    const keyName = keyNames[i];
    const map = keysLookup[keyName];
    const vTree = arguments[i];
    const nodes = vTree && vTree.childNodes;

    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        const vTree = nodes[i];

        if (vTree.key) {
          if (undefined !== 'production') {
            if (map.has(vTree.key)) {
              throw new Error(`Key: ${vTree.key} cannot be duplicated`);
            }
          }

          map.set(vTree.key, vTree);
        }
      }
    }
  }

  let shortCircuit = false; // Invoke any middleware hooks, allow the middleware to replace the
  // `newTree`. Pass along the `keysLookup` object so that middleware can make
  // smart decisions when dealing with keys.

  _caches.SyncTreeHookCache.forEach(fn => {
    // Call the user provided middleware function for a single root node. Allow
    // the consumer to specify a return value of a different VTree (useful for
    // components).
    let retVal = fn(oldTree, newTree, keysLookup, parentTree); // If the value returned matches the original element, then short circuit
    // and do not dig further.

    if (retVal && retVal === oldTree) {
      shortCircuit = true;
    } // If the consumer returned a value and it doesn't equal the existing tree,
    // then splice it into the parent (if it exists) and run a sync.
    else if (retVal && retVal !== newTree) {
        // Synchronize this new tree.
        newTree = retVal;
      }
  });

  if (shortCircuit) {
    return patches;
  }

  const newNodeName = newTree.nodeName;
  const isElement = newTree.nodeType === 1; // Text nodes are low level and frequently change, so this path is accounted
  // for first.

  if (newTree.nodeName === '#text') {
    // If there was no previous element to compare to, simply set the value
    // on the new node.
    if (oldTree.nodeName !== '#text') {
      //FIXME Why is this here?
      patches.push(PATCH_TYPE.NODE_VALUE, newTree, newTree.nodeValue, null);
    } // If both VTrees are text nodes and the values are different, change the
    // `Element#nodeValue`.
    else if (!isEmpty && oldTree.nodeValue !== newTree.nodeValue) {
        patches.push(PATCH_TYPE.NODE_VALUE, oldTree, newTree.nodeValue, oldTree.nodeValue);
        oldTree.nodeValue = newTree.nodeValue;
      }

    return patches;
  } // Seek out attribute changes first, but only from element Nodes.


  if (isElement) {
    const oldAttributes = isEmpty ? empty : oldTree.attributes;
    const newAttributes = newTree.attributes; // Search for sets and changes.

    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      if (!isEmpty) {
        oldAttributes[key] = value;
      }

      patches.push(PATCH_TYPE.SET_ATTRIBUTE, isEmpty ? newTree : oldTree, key, value);
    } // Search for removals.


    if (!isEmpty) {
      for (let key in oldAttributes) {
        if (key in newAttributes) {
          continue;
        }

        patches.push(PATCH_TYPE.REMOVE_ATTRIBUTE, oldTree, key);
        delete oldAttributes[key];
      }
    }
  } // If we somehow end up comparing two totally different kinds of elements,
  // we'll want to raise an error to let the user know something is wrong.
  // FIXME This should never occur, right?


  if (undefined !== 'production') {
    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error(`Sync failure, cannot compare ${newNodeName} with ${oldNodeName}`);
    }
  }

  const newChildNodes = newTree.childNodes; // Scan all childNodes for attribute changes.

  if (isEmpty) {
    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      syncTree(null, newChildNodes[i], patches, newTree);
    }

    return patches;
  }

  const oldChildNodes = oldTree.childNodes; // Do a single pass over the new child nodes.

  for (let i = 0; i < newChildNodes.length; i++) {
    const oldChildNode = oldChildNodes && oldChildNodes[i];
    const newChildNode = newChildNodes[i];
    const newKey = newChildNode.key; // If there is no old element to compare to, this is a simple addition.

    if (!oldChildNode) {
      if (oldChildNodes) {
        oldChildNodes.push(newChildNode);
      }

      syncTree(oldChildNode, newChildNode, patches, oldTree);
      patches.push(PATCH_TYPE.INSERT_BEFORE, oldTree, newChildNode, null);
      continue;
    }

    const oldKey = oldChildNode.key;
    const oldInNew = keysLookup.new.has(oldKey);
    const newInOld = keysLookup.old.has(newKey); // If we are working with keys, we can follow an optimized path.

    if (oldKey || newKey) {
      // Remove the old node instead of replacing.
      if (!oldInNew && !newInOld) {
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
        syncTree(null, newChildNode, patches, newTree);
        patches.push(PATCH_TYPE.REPLACE_CHILD, newChildNode, oldChildNode);
        i = i - 1;
        continue;
      } else if (!oldInNew) {
        patches.push(PATCH_TYPE.REMOVE_CHILD, oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1);
        i = i - 1;
        continue;
      } // If there is a key set for this new element, use that to figure out
      // which element to use.


      if (newKey !== oldKey) {
        let optimalNewNode = newChildNode; // Prefer existing to new and remove from old position.

        if (newKey && newInOld) {
          optimalNewNode = keysLookup.old.get(newKey);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        } else if (newKey) {
          optimalNewNode = newChildNode; // Find attribute changes for this Node.

          syncTree(null, newChildNode, patches, newTree);
        }

        patches.push(PATCH_TYPE.INSERT_BEFORE, oldTree, optimalNewNode, oldChildNode);
        oldChildNodes.splice(i, 0, optimalNewNode);
        continue;
      }
    } // If the element we're replacing is totally different from the previous
    // replace the entire element, don't bother investigating children.


    if (oldChildNode.nodeName !== newChildNode.nodeName) {
      oldChildNodes[i] = newChildNode; // If we are replacing an element that still exists in the tree,
      // prune it from the remaining child nodes.

      const existingIndex = oldChildNodes.lastIndexOf(newChildNode);

      if (existingIndex !== -1 && existingIndex !== i) {
        // Remove directly from the array.
        oldChildNodes.splice(existingIndex, 1);
      }

      syncTree(null, newChildNode, patches, newTree);
      patches.push(PATCH_TYPE.REPLACE_CHILD, newChildNode, oldChildNode);
      continue;
    }

    syncTree(oldChildNode, newChildNode, patches, oldTree);
  } // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.


  if (oldChildNodes.length !== newChildNodes.length) {
    for (let i = newChildNodes.length; i < oldChildNodes.length; i++) {
      patches.push(PATCH_TYPE.REMOVE_CHILD, oldChildNodes[i]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  return patches;
}
},{"../util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","../util/process.js":"../node_modules/diffhtml/dist/es/util/process.js"}],"../node_modules/diffhtml/dist/es/node/create.js":[function(require,module,exports) {

var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNode;

var _caches = require("../util/caches.js");

var _process = _interopRequireDefault(require("../util/process.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const namespace = 'http://www.w3.org/2000/svg';
const g = typeof global === 'object' ? global : window;
const document = g.document || null;
/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @param {Object} - Document to create Nodes in
 * @param {Boolean} - Is their a root SVG element?
 * @return {Object} - A DOM Node matching the vTree
 */

function createNode(vTree, ownerDocument = document, isSVG) {
  if (undefined !== 'production') {
    if (!vTree) {
      throw new Error('Missing VTree when trying to create DOM Node');
    }
  }

  const existingNode = _caches.NodeCache.get(vTree); // If the DOM Node was already created, reuse the existing node. This is
  // required to ensure that passed in DOM Nodes are preserved, and to ensure
  // that elements are not constantly created with the same VTree instance.


  if (existingNode) {
    return existingNode;
  }

  const {
    nodeName,
    rawNodeName = nodeName,
    childNodes = []
  } = vTree;
  isSVG = isSVG || nodeName === 'svg'; // Will vary based on the properties of the VTree.

  let domNode = null;

  _caches.CreateNodeHookCache.forEach((fn, retVal) => {
    // Invoke all the `createNodeHook` functions passing along the vTree as the
    // only argument. These functions must return a valid DOM Node value.
    if (retVal = fn(vTree)) {
      domNode = retVal;
    }
  });

  if (!domNode) {
    // Create empty text elements. They will get filled in during the patch
    // process.
    if (nodeName === '#text') {
      domNode = ownerDocument.createTextNode(vTree.nodeValue);
    } // Support dynamically creating document fragments.
    else if (nodeName === '#document-fragment') {
        domNode = ownerDocument.createDocumentFragment();
      } // Support SVG.
      else if (isSVG) {
          domNode = ownerDocument.createElementNS(namespace, rawNodeName);
        } // If not a Text or SVG Node, then create with the standard method.
        else {
            domNode = ownerDocument.createElement(rawNodeName);
          }
  } // Add to the domNodes cache.


  _caches.NodeCache.set(vTree, domNode); // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.


  for (let i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i], ownerDocument, isSVG));
  }

  return domNode;
}
},{"../util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","../util/process.js":"../node_modules/diffhtml/dist/es/util/process.js"}],"../node_modules/diffhtml/dist/es/util/parse.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _create = _interopRequireDefault(require("../tree/create.js"));

var _pool = _interopRequireDefault(require("./pool.js"));

var _process = _interopRequireDefault(require("./process.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Adapted implementation from:
// https://github.com/ashi009/node-fast-html-parser
const hasNonWhitespaceEx = /\S/;
const doctypeEx = /<!.*>/i;
const spaceEx = /[^ ]/;
const tokenEx = /__DIFFHTML__([^_]*)__/;
const {
  assign
} = Object;
const {
  isArray
} = Array;
const blockTextDefaults = ['script', 'noscript', 'style', 'code', 'template'];
const selfClosingDefaults = ['meta', 'img', 'link', 'input', 'area', 'br', 'hr', 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
const kElementsClosedByOpening = {
  li: {
    li: true
  },
  p: {
    p: true,
    div: true
  },
  td: {
    td: true,
    th: true
  },
  th: {
    td: true,
    th: true
  }
};
const kElementsClosedByClosing = {
  li: {
    ul: true,
    ol: true
  },
  a: {
    div: true
  },
  b: {
    div: true
  },
  i: {
    div: true
  },
  p: {
    div: true
  },
  td: {
    tr: true,
    table: true
  },
  th: {
    tr: true,
    table: true
  }
};
/**
 * Interpolate dynamic supplemental values from the tagged template into the
 * tree.
 *
 * @param currentParent
 * @param string
 * @param supplemental
 */

const interpolateValues = (currentParent, string, supplemental = {}) => {
  if ('childNodes' in currentParent.attributes) {
    // Reset childNodes, as we are paving over them.
    currentParent.childNodes = [];
  } // If this is text and not a doctype, add as a text node.


  if (string && !doctypeEx.test(string) && !tokenEx.test(string)) {
    return currentParent.childNodes.push((0, _create.default)('#text', string));
  }

  const childNodes = [];
  const parts = string.split(tokenEx);
  let {
    length
  } = parts;

  for (let i = 0; i < parts.length; i++) {
    const value = parts[i];

    if (!value) {
      continue;
    } // When we split on the token expression, the capture group will replace
    // the token's position. So all we do is ensure that we're on an odd
    // index and then we can source the correct value.


    if (i % 2 === 1) {
      const innerTree = supplemental.children[value];

      if (!innerTree) {
        continue;
      }

      const isFragment = innerTree.nodeType === 11;

      if (typeof innerTree.rawNodeName === 'string' && isFragment) {
        childNodes.push(...innerTree.childNodes);
      } else {
        childNodes.push(innerTree);
      }
    } else if (!doctypeEx.test(value)) {
      childNodes.push((0, _create.default)('#text', value));
    }
  }

  currentParent.childNodes.push(...childNodes);
};
/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree structure
 * provided (no parentNode, nextSibling, previousSibling etc).
 *
 * @param {String} nodeName - DOM Node name
 * @param {Object} rawAttrs - DOM Node Attributes
 * @param {Object} supplemental - Interpolated data from a tagged template
 * @return {Object} vTree
 */


const HTMLElement = (nodeName, rawAttrs, supplemental, options) => {
  let match = null;
  const attrEx = /\b([_a-z][_a-z0-9\-:]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig; // Support dynamic tag names like: `<${MyComponent} />`.

  if (match = tokenEx.exec(nodeName)) {
    return HTMLElement(supplemental.tags[match[1]], rawAttrs, supplemental, options);
  }

  const attributes = {}; // Migrate raw attributes into the attributes object used by the VTree.

  for (let match; match = attrEx.exec(rawAttrs || '');) {
    const name = match[1];
    const value = match[6] || match[5] || match[4] || match[1];
    let tokenMatch = value.match(tokenEx); // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.

    if (tokenMatch && tokenMatch.length) {
      const parts = value.split(tokenEx);
      let {
        length
      } = parts;
      const hasToken = tokenEx.exec(name);
      const newName = hasToken ? supplemental.attributes[hasToken[1]] : name;

      for (let i = 0; i < parts.length; i++) {
        const value = parts[i];

        if (!value) {
          continue;
        } // When we split on the token expression, the capture group will
        // replace the token's position. So all we do is ensure that we're on
        // an odd index and then we can source the correct value.


        if (i % 2 === 1) {
          if (attributes[newName]) {
            attributes[newName] += supplemental.attributes[value];
          } else {
            const isObject = typeof newName === 'object';

            if (isObject && !isArray(newName) && newName) {
              assign(attributes, newName);
            } else if (isObject && options.strict) {
              if (undefined !== 'production') {
                throw new Error('Arrays are not allowed to be spread in strict mode');
              }
            } else if (newName && typeof newName !== 'object') {
              attributes[newName] = supplemental.attributes[value];
            }
          }
        } // Otherwise this is a static iteration, simply concat in the raw value.
        else {
            if (attributes[newName]) {
              attributes[newName] += value;
            } else {
              attributes[newName] = value;
            }
          }
      }
    } else if (tokenMatch = tokenEx.exec(name)) {
      const nameAndValue = supplemental.attributes[tokenMatch[1]];
      const hasToken = tokenEx.exec(value);
      const getValue = hasToken ? supplemental.attributes[hasToken[1]] : value;
      attributes[nameAndValue] = value === '""' ? '' : getValue;
    } else {
      attributes[name] = value === '""' ? '' : value;
    }
  }

  return (0, _create.default)(nodeName, attributes, attributes.childNodes || []);
};
/**
 * Parses HTML and returns a root element
 *
 * @param {String} html - String of HTML markup to parse into a Virtual Tree
 * @param {Object} supplemental - Dynamic interpolated data values
 * @param {Object} options - Contains options like silencing warnings
 * @return {Object} - Parsed Virtual Tree Element
 */


function parse(html, supplemental, options = {}) {
  if (!options.parser) {
    options.parser = {};
  }

  const blockText = new Set(options.parser.blockText || blockTextDefaults);
  const selfClosing = new Set(options.parser.selfClosing || selfClosingDefaults);
  const tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;
  const attrEx = /\b([_a-z][_a-z0-9\-:]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
  const root = (0, _create.default)('#document-fragment', null, []);
  const stack = [root];
  let currentParent = root;
  let lastTextPos = -1;

  if (undefined !== 'production') {
    const markup = [html];

    if (!html.includes('<') && options.strict) {
      markup.splice(1, 0, `
Possibly invalid markup. Opening tag was not properly opened.
      `);
      throw new Error(`\n\n${markup.join('\n')}`);
    }

    if (!html.includes('>') && options.strict) {
      markup.splice(1, 0, `
Possibly invalid markup. Opening tag was not properly closed.
      `);
      throw new Error(`\n\n${markup.join('\n')}`);
    }
  } // If there are no HTML elements, treat the passed in html as a single
  // text node.


  if (!html.includes('<') && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  } // Look through the HTML markup for valid tags.


  for (let match, text, i = 0; match = tagEx.exec(html); i++) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);

        if (text) {
          interpolateValues(currentParent, text, supplemental);
        }
      }
    }

    const matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      const string = html.slice(0, matchOffset);

      if (string && hasNonWhitespaceEx.test(string) && !doctypeEx.exec(string)) {
        interpolateValues(currentParent, string, supplemental);
      }
    }

    lastTextPos = tagEx.lastIndex; // This is a comment (TODO support these).

    if (match[0][1] === '!') {
      continue;
    }

    if (!match[1]) {
      // not </ tags
      const attrs = {};

      if (!match[4] && kElementsClosedByOpening[currentParent.rawNodeName]) {
        if (kElementsClosedByOpening[currentParent.rawNodeName][match[2]]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
        }
      }

      currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], match[3], supplemental, options)) - 1];
      stack.push(currentParent);

      if (options.strict || blockText.has(match[2])) {
        // A little test to find next </script> or </style> ...
        const closeMarkup = '</' + match[2] + '>';
        const index = html.indexOf(closeMarkup, tagEx.lastIndex);
        const {
          length
        } = match[2];

        if (undefined !== 'production') {
          if (index === -1 && options.strict) {
            const nodeName = currentParent.rawNodeName; // Find a subset of the markup passed in to validate.

            const markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').slice(0, 3); // Position the caret next to the first non-whitespace character.

            const caret = Array(spaceEx.exec(markup[0]).index + closeMarkup.length - 1).join(' ') + '^';
            const name = supplemental ? supplemental.tags[0].name : match[2]; // Craft the warning message and inject it into the markup.

            markup.splice(1, 0, `${caret}
    Possibly invalid markup. <${name}> must be closed in strict mode.
            `); // Throw an error message if the markup isn't what we expected.

            throw new Error(`\n\n${markup.join('\n')}`);
          }
        }

        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        } else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        const newText = html.slice(match.index + match[0].length, index);
        interpolateValues(currentParent, newText, supplemental);
      }
    }

    if (match[1] || match[4] || selfClosing.has(match[2])) {
      if (undefined !== 'production') {
        if (currentParent && match[2] !== currentParent.rawNodeName && options.strict) {
          const nodeName = currentParent.rawNodeName; // Find a subset of the markup passed in to validate.

          const markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').slice(0, 3); // Position the caret next to the first non-whitespace character.

          const caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^'; // Craft the warning message and inject it into the markup.

          markup.splice(1, 0, `${caret}
  Possibly invalid markup. Saw ${match[2]}, expected ${nodeName}...
          `); // Throw an error message if the markup isn't what we expected.

          throw new Error(`\n\n${markup.join('\n')}`);
        }
      }

      const tokenMatch = tokenEx.exec(match[2]); // </ or /> or <br> etc.

      while (currentParent) {
        // Self closing dynamic nodeName.
        if (match[4] === '/' && tokenMatch) {
          stack.pop();
          currentParent = stack[stack.length - 1];
          break;
        } // Not self-closing, so seek out the next match.
        else if (tokenMatch) {
            const value = supplemental.tags[tokenMatch[1]];

            if (currentParent.rawNodeName === value) {
              stack.pop();
              currentParent = stack[stack.length - 1];
              break;
            }
          }

        if (currentParent.rawNodeName === match[2]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
          break;
        } else {
          const tag = kElementsClosedByClosing[currentParent.rawNodeName]; // Trying to close current tag, and move on

          if (tag) {
            if (tag[match[2]]) {
              stack.pop();
              currentParent = stack[stack.length - 1];
              continue;
            }
          } // Use aggressive strategy to handle unmatching markups.


          break;
        }
      }
    }
  } // Find any last remaining text after the parsing completes over tags.


  const remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos).trim();

  if (undefined !== 'production') {
    if ((remainingText.includes('>') || remainingText.includes('<')) && options.strict) {
      const nodeName = currentParent.rawNodeName; // Find a subset of the markup passed in to validate.

      const markup = [remainingText]; // Position the caret next to the first non-whitespace character.

      const caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^'; // Craft the warning message and inject it into the markup.

      if (remainingText.includes('>')) {
        markup.splice(1, 0, `${caret}
  Possibly invalid markup. Opening tag was not properly opened.
        `);
      } else {
        markup.splice(1, 0, `${caret}
  Possibly invalid markup. Opening tag was not properly closed.
        `);
      } // Throw an error message if the markup isn't what we expected.


      throw new Error(`\n\n${markup.join('\n')}`);
    }
  } // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.


  if (remainingText) {
    interpolateValues(currentParent, remainingText, supplemental);
  } // This is an entire document, so only allow the HTML children to be
  // body or head.


  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.
    const head = {
      before: [],
      after: []
    };
    const body = {
      after: []
    };
    const HTML = root.childNodes[0];
    let beforeHead = true;
    let beforeBody = true; // Iterate the children and store elements in the proper array for
    // later concat, replace the current childNodes with this new array.

    HTML.childNodes = HTML.childNodes.filter(el => {
      // If either body or head, allow as a valid element.
      if (el.nodeName === 'body' || el.nodeName === 'head') {
        if (el.nodeName === 'head') beforeHead = false;
        if (el.nodeName === 'body') beforeBody = false;
        return true;
      } // Not a valid nested HTML tag element, move to respective container.
      else if (el.nodeType === 1) {
          if (beforeHead && beforeBody) head.before.push(el);else if (!beforeHead && beforeBody) head.after.push(el);else if (!beforeBody) body.after.push(el);
        }
    }); // Ensure the first element is the HEAD tag.

    if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
      const headInstance = (0, _create.default)('head', null, []);
      const existing = headInstance.childNodes;
      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
      HTML.childNodes.unshift(headInstance);
    } else {
      const existing = HTML.childNodes[0].childNodes;
      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
    } // Ensure the second element is the body tag.


    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      const bodyInstance = (0, _create.default)('body', null, []);
      const existing = bodyInstance.childNodes;
      existing.push.apply(existing, body.after);
      HTML.childNodes.push(bodyInstance);
    } else {
      const existing = HTML.childNodes[1].childNodes;
      existing.push.apply(existing, body.after);
    }
  }

  return root;
}
},{"../tree/create.js":"../node_modules/diffhtml/dist/es/tree/create.js","./pool.js":"../node_modules/diffhtml/dist/es/util/pool.js","./process.js":"../node_modules/diffhtml/dist/es/util/process.js"}],"../node_modules/diffhtml/dist/es/tasks/parse-new-tree.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseNewTree;

var _caches = require("../util/caches.js");

var _parse = _interopRequireDefault(require("../util/parse.js"));

var _create = _interopRequireDefault(require("../tree/create.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseNewTree(transaction) {
  const {
    state,
    markup,
    options
  } = transaction;
  const {
    measure
  } = state;
  const {
    inner
  } = options;

  if (typeof markup === 'string') {
    measure('parsing markup for new tree');
    const {
      childNodes
    } = (0, _parse.default)(markup, null, options); // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.

    transaction.newTree = (0, _create.default)(inner ? childNodes : childNodes[0] || childNodes);
    measure('parsing markup for new tree');
  }
}
},{"../util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","../util/parse.js":"../node_modules/diffhtml/dist/es/util/parse.js","../tree/create.js":"../node_modules/diffhtml/dist/es/tree/create.js"}],"../node_modules/diffhtml/dist/es/util/memory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectVTree = protectVTree;
exports.unprotectVTree = unprotectVTree;
exports.cleanMemory = cleanMemory;

var _pool = _interopRequireDefault(require("./pool.js"));

var _caches = require("./caches.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  memory,
  protect,
  unprotect
} = _pool.default;
/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */

function protectVTree(vTree) {
  protect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }

  return vTree;
}
/**
 * Allows an vTree to be recycled during a render cycle.
 *
 * @param vTree
 * @return
 */


function unprotectVTree(vTree) {
  unprotect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}
/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */


function cleanMemory(isBusy = false) {
  _caches.StateCache.forEach(state => isBusy = isBusy || state.isRendering); // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.


  if (!isBusy) {
    memory.allocated.forEach(vTree => memory.free.add(vTree));
    memory.allocated.clear();

    _caches.NodeCache.forEach((node, vTree) => {
      if (!memory.protected.has(vTree)) {
        _caches.NodeCache.delete(vTree);

        if (_caches.ReleaseHookCache.size) {
          _caches.ReleaseHookCache.forEach(fn => fn(vTree));
        }
      }
    });
  }
}
},{"./pool.js":"../node_modules/diffhtml/dist/es/util/pool.js","./caches.js":"../node_modules/diffhtml/dist/es/util/caches.js"}],"../node_modules/diffhtml/dist/es/tasks/reconcile-trees.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reconcileTrees;

var _caches = require("../util/caches.js");

var _memory = require("../util/memory.js");

var _create = _interopRequireDefault(require("../tree/create.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reconcileTrees(transaction) {
  const {
    state,
    domNode,
    markup,
    options
  } = transaction;
  const {
    previousMarkup
  } = state;
  const {
    inner
  } = options;
  const {
    outerHTML
  } = domNode; // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.

  if (previousMarkup !== outerHTML || !state.oldTree || !outerHTML) {
    if (state.oldTree) {
      (0, _memory.unprotectVTree)(state.oldTree);
    } // Wipe out the existing root if it exists.


    _caches.NodeCache.delete(state.oldTree); // Reset the old tree with the newly created VTree association.


    state.oldTree = (0, _create.default)(domNode);

    _caches.NodeCache.set(state.oldTree, domNode);

    (0, _memory.protectVTree)(state.oldTree);
  } // Associate the old tree with this brand new transaction.


  transaction.oldTree = state.oldTree; // If we are in a render transaction where no markup was previously parsed
  // then reconcile trees will attempt to create a tree based on the incoming
  // markup (JSX/html/etc).

  if (!transaction.newTree) {
    transaction.newTree = (0, _create.default)(markup);
  } // If we are diffing only the parent's childNodes, then adjust the newTree to
  // be a replica of the oldTree except with the childNodes changed.


  if (inner) {
    const {
      oldTree,
      newTree
    } = transaction;
    const {
      rawNodeName,
      nodeName,
      attributes
    } = oldTree;
    const isUnknown = typeof newTree.rawNodeName !== 'string';
    const isFragment = newTree.nodeType === 11;
    const children = isFragment && !isUnknown ? newTree.childNodes : newTree;
    transaction.newTree = (0, _create.default)(nodeName, attributes, children);
  }
}
},{"../util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","../util/memory.js":"../node_modules/diffhtml/dist/es/util/memory.js","../tree/create.js":"../node_modules/diffhtml/dist/es/tree/create.js"}],"../node_modules/diffhtml/dist/es/util/decode-entities.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = decodeEntities;
// Support loading diffHTML in non-browser environments.
const g = typeof global === 'object' ? global : window;
const element = g.document ? document.createElement('div') : null;
/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */

function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || !string.includes('&')) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
}
},{}],"../node_modules/diffhtml/dist/es/util/escape.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = escape;

/**
 * Tiny HTML escaping function, useful to protect against things like XSS and
 * unintentionally breaking attributes with quotes.
 *
 * @param {String} unescaped - An HTML value, unescaped
 * @return {String} - An HTML-safe string
 */
function escape(unescaped) {
  return unescaped.replace(/[&<>]/g, match => `&#${match.charCodeAt(0)};`);
}
},{}],"../node_modules/diffhtml/dist/es/util/make-measure.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.prefix = exports.marks = void 0;
const marks = new Map();
exports.marks = marks;
const prefix = 'diffHTML';
exports.prefix = prefix;
const DIFF_PERF = 'diff_perf';
const hasSearch = typeof location !== 'undefined';
const hasArguments = typeof process !== 'undefined' && process.argv;

const nop = () => {};

var _default = (domNode, vTree) => {
  // Check for these changes on every check.
  const wantsSearch = hasSearch && location.search.includes(DIFF_PERF);
  const wantsArguments = hasArguments && process.argv.includes(DIFF_PERF);
  const wantsPerfChecks = wantsSearch || wantsArguments; // If the user has not requested they want perf checks, return a nop
  // function.

  if (!wantsPerfChecks) {
    return nop;
  }

  return name => {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = `${domNode.host.constructor.name} ${name}`;
    } else if (typeof vTree.rawNodeName === 'function') {
      name = `${vTree.rawNodeName.name} ${name}`;
    }

    const endName = `${name}-end`;

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    } else {
      const totalMs = (performance.now() - marks.get(name)).toFixed(3);
      marks.delete(name);
      performance.mark(endName);
      performance.measure(`${prefix} ${name} (${totalMs}ms)`, name, endName);
    }
  };
};

exports.default = _default;
},{"process":"../../../webjs/node_modules/process/browser.js"}],"../node_modules/diffhtml/dist/es/util/internals.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var caches = _interopRequireWildcard(require("./caches.js"));

var _decodeEntities = _interopRequireDefault(require("./decode-entities.js"));

var _escape = _interopRequireDefault(require("./escape.js"));

var _makeMeasure = _interopRequireDefault(require("./make-measure.js"));

var memory = _interopRequireWildcard(require("./memory.js"));

var _pool = _interopRequireDefault(require("./pool.js"));

var _process = _interopRequireDefault(require("./process.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const {
  assign
} = Object;

var _default = assign({
  decodeEntities: _decodeEntities.default,
  escape: _escape.default,
  makeMeasure: _makeMeasure.default,
  memory,
  Pool: _pool.default,
  process: _process.default
}, caches);

exports.default = _default;
},{"./caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","./decode-entities.js":"../node_modules/diffhtml/dist/es/util/decode-entities.js","./escape.js":"../node_modules/diffhtml/dist/es/util/escape.js","./make-measure.js":"../node_modules/diffhtml/dist/es/util/make-measure.js","./memory.js":"../node_modules/diffhtml/dist/es/util/memory.js","./pool.js":"../node_modules/diffhtml/dist/es/util/pool.js","./process.js":"../node_modules/diffhtml/dist/es/util/process.js"}],"../node_modules/diffhtml/dist/es/tasks/schedule.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = schedule;

var _transaction = _interopRequireDefault(require("../transaction.js"));

var _caches = require("../util/caches.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Object} nextTransaction - The Transaction instance to schedule
 * @return {Boolean} - Value used to terminate a transaction render flow
 */
function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  let {
    state
  } = transaction;
  const {
    isRendering,
    activeTransaction,
    nextTransaction
  } = state; // If there is an in-flight transaction render happening, push this
  // transaction into a queue.

  if (isRendering) {
    const {
      tasks
    } = transaction;
    const chainTransaction = nextTransaction || activeTransaction; // Pave over the `nextTransaction` to chain off the previous.

    state.nextTransaction = transaction; // Abort the remaining tasks (but do not signal completion).

    transaction.abort();
    const promise = chainTransaction.promise || Promise.resolve();
    return transaction.promise = promise.then(() => {
      transaction.aborted = false;
      return _transaction.default.flow(transaction, tasks.slice(1));
    });
  } // Indicate we are now rendering a transaction for this DOM Node.


  state.isRendering = true;
  state.activeTransaction = transaction;
}
},{"../transaction.js":"../node_modules/diffhtml/dist/es/transaction.js","../util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js"}],"../node_modules/diffhtml/dist/es/tasks/should-update.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldUpdate;

function shouldUpdate(transaction) {
  const {
    domNode,
    markup,
    state,
    state: {
      measure
    },
    options
  } = transaction;
  const prop = options.inner ? 'innerHTML' : 'outerHTML';
  measure('should update'); // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.

  if (typeof markup === 'string' && domNode[prop] === markup) {
    return transaction.abort(true);
  } else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}
},{}],"../node_modules/diffhtml/dist/es/tasks/sync-trees.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncTrees;

var _sync = _interopRequireWildcard(require("../tree/sync.js"));

var _create = _interopRequireDefault(require("../node/create.js"));

var _caches = require("../util/caches.js");

var _memory = require("../util/memory.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function syncTrees(transaction) {
  const {
    state: {
      measure
    },
    oldTree,
    newTree,
    domNode
  } = transaction;
  measure('sync trees'); // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.

  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    // If there is no `parentNode` for the replace operation, we will need to
    // throw an error and prevent the `StateCache` from being updated.
    if (!domNode.parentNode) {
      throw new Error('Unable to replace top level node without a parent');
    } // Replace the top level elements.


    transaction.patches = [_sync.PATCH_TYPE.REPLACE_CHILD, newTree, oldTree]; // Clean up the existing old tree, and mount the new tree.

    (0, _memory.unprotectVTree)(transaction.oldTree);
    transaction.oldTree = transaction.state.oldTree = newTree;
    (0, _memory.protectVTree)(transaction.oldTree); // Update the StateCache since we are changing the top level element.

    _caches.StateCache.delete(domNode);

    _caches.StateCache.set((0, _create.default)(newTree), transaction.state);
  } // Otherwise only diff the children.
  else {
      transaction.patches = (0, _sync.default)(oldTree, newTree, []);
    }

  measure('sync trees');
}
},{"../tree/sync.js":"../node_modules/diffhtml/dist/es/tree/sync.js","../node/create.js":"../node_modules/diffhtml/dist/es/node/create.js","../util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","../util/memory.js":"../node_modules/diffhtml/dist/es/util/memory.js"}],"../node_modules/diffhtml/dist/es/transition.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.runTransitions = runTransitions;

var _caches = require("./util/caches.js");

var _process = _interopRequireDefault(require("./util/process.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Available transition states.
const stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged']; // Sets up the states up so we can add and remove events from the sets.

stateNames.forEach(stateName => _caches.TransitionCache.set(stateName, new Set()));

function addTransitionState(stateName, callback) {
  if (undefined !== 'production') {
    if (!stateName || !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }

    if (!callback) {
      throw new Error('Missing transition state callback');
    }
  }

  _caches.TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (undefined !== 'production') {
    // Only validate the stateName if the caller provides one.
    if (stateName && !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }
  } // Remove all transition callbacks from state.


  if (!callback && stateName) {
    _caches.TransitionCache.get(stateName).clear();
  } // Remove a specific transition callback.
  else if (stateName && callback) {
      _caches.TransitionCache.get(stateName).delete(callback);
    } // Remove all callbacks.
    else {
        for (let i = 0; i < stateNames.length; i++) {
          _caches.TransitionCache.get(stateNames[i]).clear();
        }
      }
}

function runTransitions(setName, ...args) {
  const set = _caches.TransitionCache.get(setName);

  const promises = [];

  if (!set.size) {
    return promises;
  } // Ignore text nodes.


  if (setName !== 'textChanged' && args[0].nodeType === 3) {
    return promises;
  } // Run each transition callback, if on the attached/detached.


  set.forEach(callback => {
    const retVal = callback(...args); // Is a `thennable` object or Native Promise.

    if (typeof retVal === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  if (setName === 'attached' || setName === 'detached') {
    const element = args[0];
    [...element.childNodes].forEach(childNode => {
      promises.push(...runTransitions(setName, childNode, ...args.slice(1)));
    });
  }

  return promises;
}
},{"./util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","./util/process.js":"../node_modules/diffhtml/dist/es/util/process.js"}],"../node_modules/diffhtml/dist/es/node/patch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchNode;

var _create = _interopRequireDefault(require("./create.js"));

var _transition = require("../transition.js");

var _sync = require("../tree/sync.js");

var _caches = require("../util/caches.js");

var _memory = require("../util/memory.js");

var _decodeEntities = _interopRequireDefault(require("../util/decode-entities.js"));

var _escape = _interopRequireDefault(require("../util/escape.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);
const blacklist = new Set();
const whitelist = new Set();

const removeAttribute = (domNode, name) => {
  domNode.removeAttribute(name); // Runtime checking if the property can be set.

  const blacklistName = domNode.nodeName + '-' + name;

  if (whitelist.has(blacklistName)) {
    domNode[name] = undefined;
  } else if (!blacklist.has(blacklistName)) {
    try {
      domNode[name] = undefined;
      whitelist.add(blacklistName);
    } catch (unhandledException) {
      blacklist.add(blacklistName);
    }
  }
};

function patchNode(patches, state = {}) {
  const promises = [];
  const {
    isSVG,
    ownerDocument
  } = state;
  const {
    length
  } = patches;
  let i = 0;

  while (true) {
    const patchType = patches[i];

    if (i === length) {
      break;
    }

    switch (patchType) {
      case _sync.PATCH_TYPE.SET_ATTRIBUTE:
        {
          const vTree = patches[i + 1];
          const _name = patches[i + 2];
          const value = (0, _decodeEntities.default)(patches[i + 3]);
          i += 4;
          const domNode = (0, _create.default)(vTree, ownerDocument, isSVG);
          const oldValue = domNode.getAttribute(_name);
          const newPromises = (0, _transition.runTransitions)('attributeChanged', domNode, _name, oldValue, value); // Triggered either synchronously or asynchronously depending on if a
          // transition was invoked.

          const isObject = typeof value === 'object';
          const isFunction = typeof value === 'function'; // Events must be lowercased otherwise they will not be set correctly.

          const name = _name.indexOf('on') === 0 ? _name.toLowerCase() : _name; // Runtime checking if the property can be set.

          const blacklistName = vTree.nodeName + '-' + name; // Normal attribute value.

          if (!isObject && !isFunction && name) {
            const noValue = value === null || value === undefined;

            if (whitelist.has(blacklistName)) {
              domNode[name] = value;
            } else if (!blacklist.has(blacklistName)) {
              try {
                domNode[name] = value;
                whitelist.add(blacklistName);
              } catch (unhandledException) {
                blacklist.add(blacklistName);
              }
            } // Set the actual attribute, this will ensure attributes like
            // `autofocus` aren't reset by the property call above.


            domNode.setAttribute(name, noValue ? '' : value);
          } // Support patching an object representation of the style object.
          else if (isObject && name === 'style') {
              const keys = Object.keys(value);

              for (let i = 0; i < keys.length; i++) {
                domNode.style[keys[i]] = value[keys[i]];
              }
            } else if (typeof value !== 'string') {
              // Since this is a property value it gets set directly on the node.
              if (whitelist.has(blacklistName)) {
                domNode[name] = value;
              } else if (!blacklist.has(blacklistName)) {
                try {
                  domNode[name] = value;
                  whitelist.add(blacklistName);
                } catch (unhandledException) {
                  blacklist.add(blacklistName);
                }
              }
            }

          if (newPromises.length) {
            promises.push(...newPromises);
          }

          break;
        }

      case _sync.PATCH_TYPE.REMOVE_ATTRIBUTE:
        {
          const vTree = patches[i + 1];
          const name = patches[i + 2];
          i += 3;

          const domNode = _caches.NodeCache.get(vTree);

          const attributeChanged = _caches.TransitionCache.get('attributeChanged');

          const oldValue = domNode.getAttribute(name);
          const newPromises = (0, _transition.runTransitions)('attributeChanged', domNode, name, oldValue, null);

          if (newPromises.length) {
            Promise.all(newPromises).then(() => removeAttribute(domNode, name));
            promises.push(...newPromises);
          } else {
            removeAttribute(domNode, name);
          }

          break;
        }

      case _sync.PATCH_TYPE.NODE_VALUE:
        {
          const vTree = patches[i + 1];
          const nodeValue = patches[i + 2];
          const oldValue = patches[i + 3];
          i += 4;
          const domNode = (0, _create.default)(vTree);

          const textChanged = _caches.TransitionCache.get('textChanged');

          const textChangedPromises = (0, _transition.runTransitions)('textChanged', domNode, oldValue, nodeValue);
          const {
            parentNode
          } = domNode;

          if (nodeValue.includes('&')) {
            domNode.nodeValue = (0, _decodeEntities.default)(nodeValue);
          } else {
            domNode.nodeValue = nodeValue;
          }

          if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
            parentNode.nodeValue = (0, _escape.default)((0, _decodeEntities.default)(nodeValue));
          }

          if (textChangedPromises.length) {
            promises.push(...textChangedPromises);
          }

          break;
        }

      case _sync.PATCH_TYPE.INSERT_BEFORE:
        {
          const vTree = patches[i + 1];
          const newTree = patches[i + 2];
          const refTree = patches[i + 3];
          i += 4;

          const domNode = _caches.NodeCache.get(vTree);

          const refNode = refTree && (0, _create.default)(refTree, ownerDocument, isSVG);

          const attached = _caches.TransitionCache.get('attached');

          if (refTree) {
            (0, _memory.protectVTree)(refTree);
          }

          const newNode = (0, _create.default)(newTree, ownerDocument, isSVG);
          (0, _memory.protectVTree)(newTree); // If refNode is `null` then it will simply append like `appendChild`.

          domNode.insertBefore(newNode, refNode);
          const attachedPromises = (0, _transition.runTransitions)('attached', newNode);
          promises.push(...attachedPromises);
          break;
        }

      case _sync.PATCH_TYPE.REPLACE_CHILD:
        {
          const newTree = patches[i + 1];
          const oldTree = patches[i + 2];
          i += 3;

          const oldDomNode = _caches.NodeCache.get(oldTree);

          const newDomNode = (0, _create.default)(newTree, ownerDocument, isSVG);

          const attached = _caches.TransitionCache.get('attached');

          const detached = _caches.TransitionCache.get('detached');

          const replaced = _caches.TransitionCache.get('replaced'); // Always insert before to allow the element to transition.
          // FIXME only do this if transitions exist


          oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
          (0, _memory.protectVTree)(newTree);
          const attachedPromises = (0, _transition.runTransitions)('attached', newDomNode);
          const detachedPromises = (0, _transition.runTransitions)('detached', oldDomNode);
          const replacedPromises = (0, _transition.runTransitions)('replaced', oldDomNode, newDomNode);
          const allPromises = [...attachedPromises, ...detachedPromises, ...replacedPromises];

          if (allPromises.length) {
            Promise.all(allPromises).then(() => {
              oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
              (0, _memory.unprotectVTree)(oldTree);
            });
            promises.push(...allPromises);
          } else {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            (0, _memory.unprotectVTree)(oldTree);
          }

          break;
        }

      case _sync.PATCH_TYPE.REMOVE_CHILD:
        {
          const vTree = patches[i + 1];
          i += 2;

          const domNode = _caches.NodeCache.get(vTree);

          const detached = _caches.TransitionCache.get('detached');

          const detachedPromises = (0, _transition.runTransitions)('detached', domNode);

          if (detachedPromises.length) {
            Promise.all(detachedPromises).then(() => {
              domNode.parentNode.removeChild(domNode);
              (0, _memory.unprotectVTree)(vTree);
            });
            promises.push(...detachedPromises);
          } else {
            domNode.parentNode.removeChild(domNode);
            (0, _memory.unprotectVTree)(vTree);
          }

          break;
        }
    }
  }

  return promises;
}
},{"./create.js":"../node_modules/diffhtml/dist/es/node/create.js","../transition.js":"../node_modules/diffhtml/dist/es/transition.js","../tree/sync.js":"../node_modules/diffhtml/dist/es/tree/sync.js","../util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","../util/memory.js":"../node_modules/diffhtml/dist/es/util/memory.js","../util/decode-entities.js":"../node_modules/diffhtml/dist/es/util/decode-entities.js","../util/escape.js":"../node_modules/diffhtml/dist/es/util/escape.js"}],"../node_modules/diffhtml/dist/es/tasks/patch-node.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

var _patch = _interopRequireDefault(require("../node/patch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patch(transaction) {
  const {
    domNode,
    state,
    state: {
      measure
    },
    patches
  } = transaction;
  const {
    promises = []
  } = transaction;
  const {
    nodeName
  } = domNode;
  const namespaceURI = domNode.namespaceURI || '';
  state.isSVG = nodeName.toLowerCase() === 'svg' || namespaceURI.includes('svg');
  state.ownerDocument = domNode.ownerDocument || document;
  measure('patch node');
  promises.push(...(0, _patch.default)(patches, state));
  measure('patch node');
  transaction.promises = promises;
}
},{"../node/patch.js":"../node_modules/diffhtml/dist/es/node/patch.js"}],"../node_modules/diffhtml/dist/es/tasks/end-as-promise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = endAsPromise;

// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  const {
    promises = []
  } = transaction; // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.

  if (promises.length) {
    return transaction.promise = Promise.all(promises).then(() => transaction.end());
  } // Pass off the remaining middleware to allow users to dive into the
  // transaction completed lifecycle event.


  return transaction.promise = Promise.resolve(transaction.end());
}
},{}],"../node_modules/diffhtml/dist/es/transaction.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = exports.defaultTasks = void 0;

var _caches = require("./util/caches.js");

var _memory = require("./util/memory.js");

var _makeMeasure = _interopRequireDefault(require("./util/make-measure.js"));

var _process = _interopRequireDefault(require("./util/process.js"));

var _schedule = _interopRequireDefault(require("./tasks/schedule.js"));

var _shouldUpdate = _interopRequireDefault(require("./tasks/should-update.js"));

var _reconcileTrees = _interopRequireDefault(require("./tasks/reconcile-trees.js"));

var _syncTrees = _interopRequireDefault(require("./tasks/sync-trees.js"));

var _patchNode = _interopRequireDefault(require("./tasks/patch-node.js"));

var _endAsPromise = _interopRequireDefault(require("./tasks/end-as-promise.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultTasks = [_schedule.default, _shouldUpdate.default, _reconcileTrees.default, _syncTrees.default, _patchNode.default, _endAsPromise.default];
exports.defaultTasks = defaultTasks;
const tasks = {
  schedule: _schedule.default,
  shouldUpdate: _shouldUpdate.default,
  reconcileTrees: _reconcileTrees.default,
  syncTrees: _syncTrees.default,
  patchNode: _patchNode.default,
  endAsPromise: _endAsPromise.default
};
exports.tasks = tasks;

class Transaction {
  static create(domNode, markup, options) {
    return new Transaction(domNode, markup, options);
  }

  static flow(transaction, tasks) {
    let retVal = transaction; // Execute each "task" serially, passing the transaction as a baton that
    // can be used to share state across the tasks.

    for (let i = 0; i < tasks.length; i++) {
      // If aborted, don't execute any more tasks.
      if (transaction.aborted) {
        return retVal;
      } // Run the task.


      retVal = tasks[i](transaction); // The last `returnValue` is what gets sent to the consumer. This
      // mechanism is crucial for the `abort`, if you want to modify the "flow"
      // that's fine, but you must ensure that your last task provides a
      // mechanism to know when the transaction completes. Something like
      // callbacks or a Promise.

      if (retVal !== undefined && retVal !== transaction) {
        return retVal;
      }
    }
  }

  static assert(transaction) {
    if (undefined !== 'production') {
      if (typeof transaction.domNode !== 'object') {
        throw new Error('Transaction requires a DOM Node mount point');
      }

      if (transaction.aborted && transaction.completed) {
        throw new Error('Transaction was previously aborted');
      }

      if (transaction.completed) {
        throw new Error('Transaction was previously completed');
      }
    }
  }

  static invokeMiddleware(transaction) {
    const {
      tasks
    } = transaction;

    _caches.MiddlewareCache.forEach(fn => {
      // Invoke all the middleware passing along this transaction as the only
      // argument. If they return a value (must be a function) it will be added
      // to the transaction task flow.
      const result = fn(transaction);

      if (result) {
        tasks.push(result);
      }
    });
  }

  constructor(domNode, markup, options) {
    this.domNode = domNode;
    this.markup = markup;
    this.options = options;
    this.state = _caches.StateCache.get(domNode) || {
      measure: (0, _makeMeasure.default)(domNode, markup)
    };
    this.tasks = [].concat(options.tasks); // Store calls to trigger after the transaction has ended.

    this.endedCallbacks = new Set();

    _caches.StateCache.set(domNode, this.state);
  }

  start() {
    if (undefined !== 'production') {
      Transaction.assert(this);
    }

    const {
      domNode,
      state: {
        measure
      },
      tasks
    } = this;
    const takeLastTask = tasks.pop();
    this.aborted = false; // Add middleware in as tasks.

    Transaction.invokeMiddleware(this); // Measure the render flow if the user wants to track performance.

    measure('render'); // Push back the last task as part of ending the flow.

    tasks.push(takeLastTask);
    return Transaction.flow(this, tasks);
  } // This will immediately call the last flow task and terminate the flow. We
  // call the last task to ensure that the control flow completes. This should
  // end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
  // `return someValue` to provide the most accurate performance reading. This
  // doesn't matter practically besides that.


  abort(isReturn) {
    const {
      state
    } = this;
    this.aborted = true; // Grab the last task in the flow and return, this task will be responsible
    // for calling `transaction.end`.

    if (isReturn) {
      return this.tasks[this.tasks.length - 1](this);
    }
  }

  end() {
    const {
      state,
      domNode,
      options
    } = this;
    const {
      measure
    } = state;
    const {
      inner
    } = options;
    measure('finalize');
    this.completed = true; // Mark the end to rendering.

    measure('finalize');
    measure('render'); // Trigger all `onceEnded` callbacks, so that middleware can know the
    // transaction has ended.

    this.endedCallbacks.forEach(callback => callback(this));
    this.endedCallbacks.clear(); // Cache the markup and text for the DOM node to allow for short-circuiting
    // future render transactions.

    state.previousMarkup = domNode.outerHTML;
    state.isRendering = false; // Clean up memory before rendering the next transaction, however if
    // another transaction is running concurrently this will be delayed until
    // the last render completes.

    (0, _memory.cleanMemory)();
    return this;
  }

  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }

}

exports.default = Transaction;
},{"./util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","./util/memory.js":"../node_modules/diffhtml/dist/es/util/memory.js","./util/make-measure.js":"../node_modules/diffhtml/dist/es/util/make-measure.js","./util/process.js":"../node_modules/diffhtml/dist/es/util/process.js","./tasks/schedule.js":"../node_modules/diffhtml/dist/es/tasks/schedule.js","./tasks/should-update.js":"../node_modules/diffhtml/dist/es/tasks/should-update.js","./tasks/reconcile-trees.js":"../node_modules/diffhtml/dist/es/tasks/reconcile-trees.js","./tasks/sync-trees.js":"../node_modules/diffhtml/dist/es/tasks/sync-trees.js","./tasks/patch-node.js":"../node_modules/diffhtml/dist/es/tasks/patch-node.js","./tasks/end-as-promise.js":"../node_modules/diffhtml/dist/es/tasks/end-as-promise.js"}],"../node_modules/diffhtml/dist/es/inner-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = innerHTML;

var _transaction = _interopRequireWildcard(require("./transaction.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function innerHTML(domNode, markup = '', options = {}) {
  options.inner = true;
  options.tasks = options.tasks || _transaction.defaultTasks;
  return _transaction.default.create(domNode, markup, options).start();
}
},{"./transaction.js":"../node_modules/diffhtml/dist/es/transaction.js"}],"../node_modules/diffhtml/dist/es/outer-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = outerHTML;

var _transaction = _interopRequireWildcard(require("./transaction.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function outerHTML(domNode, markup = '', options = {}) {
  options.inner = false;
  options.tasks = options.tasks || _transaction.defaultTasks;
  return _transaction.default.create(domNode, markup, options).start();
}
},{"./transaction.js":"../node_modules/diffhtml/dist/es/transaction.js"}],"../node_modules/diffhtml/dist/es/html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleTaggedTemplate;

var _create = _interopRequireDefault(require("./tree/create.js"));

var _parse = _interopRequireDefault(require("./util/parse.js"));

var _escape = _interopRequireDefault(require("./util/escape.js"));

var _decodeEntities = _interopRequireDefault(require("./util/decode-entities.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isArray
} = Array;
const isTagEx = /(<|\/)/;
const TOKEN = '__DIFFHTML__'; // Get the next value from the list. If the next value is a string, make sure
// it is escaped.

const nextValue = values => {
  const value = values.shift();
  return typeof value === 'string' ? (0, _escape.default)((0, _decodeEntities.default)(value)) : value;
};

function handleTaggedTemplate(strings, ...values) {
  // If this function is used outside of a tagged template, ensure that flat
  // strings are coerced to arrays, simulating a tagged template call.
  if (typeof strings === 'string') {
    strings = [strings];
  } // Do not attempt to parse empty strings.


  if (!strings) {
    return null;
  } // Parse only the text, no dynamic bits.


  if (strings.length === 1 && !values.length) {
    const strict = handleTaggedTemplate.isStrict;
    handleTaggedTemplate.isStrict = undefined;
    const {
      childNodes
    } = (0, _parse.default)(strings[0], null, {
      strict
    });
    return childNodes.length > 1 ? (0, _create.default)(childNodes) : childNodes[0];
  } // Used to store markup and tokens.


  let HTML = ''; // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).

  const supplemental = {
    attributes: {},
    children: {},
    tags: {}
  }; // Loop over the static strings, each break correlates to an interpolated
  // value. As these values can be dynamic, we cannot pass them to the HTML
  // parser inline (it only accepts strings). These dynamic values are indexed
  // in an object called supplemental and keyed by a incremental string token.
  // The following loop instruments the markup with these tokens that the
  // parser then uses to assemble the correct tree.

  strings.forEach((string, i) => {
    // Always add the string, we need it to parse the markup later.
    HTML += string; // If there are values, figure out where in the markup they were injected.

    if (values.length) {
      const value = nextValue(values);
      const lastSegment = string.split(' ').pop();
      const lastCharacter = HTML.trim().slice(-1);
      const isAttribute = HTML.lastIndexOf('>') < HTML.lastIndexOf('<');
      const isTag = Boolean(lastCharacter.match(isTagEx));
      const isString = typeof value === 'string';
      const isObject = typeof value === 'object';

      const _isArray = isArray(value);

      const token = `${TOKEN}${i}__`; // Injected as a tag.

      if (isTag && !isString) {
        supplemental.tags[i] = value;
        HTML += token;
      } // Injected as attribute.
      else if (isAttribute) {
          supplemental.attributes[i] = value;
          HTML += token;
        } // Injected as a child node.
        else if (_isArray || isObject) {
            supplemental.children[i] = (0, _create.default)(value);
            HTML += token;
          } // Injected as something else in the markup or undefined, ignore
          // obviously falsy values used with boolean operators.
          else if (value) {
              HTML += value;
            }
    }
  }); // Determine if we are in strict mode and immediately reset for the next
  // call.

  const strict = handleTaggedTemplate.isStrict;
  handleTaggedTemplate.isStrict = undefined; // Parse the instrumented markup to get the Virtual Tree.

  const {
    childNodes
  } = (0, _parse.default)(HTML, supplemental, {
    strict
  }); // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.

  return childNodes.length === 1 ? childNodes[0] : (0, _create.default)(childNodes);
} // Use a strict mode similar to XHTML/JSX where tags must be properly closed
// and malformed markup is treated as an error. The default is to silently fail
// just like HTML.


handleTaggedTemplate.strict = (...args) => {
  handleTaggedTemplate.isStrict = true;
  return handleTaggedTemplate(...args);
};
},{"./tree/create.js":"../node_modules/diffhtml/dist/es/tree/create.js","./util/parse.js":"../node_modules/diffhtml/dist/es/util/parse.js","./util/escape.js":"../node_modules/diffhtml/dist/es/util/escape.js","./util/decode-entities.js":"../node_modules/diffhtml/dist/es/util/decode-entities.js"}],"../node_modules/diffhtml/dist/es/release.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = release;

var _caches = require("./util/caches.js");

var _memory = require("./util/memory.js");

function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = _caches.StateCache.get(domNode); // If there is a Virtual Tree element, recycle all objects allocated for it.


  if (state && state.oldTree) {
    (0, _memory.unprotectVTree)(state.oldTree);
  } // Remove the DOM Node's state object from the cache.


  _caches.StateCache.delete(domNode); // Recycle all unprotected objects.


  (0, _memory.cleanMemory)();
}
},{"./util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","./util/memory.js":"../node_modules/diffhtml/dist/es/util/memory.js"}],"../node_modules/diffhtml/dist/es/use.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = use;

var _caches = require("./util/caches.js");

var _process = _interopRequireDefault(require("./util/process.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isArray
} = Array;

function use(middleware) {
  const isFunction = typeof middleware === 'function';
  const isObject = typeof middleware === 'object';

  if (undefined !== 'production') {
    if (!middleware || !isFunction && !isObject || isArray(middleware)) {
      throw new Error('Middleware must be a function or plain object');
    }
  }

  const {
    subscribe,
    unsubscribe,
    createTreeHook,
    createNodeHook,
    syncTreeHook,
    releaseHook
  } = middleware; // Add the function to the set of middlewares.

  isFunction && _caches.MiddlewareCache.add(middleware); // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.

  subscribe && middleware.subscribe(); // Add the hyper-specific create hooks.

  createTreeHook && _caches.CreateTreeHookCache.add(createTreeHook);
  createNodeHook && _caches.CreateNodeHookCache.add(createNodeHook);
  syncTreeHook && _caches.SyncTreeHookCache.add(syncTreeHook);
  releaseHook && _caches.ReleaseHookCache.add(releaseHook); // The unsubscribe method for the middleware.

  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    isFunction && _caches.MiddlewareCache.delete(middleware); // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).

    unsubscribe && unsubscribe(); // Cleanup the specific fns from their Cache.

    _caches.CreateTreeHookCache.delete(createTreeHook);

    _caches.CreateNodeHookCache.delete(createNodeHook);

    _caches.SyncTreeHookCache.delete(syncTreeHook);

    _caches.ReleaseHookCache.delete(releaseHook);
  };
}
},{"./util/caches.js":"../node_modules/diffhtml/dist/es/util/caches.js","./util/process.js":"../node_modules/diffhtml/dist/es/util/process.js"}],"../node_modules/diffhtml/dist/es/version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__VERSION__ = void 0;
const __VERSION__ = '1.0.0-beta.12';
exports.__VERSION__ = __VERSION__;
},{}],"../node_modules/diffhtml/dist/es/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createTree", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "innerHTML", {
  enumerable: true,
  get: function () {
    return _innerHtml.default;
  }
});
Object.defineProperty(exports, "outerHTML", {
  enumerable: true,
  get: function () {
    return _outerHtml.default;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _html.default;
  }
});
Object.defineProperty(exports, "release", {
  enumerable: true,
  get: function () {
    return _release.default;
  }
});
Object.defineProperty(exports, "use", {
  enumerable: true,
  get: function () {
    return _use.default;
  }
});
Object.defineProperty(exports, "addTransitionState", {
  enumerable: true,
  get: function () {
    return _transition.addTransitionState;
  }
});
Object.defineProperty(exports, "removeTransitionState", {
  enumerable: true,
  get: function () {
    return _transition.removeTransitionState;
  }
});
Object.defineProperty(exports, "VERSION", {
  enumerable: true,
  get: function () {
    return _version.__VERSION__;
  }
});
exports.default = exports.Internals = void 0;

var _create = _interopRequireDefault(require("./tree/create.js"));

var _sync = _interopRequireWildcard(require("./tree/sync.js"));

var _create2 = _interopRequireDefault(require("./node/create.js"));

var _parseNewTree = _interopRequireDefault(require("./tasks/parse-new-tree.js"));

var _reconcileTrees = _interopRequireDefault(require("./tasks/reconcile-trees.js"));

var _internals = _interopRequireDefault(require("./util/internals.js"));

var _parse = _interopRequireDefault(require("./util/parse.js"));

var _innerHtml = _interopRequireDefault(require("./inner-html.js"));

var _outerHtml = _interopRequireDefault(require("./outer-html.js"));

var _transaction = require("./transaction.js");

var _html = _interopRequireDefault(require("./html.js"));

var _release = _interopRequireDefault(require("./release.js"));

var _use = _interopRequireDefault(require("./use.js"));

var _transition = require("./transition.js");

var _version = require("./version.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// At startup inject the HTML parser into the default set of tasks.
_transaction.defaultTasks.splice(_transaction.defaultTasks.indexOf(_reconcileTrees.default), 0, _parseNewTree.default);

const api = {
  VERSION: _version.__VERSION__,
  addTransitionState: _transition.addTransitionState,
  removeTransitionState: _transition.removeTransitionState,
  release: _release.default,
  createTree: _create.default,
  use: _use.default,
  outerHTML: _outerHtml.default,
  innerHTML: _innerHtml.default,
  html: _html.default
};
const {
  assign
} = Object; // This is an internal API exported purely for middleware and extensions to
// leverage internal APIs that are not part of the public API. There are no
// promises that this will not break in the future. We will attempt to minimize
// changes and will supply fallbacks when APIs change.
//
// Note: The HTML parser is only available in this mode.

const Internals = assign(_internals.default, api, {
  parse: _parse.default,
  defaultTasks: _transaction.defaultTasks,
  tasks: _transaction.tasks,
  createNode: _create2.default,
  syncTree: _sync.default,
  PATCH_TYPE: _sync.PATCH_TYPE
}); // Attach a circular reference to `Internals` for ES/CJS builds.

exports.Internals = Internals;
api.Internals = Internals; // Automatically hook up to DevTools if they are present.

if (typeof devTools !== 'undefined') {
  (0, _use.default)(devTools(Internals));
  console.warn('diffHTML DevTools: Found and activated!');
}

var _default = api;
exports.default = _default;
},{"./tree/create.js":"../node_modules/diffhtml/dist/es/tree/create.js","./tree/sync.js":"../node_modules/diffhtml/dist/es/tree/sync.js","./node/create.js":"../node_modules/diffhtml/dist/es/node/create.js","./tasks/parse-new-tree.js":"../node_modules/diffhtml/dist/es/tasks/parse-new-tree.js","./tasks/reconcile-trees.js":"../node_modules/diffhtml/dist/es/tasks/reconcile-trees.js","./util/internals.js":"../node_modules/diffhtml/dist/es/util/internals.js","./util/parse.js":"../node_modules/diffhtml/dist/es/util/parse.js","./inner-html.js":"../node_modules/diffhtml/dist/es/inner-html.js","./outer-html.js":"../node_modules/diffhtml/dist/es/outer-html.js","./transaction.js":"../node_modules/diffhtml/dist/es/transaction.js","./html.js":"../node_modules/diffhtml/dist/es/html.js","./release.js":"../node_modules/diffhtml/dist/es/release.js","./use.js":"../node_modules/diffhtml/dist/es/use.js","./transition.js":"../node_modules/diffhtml/dist/es/transition.js","./version.js":"../node_modules/diffhtml/dist/es/version.js"}],"../node_modules/widgetsjs/dist/plugins/diffing.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var diffhtml_1 = require("diffhtml");
var DiffingPlugin = /** @class */ (function () {
    function DiffingPlugin(widget) {
        this.widget = widget;
        this.differ = diffhtml_1.innerHTML;
    }
    DiffingPlugin.prototype.run = function (innerHTML) {
        this.differ(this.widget, innerHTML);
    };
    return DiffingPlugin;
}());
exports.DiffingPlugin = DiffingPlugin;

},{"diffhtml":"../node_modules/diffhtml/dist/es/index.js"}],"../node_modules/widgetsjs/dist/plugins/templatePraser.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TemplateParserPlugin = /** @class */ (function () {
    function TemplateParserPlugin(widget) {
        this.widget = widget;
    }
    TemplateParserPlugin.prototype.run = function (innerHTML) {
        var _this = this;
        (innerHTML.match(/\{([^}]+)\}/g) || []).forEach(function (t) {
            t = t.slice(2, -1);
            var res = new Function("return (" + t + ");");
            var ev = res.call(_this.widget);
            _this.widget.innerHTML = _this.widget.innerHTML.replace("{{" + t + "}}", ev);
        });
    };
    return TemplateParserPlugin;
}());
exports.TemplateParserPlugin = TemplateParserPlugin;

},{}],"../node_modules/widgetsjs/dist/StatefulWidget.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var Widget_1 = require("./Widget");
var diffing_1 = require("./plugins/diffing");
var templatePraser_1 = require("./plugins/templatePraser");
var StatefulWidget = /** @class */ (function (_super) {
    __extends(StatefulWidget, _super);
    function StatefulWidget(state, transformers) {
        var _this = _super.call(this, state, transformers) || this;
        _this.plugins = [new diffing_1.DiffingPlugin(_this), new templatePraser_1.TemplateParserPlugin(_this)];
        _this.eventEmitter = new events_1.EventEmitter();
        _this.setState(state);
        _this.on('load', _this.onMount);
        return _this;
    }
    StatefulWidget.prototype.connectedCallback = function () {
        var _this = this;
        this.setup();
        this.root = this;
        var state = {};
        for (var i = 0; i < this.attributes.length; i++) {
            var attr = this.attributes[i];
            state[attr.name] = attr.value;
        }
        var componentState = Object.assign({}, this.state);
        state = Object.assign(componentState, state);
        this.beforeRender();
        this.runPlugins(this._render(state));
        this.on('render', function (state) {
            componentState = Object.assign({}, _this.cachedState || _this.state);
            var _state = Object.assign(state, componentState);
            _this.beforeRender();
            _this.runPlugins(_this._render(_state));
            _this.afterRender();
        });
        this.emit('load');
        this.afterRender();
    };
    StatefulWidget.prototype.runPlugins = function (innerHTML) {
        for (var _i = 0, _a = this.plugins; _i < _a.length; _i++) {
            var plugin = _a[_i];
            plugin.run(innerHTML);
        }
    };
    Object.defineProperty(StatefulWidget.prototype, "emitter", {
        get: function () {
            return this.eventEmitter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatefulWidget.prototype, "on", {
        get: function () {
            return this.eventEmitter.on;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatefulWidget.prototype, "emit", {
        get: function () {
            return this.eventEmitter.emit;
        },
        enumerable: true,
        configurable: true
    });
    StatefulWidget.prototype.peerComponent = function (component) {
        var _this = this;
        component.on('render', function () {
            _this.emit('render', _this.cachedState || _this.state);
        });
    };
    StatefulWidget.prototype.cacheState = function () {
        this.cachedState = Object.assign({}, this.state);
        return this.cachedState;
    };
    StatefulWidget.prototype.setState = function (state) {
        this.transformers && Object.keys(this.state).length !== 0 && this.transformState(this.transformers, this.state);
        // console.log(this.cachedState, this.state)
        this.state = Object.assign(this.cachedState || this.state || {}, state);
        this.emit('render', this.state);
    };
    StatefulWidget.prototype.beforeRender = function () { };
    StatefulWidget.prototype.afterRender = function () { };
    return StatefulWidget;
}(Widget_1.Widget));
exports.StatefulWidget = StatefulWidget;

},{"events":"../../../webjs/node_modules/node-libs-browser/node_modules/events/events.js","./Widget":"../node_modules/widgetsjs/dist/Widget.js","./plugins/diffing":"../node_modules/widgetsjs/dist/plugins/diffing.js","./plugins/templatePraser":"../node_modules/widgetsjs/dist/plugins/templatePraser.js"}],"../node_modules/widgetsjs/dist/StatelessWidget.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Widget_1 = require("./Widget");
var StatelessWidget = /** @class */ (function (_super) {
    __extends(StatelessWidget, _super);
    function StatelessWidget(state, transformers) {
        return _super.call(this, state, transformers) || this;
    }
    StatelessWidget.prototype.connectedCallback = function () {
        this.setup();
        this.root = this;
        var state = {};
        for (var i = 0; i < this.attributes.length; i++) {
            var attr = this.attributes[i];
            state[attr.name] = attr.value;
        }
        var componentState = {};
        Object.assign(componentState, this.state);
        Object.assign(componentState, state);
        this.innerHTML = this._render(componentState);
        this.onMount();
    };
    return StatelessWidget;
}(Widget_1.Widget));
exports.StatelessWidget = StatelessWidget;

},{"./Widget":"../node_modules/widgetsjs/dist/Widget.js"}],"../node_modules/widgetsjs/dist/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shim_1 = require("./shim");
shim_1.shim();
var utils_1 = require("./utils");
exports.useComponent = utils_1.useComponent;
exports.getRef = utils_1.getRef;
var Widget_1 = require("./Widget");
exports.Widget = Widget_1.Widget;
var StatefulWidget_1 = require("./StatefulWidget");
exports.StatefulWidget = StatefulWidget_1.StatefulWidget;
var StatelessWidget_1 = require("./StatelessWidget");
exports.StatelessWidget = StatelessWidget_1.StatelessWidget;

},{"./shim":"../node_modules/widgetsjs/dist/shim.js","./utils":"../node_modules/widgetsjs/dist/utils.js","./Widget":"../node_modules/widgetsjs/dist/Widget.js","./StatefulWidget":"../node_modules/widgetsjs/dist/StatefulWidget.js","./StatelessWidget":"../node_modules/widgetsjs/dist/StatelessWidget.js"}],"Components/Canvas.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var widgetsjs_1 = require("widgetsjs");

var Canvas =
/** @class */
function (_super) {
  __extends(Canvas, _super);

  function Canvas() {
    return _super.call(this, {
      resolution: '720:480'
    }, {
      resolution: function resolution(s) {
        console.log(s);

        if (s.indexOf(':') > -1) {
          return s.split(':');
        } else {
          return [720, 480];
        }
      }
    }) || this;
  }

  Canvas.prototype.onMount = function () {
    var canvas = this.$child('canvas');
    var ctx = canvas.getContext('2d'); // Draw shit!!

    ctx.beginPath();
    ctx.rect(0, 0, 720, 480);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(100, 100, 100, 100);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(120, 120, 100, 100);
    ctx.fillStyle = 'green';
    ctx.fill();
  };

  Canvas.prototype.render = function (state) {
    return "\n            <canvas width=" + state.resolution[0] + " height=" + state.resolution[1] + ">\n            </canvas>\n        ";
  };

  return Canvas;
}(widgetsjs_1.StatelessWidget);

exports.Canvas = Canvas;
},{"widgetsjs":"../node_modules/widgetsjs/dist/index.js"}],"index.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var w = __importStar(require("widgetsjs")); //Components


var Canvas_1 = require("./Components/Canvas");

w.useComponent(Canvas_1.Canvas).as('x-display');
},{"widgetsjs":"../node_modules/widgetsjs/dist/index.js","./Components/Canvas":"Components/Canvas.ts"}],"../../../webjs/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64243" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../webjs/node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=src.77de5100.js.map