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

window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioContext = new AudioContext();
var bufferLoader;
var submix;

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

function Track(name, buffer) {
  this.track = name;
  this.buffer = buffer;
  this.output = audioContext.createGain();
  this.output.connect(submix);
};

Track.prototype.play = function(){
  var source = audioContext.createBufferSource();
  source.buffer = this.buffer;
  source.connect(this.output);
  source.start(0);
};

function drawPads() {
  tracks.forEach(function(name) {
    var key = _.invert(keys)[name];
    $('#mpc').prepend('<div id="' + name + '"><span class="pad-text">' + String.fromCharCode(key) + '</span></div>');
  });
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

