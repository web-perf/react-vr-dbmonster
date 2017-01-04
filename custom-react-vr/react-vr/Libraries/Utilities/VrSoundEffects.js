/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule VrSoundEffects
 */
'use strict';

import React, {
	NativeModules
} from 'react-native';

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var AudioModule = NativeModules.AudioModule;

export type SoundEffect = {
  handle: string,
  src: string,
  config: Object,
};

class VrSoundEffectsImpl {
  constructor() {
    this.cachedSoundEffects = {};
    this.onAudioEnded = undefined;

		this._audioReadyListener = RCTDeviceEventEmitter.addListener( 'onAudioReady', this._onAudioReady.bind(this));
    this._audioEndedListener = RCTDeviceEventEmitter.addListener( 'onAudioEnded', this._onAudioEnded.bind(this));
  }
  cacheSoundEffects(sound) {
  	this.cachedSoundEffects[sound.handle] = sound;
		this.cachedSoundEffects[sound.handle].ready = false;
		AudioModule.addHandle(sound.handle, sound.config);
		AudioModule.setUrl(sound.handle, sound.src);
		AudioModule.load(sound.handle);
  }
  _onAudioReady(handle) {
    if (this.cachedSoundEffects[handle]) {
      this.cachedSoundEffects[handle].ready = true;
    }
  }
  _onAudioEnded(handle) {
    if (this.cachedSoundEffects[handle]) {
      this.onAudioEnded && this.onAudioEnded(handle);
    }
  }
  play(handle) {
		if (this.cachedSoundEffects[handle] && this.cachedSoundEffects[handle].ready) {
      AudioModule.play(handle)
    }
	}
	stop(handle) {
		if (this.cachedSoundEffects[handle] && this.cachedSoundEffects[handle].ready) {
      AudioModule.stop(handle)
    }
	}
	dispose(handle) {
		if (this.cachedSoundEffects[handle]) {
      AudioModule.dispose(handle);
    }
  }
}

module.exports = new VrSoundEffectsImpl();