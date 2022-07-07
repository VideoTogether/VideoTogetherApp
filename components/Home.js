import React, { useState, useRef, useEffect } from 'react';
import { StatusBar, SafeAreaView, View, Image, ScrollView, TouchableNativeFeedback, TouchableOpacity, Animated, ActivityIndicator, Keyboard, BackHandler, Linking } from 'react-native';
import { Text, TextInput, Panel, Button, Divider, List } from 'react95-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./styles/HomeStyle.js";

import IonicIcon from 'react-native-vector-icons/Ionicons';

import SearchItem from './subComponents/SearchItem';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import Modal from 'react-native-modalbox';

import { useSelector, useDispatch } from 'react-redux';

const Home = ({ navigation, route }) => {

  const styleTypes = ['default', 'dark-content', 'light-content'];
  const [styleStatusBar, setStyleStatusBar] = useState(styleTypes[1]);

  const [rippleOverflow, setRippleOverflow] = useState(false);

  const scrollRef = useRef();

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const transformAnim = useRef(new Animated.Value(-16)).current;
  const rotateAnim1 = useRef(new Animated.Value(0)).current;

  const [searchOpen, setSearchOpen] = useState(false);
  const view1marTop1 = useRef(new Animated.Value(0)).current;
  const bottomViewsAll2 = useRef(new Animated.Value(1)).current;

  const translY = useRef(new Animated.Value(0)).current;

  const [searchValue, setSearchValue] = useState("");

  const pinsOp1 = useRef(new Animated.Value(0.8)).current;

  const [pin1, setPin1] = useState(" ~https://www.youtube.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294282/youtube_hbg408.png");
  const [pin2, setPin2] = useState(" ~https://www.wikipedia.org/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/wikipedia_rfho3x.png");
  const [pin3, setPin3] = useState(" ~https://twitter.com/explore~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/twitter_swc5mx.png");
  const [pin4, setPin4] = useState(" ~https://www.quora.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/quora_qglhgp.png");

  const [pin5, setPin5] = useState(" ~https://www.amazon.in/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294289/amazon_msmuqy.png");
  const [pin6, setPin6] = useState(" ~https://edition.cnn.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294289/CNN_attiju.png");
  const [pin7, setPin7] = useState(" ~https://www.instagram.com/?hl=en~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/instagram_zjam2e.png");
  const [pin8, setPin8] = useState("false/AddNew/ID84422");

  const [pinsReady, setPinsReady] = useState(false);

  const searchItemsBBo2 = useRef(new Animated.Value(0)).current;
  const [searchItems, setSearchItems] = useState([]);

  const [lastSearchedWeb, setLastSearchedWeb] = useState(false);

  const [pinAlertOpen, setPinAlertOpen] = useState(false);
  const [optionsAlertOpen, setOptionsAlertOpen] = useState(false);

  const [EBName, setEBName] = useState("");
  const [EBUrl, setEBUrl] = useState("");

  const [currentClickedPin, setCurrentClickedPin] = useState(8);

  const adOpacity = useRef(new Animated.Value(0)).current;
  const adTransY = useRef(new Animated.Value(-10)).current;


  const appInfo = useSelector((state) => state.appInfo);

  const dispatch = useDispatch();

  const getAppInfo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("appInfo");
      if (jsonValue !== null) {
        const value = JSON.parse(jsonValue);
        dispatch({ type: "CHANGE_APPINFO", value: value });
      }
    } catch (error) {
      // error
    }
  }

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
  };

  const spin = rotateAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const scrollToTop = () => {
    scrollRef.current.scrollTo({
      y: 0,
      animated: appInfo.animations,
    });
  }

  const storeData1 = async (key, value) => {
    try {
      // saving data
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // error
      return false;
    }
  }

  const storeData2 = async (key, value) => {
    try {
      // saving data
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // error
      return false;
    }
  }

  const getAndStoreSearch = async (v2S) => {
    try {
      const value = await AsyncStorage.getItem("searchItems");
      if (value !== null) {
        // value previously stored
        let parsedValue = JSON.parse(value);
        let newValue = {
          key: uuidv4(),
          item: v2S
        };
        parsedValue.insert(0, newValue);
        // let newValue2 = parsedValue.splice(0, 0,newValue)
        let val2StoreA = JSON.stringify(parsedValue);
        storeData2("searchItems", val2StoreA);
      } else {
        let val2StoreB = JSON.stringify([{
          key: uuidv4(),
          item: v2S
        }]);
        storeData2("searchItems", val2StoreB);
      }
    } catch (e) {
      // error reading value
    }
  }

  const getData1 = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value == "true") {

        // Get Pins from storage and fill their states
        const p1 = await AsyncStorage.getItem("pin1");
        const p2 = await AsyncStorage.getItem("pin2");
        const p3 = await AsyncStorage.getItem("pin3");
        const p4 = await AsyncStorage.getItem("pin4");

        const p5 = await AsyncStorage.getItem("pin5");
        const p6 = await AsyncStorage.getItem("pin6");
        const p7 = await AsyncStorage.getItem("pin7");
        const p8 = await AsyncStorage.getItem("pin8");

        setPin1(p1);
        setPin2(p2);
        setPin3(p3);
        setPin4(p4);

        setPin5(p5);
        setPin6(p6);
        setPin7(p7);
        setPin8(p8);

        setPinsReady(true);
        Animated.timing(
          pinsOp1,
          {
            toValue: 1,
            duration: appInfo.animations == false ? 0 : 200,
            useNativeDriver: true,
          }
        ).start();

      } else {

        // First time app is being opened
        // Store the pins

        storeData1("pin1", "YouTube~https://www.youtube.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294282/youtube_hbg408.png");
        storeData1("pin2", "Wikipedia~https://www.wikipedia.org/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/wikipedia_rfho3x.png");
        storeData1("pin3", "Twitter~https://twitter.com/explore~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/twitter_swc5mx.png");
        storeData1("pin4", "Quora~https://www.quora.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/quora_qglhgp.png");

        storeData1("pin5", "Amazon~https://www.amazon.in/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294289/amazon_msmuqy.png");
        storeData1("pin6", "CNN~https://edition.cnn.com/~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294289/CNN_attiju.png");
        storeData1("pin7", "Instagram~https://www.instagram.com/?hl=en~https://res.cloudinary.com/dpj9ddsjf/image/upload/v1612294281/instagram_zjam2e.png");
        storeData1("pin8", "false/AddNew/ID84422");

        storeData1("inApp", "true");

        storeData1("appInfo", JSON.stringify({
          searchEngine: "百度",
          animations: true,
          animationDirection: true,
          disableCookies: false,
          disableJS: false
        }));

        // Get Pins from storage and fill their states
        const p1 = await AsyncStorage.getItem("pin1");
        const p2 = await AsyncStorage.getItem("pin2");
        const p3 = await AsyncStorage.getItem("pin3");
        const p4 = await AsyncStorage.getItem("pin4");

        const p5 = await AsyncStorage.getItem("pin5");
        const p6 = await AsyncStorage.getItem("pin6");
        const p7 = await AsyncStorage.getItem("pin7");
        const p8 = await AsyncStorage.getItem("pin8");

        setPin1(p1);
        setPin2(p2);
        setPin3(p3);
        setPin4(p4);

        setPin5(p5);
        setPin6(p6);
        setPin7(p7);
        setPin8(p8);

        setPinsReady(true);
        Animated.timing(
          pinsOp1,
          {
            toValue: 1,
            duration: appInfo.animations == false ? 0 : 200,
            useNativeDriver: true,
          }
        ).start();

      }
    } catch (e) {
      // error
    }
  }

  const getData2 = async () => {
    try {
      const value = await AsyncStorage.getItem("searchItems");
      if (value !== null) {
        // value previously stored
        let gotValue = JSON.parse(value);
        setSearchItems(gotValue);
      }
    } catch (e) {
      // error reading value
    }
  }

  const getData4 = async () => {
    try {
      const value = await AsyncStorage.getItem("lastSearchedWeb");
      if (value !== null) {
        // value previously stored
        setLastSearchedWeb(JSON.parse(value));
      }
    } catch (e) {
      // error
    }
  }

  useEffect(() => {
    getData1("inApp");
  }, []);

  useEffect(() => {
    getAppInfo();
    navigation.addListener('focus',
      () => {
        // getData1("inApp");
        // AsyncStorage.clear();
        setLastSearchedWeb(false);
        setSearchItems(false);
        // getAppInfo();
      }
    );
  }, [])


  const searchBarClicked1 = () => {
    setSearchValue("");
    setSearchOpen(true);
    scrollToTop();
    Animated.timing(
      translY,
      {
        toValue: -170,
        duration: appInfo.animations == false ? 0 : 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      bottomViewsAll2,
      {
        toValue: 0,
        duration: appInfo.animations == false ? 0 : 200,
        useNativeDriver: true,
      }
    ).start();
    setTimeout(() => {
      Animated.timing(
        searchItemsBBo2,
        {
          toValue: 1,
          duration: appInfo.animations == false ? 0 : 400,
          useNativeDriver: true,
        }
      ).start();
    }, 200);
    setTimeout(() => {
      getData4();
      getData2();
    }, 200);
  }

  Keyboard.addListener("keyboardDidHide", function () {
    // closeSearchBtn();
  });

  const closeSearchBtn = () => {
    setSearchOpen(false);
    Animated.timing(
      translY,
      {
        toValue: 0,
        duration: appInfo.animations == false ? 0 : 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      bottomViewsAll2,
      {
        toValue: 1,
        duration: appInfo.animations == false ? 0 : 200,
        useNativeDriver: true,
      }
    ).start();
    Animated.timing(
      searchItemsBBo2,
      {
        toValue: 0,
        duration: appInfo.animations == false ? 0 : 400,
        useNativeDriver: true,
      }
    ).start();
  }

  const openWebsite = (url) => {

    navigation.navigate('Search', { name: `turbo/${url}` });

    setTimeout(() => {
      setSearchOpen(false);
      Animated.timing(
        translY,
        {
          toValue: 0,
          duration: appInfo.animations == false ? 0 : 150,
          useNativeDriver: true,
        }
      ).start();
      Animated.timing(
        bottomViewsAll2,
        {
          toValue: 1,
          duration: appInfo.animations == false ? 0 : 200,
          useNativeDriver: true,
        }
      ).start();
    }, 400);

  }

  const onSearchChangeText = (text) => {
    setSearchValue(text);
  }

  const onEditBChangeName = (text) => {
    setEBName(text);
  }

  const onEditBChangeURL = (text) => {
    setEBUrl(text);
  }

  const voiceSearchBtnClk = () => {
    speechToTextHandler();
  }

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem("lastSearchedWeb");
      setLastSearchedWeb(false);
    } catch (e) {
      // error
    }
  }

  const deleteLastSearchWeb = () => {
    removeValue();
  }

  const searchString = (string) => {

    if (string == "") {

    } else if (string.substring(0, 8) == "https://" || string.substring(0, 7) == "http://") {
      if (string.includes("~")) {
        openWebsite(string);
      } else {
        openWebsite(string);
        setTimeout(() => {
          getAndStoreSearch(string);
        }, 400);
      }
    } else {

      if (string.includes("~")) {
        if (appInfo.searchEngine == "Google") {
          openWebsite("https://www.google.com/search?q=" + string.replace(/ /g, "+"));
        } else if (appInfo.searchEngine == "DuckDuckGo") {
          openWebsite("https://duckduckgo.com/?q=" + string.replace(/ /g, "+"));
        } else if (appInfo.searchEngine == "Bing") {
          openWebsite("https://www.bing.com/search?q=" + string.replace(/ /g, "+"));
        } else if (appInfo.searchEngine == "Yahoo!") {
          openWebsite("https://in.search.yahoo.com/search?p=" + string.replace(/ /g, "+"));
        } else if (appInfo.searchEngine == "百度") {
          openWebsite("https://www.baidu.com/s?wd=" + string.replace(/ /g, "+"));
        } else {
          openWebsite("https://www.google.com/search?q=" + string.replace(/ /g, "+"));
        }
      } else {
        if (appInfo.searchEngine == "Google") {
          openWebsite("https://www.google.com/search?q=" + string.replace(/ /g, "+"));
        } else if (appInfo.searchEngine == "DuckDuckGo") {
          openWebsite("https://duckduckgo.com/?q=" + string.replace(/ /g, "+"));
        } else if (appInfo.searchEngine == "Bing") {
          openWebsite("https://www.bing.com/search?q=" + string.replace(/ /g, "+"));
        } else if (appInfo.searchEngine == "Yahoo!") {
          openWebsite("https://in.search.yahoo.com/search?p=" + string.replace(/ /g, "+"));
        } else if (appInfo.searchEngine == "百度") {
          openWebsite("https://www.baidu.com/s?wd=" + string.replace(/ /g, "+"));
        } else {
          openWebsite("https://www.google.com/search?q=" + string.replace(/ /g, "+"));
        }
        setTimeout(() => {
          getAndStoreSearch(string);
        }, 400);
      }

    }

  }

  const openOutlineHandle = (string) => {
    setSearchValue(string);
  }

  const openWebsiteHandle = (string) => {
    searchString(string);
  }

  const showAlert1 = (id) => {
    setCurrentClickedPin(id);
    setPinAlertOpen(true);
  }

  const savePIN = async (pinToSet) => {
    if (
      EBName.includes("~") ||
      EBUrl.includes("~") ||
      EBName.trim() == "" ||
      EBUrl.trim() == ""
    ) {
      // Do nothing
    } else {
      try {
        // ;-;
        storeData1("pin" + pinToSet, EBName.trim() + "~" + EBUrl.trim() + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        if (pinToSet == "1") {
          setPin1(EBName.trim() + "~" + EBUrl.trim() + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if (pinToSet == "2") {
          setPin2(EBName.trim() + "~" + EBUrl.trim() + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if (pinToSet == "3") {
          setPin3(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if (pinToSet == "4") {
          setPin4(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if (pinToSet == "5") {
          setPin5(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if (pinToSet == "6") {
          setPin6(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if (pinToSet == "7") {
          setPin7(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else if (pinToSet == "8") {
          setPin8(EBName.trim() + "~" + EBUrl + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        } else {
          setPin8(EBName.trim() + "~" + EBUrl.trim() + "~" + "https://api.statvoo.com/favicon/?url=" + EBUrl.trim());
        }
        setPinAlertOpen(false);
        setEBName("");
        setEBUrl("");
      } catch (error) {
        // error
      }
    }
  }

  return (
    <SafeAreaView>
      <Panel>
        <StatusBar backgroundColor="#ffffff" barStyle={styleStatusBar} />

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
          animationDuration={appInfo.animations == false ? 0 : 200}
        >
          <Panel style={styles.optionAlertCont_MAIN}>

            <Button
              variant='menu'
              onPress={() => {
                setOptionsAlertOpen(false);
                navigation.navigate('Settings', { name: "Home" });
              }}>设置</Button>
            <Divider></Divider>
            <Button
              variant='menu'
              onPress={() => {
                setOptionsAlertOpen(false);
                navigation.navigate('Help', { name: "Home" });
              }}>帮助</Button>
            <Divider></Divider>
            <Button
              variant='menu'
              onPress={() => {
                BackHandler.exitApp();
              }}>退出</Button>
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


        <ScrollView ref={scrollRef} style={styles.scrollView} scrollEnabled={!searchOpen} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} scrollEventThrottle={1}>

          <Animated.View
            style={{
              translateY: translY
            }}
          >

            {/* View 1 */}
            <Animated.View
              style={{
                marginTop: view1marTop1
              }}
            >
              <View style={styles.view__1}>
                <Panel>
                  <Image
                    source={require("../assets/vt.png")}
                    style={{ resizeMode: 'contain', width: 64, height: 64 }}
                  />
                </Panel>

              </View>
            </Animated.View>

            <View style={{
              position: "absolute",
              right: 20,
              top: 20,
              height: 48,
              width: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>

              <Button onPress={() => {
                setOptionsAlertOpen(true);
              }} >
                <IonicIcon style={{
                  color: "#8F8D8DFE",
                  fontSize: 16,
                }} name="ellipsis-vertical" />
              </Button>
            </View>

            {/* View 2 */}
            <View style={styles.view__2}>

              <View>

                <TouchableOpacity
                  onPress={searchBarClicked1}
                  style={{ width: "100%" }}
                >

                  <Panel style={styles.view_input_c_1}>

                    {
                      searchOpen
                        ?
                        <IonicIcon onPress={closeSearchBtn} style={styles.search_icon} name="arrow-back" />
                        :
                        <IonicIcon style={styles.search_icon} name="search" />
                    }

                    {
                      searchOpen ?
                        <TextInput
                          style={{
                            fontSize: 14,
                            color: "#5B5D5DFF",
                            marginLeft: 8,
                            fontFamily: "Helvetica",
                            flexGrow: 1,
                          }}
                          value={searchValue}
                          onChangeText={(text) => onSearchChangeText(text)}
                          autoFocus={true}
                          editable={searchOpen}
                          onSubmitEditing={() => searchString(searchValue)}
                          placeholderTextColor="#CECFCFFF"
                        />
                        :
                        <Text style={styles.search_text}>搜索 {appInfo.searchEngine.replace("!", "")}</Text>
                    }

                  </Panel>

                </TouchableOpacity>

              </View>

            </View>

            {/* Search */}

            <Animated.View
              style={{
                opacity: searchItemsBBo2,
              }}
            >

              {
                searchOpen ?
                  <View style={styles.searchItemsBB_1}>

                    {
                      lastSearchedWeb == false || searchValue !== "" ?
                        <></> :
                        <View style={styles.searchItemsBB_CON_1}>
                          <View>
                            <IonicIcon style={styles.searchItemsBB_1_A} name="globe-outline" />
                          </View>
                          <View style={styles.searchItemsBB_1_B_CON}>
                            <TouchableOpacity onPress={() => { openWebsite(lastSearchedWeb.url) }}>
                              <View>
                                <Text style={styles.searchItemsBB_1_B}>
                                  {lastSearchedWeb.name.length > 26 ? lastSearchedWeb.name.substring(0, 24) + "..." : lastSearchedWeb.name}
                                </Text>
                                <Text style={styles.searchItemsBB_1_B__2}>
                                  {lastSearchedWeb.url.length > 38 ? lastSearchedWeb.url.substring(0, 36) + "..." : lastSearchedWeb.url}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View>
                            <Button onPress={deleteLastSearchWeb}>
                              <IonicIcon style={styles.searchItemsBB_1_C} name="trash-outline" />
                            </Button>
                          </View>
                        </View>
                    }
                    <Divider style={{ marginTop: 16 }}></Divider>
                    {

                      searchItems == "" ? <></> :
                        <>
                          {
                            searchValue !== "" ?
                              <></> :
                              <Text style={styles.searchHeadingB_1}>搜索历史</Text>
                          }
                          <SearchItem searchValue={searchValue} searchItems={searchItems} openOutlineHandle={openOutlineHandle} openWebsiteHandle={openWebsiteHandle} />
                        </>
                    }

                  </View>
                  :
                  <></>
              }

            </Animated.View>

            <Animated.View
              style={{
                opacity: bottomViewsAll2
              }}
            >

            </Animated.View>

          </Animated.View>

        </ScrollView>
      </Panel>
    </SafeAreaView>
  )

}

export default Home;