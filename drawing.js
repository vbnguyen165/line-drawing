"use strict";

var gl;
const MAX_POINTS = 50;

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
    /*
        Setup the size of the buffer to hold MAX_POINTS number of vec2 objects (for vertices).
        Hint: You can find the size of the types using the sizeof dictionary from MV.js
    */

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
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

    render();
}


// Clear screen function on click

/*
    Helper function to convert the mouse coordinates from javascript to clip coordinate space.
    Hint: check the book and the textbook examples on github
*/

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    /*
        Add logic for rendering lines and the cursor point.
        Use the techniques shown in class to have the function 
        render multiple times to show an animation.
    */
}
