function Track(name, buffer) {
  this.track = name;
  this.buffer = buffer;
  this.soloed = false;
  this.muted = false;
  this.output = audioContext.createGain();
  this.panner = audioContext.createPanner();
  this.panner.panningModel = 'equalpower';
  this.output.connect(this.panner);
  this.panner.connect(submix);
};

Track.prototype.play = function() {
  this.source = audioContext.createBufferSource();
  this.source.buffer = this.buffer;
  this.source.connect(this.output);
  this.source.start(0);
};

Track.clear = function() {
  tracks.forEach(function(track) {
    track.unmute();track.unsolo()
  });
}

Track.reset = function() {
  Track.clear();
  tracks.forEach(function(track) {
    track.source = null;
    track.output.gain.value = 1;
    $('#channel-'+track.track+' .fader').val(1);
  });
}

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

Track.prototype.pan = function(amount) {
  var x = amount,
      y = 0,
      z = 1 - Math.abs(x);
  this.panner.setPosition(x, y, z);
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
