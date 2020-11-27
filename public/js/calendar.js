
var p = document.getElementById("prev");
var ctx = p.getContext("2d");
ctx.lineWidth=5;
ctx.moveTo(25,5);
ctx.lineTo(0,20);
ctx.stroke();
ctx.moveTo(0,20);
ctx.lineTo(25,35);
ctx.stroke();
var n = document.getElementById("next");
ctx = n.getContext("2d");
ctx.lineWidth=5;
ctx.moveTo(5,5);
ctx.lineTo(30,20);
ctx.stroke();
ctx.moveTo(30,20);
ctx.lineTo(5,35);
ctx.stroke();

