/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Animated, TextInput, } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import { HEIGHTXD, WIDTHXD, getFontXD, getLineHeightXD } from '../../config/Function';
import R from '../../assets/R';

export default class HeaderForNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {

    };
  }

  render() {
    const { title, index, onPressLeft } = this.props;
    return (
      <LinearGradient
        colors={R.colors.colorHeaderGradienTab}
        style={styles.container}
      >
        <StatusBar backgroundColor={R.colors.colorMain} barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.wrapper}>
            <TouchableOpacity
              onPress={() => onPressLeft()}
              hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
            >
              <Fontisto name="angle-left" size={WIDTHXD(46)} color={R.colors.white} />
            </TouchableOpacity>
            <View style={styles.view}>
              <Text style={styles.title}>{title}</Text>
              {index === 0 ?
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: WIDTHXD(105) }}>
                  <TouchableOpacity
                    onPress={() => this.props.readAllNotifcation()}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{ flex: 0 }}
                  >
                    <Image
                      resizeMode="contain"
                      source={R.images.iconReadALl}
                      style={styles.btn}
                    />
                  </TouchableOpacity>
                </View>
                : null}
            </View>
          </View>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.colorMain,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WIDTHXD(917),
    marginLeft: WIDTHXD(40)
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: WIDTHXD(80),
    marginTop: HEIGHTXD(65)
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEIGHTXD(99)
  },
  title: {
    fontSize: getFontXD(54),
    lineHeight: getLineHeightXD(65),
    color: R.colors.white,
    fontFamily: R.fonts.RobotoMedium
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEye: {
    height: HEIGHTXD(45.3),
    width: WIDTHXD(73)
  },
  btn: {
    height: WIDTHXD(75),
    width: WIDTHXD(75),
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(30),
    alignItems: 'center',
    marginLeft: WIDTHXD(40),
    height: HEIGHTXD(99),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
  },
  formEnterInfo: {
    width: WIDTHXD(800),
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoMedium,
    paddingVertical: 0
  },
})
