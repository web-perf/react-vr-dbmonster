/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule VrHeadModel
 */
'use strict';

import React, {
	NativeModules
} from 'react-native';

var MatrixMath = require('MatrixMath');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var VrMath = require('VrMath');

class VrHeadModelImpl {
  constructor() {
    this.headMatrix = MatrixMath.createIdentityMatrix();
    this.viewMatrix = MatrixMath.createIdentityMatrix();
		this._headMatrixListener = RCTDeviceEventEmitter.addListener( 'onReceivedHeadMatrix', this._onReceivedHeadMatrix.bind(this));
  }

  _onReceivedHeadMatrix(headMatrix, viewMatrix) {
    this.headMatrix = headMatrix;
    this.viewMatrix = viewMatrix;
  }

  positionOfHeadMatrix(headMatrix) {
    const matrix = headMatrix || this.headMatrix;
    return VrMath.getTranslation(matrix);
  }

  rotationOfHeadMatrix(headMatrix, eulerOrder) {
    const matrix = headMatrix || this.headMatrix;
    return VrMath.getRotation(matrix, eulerOrder);
  }
}

module.exports = new VrHeadModelImpl();