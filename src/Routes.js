import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Splash from './screens/splash/Splash';
import Home from './screens/home/Home';

export default (Routes = () => {
  NavigationContainer = createStackNavigator(
    {
      Splash: {
        screen: Splash,
      },
      Home: {
        screen: Home,
      },
    },
    {
      navigationOptions: {
        header: null,
      },
    }
  );
  return <NavigationContainer />;
});
