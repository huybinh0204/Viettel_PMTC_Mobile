import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Image, Animated, BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from '../../routers/NavigationService';
import { getFontXD, WIDTHXD, HEIGHTXD, getLineHeightXD } from '../../config';
import R from '../../assets/R';

export default class HeaderBtnSearch extends Component {
  state = {
    searchFocus: new Animated.Value(0),
    searchString: null,
    isSearch: false
  };

  _handleSearchFocus = (status) => {
    this.setState({ isSearch: true })
    const widthTmp = this.props.isFilter ? WIDTHXD(800) : WIDTHXD(917)
    Animated.timing(this.state.searchFocus, {
      toValue: status ? widthTmp : 0, // status === true, increase flex size
      duration: 300 // ms
    }).start();
  }

  _setSearch = () => {
    this.setState({ isSearch: false })
    this.props.onChangeSearch('')
  }

  render() {
    const { search, onChangeSearch, placeholderSearch, onButtonSetting, isFilter } = this.props;
    const { searchFocus, isSearch } = this.state;
    return (
      <LinearGradient
        style={styles.container}
        colors={R.colors.colorHeaderGradien}
      >
        <StatusBar backgroundColor={R.colors.colorMain} barStyle="light-content" />

        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingHorizontal: WIDTHXD(60) }}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            onPress={() => {
              if (this.state.isSearch) {
                this._setSearch(false)
                onChangeSearch && onChangeSearch('')
              } else NavigationService.pop()
            }}
            style={styles.backBtn}
          >
            <Fontisto name="angle-left" size={WIDTHXD(46)} color={R.colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            {isSearch
              ? (
                <Animated.View style={[styles.btnSearch, { width: searchFocus }]}>
                  <TextInput
                    value={search}
                    onChangeText={onChangeSearch}
                    autoFocus={true}
                    placeholder={placeholderSearch}
                    placeholderTextColor='#8D8D8D'
                    style={[styles.formEnterInfo, {fontStyle: !_.isEmpty(search)? 'normal' : 'italic'}]}
                  />
                  <TouchableOpacity
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50,}}
                    onPress={() => onChangeSearch('')}
                    style={{ flex: 0 }}
                  >
                    <Ionicons
                      name="ios-search"
                      size={WIDTHXD(55)}
                      color="#8D8D8D"
                    />
                  </TouchableOpacity>
                </Animated.View>
              )
              : (
                <View style={styles.view}>
                  <Text style={styles.textTitle}>{this.props.title}</Text>
                  <TouchableOpacity
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    onPress={() => {
                      this._handleSearchFocus(true)
                    }
                    }
                    style={{ flex: 0 }}
                  >
                    <Image
                      resizeMode="contain"
                      source={R.images.iconSearch}
                      style={styles.btn}
                    />
                  </TouchableOpacity>
                </View>)
            }
          </View>
          {isFilter
            ? (<TouchableOpacity
              onPress={onButtonSetting}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              style={{ flex: 0, marginLeft: WIDTHXD(30) }}
            >
              <Image
                resizeMode="contain"
                source={R.images.iconFilter}
                style={styles.btn}
              />
            </TouchableOpacity>) : null
          }
        </View>
      </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: HEIGHTXD(65),
    paddingBottom: HEIGHTXD(86),
    backgroundColor: R.colors.colorMain,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnTextInput: {
    justifyContent: 'center',
    flex: 0,
  },
  formEnterInfo: {
    // width: WIDTHXD(800),
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoMedium,
    paddingVertical: 0,
    flex:1,
    color:R.colors.black0
  },
  btnSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(30),
    alignItems: 'center',
    marginLeft: WIDTHXD(40),
    minHeight: HEIGHTXD(99),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
    height: HEIGHTXD(132),
  },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitle: {
    fontSize: getFontXD(54),
    // lineHeight: getLineHeightXD(65),
    color: R.colors.white,
    fontFamily: R.fonts.RobotoMedium,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // flex: 1,
    marginLeft: WIDTHXD(40),
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
