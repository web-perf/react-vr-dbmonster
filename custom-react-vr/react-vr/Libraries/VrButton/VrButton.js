/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule VrButton
 */
'use strict';

const PropTypes = require('react/lib/ReactPropTypes');
const React = require('React');
const View = require('View');
const StyleSheetPropType = require('StyleSheetPropType');
const ViewStylePropTypes = require('ViewStylePropTypes');

const keyMirror = require('fbjs/lib/keyMirror');

var States = keyMirror({
  FOCUS_OUT: null,
  FOCUS_IN: null,
  FOCUS_IN_PRESS: null,
  FOCUS_IN_LONG_PRESS: null,
  ERROR: null
});

/**
 * Quick lookup for states that are considered to be "pressing"
 */
var IsPressingIn = {
  FOCUS_IN_PRESS: true,
  FOCUS_IN_LONG_PRESS: true,
};

/**
 * Quick lookup for states that are considered to be "long pressing"
 */
var IsLongPressingIn = {
  FOCUS_IN_LONG_PRESS: true,
};

/**
 * Inputs to the state machine.
 */
var Signals = keyMirror({
  ENTER: null,
  EXIT: null,
  KEY_PRESSED: null,
  KEY_RELEASED: null,
  LONG_PRESS_DETECTED: null,
});

/**
 * Mapping from States x Signals => States
 */
var Transitions = {
  FOCUS_OUT: {
    ENTER: States.FOCUS_IN,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_OUT,
    KEY_RELEASED: States.FOCUS_OUT,
    LONG_PRESS_DETECTED: States.ERROR,
  },
  FOCUS_IN: {
    ENTER: States.FOCUS_IN,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_IN_PRESS,
    KEY_RELEASED: States.FOCUS_IN,
    LONG_PRESS_DETECTED: States.ERROR,
  },
  FOCUS_IN_PRESS: {
    ENTER: States.FOCUS_IN_PRESS,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_IN_PRESS,
    KEY_RELEASED: States.FOCUS_IN,
    LONG_PRESS_DETECTED: States.FOCUS_IN_LONG_PRESS,
  },
  FOCUS_IN_LONG_PRESS: {
    ENTER: States.FOCUS_IN_LONG_PRESS,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_IN_LONG_PRESS,
    KEY_RELEASED: States.FOCUS_IN,
    LONG_PRESS_DETECTED: States.FOCUS_IN_LONG_PRESS,
  },
  ERROR: {
    ENTER: States.FOCUS_IN,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_OUT,
    KEY_RELEASED: States.FOCUS_OUT,
    LONG_PRESS_DETECTED: States.FOCUS_OUT,
  },
};

var LONG_PRESS_THRESHOLD = 500;

/**
 * This Component is a helper for managing the interaction state machine for a gaze button.
 * By default, a VrButton has no appearance and will only act as a wrapper to
 * capture events, but it can be styled in the same ways as a View.
 *
 *```
 * <VrButton
 *   style={{width: 0.7}}
 *   onClick={()=>this._onViewClicked()}>
 *   <Image style={{width:1, height:1}}
 *     source={{uri:'../../Assets/Images/gaze_cursor_cross_hi.png'}}
 *     inset={[0.2,0.2,0.2,0.2]}
 *     insetSize={[0.05,0.45,0.55,0.15]} >
 *   </Image>
 * </VrButton>
 *```
 *
 * The State Machine for button state.
 * ```
 * +-------------+
 * |  FOCUS_OUT  | <---------------------------------------------------------+
 * +-------------+ <--------------------+                                    |
 *   +        ^                         |                                    |
 *   | ENTER  | EXIT                    | EXIT                           EXIT|
 *   v        +                         +                                    +
 * +-----------+  KEY_PRESSED  +----------------+ LONG DELAY+---------------------+
 * | FOCUS_IN  | +-----------> | FOCUS_IN_PRESS | +-------> | FOCUS_IN_LONG_PRESS |
 * +-----------+               +----------------+           +---------------------+
 *   ^        ^                         +                                    +
 *   |        |     KEY_RELEASED        |                                    |
 *   |        +-------------------------+          KEY_RELEASED              |
 *   +-----------------------------------------------------------------------+
 *
 * Standard component dipatching click events
 * These input event will be considered as primary key and handled by VrButton
 *  - Button A on XBOX Gamepad
 *  - Space button on keyboard
 *  - Left click on Mouse
 *  - Touch on screen
 * ```
 */
