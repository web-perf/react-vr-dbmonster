/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule LayoutPropTypes
 * @flow
 */
'use strict';

const ReactPropTypes = require('react/lib/ReactPropTypes');

// We add a few overrides to the original React Native implementation
// Import the original, and add the extra values before re-exporting it
const OriginalLayoutPropTypes = require('react-native/Libraries/StyleSheet/LayoutPropTypes');

const LayoutPropTypes = {
  ...OriginalLayoutPropTypes,

  /**
   * `layoutOrigin` defines how the final top and left locations are determined prior to rendering
   * The equivalent is computing the world location by
   * `style.left` = -layoutOrigin[0] * style.width
   * `style.top` = -layoutOrigin[1] * style.height
   * The advantage is that this is calculated after width and height are computed by flex box meaning that
   * it can be used without prior knowledge of the final layout
   * the default is [0,0]
   */
  layoutOrigin: ReactPropTypes.arrayOf(ReactPropTypes.number),

  /**
   * `animation` defines a native per view version of the `LayoutAnimation`
   * This is currently only availble on the native version of react VR
   */
  animation: ReactPropTypes.object,

  /**
   * `renderGroup` defines a component which is used for depth sorting the
   *  components under it. This is generally used on any component which is position
   *  `absolute` and transformed.
   */
  renderGroup: ReactPropTypes.bool,
};

module.exports = LayoutPropTypes;
