"use strict";

var gl;
const MAX_POINTS = 50;
var cursor;
var current_point;
var current_n_points = 1;
var color_index = 0;

var colors = [

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0)   // cyan

];
var selected_color = colors[color_index];
window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizeof['vec2'] * MAX_POINTS, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizeof['vec4'] * MAX_POINTS, gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);


    // listener for mouse-moving events
    canvas.addEventListener("mousemove", function(mouseFollow){
      gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
      cursor = convertToClipCoordinates(event.clientX, event.clientY,
                                        canvas.width, canvas.height);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * (current_n_points - 1),
                       flatten(cursor));

      gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4'] * (current_n_points - 1),
                       flatten(selected_color));
    });

    // listener for mouse-clicking events
    canvas.addEventListener("click", function(event){
      if (current_n_points < MAX_POINTS) {
        current_n_points++;
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);

        current_point = convertToClipCoordinates(event.clientX, event.clientY,
                                                 canvas.width, canvas.height);
        gl.bufferSubData(gl.ARRAY_BUFFER,
                         sizeof['vec2'] * (current_n_points - 2),
                         flatten(current_point));

        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
        var t = vec4(1.0, 0.0, 0.0, 1.0);
        gl.bufferSubData(gl.ARRAY_BUFFER,
                         sizeof['vec4'] * (current_n_points - 2),
                         flatten(selected_color));

        if (current_n_points >= 2) {
        cursor = null;
        }
      }
    });

    // listener for color-changing events
    let color_droplist = document.getElementById("colors");
    color_droplist.addEventListener("click", function() {
       color_index = color_droplist.selectedIndex;
       selected_color = colors[color_index];
    });
    render();
}


// Clear screen function on click
function reset() {
  gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
  gl.clear(gl.COLOR_BUFFER_BIT);
  current_point = null;
  cursor = null;
  current_n_points = 1;
  render();
}


/*
    Helper function to convert the mouse coordinates from javascript
    to clip coordinate space.
*/
function convertToClipCoordinates(x_value, y_value, canvas_width, canvas_height)
{
  return vec2(2*x_value/canvas_width-1,
              2*(canvas_height-y_value)/canvas_height-1);
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    if (cursor != null) {
      gl.drawArrays(gl.POINTS, current_n_points - 1, 1);
    }
    if (current_n_points >= 2 & cursor != null) {
      gl.drawArrays(gl.LINES, current_n_points - 2, 2);
    }
    if (current_n_points >= 3) {
      gl.drawArrays(gl.LINE_STRIP, 0, current_n_points - 1);
    }
    window.requestAnimationFrame(render);
}
