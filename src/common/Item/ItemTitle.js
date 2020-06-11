import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import R from 'assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../config/Function';


export default (props) => {
  let { title, isRequire } = props
  return (
    <View style={styles.flexColumn}>
      {isRequire ?
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>{title}</Text>
          <Text style={[styles.require, { marginRight: WIDTHXD(36) }]}>*</Text>
        </View>
        :
        <Text style={styles.label}>{title}</Text>
      }
    </View>
  )
}
const styles = StyleSheet.create({
  flexColumn: {
    flexDirection: 'column',
  },
  require: {
    color: 'red',
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    marginLeft: WIDTHXD(12)
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    marginVertical: HEIGHTXD(13),
    color: R.colors.color777,
  }
})
