/*
 *   Project for Nelen 2017
 *   author: Pavel Studenik <studenik@varhoo.cz>
 *   Source:  https://github.com/Varhoo/nelen-alphabet
 */

var alphabet = "aábcčdďeéěfghiíjklmnňoópqrřsštuůúvwxyýzž1234567890";
var czech =   " ěšďčřžýáéíóúňů";
var convert = "_esdcrzyaeiounu";
var anim = [];

lock_status = false;

function Lock (){
    lock_status = true;
    $("#interactive-submit").text("...");
}

function IsLock (){
    return (lock_status == true);
}

function Unlock (){
    lock_status = false;
    $("#interactive-submit").text("OK");
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

function initSound(){
     allow = "bjckouy".toUpperCase();
     for(i=0; i < allow.length; i++){
        url = "/static/audio/" + allow[i] + ".wav";
        console.log(url);
        audio = new Audio(url);
     }
}

function playChar(char){
    url = "/static/audio/" + char + ".wav";
    audio = new Audio(url);
    audio.loop = true;
    audio.play();
    return audio;
}

var sounds = [];
function sound(text){
    sounds.forEach(function(element) {
        element.pause();
    });
    sounds = [];
    upper = [];
    text = text.toLowerCase();

    var convert = "abcdefijklmnopqrstuvwxyz";
    var chars =   "-bcok-k-jkubco-c-yu---y-";
    var chars = chars.toUpperCase();
    for (i = 0; i < text.length; i++){
        upper[i] = chars[convert.indexOf(text[i])]
    }
    t = new Set(upper);
    t.delete("-");
    t = Array.from(t).join("");
    for (i = 0; i < 3; i++){
        if (t.length > i){
            sounds[i] = playChar(t[i]);
            sounds[i].play();
            console.log(sounds[i]);
        }
    }
}


function check (time){
    get_data();
    setTimeout(check, 5000, time);
}

function block (id, char){
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
    return bodymovin.loadAnimation(animData);
}

function refresh (){
    /* empty */
}

function put_data(msg, place){
    data = {
        "msg": msg,
        "csrfmiddlewaretoken": getCookie("csrftoken"),
    };
    $.ajax({
        url: '/api/record/' + place,
        type: 'PUT',
        data: data,
        success: function(result) {
            $("#msg-id").val(result["status"]);
        }
    });
}

function get_data(){
     place = $("#msg-space").val();
     last_id = $("#msg-id").val()
     $.ajax({
        url: '/api/record/' + place,
        type: 'GET',
        data: {"id": last_id},
        success: function(result) {
           if (result["msg"].length > 0) {
              obj = JSON.parse(result["msg"]);
              msg = obj[0].fields["message"];
              id = obj[0].pk;
              last_id = $("#msg-id").val(id);
              $("#interactive-input").val(msg);
              update(msg);
           }
        }
    });
}

function update (text){
    Lock();
    sound(text);
    $("#canvas").empty();
    ww = $("#canvas").width();
    lenght = 0;
    anim = [];
    $("#canvas").append("<div id='begin' >&nbsp;</div>");
    for (i = 0; i < text.length; i++){
        char = c(text.charAt(i));
        $("#canvas").append("<div id='bodymovin" + i +"' ></div>");
        anim[i] = block(i, char);
        div = $("#bodymovin" + i);
        lenght = lenght + div.width();
    }
    $("#canvas").append("<div class='clearfix' ></div>");
    $("#begin").width((ww - lenght) / 2);
    window.setTimeout(Unlock, 5000);
}

$(document).ready(function(){
    place = $("#msg-space").val();
    if (place){
        window.setTimeout(check, 5000);
    }
    initSound();
    var url = window.location.href;
    if (url.indexOf('#') > -1) {
        var text = url.substring(url.indexOf('#') + 1);
        $("#interactive-input").val(text);
        update(text);
    }
    $("#interactive-submit").click(function(){
        if (! IsLock()){
            place = $("#msg-space").val();
            text = $("#interactive-input").val();
            put_data(text, place);
            update(text);
        }
    });
}).keypress(function(e) {
    if(e.which == 13) {
        $("#interactive-submit").click();
    }
})