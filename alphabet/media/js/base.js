/*
 *   Project for Nelen 2017
 *   author: Pavel Studenik <studenik@varhoo.cz>
 *   Source:  https://github.com/Varhoo/nelen-alphabet
 */

var alphabet = "abcdefghijklmnopqrstuvwxyz";
var czech =   "ěšďčřžýáéíóúň";
var convert = "esdcrzyaeioun";

lock_status = false;

function Lock(){
    lock_status = true;
}

function Unlock(){
    lock_status = false;
}

function c (char){
    ch = char.toLowerCase();
    if (alphabet.indexOf(ch) >= 0) {
        return ch;
    } else {
        var j = czech.indexOf(char);
        if (j < 0) { j = 0; }
        return convert.charAt(j);
    }
}

function check(time){
    setTimeout(check, 1000, time);
}

function stop(){
    $("#canvas div").fadeOut(2000);
}

function block (id, char){
    var animData = {
        container: document.getElementById('bodymovin' + id),
        renderer: 'svg',
        loop: false,
        autoplay: true,
        rendererSettings: {
            progressiveLoad:false
        },
        path: '/static/js/source/' + char.toUpperCase() +'.json'
    };
    return bodymovin.loadAnimation(animData);
}

function update(){
    text = $("#interactive-input").val();
    $("#canvas").empty();
    ww = $("#canvas").width();
    lenght = 0;
    $("#canvas").append("<div id='begin' >&nbsp;</div>");
    for (i = 0; i < text.length; i++){
        char = c(text.charAt(i));
        $("#canvas").append("<div id='bodymovin" + i +"' ></div>");
        anim = block(i, char);
        div = $("#bodymovin" + i);
        lenght = lenght + div.width();
    }
    $("#canvas").append("<div class='clearfix' ></div>");
    $("#begin").width((ww - lenght) / 2);
    setTimeout(stop, 7000);
}

$(document).ready(function(){
    window.setTimeout(check, 1000, 1000);
    var url = window.location.href;
    if (url.indexOf('#') > -1) {
        var hash = url.substring(url.indexOf('#') + 1);
        $("#interactive-input").val(hash);
        update();
    }

    $("#interactive-submit").click(function(){
        update();
    });
}).keypress(function(e) {
    if(e.which == 13) {
        update();
    }
})