function Track(name, buffer) {
  this.track = name;
  this.buffer = buffer;
  this.soloed = false;
  this.muted = false;
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
    if (this.soloed) {
      this.unsolo();
    }
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

Track.prototype.solo = function() {
  if (!this.soloed) {
    this.soloed = true;
    if (this.muted) {
      this.unmute();
    }
    $('#channel-'+this.track+' .solo').css({'color': 'yellow'});
    tracks.filter(function(track){return track.soloed === false}).forEach(function(track) {
      track.mute();
    });
  }
}

Track.prototype.unsolo = function() {
  if (this.soloed) {
    this.soloed = false;
    $('#channel-'+this.track+' .solo').css({'color': 'black'});
    soloedTracks = tracks.filter(function(track){return track.soloed === true});
    if (soloedTracks.length <= 0) {
      tracks.forEach(function(track){track.unmute()});
    } else {
      tracks.filter(function(track){return track.soloed === false}).forEach(function(track) {
        track.mute();
      });
    }
  }
}
