// highly influenced by http://www.html5rocks.com/en/tutorials/audio/scheduling/
var isPlaying = false;
var lookahead = 25.0;
var current16thNote;
var scheduleAheadTime = 0.1;
var notesInQueue = [];
var timerID = 0;

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function nextNote() {
  var secondsPerBeat = 60.0 / tempo;
  nextNoteTime += 0.25 * secondsPerBeat;
  current16thNote++;
  if (current16thNote === 16) {
    current16thNote = 0;
  }
}

function scheduleNote(beatNumber, time, track) {
  notesInQueue.push({note: beatNumber, time: time});
  if (beatNumber % 2 || beatNumber % 4) {
    return;
  }
  track.play(time);
}

function play(track, isPlaying) {
  if (isPlaying) {
    current16thNote = 0;
    nextNoteTime = audioContext.currentTime;
    scheduler(track);
    return "stop";
  } else {
    window.clearTimeout(timerID);
    window.clearTimeout(timerID + 1);
    return "play";
  }
}

function scheduler(track) {
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(current16thNote, nextNoteTime, track);
    nextNote();
  }
  timerID = window.setTimeout(function() { scheduler(track) }, lookahead);
}

function queue() {
  var currentTime = audioContext.currentTime;
  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    notesInQueue.splice(0,1);
  }
  requestAnimFrame(queue);
}
