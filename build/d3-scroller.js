(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-drag'), require('d3-scale'), require('d3-transition')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-drag', 'd3-scale', 'd3-transition'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Selection,d3Drag,d3Scale,d3Transition) { 'use strict';

var utils = {
  mergeRecursive: function mergeRecursive(source, sink) {
     var prop;

     for (prop in sink) {

         if (source[prop] instanceof Object) {
             mergeRecursive(source[prop], sink[prop]);
         }
         else {
             source[prop] = sink[prop];
         }
     }
  },
  isObject: function (obj) {
    return typeof obj === 'object';
  },
  clone: function () {
    return this.parentNode.appendChild(this.cloneNode(true));
  },
  toPrecision: function(obj, value) {
      var tenPow = Math.pow(10, value);
      return Math.round(obj * tenPow) / tenPow;
  }
};

var defaultConfig = {
  animate: 250,
  classes: {
    "ui-slider": "ui-corner-all",
    "ui-slider-handle": "ui-corner-all",
    "ui-slider-range": "ui-corner-all ui-widget-header"
  },
  distance: 0,
  width: 600,
  height: 14,
  orientation: "horizontal",
  range: false,
  step: 50,
  value: 0,
  values: null,
  handle: {
    x: 70,
    width: 40,
    minWidth: 40
  },
  buttons: {
    width: 14
  },
  bar: {
    margin: {
      left: 5,
      right: 5,
      top: 0,
      bottom: 0
    }
  },
  goti: {
    width: 20,
    path: function (ref, width) {
      var handleConf = ref.attr('handle'),
        // width = handleConf.width,
        gotiWidth = Math.min(ref.attr('goti').width, handleConf.minWidth),
        x = handleConf.x + (width / 2),
        height = ref.attr('height'),
        y = height / 2,
        pathStr = '';
      if (width <= gotiWidth) {
        x = handleConf.x + handleConf.minWidth / 2;
      }

      // this.style('visibility', (width < gotiWidth) ? 'hidden' : 'visible');

      // the center line
      pathStr += 'M' + x + ',' + (y - height / 4) + 'L' + x + ',' +(y + height / 4);

      // the left line
      pathStr += 'M' + (x - gotiWidth / 6) + ',' + (y - height / 4) + 'L' + (x - gotiWidth / 6) + ',' +(y + height / 4);

      // the right line
      pathStr += 'M' + (x + gotiWidth / 6) + ',' + (y - height / 4) + 'L' + (x + gotiWidth / 6) + ',' +(y + height / 4);
      return pathStr;
    }
  },
  margin: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  // Callbacks
  change: null,
  slide: null,
  start: null,
  stop: null
};

var UNDEFINED;
var COMMA = ',';
var toPrecision = utils.toPrecision;

/*eslint-disable */
/*eslint-enable */

function Scroller(selection) {
  this.config = defaultConfig;
  this.attr('selection', selection);
  return this;
}

// *****OPTIONS*****

// duration can be a Boolean, object or a number.
// options can contain the other optional animation info like animation easings.
/*Scroller.prototype.animate = function (duration, options) {

};

Scroller.prototype.classes = function () {

};

Scroller.prototype.disabled = function () {

};

Scroller.prototype.max = function () {

};

Scroller.prototype.min = function () {

};

Scroller.prototype.value = function () {

};

Scroller.prototype.margin = function () {

};

Scroller.prototype.values = function () {

};

Scroller.prototype.width = function () {

};

Scroller.prototype.height = function () {

};*/

Scroller.prototype.attr = function (key, value) {
  if (value === UNDEFINED) {
    return this.config[key];
  }
  else {
    this.config[key] = value;
    return this;
  }
};

Scroller.prototype.drawSelf = function (animate) {
  var self = this,
    selection = this.attr('selection'),
    btnConfig = this.attr('buttons'),
    margin = this.attr('margin'),
    width = +this.attr("width") - margin.left - margin.right,
    barMargin = this.attr('bar').margin,
    hueActual = 0,
    unit = [1],
    duration = this.attr('animate'),
    height = this.attr('height'),
    handleConf = this.attr('handle'),
    hueTarget = handleConf.x + handleConf.width / 2,
    arr = [margin.left + btnConfig.width + barMargin.left, width -  btnConfig.width
      - barMargin.right],
    x = d3Scale.scaleLinear()
      .domain(arr)
      .range(arr),
    slider = selection
      .classed('slider', true)
      .attr('transform', this.attr('transform')),
    trackSelection = slider.selectAll('.track')
      .data(unit),
    offset = 0,
    handle,
    goti;

  trackSelection
    .enter()
    .append('rect')
    .attr("class", "track")
    .select(utils.clone)
    .attr("class", "track-inset")
    .select(utils.clone)
    .attr("class", "track-overlay")
    .call(d3Drag.drag()
      .on("start.interrupt", function() { slider.interrupt(); })
      .on("start drag", function() {
        var xCo = x.invert(d3Selection.event.x),
          handleConf = self.attr('handle');
        if (d3Selection.event.type === 'start') {
          if (xCo > handleConf.x && xCo < handleConf.x + handleConf.width) {
            offset = (handleConf.x + handleConf.width / 2) - xCo;
            return;
          }
          else {
            offset = 0;
          }
        }
        // temp code.
        // no on demand scroll move on clicking on the track for now.
        if (d3Selection.event.type === 'start') {
          if (xCo < handleConf.x ||xCo > handleConf.x + handleConf.width) {
            return;
          }
        }

        self.emit('slide', xCo + offset);
      }));

  slider.selectAll('.track, .track-inset, .track-overlay')
  .attr('x', x.range()[0])
  .attr('y', 0)
  .attr('width', x.range()[1] - x.range()[0])
  .attr('height', height);

  slider
    .selectAll('.handle')
    .data([1])
    .enter()
    .insert("rect", ".track-overlay")
    .attr("class", "handle");

  handle = slider
    .selectAll('.handle')
    .attr("width", handleConf.width)
    .attr('height', height)
    .attr('x', btnConfig.width + barMargin.left + margin.left);

  goti = slider.selectAll('.goti');

  goti.data([1])
    .enter()
    .insert('path', '.track-overlay')
    .classed('goti', true)
    .style('stroke', '#000');

  goti = slider.selectAll('.goti');

  function normalize(h) {
    var halfHandleWidth = handle.attr('width') / 2,
      a = x(Math.max(arr[0] + halfHandleWidth,
        Math.min(h, arr[1] - halfHandleWidth)) - (halfHandleWidth));
    return a;
  }

  function hue(h, doNotAnimate, w) {
    hueTarget = h;
    handle
      .transition()
      .duration(doNotAnimate ? false : duration)
      .tween('abc', function () {
        var initialWidth = +handle.attr('width');
        return function(t) {
          var x,
            width;
          if (w) {
            width = t < 1 ? (initialWidth + (w - initialWidth) * t) : w;
            width = Math.max(width, handleConf.minWidth);

            if (x + width > arr[1]) {
              width = arr[1] - x;
            }
            handle.attr("width", toPrecision(width, 1));
          }
          else {
            w = handle.attr('width');
          }
          x = normalize(t !== 1 ?
            hueActual + t * (hueTarget - hueActual): (hueActual = hueTarget));
          handle.attr('x', toPrecision((self.attr('handle').x = x), 1));
          // change the positions for the goti, and update it.
          goti.attr('d', self.attr('goti').path.call(goti, self, toPrecision(w, 1)));
        };
      });
  }

  this.update = function (startX, endX, doNotAnimate, minWidth) {
    if (minWidth) {
      self.attr('handle').minWidth = minWidth;
    }
    hue((startX + endX) / 2, doNotAnimate, (endX - startX));
    self.attr('handle').width = endX - startX;
    self.emit('change');
  };
  hue(hueTarget, animate);
  return this;
};

Scroller.prototype.draw = function (animate) {
  return this.drawSelf(animate)
    .drawButtons(animate);
};

Scroller.prototype.drawButtons = function (animate) {
  var self = this,
    selection = this.attr('selection'),
    height = this.attr('height'),
    btnWidth = this.attr('buttons').width,
    width = this.attr('width'),
    margin = this.attr('margin'),
    leftMargin = margin.left,
    duration = this.attr('animate'),
    translate = function (x, y) {
      return  'translate(' + x + COMMA + y + ')';
    },
    symbol;

  selection
  .selectAll('.buttonGroup')
  .data([1])
  .enter()
  .append('g')
  .classed('buttonGroup', true)
  .selectAll('g')
  .data([0,1])
  .enter()
  .append('g')
  .attr('class', function (d, index) {
    return index ? 'rightButton' : 'leftButton';
  })
  .on('click', function (d, i) {
    var handleConf = self.attr('handle'),
      x = handleConf.x + ((i ? 1 : -1) * self.attr('step'));
    self.emit('slide', x + handleConf.width / 2);
  });

  selection = selection
    .selectAll('.buttonGroup g');

  animate && (selection = selection.transition().duration(duration));
  selection.attr('transform', function (d, index) {
      return index ? translate(width - margin.right - btnWidth, 0) : translate(2 * leftMargin, 0);
    })
    .each(function (d, index) {
      var s = d3Selection.select(this),
        rect = s.selectAll('rect')
          .data([1]);

      rect.enter()
      .append('rect')
      .classed('bg', true)
      .merge(rect)
      .attr('x', -leftMargin)
      .attr('y', 0)
      .attr('width', btnWidth)
      .attr('height', height)
      .attr('r', 1);


      symbol = s.selectAll('path')
        .data([1]);

      symbol.enter()
      .append('path')
      .classed('arrows', true)
      .merge(symbol)
      .attr('d', function () {
        return 'M' + (((btnWidth - leftMargin * 2) / 2) + (index ? -1 : 1)) +
        COMMA + (height / 2 - 3) + 'L' + (((btnWidth - leftMargin * 2) / 2) +
        (index ? -1 : 1)) + COMMA + (height / 2 + 3) + 'L' +
        (((btnWidth - leftMargin * 2) / 2) + (index ? 2 : -2)) + COMMA +
        (height / 2) + 'Z';
      });
    });

  return this;
};

/*Scroller.prototype.selection = function (selection) {

};

Scroller.prototype.orientation = function () {

};

Scroller.prototype.range = function () {

};

Scroller.prototype.step = function () {

};*/




// *****METHODS*****
Scroller.prototype.destroy = function () {

};

Scroller.prototype.disable = function () {

};

Scroller.prototype.enable = function () {

};

/*Scroller.prototype.instance = function () {

};*/

Scroller.prototype.option = function () {

};

/*Scroller.prototype.widget = function () {

};*/



// *****EVENTS*****
Scroller.prototype.change = function () {

};

Scroller.prototype.create = function () {

};

Scroller.prototype.slide = function () {

};

Scroller.prototype.start = function () {

};

Scroller.prototype.stop = function () {

};

Scroller.prototype.emit = function (type, options) {
  var callbacks = this.getEvents(type) || [],
      i, len,
      slider = this.attr('selection');
  for (i = 0, len = callbacks.length; i < len; i += 1) {
    slider.call(callbacks[i], this, options);
  }
  return this;
};

Scroller.prototype.getEvents = function (type) {
  return this.eventObj && this.eventObj[type];
};

Scroller.prototype.on = function (type, callback) {
  var eventObj = this.eventObj || (this.eventObj = {});
  if (!eventObj[type]) {
    eventObj[type] = [];
  }
  eventObj[type].push(callback);
  return this;
};




// Constructs a new fusionText generator with the default settings.
var scroller = function(selection, options) {
  if (typeof selection === 'string') {
    selection = d3Selection.select(selection);
  }
  return new Scroller(selection, options);
};

exports.scroller = scroller;

Object.defineProperty(exports, '__esModule', { value: true });

})));
