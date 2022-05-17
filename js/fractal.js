function logg(val,base) { return Math.log(val)/Math.log(base); }

window.onload = function() {

    this.reset_button = document.getElementById("reset");
    this.reset_button.addEventListener('click', (event) => resetFractal(event), false);

    function resetFractal() {
        z = 3;
        offset_x = 0;
        offset_y = 0;
        panx = 0;
        pany = 0;
        generateImage();
    }

    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    var width = canvas.width;
    var height = canvas.height;
    var imagedata = context.createImageData(width, height);
 
    var max = 300;

    var z = 3;
    var offset_x = 0;
    var offset_y = 0;
    var panx = 0;
    var pany = 0;

    let points = [ 
        {cr: -0.4, ci: 0.6}, 
        {cr: 0.285, ci: 0},
        {cr: 0.285, ci: 0.01},
        {cr: 0.45, ci: 0.1428},
        {cr: -0.70176 , ci: -0.3842},
        {cr: -0.83 , ci: -0.2321},
        {cr: -0.8 , ci: 0.156},
        {cr: -0.7269 , ci: 0.1889},
        {cr: 0 , ci: -0.8},
        {cr: 0 , ci: 1}
        ];
    

    var state = 9;
    var pre = 9;

    function RadioValue() {
        var ele = document.getElementsByName('Fractal');          
        for(i = 0; i < ele.length; i++) {
            if(ele[i].checked)
                state = ele[i].value;
        }
        if(pre!==state) {
            pre = state;
            reset();
            generateImage();
        }
    }

    function reset() {
        z = 3;
        offset_x = 0;
        offset_y = 0;
        panx = 0;
        pany = 0;
    }

    function init() {
        canvas.addEventListener("mousedown", onMouseDown);
        generateImage();
        main(0);
    }
    
    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);
        RadioValue();
        
        // Draw the generate image
        context.putImageData(imagedata, 0, 0);
    }

    function generateImage() {
        offset_x = offset_x + panx*z/(height);
        offset_y = offset_y - pany*z/(height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                iterate_J(x, y, max, state);
            }
        }
    }

    function iterate_J(x, y, max, state) {
        if(state === "9")
            return iterate_M(x, y, max);
        var i;
        var cr = points[state].cr;
        var ci = points[state].ci;

        var zr = x * z / height;
        zr = offset_x + zr - z / 2 * width / height;
        var a = zr;
        var zi = y * z / height;
        zi = offset_y + z / 2 - zi;
        var b = zi;

        var color;

        for(i = 0; i<max; i++) {
            zr = a*a - b*b + cr;
            zi = 2*a*b + ci;
            a = zr;
            b = zi;
            if(a*a+b*b>=4) 
                break;
        }
        if(i === max)
            color = {r:0, g:0, b:0};
        else {
            color = {r:(2*i)%255+10, g:(i/3)%255+10, b:(i/2)%255+10};
        }

        var pixelindex = (y * width + x) * 4;
        imagedata.data[pixelindex] = color.r;
        imagedata.data[pixelindex+1] = color.g;
        imagedata.data[pixelindex+2] = color.b;
        imagedata.data[pixelindex+3] = 255;
    }

    function iterate_M(x, y, max) {
        var i;
        var zr = 0;
        var zi = 0;
        var a = 0;
        var b = 0;

        var cr = x * z / height;
        cr = offset_x + cr - z / 2 * width / height;
        var ci = y * z / height;
        ci = offset_y + z / 2 - ci;

        var color;

        for(i = 0; i<max; i++) {
            zr = a*a - b*b + cr;
            zi = 2*a*b + ci;
            a = zr;
            b = zi;
            if(a*a + b*b >= 4) 
                break;
        }
        if(i===max)
            color = {
                r: 0,
                g: 0,
                b: 0
            };
        else {
            if(i % 3 === 0) i = 0;
            i = Math.floor(logg(i + 1, 1.0291));
            color = {
                r: (i * i + 2 * i) % 255,
                g: (i / 4) % 255,
                b: i % 255
            };
        }

        var pixelindex = (y * width + x) * 4;
        imagedata.data[pixelindex] = color.r;
        imagedata.data[pixelindex + 1] = color.g;
        imagedata.data[pixelindex + 2] = color.b;
        imagedata.data[pixelindex + 3] = 255;
    }

    function onMouseDown(e) {
        var pos = getMousePos(canvas, e); 
        panx = pos.x - width / 2;
        pany = pos.y - height / 2;
        if(e.ctrlKey)
            z = 81 * z / 49;
        z = 7 * z / 9;
        generateImage();
    }

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }

    init();
};

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}
        
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}   