var audio = [
  'kick',
  'snare',
  'clap',
  'hiHat',
  'kick2',
  'snare2',
  'snaps',
  'openHiHat',
  'hiTom',
  'midTom',
  'lowTom',
  'shaker',
  'longScratch',
  'shortScratch',
  'ride',
  'crash'
];

window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioContext = new AudioContext();
var bufferLoader;

(function(){
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
}());

function Track(name, buffer) {
  this.track = name;
  this.buffer = buffer;
};

Track.prototype.play = function(){
  var source = audioContext.createBufferSource();
  source.buffer = this.buffer;
  source.connect(audioContext.destination);
  source.start(0);
};

function getAudioFiles() {
  var soundFiles = [];
  audio.forEach(function(name){
    soundFiles.push('../audio/' + name + '.ogg')
  });
  return soundFiles;
}

function loadAudio() {
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

