import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import R from 'assets/R';
import FastImage from 'react-native-fast-image';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../../../config';

export default ItemSigner = (props) => {
  const { item } = props
  return (
    <TouchableOpacity style={styles.root}>
      <Text style={styles.text_lineno}>{item.lineno}</Text>
      <View style={styles.vline} />
      <View style={styles.contain}>
        <View style={styles.contain_line}>
          <Text style={styles.text_left}>Người ký</Text>
          <Text style={styles.text_right}>{item.cSignerName}</Text>
        </View>
        <View style={styles.contain_line}>
          <Text style={styles.text_left}>Vai trò ký</Text>
          <Text style={styles.text_right}>{item.rolename}</Text>
        </View>
        <View style={styles.contain_line}>
          <Text style={styles.text_left}>Vị trí ký</Text>
          <Text style={styles.text_right}>{item.imagenote}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  root: {
    width: WIDTHXD(1071),
    marginHorizontal: WIDTHXD(23),
    marginTop: HEIGHTXD(30),
    borderRadius: WIDTHXD(40),
    backgroundColor: '#fff',
    minHeight: HEIGHTXD(321),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  text_lineno: {
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoRegular,
    minWidth: WIDTHXD(82),
    textAlign: 'center'
  },
  vline: {
    width: WIDTHXD(1.83),
    height: '100%',
    backgroundColor: '#E6E6E6'
  },
  contain: {
    paddingHorizontal: WIDTHXD(30),
    paddingTop: HEIGHTXD(48),
    justifyContent: 'space-between',
    flex: 1,
    minHeight: HEIGHTXD(280),
  },
  contain_line: {
    flexDirection: 'row',
    width: '100%',
  },
  text_left: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    color: '#5D5D5D',
    width: WIDTHXD(237),
    fontFamily: R.fonts.RobotoRegular
  },
  text_right: {
    fontSize: getFontXD(42),
    color: '#000000',
    flex: 1,
    fontFamily: R.fonts.RobotoRegular
  }
})
