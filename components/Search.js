import React, { useState, useRef, useEffect } from 'react';
import { StatusBar, SafeAreaView, View, Image, TouchableNativeFeedback, TouchableOpacity, Animated, ActivityIndicator, Share, ToastAndroid, Keyboard } from 'react-native';
import { Text, TextInput, Panel, Button, Divider, List } from 'react95-native'
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import 'react-native-gesture-handler';

import IonicIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from "./styles/SearchStyle.js";

import Modal from 'react-native-modalbox';
import Clipboard from '@react-native-clipboard/clipboard';
import SpeechToText from 'react-native-google-speech-to-text';

import { useSelector } from 'react-redux';

const Search = ({ navigation, route }) => {

  const styleTypes = ['default', 'dark-content', 'light-content'];
  const [styleStatusBar, setStyleStatusBar] = useState(styleTypes[1]);

  const [rippleOverflow, setRippleOverflow] = useState(false);

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const [WebL, setWebL] = useState(true);
  const [cUrl, setCUrl] = useState((route.params.name).replace("turbo/", ""));
  const [httpS, setHttpS] = useState(2);
  const [favIcon, setFavIcon] = useState("");
  const [webTS, setWebTS] = useState((route.params.name).replace("turbo/", "").split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]);
  const [titleCurrent, setTitleCurrent] = useState("");

  const [webViewShow, setWebViewShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [f2, setF2] = useState(false);

  const BottomNavOpacity = useRef(new Animated.Value(1)).current;

  const [optionsAlertOpen, setOptionsAlertOpen] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const [searchAlertOpen, setSearchAlertOpen] = useState(false);

  const INJECTEDJAVASCRIPT = `
  const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
  
  var links = document.links, i, length;
  for (i = 0, length = links.length; i < length; i++) {
      links[i].target == '_blank' && links[i].removeAttribute('target');
  }
  
  window.ReactNativeWebView.postMessage(document.title);

  (function () {
    if (window.VideoTogetherLoading) {
      return;
    }
    window.VideoTogetherLoading = true;
    let wrapper = document.createElement("div");
    wrapper.innerHTML = \`<div id="videoTogetherLoading">
    <div style="width: 100%">
        <img style="display: inline;" src="https://cdn.jsdelivr.net/gh/maggch97/VideoTogether/icon/favicon-16x16.png">
        <a target="_blank" href="https://videotogether.github.io/usage.html" style="display: inline;color: black;">Video Together 加载中...</p>
    </div>
  </div>
  <style>
    #videoTogetherLoading {
        touch-action: none;
        line-height: 16px;
        height: 80px;
        font-size: 16px;
        border: solid;
        border-width: 2px;
        border-bottom-color: #424242;
        border-right-color: #424242;
        border-left-color: #fff;
        border-top-color: #fff;
        background: silver;
        color: #212529;
        display: flex;
        align-items: center;
        z-index: 2147483646;
        position: fixed;
        bottom: 15px;
        right: 15px;
        width: 250px;
        text-align: center;
    }
  </style>\`
    document.getElementsByTagName('body')[0].appendChild(wrapper);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.jsdelivr.net/gh/maggch97/VideoTogether@latest/release/vt.user.js?timestamp=' + parseInt(Date.now() / 1000 / 3600);
    document.getElementsByTagName('body')[0].appendChild(script);
    function filter(e) {
        let target = e.target;
  
        if (!target.id == "videoTogetherLoading") {
            return;
        }
  
        target.moving = true;
  
        if (e.clientX) {
            target.oldX = e.clientX;
            target.oldY = e.clientY;
        } else {
            target.oldX = e.touches[0].clientX;
            target.oldY = e.touches[0].clientY;
        }
  
        target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
        target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;
  
        document.onmousemove = dr;
        document.ontouchmove = dr;
  
        function dr(event) {
            if (!target.moving) {
                return;
            }
            if (event.clientX) {
                target.distX = event.clientX - target.oldX;
                target.distY = event.clientY - target.oldY;
            } else {
                target.distX = event.touches[0].clientX - target.oldX;
                target.distY = event.touches[0].clientY - target.oldY;
            }
  
            target.style.left = Math.min(document.documentElement.clientWidth - target.clientWidth, Math.max(0, target.oldLeft + target.distX)) + "px";
            target.style.top = Math.min(document.documentElement.clientHeight - target.clientHeight, Math.max(0, target.oldTop + target.distY)) + "px";
        }
  
        function endDrag() {
            target.moving = false;
        }
        target.onmouseup = endDrag;
        target.ontouchend = endDrag;
    }
    document.onmousedown = filter;
    document.ontouchstart = filter;
  })();
  `;

  const inputRef = React.useRef();
  const webviewRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [bookmarksKeyValue, setBookmarksKeyValue] = useState("");

  const appInfo = useSelector((state) => state.appInfo);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const speechToTextHandler = async () => {
    let speechToTextData = null;
    try {
      speechToTextData = await SpeechToText.startSpeech('Try saying something', 'en_IN');
      searchStringS(speechToTextData);
    } catch (error) {
      // error
    }
  }

  const _keyboardDidShow = () => {
    if (route.name == "Search") {
      setF2(true);
    } else {
      // Do nothing
    }
  };

  const _keyboardDidHide = () => {
    if (route.name == "Search") {
      setF2(false);
    } else {
      // Do nothing
    }
  };

  const showToast = () => {
    ToastAndroid.show("链接已复制", ToastAndroid.SHORT);
  };

  useEffect(() => {
    setTimeout(() => {
      setWebViewShow(true);
    }, 600);
  }, []);

  const se1 = () => {
    if (webviewRef.current) {
      if (canGoBack) {
        webviewRef.current.goBack();
      } else {
        navigation.goBack();
      }
    }
  }

  const se2 = () => {
    if (webviewRef.current) webviewRef.current.goForward();
  }

  const se3 = () => {
    navigation.navigate('Home', { name: "Home" });
  }

  const setHttpIcon = () => {
    if (cUrl.substring(0, 5) == "https") {
      setHttpS(1);
    } else if (cUrl.substring(0, 5) == "http:") {
      setHttpS(2);
    } else {
      setHttpS(3);
    }
  }

  const getBookmarkValue = async () => {
    try {
      const value = await AsyncStorage.getItem("bookmarksKey")
      if (value !== null) {
        // value previously stored
        setBookmarksKeyValue(value);
      } else {
        setBookmarksKeyValue("");
      }
    } catch (e) {
      // error
    }
  }

  const saveBookmarkValue = async () => {
    try {
      const value = await AsyncStorage.getItem("bookmarksKey")
      if (value !== null) {
        // value previously stored
        await AsyncStorage.setItem("bookmarksKey", value + "~" + currentUrl);
        setBookmarksKeyValue(value + "~" + currentUrl);
      } else {
        await AsyncStorage.setItem("bookmarksKey", currentUrl + "~");
        setBookmarksKeyValue(currentUrl + "~");
      }
    } catch (e) {
      // error
    }
  }

  useEffect(() => {
    navigation.addListener('focus',
      () => {

        let urlToOpen = (route.params.name).replace("turbo/", "");
        setCurrentUrl(urlToOpen);

        setWebTS(urlToOpen.split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]);
        setHttpS(2);
        setF2(false);

        getBookmarkValue();

      }
    );
  }, []);

  const refreshWeb = () => {
    if (webviewRef.current) webviewRef.current.reload();
  }

  const onMessage = async (message) => {
    setTitleCurrent(message.nativeEvent.data);
    if (message.nativeEvent.data !== "") {
      let objectToSet = {
        name: message.nativeEvent.data,
        url: message.nativeEvent.url
      }
      let valueToSet = JSON.stringify(objectToSet);
      await AsyncStorage.setItem("lastSearchedWeb", valueToSet);
    }
  }

  const handleFullScrTouch = () => {
    if (fullscreen) {
      setFullscreen(false);
      Animated.timing(
        BottomNavOpacity,
        {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }
      ).start();
      setTimeout(() => {
        Animated.timing(
          BottomNavOpacity,
          {
            toValue: 1,
            duration: appInfo.animations == false ? 0 : 200,
            useNativeDriver: true,
          }
        ).start();
      }, 200);
    } else {
      setFullscreen(true);
      Animated.timing(
        BottomNavOpacity,
        {
          toValue: 0,
          duration: appInfo.animations == false ? 0 : 100,
          useNativeDriver: true,
        }
      ).start();
    }
  }

  const se4 = () => {
    saveBookmarkValue();
  }

  const se5 = () => {
    setOptionsAlertOpen(true);
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: currentUrl,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // error
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(currentUrl);
  };

  const onSearchChangeText = (text) => {
    setSearchValue(text);
  }

  const saveHistory = async () => {
    if (currentUrl !== "about:blank" || currentUrl !== "" || currentUrl.includes("~"))
      try {
        const value = await AsyncStorage.getItem("historyKey");
        if (value !== null) {
          // value previously stored
          if (value.includes("~")) {
            await AsyncStorage.setItem("historyKey", currentUrl + "~" + value);
          } else {
            await AsyncStorage.setItem("historyKey", currentUrl + "~" + value);
          }
        } else {
          await AsyncStorage.setItem("historyKey", currentUrl);
        }
      } catch (error) {
        // error
      }
  }

  const searchStringS = (string) => {

    if (string == "") {

    } else if (string.substring(0, 8) == "https://" || string.substring(0, 7) == "http://") {
      setCurrentUrl(string);
    } else {

      // openWebsite("https://www.google.com/search?q=" + string.replace(/ /g,"+"));

      if (appInfo.searchEngine == "Google") {
        setCurrentUrl("https://www.google.com/search?q=" + string.replace(/ /g, "+"));
      } else if (appInfo.searchEngine == "DuckDuckGo") {
        openWebsite("https://duckduckgo.com/?q=" + string.replace(/ /g, "+"));
      } else if (appInfo.searchEngine == "Bing") {
        setCurrentUrl("https://www.bing.com/search?q=" + string.replace(/ /g, "+"));
      } else if (appInfo.searchEngine == "Yahoo!") {
        setCurrentUrl("https://in.search.yahoo.com/search?p=" + string.replace(/ /g, "+"));
      } else if (appInfo.searchEngine == "百度") {
        setCurrentUrl("https://www.baidu.com/s?wd=" + string.replace(/ /g, "+"));
      } else {
        setCurrentUrl("https://www.google.com/search?q=" + string.replace(/ /g, "+"));
      }

    }

  }

  const se4Remove = async () => {
    try {
      const value = await AsyncStorage.getItem("bookmarksKey");
      const newValue = value.split(currentUrl).join("");
      await AsyncStorage.setItem("bookmarksKey", newValue);
      setBookmarksKeyValue(newValue);
    } catch (e) {
      // error
    }
  }

  return (
    <SafeAreaView>
      <Panel>
      <StatusBar backgroundColor="#ffffff" barStyle={styleStatusBar} />


      <Modal
        isOpen={searchAlertOpen}
        onClosed={() => {
          setSearchAlertOpen(false);
          setSearchOpen(false);
        }}
        style={[styles.modal, styles.modal12]}
        entry={"top"}
        position={"top"}
        backdropPressToClose={true}
        swipeToClose={false}
        backdropOpacity={0.4}
        backButtonClose={true}
        coverScreen={true}
        animationDuration={200}
      >
        <Panel style={styles.view__2}>
          <View style={{ overflow: 'hidden' }}>

            <View style={styles.view_input_c_1}>

              <IonicIcon style={styles.search_icon} name="search" />

              <TextInput
                ref={inputRef}
                style={{
                  height: 48,
                  fontSize: 14,
                  marginLeft: 8,
                  flexGrow: 1,
                }}
                value={searchValue}
                onChangeText={(text) => onSearchChangeText(text)}
                autoFocus={true}
                editable={searchOpen}
                onSubmitEditing={() => {
                  setSearchAlertOpen(false);
                  setSearchOpen(false);
                  searchStringS(searchValue);
                }}
                placeholderTextColor="#CECFCFFF"
                placeholder="搜索"
              />

            </View>
            {/* </TouchableOpacity> */}
          </View>
        </Panel>

      </Modal>

      <Modal
        isOpen={optionsAlertOpen}
        onClosed={() => { setOptionsAlertOpen(false) }}
        style={[styles.modal, styles.modal8]}
        position={"bottom"}
        backdropPressToClose={true}
        swipeToClose={false}
        backdropOpacity={0.2}
        backButtonClose={true}
        coverScreen={true}
        animationDuration={200}
      >
        <Panel style={styles.optionAlertCont_MAIN}>

          <View style={styles.optionAlertCont_opt_1}>
            <Button
              variant='menu' onPress={() => {
              setOptionsAlertOpen(false);
              copyToClipboard();
              showToast();
            }}>
              <Text style={styles.optionAlertCont_optText_1}>
                复制链接
              </Text>
            </Button>
          </View>
          <Divider></Divider>
          <View style={styles.optionAlertCont_opt_1}>
            <TouchableOpacity onPress={() => {
              setOptionsAlertOpen(false);
              setTimeout(() => {
                onShare();
              }, 320);
            }}>
              <Text style={styles.optionAlertCont_optText_1}>
                分享
              </Text>
            </TouchableOpacity>
          </View>
          <Divider></Divider>
          <View style={styles.optionAlertCont_opt_1}>
            <TouchableOpacity onPress={() => {
              setOptionsAlertOpen(false);
              navigation.navigate('Settings', { name: "Home" });
            }}>
              <Text style={styles.optionAlertCont_optText_1}>
                设置
              </Text>
            </TouchableOpacity>
          </View>
          <Divider></Divider>
          <View style={styles.optionAlertCont_opt_1_B}>
            <TouchableOpacity onPress={() => {
              setOptionsAlertOpen(false);
              navigation.navigate('Help', { name: "Home" });
            }}>
              <Text style={styles.optionAlertCont_optText_1}>
                帮助
              </Text>
            </TouchableOpacity>
          </View>
          <Divider></Divider>
          <View style={styles.optionAlertCont_opt_icon_1}>
            <TouchableOpacity style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
              marginBottom: 4,
            }} onPress={() => { setOptionsAlertOpen(false) }}>
              {/* <FontAwesome style={styles.optionAlertCont_opt_icon_2} name="chevron-down"/> */}
              <Image
                source={require("../assets/arrowDown2.png")}
                style={{
                  height: 26,
                  width: 26,
                }}
              />
            </TouchableOpacity>
          </View>

        </Panel>
      </Modal>

      <View style={styles.searchMainContainer}>


        {/* Search 1 */}
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}  colors={['#08216b', '#3b5998', '#a5cef7']} style={styles.search_1}>
          {
            currentUrl.includes("view-source:") ?
              <View style={styles.sea1__1}>
                <Image

                  style={styles.sea1__1A}

                  source={(favIcon.includes("https://api.statvoo.com/favicon/?url=https://www.nytimes.com/") ? require("../assets/ny.png") :

                    favIcon.includes("https://api.statvoo.com/favicon/?url=https://www.google.com/") ? require("../assets/googleIcon.png") :

                      { uri: favIcon })}

                />
              </View>
              :
              <View style={styles.sea1__1}>
                {WebL ?
                  <ActivityIndicator size="small" style={{
                    height: 16,
                    width: 16,
                    resizeMode: "cover",
                    marginLeft: 8,
                    marginRight: 8,
                  }} color={'#8F8D8DFE'} />
                  :
                  <Image

                    style={styles.sea1__1A}

                    source={(favIcon.includes("https://api.statvoo.com/favicon/?url=https://www.nytimes.com/") ? require("../assets/ny.png") :

                      favIcon.includes("https://api.statvoo.com/favicon/?url=https://www.google.com/") ? require("../assets/googleIcon.png") :

                        { uri: favIcon })}

                  />
                }
              </View>
          }

          <View style={{
            height: 30,
            flexGrow: 1,
            overflow: "hidden",
          }}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple("#AEAEAEFF", rippleOverflow)}
              onPress={() => {
                setSearchAlertOpen(true);
                setSearchValue("");
                setTimeout(() => {
                  setSearchOpen(true);
                  inputRef.current?.focus();
                }, 400);
              }}
            >
              <View style={styles.sea1__2}>
                <View style={styles.sea1__2A}>
                  {
                    (httpS == 1) ?
                      <MaterialIcons style={styles.sea1__2A_icon1} name="https" />
                      : (httpS == 2) ?
                        <MaterialIcons style={styles.sea1__2A_icon2} name="https" />
                        : (httpS == 3) ?
                          <MaterialIcons style={styles.sea1__2A_icon2} name="https" />
                          : <MaterialIcons style={styles.sea1__2A_icon2} name="https" />
                  }
                </View>
                <View style={styles.sea1__2B}>
                  <Text style={styles.sea1__2B_txt}>
                    {currentUrl.replace("turbo/", "").split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]}
                  </Text>
                </View>
                <TouchableOpacity onPress={refreshWeb}>
                  <View style={styles.sea1__2C}>
                    <MaterialIcons style={styles.sea1__2C_icon} name="replay" />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={styles.sea1__3}>
            <TouchableOpacity onPress={handleFullScrTouch}>
              {/* <MaterialIcons style={styles.sea1__3_icon} name="more-vert"/> */}
              {
                fullscreen ?
                  <MaterialIcons style={styles.sea1__3_icon} name="fullscreen-exit" />
                  :
                  <MaterialIcons style={styles.sea1__3_icon} name="fullscreen" />
              }
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Search 2 */}
        <View style={styles.search_2}>
          {
            webViewShow ?
              <WebView
                startInLoadingState={true}
                ref={webviewRef}
                source={{
                  uri: currentUrl,
                }}
                onNavigationStateChange={navState => {
                  setCanGoBack(navState.canGoBack);
                  setCanGoForward(navState.canGoForward);
                  setCUrl(navState.url);
                  // setWebTS(cUrl.split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]);
                }}
                allowFileAccess={true}
                geolocationEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                injectedJavaScript={INJECTEDJAVASCRIPT}
                onLoadStart={() => {
                  setWebL(true);
                }}
                onLoadEnd={() => {
                  setFavIcon("https://api.statvoo.com/favicon/?url=" + cUrl);
                  setWebL(false);
                  setHttpIcon();
                  setWebTS(cUrl.split("/")[2] > 26 ? cUrl.split("/")[2].substring(0, 24) + "..." : cUrl.split("/")[2]);
                  saveHistory();
                }}
                userAgent="Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36"
                onMessage={onMessage}
                javaScriptEnabled={appInfo.disableJS == true ? false : true}
                domStorageEnabled={appInfo.disableCookies == true ? false : true}
              />
              : <></>
          }
        </View>

        {/* Search 3 */}
        {
          fullscreen || f2 ?
            <></>
            :
            <Animated.View
              style={{
                opacity: BottomNavOpacity
              }}
            >
              <View style={styles.search_3}>
                <Button onPress={se1} style={styles.sea_3_item}>
                  <View>
                    <IonicIcon style={styles.sea3__3_icon} name="chevron-back-outline" />
                  </View>
                </Button>
                <Button onPress={se2} style={styles.sea_3_item}>
                  <View>
                    <IonicIcon style={styles.sea3__3_icon} name="chevron-forward-outline" />
                  </View>
                </Button>
                <Button onPress={se3} style={styles.sea_3_item}>
                  <View>
                    <IonicIcon style={styles.sea3__3_icon} name="home-outline" />
                  </View>
                </Button>
                {
                  bookmarksKeyValue.includes(currentUrl) ?
                    <Button onPress={se4Remove} style={styles.sea_3_item}>
                      <View>
                        <IonicIcon style={styles.sea3__3_icon_r} name="heart" />
                      </View>
                    </Button>
                    :
                    <Button onPress={se4} style={styles.sea_3_item}>
                      <View>
                        <IonicIcon style={styles.sea3__3_icon_r} name="heart-outline" />
                      </View>
                    </Button>
                }

                <Button onPress={se5} style={styles.sea_3_item}>

                  <View>
                    <IonicIcon style={styles.sea3__3_icon} name="grid-outline" />
                  </View>
                </Button>
              </View>
            </Animated.View>
        }

      </View>
      </Panel>
    </SafeAreaView>
  );

}

export default Search;