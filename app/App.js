import React, { useRef, useState, useCallback, useEffect } from "react";
import { BackHandler, Text, StyleSheet, SafeAreaView  } from "react-native";
import { WebView } from "react-native-webview";

import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const [isOffline, setOfflineStatus] = useState(false);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  const webView = useRef();
  const [nativeEvent, setNativeEvent] = useState(false);

  const handleBack = useCallback(() => {
    console.log(nativeEvent)
    if(nativeEvent.url=='https://sistemadecontroledemaquinas.web.app/'){
      BackHandler.exitApp();
    }
    if (nativeEvent.canGoBack && webView.current) {
      webView.current.goBack();
      return true;
    }
    return false;
  }, [nativeEvent]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [handleBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {
        (!isOffline) ?
          <WebView
            cacheEnabled={false}
            style={styles.view}
            ref={webView}
            source={{ uri: 'https://segurocontrol001.web.app/' }}
            onLoadProgress={(event) => setNativeEvent(event.nativeEvent)}
          />
          :
          <>
            <Text style={styles.info_internet}>
              <MaterialCommunityIcons name="wifi-strength-off-outline" size={48} color="black" />
              Sem conexão com a internet!
            </Text>
          </>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24
  },
  info_internet: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18
  }
});
