import React, { useState, useRef, useEffect } from 'react';
import { StatusBar, SafeAreaView, Text, View, ScrollView, TouchableNativeFeedback, TouchableOpacity, Switch, Linking, Share } from 'react-native';
// import { WebView } from 'react-native-webview';
import 'react-native-gesture-handler';

import IonicIcon from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/FontAwesome';

import styles from "./styles/SettingsStyle.js";

import AsyncStorage from '@react-native-async-storage/async-storage';

// import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modalbox';
import CookieManager from 'react-native-cookies';
import Snackbar from 'react-native-snackbar';
import RadioButtonRN from 'radio-buttons-react-native';

import {useSelector, useDispatch} from 'react-redux';

const Settings = ({ navigation, route }) => {
  
  const styleTypes = ['default','dark-content', 'light-content'];
  const [styleStatusBar, setStyleStatusBar] = useState(styleTypes[1]);

  const [rippleOverflow, setRippleOverflow] = useState(false);

  const [searchEngineAlert, setSearchEngineAlert] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState("百度");
  const [defaultBrowserNum, setDefaultBrowserNum] = useState(1);

  const appInfo = useSelector((state) => state.appInfo);

  const dispatch = useDispatch();

  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const [isAnimationDirEnabled, setIsAnimationDirEnabled] = useState(true);
  const [isCookiesDisabled, setIsCookiesDisabled] = useState(false);
  const [isJSDisabled, setIsJSDisabled] = useState(false);

  useEffect(() => {
    setSelectedSelection(appInfo.searchEngine);
    setIsAnimationEnabled(appInfo.animations);
    setIsAnimationDirEnabled(appInfo.animationDirection);
    setIsCookiesDisabled(appInfo.disableCookies);
    setIsJSDisabled(appInfo.disableJS);
    if(appInfo.searchEngine == "Google") {
      setDefaultBrowserNum(1);
    } else if(appInfo.searchEngine == "DuckDuckGo") {
      setDefaultBrowserNum(2);
    } else if(appInfo.searchEngine == "Bing") {
      setDefaultBrowserNum(3);
    }
    else if(appInfo.searchEngine == "Yahoo!"){
      setDefaultBrowserNum(4);
    } else {
      setDefaultBrowserNum(1);
    }
  }, [appInfo]);

  const data = [
    {
      label: "Google"
    },
    {
      label: "DuckDuckGo"
    },
    {
      label: "Bing"
    },
    {
      label: "Yahoo!"
    },
    {
      label: "百度"
    }
  ];



  const clearAll = async () => {
    try {

      await AsyncStorage.clear();
      dispatch({type: "CHANGE_APPINFO", value: {
        searchEngine: "百度",
        animations: true,
        animationDirection: true,
        disableCookies: false,
        disableJS: false
      }});
      
      setDefaultBrowserNum(1);
      setSelectedSelection("百度");

      setIsAnimationEnabled(true);
      setIsAnimationDirEnabled(true);
      
      setIsCookiesDisabled(false);
      setIsJSDisabled(false);

    } catch(error) {
      // error
    }
  }

  const closeSearchEngine = () => {
    setSearchEngineAlert(false);
  }

  const saveSearchEngine = async () => {
    try {
      await AsyncStorage.setItem("appInfo", JSON.stringify({...appInfo, searchEngine: selectedSelection}));
      dispatch({type: "CHANGE_APPINFO", value: {...appInfo, searchEngine: selectedSelection}});
      setSelectedSelection(selectedSelection);
      closeSearchEngine();
    } catch (error) {
      // error
    }
  }

  return (
    <SafeAreaView>
    <StatusBar backgroundColor="#ffffff" barStyle={styleStatusBar}/>

    <Modal 
      isOpen={searchEngineAlert} 
      onClosed={saveSearchEngine} 
      style={[styles.modal, styles.modal4]} 
      position={"center"} 
      backdropPressToClose={true} 
      swipeToClose={false} 
      backdropOpacity={0.2} 
      backButtonClose={true}
      coverScreen={true} 
      animationDuration={200}
    >
      <View style={styles.modal4__1A}>

        <View style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 20,
          marginBottom: 5,
        }}>
          <Text style={{
            fontSize: 16,
            color: "#6C7377FE",
            fontFamily: "Helvetica",
            marginLeft: 20,
            marginTop: 4,
            marginRight: 10,
            paddingBottom: 4,
            flexGrow: 1,
          }}>
            Search Engine
          </Text>
          <TouchableOpacity onPress={closeSearchEngine}>
            <View>
              <IonicIcon name="chevron-down" style={{
                fontSize: 20,
                color: "#6C7377FE",
                marginRight: 20,
                marginTop: 4,
              }}/>
            </View>
          </TouchableOpacity>
        </View>

        <View>
            <View style={{
              marginLeft: 10,
              marginBottom: 30,
            }}>
            <RadioButtonRN
              data={data}
              box={false}
              initial={defaultBrowserNum}
              selectedBtn={(e) => {setSelectedSelection(e.label)}}
              animationTypes={[]}
              textColor="#6C7377FE"
              circleSize={14}
              duration={200}
              textStyle={{
                fontFamily: "Helvetica",
                marginTop: 2,
                marginBottom: 2,
                fontSize: 15,
              }}
              icon={
                <IonicIcon name="checkmark-circle-outline" style={{
                  fontSize: 22,
                  color: "#6C7377FE",
                }}/>
              }
            />
            </View>
        </View>

      </View>
    </Modal>

    <View style={styles.history_title_1}>
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <View style={styles.history1_AA}>
          <IonicIcon name="arrow-back" style={styles.history_title_1A_icon}/>
        </View>
      </TouchableOpacity>
      <View style={styles.history1_BB}>
        <Text style={styles.history_title_1B_txt}>设置</Text>
      </View>
    </View>
    {/* <LinearGradient colors={['#EDEEEEFE', '#FFFFFFFF']} style={styles.linearGradient_1}></LinearGradient> */}

    <ScrollView style={styles.settingsMainContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} scrollEventThrottle={1}>

    <View>
      <Text style={styles.section_1_txt}>通用</Text>
    </View>

    <View style={styles.section_1_CONT_1}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple("#AFB1B13D", rippleOverflow)}
        onPress={() => {setSearchEngineAlert(true)}}
      >
        <View>
          <Text style={styles.section_1_txt_A}>
            搜索引擎
          </Text>
          <Text style={styles.section_1_txt_B}>
            {selectedSelection}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>

    <View style={{
      minHeight: 1,
      backgroundColor: "#EDEEEEFE",
      marginTop: 10,
      marginBottom: 10,
    }}></View>

    <View>
      <Text style={styles.section_1_txt}>高级设置</Text>
    </View>

    <View style={styles.section_1_CONT_SWH_1}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple("#AFB1B13D", rippleOverflow)}
        onPress={() => {
          // -- x
          CookieManager.clearAll()
          .then((res) => {
            Snackbar.show({
              text: "清除成功",
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: "#282C34FF",
            });
          });
        }}
      >
        <View style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: 12,
          marginRight: 12,
        }}>
          <Text style={styles.section_1_txt_A_TF2}>
            清除 Cookies
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>


    <View style={styles.section_1_CONT_SWH_1}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple("#AFB1B13D", rippleOverflow)}
        onPress={() => {
          clearAll();
          Snackbar.show({
            text: "清除成功",
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "#282C34FF",
          });
        }}
      >
        <View style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: 12,
          marginRight: 12,
        }}>
          <Text style={styles.section_1_txt_A_TF2}>
            清除应用数据
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>

    <View style={{
      minHeight: 1,
      backgroundColor: "#EDEEEEFE",
      marginTop: 10,
      marginBottom: 10,
    }}></View>

    <View>
      <Text style={styles.section_1_txt}>APP</Text>
    </View>

    <View style={styles.section_1_CONT_SWH_1}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple("#AFB1B13D", rippleOverflow)}
        onPress={() => {
          navigation.navigate('Help', { name: "Home" });
        }}
      >
        <View style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: 12,
          marginRight: 12,
        }}>
          <Text style={styles.section_1_txt_A_TF2}>
            帮助
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>


    <View style={{
      minHeight: 1,
      backgroundColor: "#EDEEEEFE",
      marginTop: 10,
      marginBottom: 10,
    }}></View>


    <View style={{
      minHeight: 80,
    }}></View>
    
    </ScrollView>
    </SafeAreaView>
  );

}

export default Settings;