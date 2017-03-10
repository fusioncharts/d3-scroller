# d3-scroller

d3-scroller allows to draw a SVG scroller element. It comes with the flexibility to configure different visual and interactive parameters.

## Installing

If you use NPM, `npm install d3-scroller`. Otherwise, download the [latest release](https://github.com/AyanGhatak/d3-scroller/releases/latest). You can also load as a [standalone library](https://raw.githubusercontent.com/AyanGhatak/d3-scroller/master/build/d3-scroller.js). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3` global is exported:

```html
<!-- d3-selection -->
<script src="https://d3js.org/d3-selection.v1.min.js"></script>
<!-- d3-drag -->
<script src="https://d3js.org/d3-dispatch.v1.min.js"></script>
<script src="https://d3js.org/d3-drag.v1.min.js"></script>
<!-- d3-scale -->
<script src="https://d3js.org/d3-color.v1.min.js"></script>
<script src="https://d3js.org/d3-interpolate.v1.min.js"></script>
<script src="https://d3js.org/d3-scale.v1.min.js"></script>
<!-- d3-transition -->
<script src="https://d3js.org/d3-timer.v1.min.js"></script>
<script src="https://d3js.org/d3-transition.v1.min.js"></script>

<!-- d3-scroller -->
<script src="https://raw.githubusercontent.com/AyanGhatak/d3-scroller/master/build/d3-scroller.js"></script>
<script>

var div = d3.selectAll("div");

</script>
```

[Try d3-scroller in your browser.](https://cdn.rawgit.com/AyanGhatak/d3-scroller/b10385d2/example/index.html)

## API Reference

* Configuring the parameters
* Draw the scroller
* Update the position
* Adding scroll in a scroller

### Configuring the parameters
d3-scroller comes with an ample flexibility to configure the scroller. After instantiating the scroller, use the `.attr()` api to update the default value of the configuration.
Please refer to the [default config file](https://raw.githubusercontent.com/AyanGhatak/d3-scroller/master/src/defaultConfig.js) to get default values and corresponding names of the properties.

* <b>Change the dimension for the scroller.</b>
```js
// container is the id of the selector where the scroller is to be rendered.
d3.scroller('#container');
    .attr('width', 500)
    .attr('height', 20);
```
* <b>Change the unit step.</b>
Sometimes it becomes very useful to control the momentum of the movement of the scroller. Here is how to achieve that
```js
// On every click on the buttons the handle moves 200px, i.e. the step movement for the handle on button interactions.
d3.scroller('#container');
    .attr('step', 200);
```
* <b>Choosing the initial position of the handle</b>
The handle is the bar element which facilitates the interaction on it.
```js
// Placing the handle, having a width of 40px, at 70 pixels away from the left side of the scroller.
d3.scroller('#container');
    .attr('handle', {
    x: 70,
      width: 40
  });
```
* <b>Customise the goti visuals</b>
The small stub visual in placed centrally in the scroller bar(handle) is being referred to `goti` here. Feel free to customise its visual by feeding the path methods.
```js
d3.scroller('#container');
    .attr('goti', {
    width: 25,
    path: function () {
      // The custom path suitable here comes here.
    }
  });
```

### Drawing the scroller
This can be pretty simple and a simple invocation like the following would do.
```js
d3.scroller('#container')
  .draw()
```
But the avobe snippet picks the default parameters and renders the scroller at the top-left most point of the page. So thats definitelty we might be looking, right? So why not translate the group once we have already configured the dimensional parameters as shown avobe.

Lets check a simple snippet for this
```js
// Assuming the variables(x, y, width, height) are defined in the scope, this snippet
d3.scroller('#container')
  .attr('width', width)
    .attr('height', height)
  .attr('transform', 'translate(' + x + ',' + y + ')')
  .draw()
```

### Update the scroller
The `update()` method can be invoked with the positional information to shift the handle as per the requirement.
```js
// Assuming its already been drawn.
// startX --> The starting position of the handle.
// endX --> The end position for the handle.
d3.scroller('#container')
  .update(startX, endX, true);
```

### Adding scroll in a scroller
What!! Adding scroll in a scroller! How does that sound? Isnt that too obvious?

Well, lets see why thats not too obvious. So here we have seperated two concerns

* <b>Drawing a scroller element</b>
  This has been previously discussed. Please refer for the avobe section.
* <b>Adding interaction callbacks</b>

Now think an application has so many components which is in turn managed and controlled by a single model. And every time the model is changed, it re-render all its components differentially!( Sounding the React way, right? Yeah one might relate to it too.)

So think scroller is also a compoent, and on scrolling, it updates the reactive model. So in this situation we might not want to necessarily re-render the scroller elements, but just update the model - which re-render it.

Thus d3-scroller gives an enhanced control over the interaction.

Here we use the `.on()` method which accepts the `eventName` and the `callback`as the first and second parameters.

**Add a callback for its slide.**
```js
d3.scroller('#container')
  .on('slide', () => {
    // The callback to facilitate its interaction.
  })
```
To get a hunch of how this callback works, check the [implementation](https://github.com/AyanGhatak/d3-scroller/blob/master/example/index.html)

Currently we have couple of events supported to be listened

* slide -> On sliding through the scroller by dragging
* change -> Whenever the position of the handle is changed using the `update()` API.
