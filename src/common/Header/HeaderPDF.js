// @flow

import React from 'react'
import {
  Text, View, StyleSheet, TouchableOpacity, StatusBar
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

import { WIDTH, getFont, getLineHeight, HEIGHT, getWidth } from '../../config';
import R from '../../assets/R';


const HeaderPDF = (props) => {
  const { title, onButton } = props;
  return (
    <View style={styles.header}>
      <StatusBar backgroundColor={R.colors.colorMain} />
      <TouchableOpacity
        onPress={() => onButton()}
        style={styles.menu}
      >
        <Ionicons name="ios-arrow-back" size={HEIGHT(26)} color={R.colors.white} />
      </TouchableOpacity>
      <View style={styles.cntTextInput}>
        <Text numberOfLines={1} style={[styles.text, {}]}>
          {title}
        </Text>
      </View>
    </View>
  )
}


export default HeaderPDF;

const styles = StyleSheet.create({
  header: {
    height: HEIGHT(43),
    width: getWidth(),
    flexDirection: 'row',
    backgroundColor: R.colors.colorMain,
    alignItems: 'center',
    paddingRight: 5,
  },
  menu: {
    paddingLeft: 8,
    width: HEIGHT(55),
  },
  logo: {
    width: HEIGHT(26),
    height: HEIGHT(35),
  },
  cntlogoStart: {
    width: WIDTH(35),
    height: HEIGHT(35),
  },
  logoStart: {
    width: WIDTH(35),
    height: HEIGHT(25),
  },
  text: {
    color: R.colors.white,
    fontSize: getFont(17),
    lineHeight: getLineHeight(20),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: R.fonts.RobotoMedium,
    width: WIDTH(200),
    flexWrap: 'wrap',
    fontWeight: 'bold'
  },
  textMini: {
    color: R.colors.white,
    fontSize: getFont(13),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: R.fonts.RobotoRegular,
  },
  cntTextInput: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: getWidth() * 0.53,
    height: HEIGHT(30),
    backgroundColor: R.colors.red103,
    fontSize: getFont(14),
    fontFamily: R.fonts.RobotoRegular,
    marginLeft: 5,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
    color: R.colors.white,
  }
})
