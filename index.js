'use strict';

//  Options
//    listener
//    multiplier

function Drag(options) {

	this._event = {
		x: 0,
    y: 0,
    cursorDown: false,
		startCursorX: 0, // The X position of the cursor on start.
		startCursorY: 0, // The Y position of cursor on start.
		originalEvent: null
  };

  this.listener = options.listener || window;
  this.multiplier = options.multiplier || 1;
  this.curDown = false; // True if cursor is down.
  this.initialized = false;
  this.listeners = [];
  this.numListeners = 0;

  this._onMouseDown = this._onMouseDown.bind(this);
  this._onMouseMove = this._onMouseMove.bind(this);
  this._onMouseUp = this._onMouseUp.bind(this);
  this._onMouseLeave = this._onMouseLeave.bind(this);
  this._notify = this._notify.bind(this);

}

Drag.prototype.on = function(f) {
  if(!this.initialized) this._addListeners();
  this.listeners.push(f);
  this.numListeners = this.listeners.length;
};

Drag.prototype.off = function(f) {
  this.listeners.splice(f, 1);
  this.numListeners = this.listeners.length;
  if(this.numListeners <= 0) this._removeListeners();
};

Drag.prototype._notify = function(e) {
  const targetX = (e.pageX - this._event.startCursorX) * this.multiplier;
  const targetY = (e.pageY - this._event.startCursorY) * this.multiplier;

  this._event.x = targetX;
  this._event.y = targetY;
  this._event.originalEvent = e;
  this._event.cursorDown = this.curDown;

  this._event.startCursorX = e.pageX;
  this._event.startCursorY = e.pageY;

  for(var i = 0; i < this.numListeners; i++) {
    this.listeners[i](this._event);
  }
};

// Event Listeners.
Drag.prototype._onMouseMove = function(e) {
  if(this.curDown){
    e.preventDefault();
    this._notify(e);
  }
};

Drag.prototype._onMouseDown = function(e) {
  this._event.startCursorX = e.pageX;
  this._event.startCursorY = e.pageY;
  this.curDown = true;
  //this._notify(e);
};

Drag.prototype._onMouseUp = function(e) {
  this.curDown = false;
  //this._notify(e);
};

Drag.prototype._onMouseLeave = function(e) {
  this.curDown = false;
  //this._notify(e);
};

Drag.prototype._addListeners = function() {
  this.listener.addEventListener('mouseup', this._onMouseUp);
  this.listener.addEventListener('mousedown', this._onMouseDown);
  this.listener.addEventListener('mousemove', this._onMouseMove);
  this.listener.addEventListener('mouseleave', this._onMouseLeave);
};

Drag.prototype._removeListeners = function() {
  this.listener.removeEventListener('mousemove', this._onMouseMove);
  this.listener.removeEventListener('mousedown', this._onMouseDown);
  this.listener.removeEventListener('mouseup', this._onMouseUp);
  this.listener.removeEventListener('mouseleave', this._onMouseLeave);
};

module.exports = Drag;
