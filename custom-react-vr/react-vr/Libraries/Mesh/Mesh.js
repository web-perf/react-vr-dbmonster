/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Mesh
 */
'use strict';

const ColorPropType = require('ColorPropType');
const NativeMethodsMixin = require('react/lib/NativeMethodsMixin');
const PropTypes = require('react/lib/ReactPropTypes');
const React = require('React');
const ReactNative = require('ReactNative');
const View = require('View');
const VrSceneManager = require('NativeModules').VrSceneManager;
const StyleSheetPropType = require('StyleSheetPropType');
const LayoutAndTransformPropTypes = require('LayoutAndTransformPropTypes');
const processColor = require('processColor');
const requireNativeComponent = require('requireNativeComponent');
const resolveAssetSource = require('resolveAssetSource');

/**
 * A triangle mesh is a collection of vertices, edges and faces that defines
 * the shape of a polyhedral object in React VR.
 *
 * ReactVR supports the [Wavefront OBJ file format](https://en.wikipedia.org/wiki/Wavefront_.obj_file)
 *
 * ```
 * <Mesh
 *   source={{mesh:'cube.obj', mtl:'cube.mtl'}}
 * />
 * ```
 *
 * ```
 * <Mesh
 *   source={{mesh:'cube.obj', texture:'cube.jpg'}}
 * />
 * ```
 *
 * by default this is `postion:'absolute'`
 */
const Mesh = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,
    style: StyleSheetPropType(LayoutAndTransformPropTypes),
    /**
     * source mesh in the wavefron obj format
     * `{mesh: 'http', texture: 'http' }`
     * or
     * `{mesh: 'http', mtl: 'http' }` for a mesh with material
     */
    source: PropTypes.object,
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
    if ( props.source ) {
      if (typeof props.source.mesh === 'number') {
        props.source.mesh = resolveAssetSource(props.source.mesh).uri;
      }
      if (typeof props.source.texture === 'number') {
        props.source.texture = resolveAssetSource(props.source.texture).uri;
      }
      if (typeof props.source.mtl === 'number') {
        props.source.mtl = resolveAssetSource(props.source.mtl).uri;
      }
    }
    // default meshes to being a render group
    if (!props.style.renderGroup) {
      props.style.renderGroup = true;
    }
    return (
      <RKMesh
        {...props}
        testID={this.props.testID}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}>
        {this.props.children}
      </RKMesh>
    );
  }
});

const RKMesh = requireNativeComponent('Mesh', Mesh, {
  nativeOnly: {
  }
});

module.exports = Mesh;
