function Track(name, buffer) {
  this.track = name;
  this.buffer = buffer;
  this.output = audioContext.createGain();
  this.output.connect(submix);
};

Track.prototype.play = function() {
  this.source = audioContext.createBufferSource();
  this.source.buffer = this.buffer;
  this.source.connect(this.output);
  this.source.start(0);
};

Track.prototype.mute = function() {
  if (!this.muted) {
    this.muted = true;
    $('#channel-'+this.track+' .mute').css({'color': 'red'});
    this.output.gain.value = 0;
  }
}

Track.prototype.unmute = function(volume) {
  if (this.muted) {
    this.muted = false;
    $('#channel-'+this.track+' .mute').css({'color': 'black'});
    this.output.gain.value = volume || 1;
  }
}
