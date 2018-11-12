import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import logo from '../../assets/img/logo.png';

class Splash extends Component {
  componentDidMount = () => {
    setTimeout(() => {
      this.props.navigation.replace('Home');
    }, 2000);
  };

  render = () => (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
    </View>
  );
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    aspectRatio: 1,
  },
});