var VrButton = React.createClass({

  propTypes: {
    ...View.propTypes,
    style: StyleSheetPropType(ViewStylePropTypes),

    /**
     * If `true`, this component can't be interacted with.
     */
    disabled: PropTypes.bool,

    /**
     * Invoked on short click event or if no long click handler
     */
    onClick: PropTypes.func,

    /**
     * Invoked on long click event
     */
    onLongClick: PropTypes.func,

    /**
     * Custom delay time for long click
     */
    longClickDelayMS: PropTypes.number,

    /**
     * Invoked when button hit enters
     */
    onEnter: PropTypes.func,

    /**
     * Invoked when button hit exits
     */
    onExit: PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      disabled: false,
    };
  },

  getInitialState: function() {
    return {
      buttonState: States.FOCUS_OUT,
    };
  },

  componentWillUnmount: function() {
    this.longPressDelayTimeout && clearTimeout(this.longPressDelayTimeout);
  },

  /**
   * Verify whether a input event is a key released event for VrButton
   *
   * @param event - the input event
   */
  _isKeyReleased: function(event) {
    // Currently WebVR can only recognize XboxController as 'standard' mapping. But it seems key 0 is the primary key
    // for most gamepad controller. We should revisit this once the functionality of mapping is fully implemented.
    return (event.type === 'GamepadInputEvent' && event.buttonId === 0 && event.keyEventType === 'keyup')
      || (event.type === 'KeyboardInputEvent' && event.code === 'Space' && event.keyEventType === 'keyup')
      || (event.type === 'MouseInputEvent' && event.button === 0 && event.mouseEventType === 'mouseup')
      || (event.type === 'TouchInputEvent' && event.touchEventType === 'touchend');
  },

  /**
   * Verify whether a input event is a key pressed event for VrButton
   *
   * @param event - the input event
   */
  _isKeyPressed: function(event) {
    // Currently WebVR can only recognize XboxController as 'standard' mapping. But it seems key 0 is the primary key
    // for most gamepad controller. We should revisit this once the functionality of mapping is fully implemented.
    return (event.type === 'GamepadInputEvent' && event.buttonId === 0 && event.keyEventType === 'keydown' && !event.repeat)
      || (event.type === 'KeyboardInputEvent' && event.code === 'Space' && event.keyEventType === 'keydown' && !event.repeat)
      || (event.type === 'MouseInputEvent' && event.button === 0 && event.mouseEventType === 'mousedown')
      || (event.type === 'TouchInputEvent' && (event.touchEventType === 'touchstart' || event.touchEventType === 'touchmove'));
  },

  _onInput: function(event) {
    if (this.props.disabled) {
      return;
    }

    if (this._isKeyReleased(event.nativeEvent.inputEvent)) {
      this._receiveSignal(Signals.KEY_RELEASED, event);
    } else if (this._isKeyPressed(event.nativeEvent.inputEvent)) {
      this._receiveSignal(Signals.KEY_PRESSED, event);
    }
  },

  _onEnter: function(event) {
    if (this.props.disabled) {
      return;
    }

    this._receiveSignal(Signals.ENTER, event);
    this.props.onEnter && this.props.onEnter(event);
  },

  _onExit: function(event) {
    if (this.props.disabled) {
      return;
    }

    this._receiveSignal(Signals.EXIT, event);
    this.props.onExit && this.props.onExit(event);
  },

  _cancelLongPressDelayTimeout: function () {
    this.longPressDelayTimeout && clearTimeout(this.longPressDelayTimeout);
    this.longPressDelayTimeout = null;
  },

  _handleLongDelay: function(event) {
    this.longPressDelayTimeout = null;
    var curState = this.state.buttonState;
    if (!IsPressingIn[curState]) {
      console.error('Attempted to transition from state `' + curState + '` to `' +
        States.FOCUS_IN_LONG_PRESS + '`, which is not supported. This is ' +
        'most likely due to `VrButton.longPressDelayTimeout` not being cancelled.');
    } else {
      this._receiveSignal(Signals.LONG_PRESS_DETECTED, event);
    }
  },

  /**
   * Receives a state machine signal, performs side effects of the transition
   * and stores the new state. Validates the transition as well.
   *
   * @param signal - State machine signal.
   */
  _receiveSignal: function(signal, event) {
    var curState = this.state.buttonState;
    var nextState = Transitions[curState] && Transitions[curState][signal];
    if (!nextState) {
      console.error('Unrecognized signal `' + signal + '` or state `' + curState);
    }
    if (nextState === States.ERROR) {
      console.error('VrButton cannot transition from `' + curState + '` to `' + signal);
    }
    if (curState !== nextState) {
      this._performSideEffectsForTransition(curState, nextState, signal, event);
      this.state.buttonState = nextState;
    }
  },

  /**
   * Perform side effects for transition between button states
   *
   * @param curState - Current Touchable state.
   * @param nextState - Next Touchable state.
   * @param signal - Signal that triggered the transition.
   * @param event - Native event.
   */
  _performSideEffectsForTransition: function(curState, nextState, signal, event) {
    // Cancel long press timeout if lost focus or key released.
    const isFinalSignal = signal === Signals.EXIT || signal === Signals.KEY_RELEASED;
    if (isFinalSignal) {
      this._cancelLongPressDelayTimeout();
    }

    // Set long press timeout
    if (!IsPressingIn[curState] && IsPressingIn[nextState] && signal === Signals.KEY_PRESSED) {
      this._cancelLongPressDelayTimeout();
      const longDelayMS = this.props.longClickDelayMS ? Math.max(this.props.longClickDelayMS, 10) : LONG_PRESS_THRESHOLD;
      this.longPressDelayTimeout = setTimeout(this._handleLongDelay.bind(this, event), longDelayMS );
    }

    // Dispatch click events
    if (IsPressingIn[curState] && signal === Signals.KEY_RELEASED) {
      if (IsLongPressingIn[curState] && this.props.onLongClick) {
        this.props.onLongClick(event);
      } else {
        this.props.onClick && this.props.onClick(event);
      }
    }
  },

  /**
   * Reset button state to FOCUS_OUT if button is disabled
   */
  _resetButtonState: function() {
    this._cancelLongPressDelayTimeout();
    this.state.buttonState = States.FOCUS_OUT;
  },

  render: function() {
    if (this.props.disabled) {
      this._resetButtonState();
    }
    return (
      <View
        {...this.props}
        onInput={this._onInput}
        onEnter={this._onEnter}
        onExit={this._onExit}
        testID={this.props.testID}>
        {this.props.children}
      </View>
    );
  }
});

module.exports = VrButton;
