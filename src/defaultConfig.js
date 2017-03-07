 export default {
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
