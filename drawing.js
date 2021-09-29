"use strict";

var gl;
const MAX_POINTS = 50;
var cursor;
var current_point;
var current_n_points = 0;
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
    /*
        Setup the size of the buffer to hold MAX_POINTS number of vec2 objects (for vertices).
        Hint: You can find the size of the types using the sizeof dictionary from MV.js
    */

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizeof['vec4'] * MAX_POINTS, gl.STATIC_DRAW);
    /*
        Setup the size of the buffer to hold MAX_POINTS number of vec4 objects (for color).
        Hint: You can find the size of the types using the sizeof dictionary from MV.js
    */

    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    /*
        Add listeners for mouse actions and the dropdown list
        Make sure that when the page is refreshed, the dropdown list
        is set to the first value in the list.
    */
    canvas.addEventListener("click", function(event){
      // if (current_point !== null) {
      //   var temp = current_point;
      // }
      if (current_n_points < MAX_POINTS) {
        current_n_points++;
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);

        current_point = vec2(2*event.clientX/canvas.width-1,
             2*(canvas.height-event.clientY)/canvas.height-1);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * (current_n_points - 2), flatten(current_point));

        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
        var t = vec4(1.0, 0.0, 0.0, 1.0);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4'] * (current_n_points - 2), flatten(t));

        if (current_n_points >= 2) {
        cursor = null;
        }
      }

    });
    //   if (current_n_points >= 2) {
    //     gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    //     gl.bufferSubData(gl.ARRAY_BUFFER, 8*(current_n_points), flatten(temp));
    //
    //     gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    //     var t = vec4(1.0, 0.0, 0.0, 1.0);
    //     gl.bufferSubData(gl.ARRAY_BUFFER, 16*(current_n_points), flatten(t));
    //
    //   }
    // } );

    canvas.addEventListener("mousemove", function(mouseFollow){
      if (current_n_points === 0) {
        current_n_points = 1;
      }
      gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
      cursor = vec2(2*event.clientX/canvas.width-1,
        2*(canvas.height-event.clientY)/canvas.height-1);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * (current_n_points - 1), flatten(cursor));

      gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
      var t = vec4(1.0, 0.0, 0.0, 1.0);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4'] * (current_n_points - 1), flatten(t));
    });

    render();
}


// Clear screen function on click

/*
    Helper function to convert the mouse coordinates from javascript to clip coordinate space.
    Hint: check the book and the textbook examples on github
*/

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

    /*
        Add logic for rendering lines and the cursor point.
        Use the techniques shown in class to have the function
        render multiple times to show an animation.
    */
    window.requestAnimationFrame(render);
}
