/**
 * For more info on using the canvas,
 * see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
 *
 * For more info on using ImageData,
 * see https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 */
var canvas, ctx;

// Each matrix is written as an array of arrays, for convenience
// and readability
// This will cause no change in the image
var identity = [
  [1.0, 0.0, 0.0, 0.0],
  [0.0, 1.0, 0.0, 0.0],
  [0.0, 0.0, 1.0, 0.0],
  [0.0, 0.0, 0.0, 1.0]
];

function transform(matrix, image) {
  var data = new Uint8ClampedArray(image.data.length);
  for (var i=0; i<data.length;) {
    // r
    data[i] = image.data[i]*matrix[0][0] + image.data[i+1]*matrix[1][0] +
               image.data[i+2]*matrix[2][0] + matrix[3][0];
    // g
    data[i+1] = image.data[i]*matrix[0][1] + image.data[i+1]*matrix[1][1] +
               image.data[i+2]*matrix[2][1] + matrix[3][1];
    // b
    data[i+2] = image.data[i]*matrix[0][2] + image.data[i+1]*matrix[1][2] +
               image.data[i+2]*matrix[2][2] + matrix[3][2];
    // set 'a' (alpha) value
    data[i+3] = 255;
    i+=4;
  }

  return new ImageData(data, 100, 100);
}

function brighten(b, image) {
  var matrix = [
    [b, 0.0, 0.0, 0.0],
    [0.0, b, 0.0, 0.0],
    [0.0, 0.0, b, 0.0],
    [0.0, 0.0, 0.0, 1.0],
  ];
  return transform(matrix, image);
}

function saturate(s, image) {
  var rwgt = 0.3086,
      gwgt = 0.6094,
      bwgt = 0.0820;

  var a = (1.0-s)*rwgt + s,
      b = (1.0-s)*rwgt,
      c = (1.0-s)*rwgt,
      d = (1.0-s)*gwgt,
      e = (1.0-s)*gwgt + s,
      f = (1.0-s)*gwgt,
      g = (1.0-s)*bwgt,
      h = (1.0-s)*bwgt,
      i = (1.0-s)*bwgt + s;

  var matrix = [
    [a, b, c, 0.0],
    [d, e, f, 0.0],
    [g, h, i, 0.0],
    [0.0, 0.0, 0.0, 1.0],
  ];
  return transform(matrix, image);
}

// Add your own matrix transform!
// Just create a function that accepts a float and an ImageData object
// and returns the result of calling transform() with a matrix and
// the ImageData object.
// Don't forget to add a button and an event listener in doFilter().

function doFilter() {
  var output;
  var imageEl = document.getElementById('sourceimg');

  var tmpcanvas = document.createElement('canvas');
  tmpcanvas.width = 100;
  tmpcanvas.height = 100;
  
  var tmpctx = tmpcanvas.getContext('2d');
  tmpctx.drawImage(imageEl, 0, 0, 100, 100);

  var imageData = tmpctx.getImageData(0, 0, 100, 100);

  var intensity = parseFloat(document.getElementById('intensity').value);

  switch(this.id) {
    case 'saturate':
      output = saturate(intensity, imageData);
      break;
    case 'brighten':
      output = brighten(intensity, imageData);
      break;
    case 'default':
      console.log('No such filter: '+this.id);
  }

  ctx.putImageData(output, 0, 0);
}

function main() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  document.getElementById('saturate').addEventListener('click', doFilter);
  document.getElementById('brighten').addEventListener('click', doFilter);
}

document.addEventListener('DOMContentLoaded', main);
