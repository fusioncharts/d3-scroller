import {select, event} from 'd3-selection';
import {drag} from 'd3-drag';
import {scaleLinear} from 'd3-scale';
import 'd3-transition';


import utils from './utils';
import defaultConfig from './defaultConfig';

var UNDEFINED,
  COMMA = ',',
  toPrecision = utils.toPrecision;

/*eslint-disable */
if (ENV !== 'production') {
  document && document.write(
   '<script src="http://' + (location.host || 'localhost').split(':')[0] +
   ':35729/livereload.js?snipver=1"></' + 'script>'
  );
}
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

Scroller.prototype.drawSelf = function () {
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
    x = scaleLinear()
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
    .call(drag()
      .on("start.interrupt", function() { slider.interrupt(); })
      .on("start drag", function() {
        var xCo = x.invert(event.x),
          handleConf = self.attr('handle');
        if (event.type === 'start') {
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
        if (event.type === 'start') {
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
  hue(hueTarget, true);
  return this;
};

Scroller.prototype.draw = function () {
  return this.drawSelf()
    .drawButtons();
};

Scroller.prototype.drawButtons = function () {
  var self = this,
    selection = this.attr('selection'),
    height = this.attr('height'),
    btnWidth = this.attr('buttons').width,
    width = this.attr('width'),
    margin = this.attr('margin'),
    leftMargin = margin.left,
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

  selection
    .selectAll('.buttonGroup g')
    .attr('transform', function (d, index) {
      return index ? translate(width - margin.right - btnWidth, 0) : translate(2 * leftMargin, 0);
    })
    .each(function (d, index) {
      var s = select(this),
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
export default function(selection, options) {
  if (typeof selection === 'string') {
    selection = select(selection);
  }
  return new Scroller(selection, options);
}
