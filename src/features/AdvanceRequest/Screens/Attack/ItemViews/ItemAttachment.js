import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CheckBox } from 'native-base'
import R from '../../../../../assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD, WIDTH } from '../../../../../config';

export default (props) => {
  const { filename, type, pressItemAttack, isFileSign, onCheck, index, checkbox } = props
  return (
    <TouchableOpacity
      onPress={pressItemAttack}
      style={styles.mainContainer}
    >
      <View style={styles.containerItem}>
        <View style={{ flexDirection: 'row', flex: 2 }}>
          <FastImage source={R.strings.fileTypeIcon[type].icon} style={styles.icon} resizeMode={FastImage.resizeMode.stretch} />
          <Text numberOfLines={1} style={styles.title}>{filename}</Text>
        </View>
        {checkbox
          ? <TouchableOpacity style={styles.ctnCheckbox} onPress={() => onCheck(index)}>
            <CheckBox
              onPress={() => onCheck(index)}
              checked={isFileSign}
              size={WIDTH(30)}
              color={isFileSign ? R.colors.colorNameBottomMenu : R.colors.colorCheckBox}
              style={{ borderRadius: HEIGHTXD(18) }}
            />
            <Text style={[styles.label, { marginLeft: WIDTHXD(56), color: R.colors.black0 }]}>File ký chính</Text>
          </TouchableOpacity>
          : null}
      </View>
    </TouchableOpacity>
  )
};
const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1.5,
      height: 1.5,
    },
    shadowOpacity: 0.3,
    elevation: 4,
    marginTop: HEIGHTXD(30),
  },
  ctnCheckbox: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: WIDTHXD(36),
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginVertical: HEIGHTXD(13),
    color: R.colors.color777,
  },
  containerItem: {
    width: WIDTHXD(1065),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(30),
    paddingVertical: HEIGHTXD(25),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginLeft: WIDTHXD(26),
    flexWrap: 'wrap',
    flex: 1,
  },
  icon: {
    width: WIDTHXD(56),
    height: HEIGHTXD(69)
  }
})
