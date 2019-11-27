let socket = io();

let color1 = '#ff3399';
let color2 = '#33ff99';
let color3 = '#99ff33';
let color4 = '#ff9933';
let color5 = '#3399ff';
let color6 = '#33ffff';
let color7 = '#ffff33';

let clickTags = ['player', 'item', 'creature', 'object', 'exit'];

let tags = [ ['title', color1], ['command', color2], ['creature', color3], ['player', color4], ['item', color5],
    ['object', color6], ['exit', color7, exitClicked] ];

let discoveredPlayers = [];

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.containsAny = function(list) {
  for (let i = 0; i < list.length; i++) {
      if (list[i] === this) {
          return true;
      }
  }
  return false;
};

function setup() {
    let commandInput = document.getElementById('commandInput');
    commandInput.addEventListener("keyup", function(event) {
        if (event.keyCode == 13) {
            sendMessage();
        }
    });
}

function sendMessage() {
    let commandInput = document.getElementById('commandInput');
    socket.emit('send', commandInput.value);
    commandInput.value = "";
}

function displayMainText(text) {
    let mainTextBox = document.getElementById('mainTextBox');
    mainTextBox.innerHTML += '<div>' + parse(text) + '</div>';
    mainTextBox.scrollTop = mainTextBox.scrollHeight;
}

function parse(message) {
    message = message.replaceAll('\n', '<br>');
    for (let i = 0; i < tags.length; i++) {
        message = colorizeTag(message, tags[i][0], tags[i][1]);
    }
    return message;
}

function colorizeTag(message, tag, color) {
    console.log(tag + " " + clickTags);
    if (tag.containsAny(clickTags)) {
        transform(tag);
    }
    message = message.replaceAll(`<${tag}>`, `<font color=${color} onclick="exitClicked(event, '${tag}')">`);
    message = message.replaceAll(`</${tag}>`, '</font>');
    return message;
}

function transform(message, tag, color) {
    let reg = new RegExp(`<${tag}>(.*)<\/${tag}>`, '');
    let result = message.match(reg);
    console.log(result);
    if (!result) return;
    for (let i = 0; i < result.length; i++) {
        console.log(result[i] + "\n");
    }
}

function exitClicked(event, type, value) {
    console.log(event.clientX + " " + event.clientY + " " + type);
}

function look() {
    socket.emit('send', 'look');
}

function inventory() {
    socket.emit('send', 'inventory');
}

socket.on('message', function(message) {
    displayMainText(message)
});