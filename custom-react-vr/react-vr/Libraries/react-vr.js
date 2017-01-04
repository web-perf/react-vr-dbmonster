/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

 // Entry point for the react-vr npm module

const ReactVR = {
  // React Native overrides
  get View() { return require('View'); },
  get Image() { return require('Image'); },
  get Text() { return require('Text'); },

  // VR Components and modules
  get AmbientLight() { return require('AmbientLight'); },
  get DirectionalLight() { return require('DirectionalLight'); },
  get PointLight() { return require('PointLight'); },
  get SpotLight() { return require('SpotLight'); },
  get Mesh() { return require('Mesh'); },
  get Pano() { return require('Pano'); },
  get Scene() { return require('Scene'); },
  get VrAnimated() { return require('VrAnimated'); },
  get VrButton() { return require('VrButton'); },
  get VrHeadModel() { return require('VrHeadModel'); },

  // React VR-specific utilities
  get asset() { return require('asset'); },

  // Direct access to RN properties
  get Animated() { return require('Animated'); },
  get AppRegistry() { return require('AppRegistry'); },
  get AsyncStorage() { return require('AsyncStorage'); },
  get NativeModules() { return require('NativeModules'); },
  get StyleSheet() { return require('StyleSheet'); },
};

module.exports = ReactVR;
