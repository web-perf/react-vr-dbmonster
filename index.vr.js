import React from 'react';
import {
  AppRegistry,
  asset,
  StyleSheet,
  Pano,
  Text,
  View,
} from './custom-react-vr/react-vr';

import DBMonster from './app/dbmonster.js'

class App extends React.Component {
  render() {
    return (
      <View>
        <Pano source={asset('chess-world.jpg')}/>
        <DBMonster timeout={0} rows={200}/>
      </View>
    );
  }
};

AppRegistry.registerComponent('DBMonster', () => App);
