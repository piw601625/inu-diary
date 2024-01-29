import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Realm from 'realm';
import Navigator from './navigator';
import { DBContext } from './context';

const FeelingSchema = {
  name: 'Feeling',
  properties: {
    _id: 'int',
    emotion: 'string',
    message: 'string',
  },
  primaryKey: '_id',
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    async function prepare() {
      try {
        const connection = await Realm.open({
          path: 'inuDiaryDB',
          schema: [FeelingSchema],
        });

        setRealm(connection);
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
      <View onLayout={onLayoutRootView}></View>
    </DBContext.Provider>
  );
}
