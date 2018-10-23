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

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
  start_sound.play();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

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
  utterance.voice = speechSynthesis.getVoices().filter(function (voice) {
    return voice.name == "Google US English";
  })[0];
  // for local change string with this one "Microsoft Zira Desktop - English (United States)"
  synth.speak(utterance);
}

socket.on('bot reply', function (replyText) {
  synthVoice(replyText);

  if (replyText == '') replyText = '(No answer)';
  outputBot.textContent = replyText;
});
