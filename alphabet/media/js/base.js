
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var czech =   "ěšdčřžýáéíóúň";
var convert = "esdcrzyaeioun";

function c (char){
    ch = char.toLowerCase();
    if (alphabet.indexOf(ch) >= 0) {
        return ch;
    } else {
        i = czech.indexOf(char);
        if (i < 0) { i = 0; }
        return convert.charAt(i);
    }
}

function block (id, char){
    var anim;
    var animData = {
        container: document.getElementById('bodymovin' + id),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        rendererSettings: {
            progressiveLoad:false
        },
        path: '/static/js/source/' + char.toUpperCase() +'.json'
    };
    anim = bodymovin.loadAnimation(animData);
}

$(document).ready(function(){

    $("#interactive-submit").click(function(){
        text = $("#interactive-input").val();
        $("#canvas").empty();
        ww = $("#canvas").width();
        lenght = 0;
        $("#canvas").append("<div id='begin' >&nbsp;</div>");
        for (i = 0; i < text.length; i++){
            char = c(text.charAt(i));
            $("#canvas").append("<div id='bodymovin" + i +"' ></div>");
            anim = block(i, char);
            console.log("print " + char);
            div = $("#bodymovin" + i);
            lenght = lenght + div.width();
        }
        $("#canvas").append("<div class='clearfix' ></div>");
        $("#begin").width((ww - lenght) / 2);

    });
});