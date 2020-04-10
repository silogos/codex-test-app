import 'react-native-gesture-handler';
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TopStoriesScreen from './screens/TopStories';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Top Stories" component={TopStoriesScreen} />
        <Stack.Screen name="Story Detail" component={() => <View style={{ flex: 1, backgroundColor: 'red' }} ></View>} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
