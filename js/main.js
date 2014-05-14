var tracks = [
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
var soloedCount = 0;
var audioLoaded = new Event('audioLoaded');

window.addEventListener('audioLoaded', drawMixer, false);

window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioContext = new AudioContext();
var bufferLoader;
var submix;

function drawPads() {
  tracks.forEach(function(name) {
    var key = _.invert(keys)[name];
    $('#mpc').prepend('<div id="' + name + '"><span class="pad-text">' + String.fromCharCode(key) + '</span></div>');
  });
}

function drawMixer() {
  tracks.forEach(function(name) {
    var html = [
      '<div data-track="' + name + '" id="channel-' + name + '" class="strip">',
      '<input type="range" class="fader" value=1 min=0 max=1 step=0.01></input></br>',
      '<button class="mute">Mute</button></br>',
      '<button class="solo">Solo</button></br>',
      '<span class="label">' + name + '</span>',
      '</div>'
    ].join('\n');
    $('#mixer').prepend(html);
  });
  $('#mixer input[type=range]').on('change', changeVolume);
  $('.mute').on('mousedown', mute);
  $('.solo').on('mousedown', solo);
}

function changeVolume(e) {
  var track = $(e.target).parent().attr('data-track');
  window[track].output.gain.value = e.target.value;
}

function solo(e) {
  var $parent = $(e.target).parent();
  var track = $(this).attr('data-track');
  if (!window[track].soloed) {
    window[track].solo();
  } else {
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

function getAudioFiles() {
  var soundFiles = [];
  tracks.forEach(function(name){
    soundFiles.push('../audio/' + name + '.ogg')
  });
  return soundFiles;
}

function loadAudio() {
  submix = audioContext.createGain();
  submix.connect(audioContext.destination);
  bufferLoader = new BufferLoader(
    audioContext,
    getAudioFiles(),
    finishedLoading
  );

  bufferLoader.load();
}

function finishedLoading(bufferList){
  for(var i=0;i<bufferList.length;i++){
    window[bufferList[i].name] = new Track(bufferList[i].name, bufferList[i]);
  }
  window.dispatchEvent(audioLoaded);
}

(function(){
  drawPads();
  loadAudio();
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
  $('.toggle').on('click', function(e) {
    var currentPage = $('.toggle').text();
    $('#mpc').toggleClass('hidden');
    $('#mixer').toggleClass('hidden');
    var newPage = currentPage === 'Mixer' ? 'MPC' : 'Mixer';
    $('.toggle').text(newPage);
  });
}());
