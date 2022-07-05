import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import Home from './components/Home';
import Search from './components/Search';
import Help from './components/Help';
import Settings from './components/Settings';

const Stack = createStackNavigator();

import { createStore } from 'redux';
import { Provider, useSelector } from 'react-redux';

const initialState = {
  appInfo: {
    searchEngine: "百度",
    animations: true,
    animationDirection: true,
    disableCookies: false,
    disableJS: false
  }
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case "CHANGE_APPINFO":
      return {appInfo: action.value}
  }
  return state
}

const store = createStore(reducer);

const NavigationContainerComponent = () => {
  const Stack = createStackNavigator();

  const appInfo = useSelector((state) => state.appInfo);

  return (
    <NavigationContainer>
      <Stack.Navigator 
      screenOptions={ appInfo.animationDirection ? {
        
      } : {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}
      initialRouteName={Home}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {

  return (
    <Provider store={store}>
      <NavigationContainerComponent/>
    </Provider>
  );

}

export default App;