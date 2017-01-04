/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PointLight
 */
'use strict';

const ColorPropType = require('ColorPropType');
const NativeMethodsMixin = require('react/lib/NativeMethodsMixin');
const PropTypes = require('react/lib/ReactPropTypes');
const React = require('React');
const ReactNative = require('ReactNative');
const View = require('View');
const StyleSheetPropType = require('StyleSheetPropType');
const LayoutAndTransformPropTypes = require('LayoutAndTransformPropTypes');

const requireNativeComponent = require('requireNativeComponent');

const stylePropTypes = StyleSheetPropType({
  ...LayoutAndTransformPropTypes,
  color: ColorPropType,
});

/**
 * Light originates from a single point, and spreads outward in all directions.
 *
 * Representation of
 * https://threejs.org/docs/index.html#Reference/Lights/PointLight
 */
const PointLight = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,
    style: stylePropTypes,

    /**
     * In "physically correct" mode, the product of color * intensity is interpreted as luminous intensity measured in candela.
     */
    intensity: PropTypes.number,
    /**
     * If non-zero, light will attenuate linearly from maximum intensity at light position down to zero at distance.
     */
    distance: PropTypes.number,
    /**
     * The amount the light dims along the distance of the light
     * In "physically correct" mode, decay = 2 leads to physically realistic light falloff.
     */
    decay: PropTypes.number,
  },

  getDefaultProps: function() {
    return {
    };
  },
  render: function() {
    var props = {...this.props} || {};
    props.style = props.style || {};
    if (!props.style.position) {
      props.style.position = 'absolute';
    }
    return (
      <RKPointLight
        {...props}
        testID={this.props.testID}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}>
        {this.props.children}
      </RKPointLight>
    );
  }
});

const RKPointLight = requireNativeComponent('PointLight', PointLight, {
  nativeOnly: {
  }
});

module.exports = PointLight;