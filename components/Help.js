import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import 'react-native-gesture-handler';

import IonicIcon from 'react-native-vector-icons/Ionicons';

import styles from "./styles/HelpStyle.js";

const Help = ({ navigation, route }) => {
  
  // ["#282C34FF", "#FFFFFFFF"]
  const styleTypes = ['default','dark-content', 'light-content'];
  const [statusColor, setStatusColor] = useState("#FFFFFFFF");
  const [styleStatusBar, setStyleStatusBar] = useState(styleTypes[3]);

  const [webViewShow, setWebViewShow] = useState(false);

  const [currentUrl, setCurrentUrl] = useState("https://videotogether.github.io/");

  useEffect(() => {
    setCurrentUrl("https://videotogether.github.io/");
  }, []);

  useEffect(() => {
    navigation.addListener("blur",
    () => {
      setStatusColor("#FFFFFFFF");
      setStyleStatusBar(styleTypes[3]);
    }
  );
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setWebViewShow(true);
    }, 200);
  }, []);

  return (
    <SafeAreaView>
    <StatusBar backgroundColor={statusColor} barStyle={styleStatusBar} />

    <View style={styles.searchMainContainer}>
      {
        statusColor == "#282C34FF" ?
        <View style={styles.history_title_1_DARK}>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
          <View style={styles.history1_AA}>
            <IonicIcon name="arrow-back" style={styles.history_title_1A_icon_DARK}/>
          </View>
          </TouchableOpacity>
          <View style={styles.history1_BB}>
            <Text style={styles.history_title_1B_txt_DARK}>帮助</Text>
          </View>
        </View>
      :
        <View style={styles.history_title_1}>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
          <View style={styles.history1_AA}>
            <IonicIcon name="arrow-back" style={styles.history_title_1A_icon}/>
          </View>
          </TouchableOpacity>
          <View style={styles.history1_BB}>
            <Text style={styles.history_title_1B_txt}>帮助</Text>
          </View>
          <View style={{
            marginLeft: 10,
            transform: [
                { scale: 0.8 },
            ]
          }}>
            <ActivityIndicator color={'#282C34'}/>
          </View>
        </View>
      }

      <View style={styles.helpWebContainer}>
      { webViewShow ?
        <WebView
          startInLoadingState={true}
          source={{
            uri: currentUrl,
          }}
          onLoadEnd={() => {
            setStatusColor("#282C34FF");
            setStyleStatusBar(styleTypes[2]);
          }}
          geolocationEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        : <></>
      }
      </View>
    
    </View>

    </SafeAreaView>
  );

}

export default Help;