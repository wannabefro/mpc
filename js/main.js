var trackNames = [
  'hiHat',
  'clap',
  'snare',
  'kick',
  'openHiHat',
  'snaps',
  'snare2',
  'kick2',
  'shaker',
  'lowTom',
  'midTom',
  'hiTom',
  'crash',
  'ride',
  'shortScratch',
  'longScratch'
];

var extras = [
  'click'
];

var tracks = [];

var soloedCount = 0;
var audioLoaded = new Event('audioLoaded');
var metronomeInterval;

window.addEventListener('audioLoaded', drawMixer, false);
window.addEventListener('tempoChanged', updateTempo, false);

window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioContext = new AudioContext();
var submix = audioContext.createGain();
submix.connect(audioContext.destination);
var bufferLoader;
var submix;
var tempo = 120;

function drawPads() {
  trackNames.forEach(function(name) {
    var key = _.invert(keys)[name];
    $('#mpc').prepend('<div id="' + name + '"><span class="pad-text">' + String.fromCharCode(key) + '</span></div>');
  });
}

function drawMixer() {
  trackNames.forEach(function(name) {
    var html = [
      '<div data-track="' + name + '" id="channel-' + name + '" class="strip">',
      '<input type="range" class="fader" value=1 min=0 max=1 step=0.01></input></br>',
      '<input type="range" class="pan" value=0 min=-1 max=1 step="any"></input></br>',
      '<button class="mute">Mute</button></br>',
      '<button class="solo">Solo</button></br>',
      '<span class="label">' + name + '</span>',
      '</div>'
    ].join('\n');
    $('#mixer').prepend(html);
  });
  $('#mixer .fader').on('change', changeVolume);
  $('#mixer .pan').on('change', changePan);
  $('.mute').on('mousedown', mute);
  $('.solo').on('mousedown', solo);
}

function updateTempo() {
  $('#tempo').html('<p>' + tempo + 'bpm</p>');
}

function changeVolume(e) {
  var track = $(e.target).parent().attr('data-track');
  window[track].output.gain.value = e.target.value;
}

function changePan(e) {
  var track = $(e.target).parent().attr('data-track');
  window[track].pan(e.target.value);
}

function solo(e) {
  var $parent = $(e.target).parent();
  var track = $parent.attr('data-track');
  if (!window[track].soloed) {
    window[track].solo();
  } else {
    window[track].unsolo();
  }
}

function mute(e) {
  var $parent = $(e.target).parent();
  var track = $parent.attr('data-track');
  var fader = $parent.find('.fader');
  if (!window[track].muted) {
    window[track].mute();
  } else {
    window[track].unmute(fader.val());
  }
}

function getAudioFiles(audio) {
  var soundFiles = [];
  audio.forEach(function(name){
    soundFiles.push('../audio/' + name + '.ogg')
  });
  return soundFiles;
}

function loadAudio() {
  bufferLoader = new BufferLoader(
    audioContext,
    getAudioFiles(trackNames),
    finishedLoading
  );
  window.dispatchEvent(audioLoaded);
  bufferLoader.load();
}

function loadExtras() {
  bufferLoader = new BufferLoader(
    audioContext,
    getAudioFiles(extras),
    finishedLoading
  );
  bufferLoader.load();
}

function finishedLoading(bufferList){
  for(var i=0;i<bufferList.length;i++){
    window[bufferList[i].name] = new Track(bufferList[i].name, bufferList[i]);
    tracks.push(window[bufferList[i].name]);
  }
}

function metronome() {
  this.playing = !this.playing;
  var beat = (60 / tempo);
  if (this.playing) {
    this.interval = setInterval(function() {
      click.play();
    }, 500);
  } else {
    clearInterval(this.interval);
  }
}

function changePage() {
  var currentPage = $('.toggle').text();
  $('#mpc').toggleClass('hidden');
  $('#mixer').toggleClass('hidden');
  var newPage = currentPage === 'Mixer' ? 'MPC' : 'Mixer';
  $('.toggle').text(newPage);
}

(function(){
  drawPads();
  loadAudio();
  loadExtras();
  $('#mpc').on('click', function(e) {
    if ($(e.target).is("span")) {
      var pad = $(e.target).parent();
    } else {
      var pad = $(e.target);
    }
    var track = pad.attr('id');
    window[track].play();
  });
  $(document).on('keydown', function(e) {
    var track = keys[e.keyCode];
    window[track].play();
  });
  $('#clear').on('click', function() {
    Track.clear();
  });
  $('#reset').on('click', function() {
    Track.reset();
  });
  $('.toggle').on('click', changePage);
  $('#metronome').on('click', metronome);
}());
