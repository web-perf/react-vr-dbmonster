/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Scene
 */
'use strict';

const NativeMethodsMixin = require('react/lib/NativeMethodsMixin');
const PropTypes = require('react/lib/ReactPropTypes');
const React = require('React');
const requireNativeComponent = require('requireNativeComponent');
const ReactNativeViewAttributes = require('ReactNativeViewAttributes');
const StaticContainer = require('StaticContainer.react');
const View = require('View');
const StyleSheetPropType = require('StyleSheetPropType');
const LayoutAndTransformPropTypes = require('LayoutAndTransformPropTypes');

/**
 * The Scene transform represents the camera location in the world
 *
 * There should only be a single Scene node within a React VR view tree and
 * the transform of a Scene node, rather the affecting the children is the transform
 * of the camera in the scene.
 */
var Scene = React.createClass({
  mixins: [NativeMethodsMixin],

  viewConfig: {
    uiViewClassName: 'Scene',
    validAttributes: ReactNativeViewAttributes.RCTView
  },

  propTypes: {
    ...View.propTypes,
    style: StyleSheetPropType(LayoutAndTransformPropTypes),
    /**
     */
  },

  getDefaultProps: function() {
    return {
    };
  },

  render: function() {
    // StaticContainer is use to prevent propagtion of any state changes up the view hierarchy
    // the viewer transform change is handled via the runtime
    return (
      <RKScene
        {...this.props}
        testID={this.props.testID}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}>
        <StaticContainer>
          <View>
            {this.props.children}
          </View>
        </StaticContainer>
      </RKScene>
    );
  }
});

var RKScene = requireNativeComponent('Scene', Scene, {
  nativeOnly: {
  }
});

module.exports = Scene;
