// @flow
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import NavigationService from '../../routers/NavigationService';
import { getFontXD, WIDTHXD, HEIGHTXD, getLineHeightXD } from '../../config';
import R from '../../assets/R';


type Props = {
  title: string,
  placeholderSearch: string,
  search: string,
  isSearch: boolean,
  onChangeSearch: Function,
  setIsSearch: Function,
  onButtonSetting: Function,
  onButtonSearch: Function
}

export default class HeaderStatement extends PureComponent<Props> {
  render() {
    const { title, search, isSearch, onChangeSearch, setIsSearch, placeholderSearch, onButtonSetting } = this.props;
    return (
      <LinearGradient
        style={styles.container}
        colors={R.colors.colorHeaderGradien}
      >
        <StatusBar
          backgroundColor={R.colors.colorMain}
          barStyle="light-content"
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingHorizontal: WIDTHXD(60) }}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            onPress={() => {
              if (isSearch) {
                setIsSearch(false);
              }
              else {
                NavigationService.pop()
              }
            }
            }

            style={styles.backBtn}
          >
            <Fontisto name="angle-left" size={WIDTHXD(46)} color={R.colors.white} />
          </TouchableOpacity>
          <View>
            {isSearch
              ? <View style={styles.btnSearch}>
                <TextInput
                  value={search}
                  // onEndEditing={() => setIsSearch(false)}
                  onChangeText={onChangeSearch}
                  placeholder={placeholderSearch}
                  style={styles.formEnterInfo}
                  placeholderTextColor='#8D8D8D'
                />
                <TouchableOpacity
                  hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                  onPress={() => onChangeSearch('')}
                  style={{ flex: 0 }}
                >
                  <Ionicons
                    name="ios-search"
                    size={WIDTHXD(43)}
                    color="#8D8D8D"
                  />
                </TouchableOpacity>
              </View>
              : <View style={styles.view}>
                <Text style={styles.textTitle}>{this.props.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: WIDTHXD(210) }}>
                  <TouchableOpacity
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    onPress={this.props.onButtonSearch}
                    style={{ flex: 0 }}
                  >
                    <Image
                      resizeMode="contain"
                      source={R.images.iconSearch}
                      style={styles.btn}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onButtonSetting}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{ flex: 0 }}
                  >
                    <Image
                      resizeMode="contain"
                      source={R.images.iconFilter}
                      style={styles.btn}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            }
          </View>
        </View>
      </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    marginTop: HEIGHTXD(53),
    paddingBottom: HEIGHTXD(91),
    backgroundColor: R.colors.colorMain,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnTextInput: {
    justifyContent: 'center',
    flex: 0,
  },
  formEnterInfo: {
    width: WIDTHXD(800),
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoMedium,
    color:R.colors.black0
  },
  btnSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(30),
    alignItems: 'center',
    marginLeft: WIDTHXD(40),
    height: HEIGHTXD(120),
    backgroundColor: R.colors.white,
    width: WIDTHXD(917),
    borderRadius: WIDTHXD(20),
  },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: HEIGHTXD(20),
  },
  textTitle: {
    fontSize: getFontXD(54),
    lineHeight: getLineHeightXD(65),
    color: R.colors.white,
    fontFamily: R.fonts.RobotoMedium
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WIDTHXD(917),
    marginLeft: WIDTHXD(40)
  },
  iconSearch: {
    height: WIDTHXD(43),
    width: WIDTHXD(43),
  },
  btn: {
    height: WIDTHXD(75),
    width: WIDTHXD(75),
    justifyContent: 'center',
    alignItems: 'center'
  }
})
