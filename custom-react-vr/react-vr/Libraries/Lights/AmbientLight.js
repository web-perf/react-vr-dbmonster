/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AmbientLight
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
  backgroundColor: ColorPropType,
});

/**
 * A light that effects all objects in the scene equally and from all directions.
 *
 * The [Wikipedia](https://en.wikipedia.org/wiki/Shading#Ambient_lighting) defintion is as follows
 * An ambient light source represents an omni-directional, fixed-intensity and
 * fixed-color light source that affects all objects in the scene equally. Upon rendering,
 * all objects in the scene are brightened with the specified intensity and color.
 * This type of light source is mainly used to provide the scene with a basic view of the
 * different objects in it. This is the simplest type of lighting to implement and models
 * how light can be scattered or reflected many times producing a uniform effect.
 *
 * Representation of
 *
 * https://threejs.org/docs/index.html#Reference/Lights/AmbientLight
 */
const AmbientLight = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,
    style: stylePropTypes,

    /**
     * Intensity of the light
     */
    intensity: PropTypes.number,
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
      <RKAmbientLight
        {...props}
        testID={this.props.testID}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}>
        {this.props.children}
      </RKAmbientLight>
    );
  }
});

const RKAmbientLight = requireNativeComponent('AmbientLight', AmbientLight, {
  nativeOnly: {
  }
});

module.exports = AmbientLight;
