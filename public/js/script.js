'use strict';

const socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var start_sound = document.getElementById("myAudio");
var end_audio = document.getElementById("myAudio1");

// click on the big listening button on press of space bar
document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode == 32) {
    document.querySelector('button').click()
  }
};

document.querySelector('button').addEventListener('click', () => {
  // change button color
  document.querySelector('button').style.background = "linear-gradient(180deg, #24760e 0%, #52d524 80%, #29c839 100%)";

  try {
    recognition.start();

  } catch (e) { // if recogination is already started, starting again will genrate error, so in this case stop it; toggle recogination
    console.log("error")
    // change button color
    document.querySelector('button').style.background = "linear-gradient(180deg, #8d1b1b 0%, #ff0000 80%, #ff0000 100%)";

    // play end audio
    end_audio.play();
  }

  // play start sound
  start_sound.play();

});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  // change button color
  document.querySelector('button').style.background = "linear-gradient(180deg, #8d1b1b 0%, #ff0000 80%, #ff0000 100%)";

  // play end audio
  end_audio.play();

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
  end_audio.play();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});


function synthVoice(text) {

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  // utterance.voice = voices[1] // microsoft zira

  // // not using this anymore due to bad user experiance 
  // utterance.onend = function (event) {
  //   console.log("ended");
  //   document.querySelector('button').click()
  // };

  synth.speak(utterance);

  document.querySelector('button').addEventListener('click', () => {
    if (synth) synth.cancel() // cancel speaking when user press button again to start talking
  })



}

socket.on('bot reply', function (replyText) {

  if (replyText == '') replyText = '(No answer)';
  outputBot.textContent = replyText;

  synthVoice(replyText);
});
