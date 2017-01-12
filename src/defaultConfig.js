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
  step: 25,
  value: 0,
  values: null,
  handle: {
    x: 70,
    width: 20
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
