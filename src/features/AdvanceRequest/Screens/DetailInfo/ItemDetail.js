import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import R from '../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getLineHeightXD, numberWithCommas, ellipsis } from '../../../../config';

const ItemInvoice = (props) => {
  const { content, onPressIcon, time, color } = props
  const fontSize = numberWithCommas(content.price).lenght > 10 ? getFontXD(36) : getFontXD(42)
  return (
    <TouchableOpacity
      onPress={() => onPressIcon(content.id)}
      activeOpacity={0.8}
      style={styles.content}
    >
      <View style={[styles.txtDay, { borderLeftColor: color }]}>
        <Text style={styles.month}>{`T${time.month}`}</Text>
        <Text style={styles.day}>{`${time.day}`}</Text>
      </View>
      <View style={styles.viewRight}>
        <Text style={styles.title}>{ellipsis(content.name, 50)}</Text>
        <Text style={[styles.price, { fontSize }]}>{content.price && `${numberWithCommas(content.price)}`}</Text>
      </View>
    </TouchableOpacity>
  )
}
export default ItemInvoice;

const styles = StyleSheet.create({
  txtMonth: {
    marginLeft: WIDTHXD(46),
    lineHeight: getLineHeightXD(43),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    marginTop: HEIGHTXD(23),
    opacity: 1,
    fontFamily: R.fonts.RobotoMedium
  },
  content: {
    flexDirection: 'row',
    width: WIDTHXD(1065),
    height: HEIGHTXD(180),
    alignSelf: 'center',
    backgroundColor: R.colors.white,
    marginTop: HEIGHTXD(24),
    borderRadius: WIDTHXD(30),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  viewRight: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: HEIGHTXD(8)
  },
  txtDay: {
    borderRightWidth: 1,
    borderLeftWidth: WIDTHXD(16),
    width: WIDTHXD(125),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: WIDTHXD(30),
    borderTopLeftRadius: WIDTHXD(30),
    borderRightColor: R.colors.grey300,
    borderLeftColor: R.colors.white
  },
  month: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    lineHeight: getLineHeightXD(43),
    opacity: 0.7,
    color: R.colors.black0
  },
  day: {
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoRegular,
    lineHeight: getLineHeightXD(58),
    opacity: 1,
    color: R.colors.black0
  },
  price: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.color949,
    opacity: 1,
    flex: 1.5,
    textAlign: 'right',
    marginRight: WIDTHXD(36)
  },
  title: {
    fontSize: getFontXD(39),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    flex: 3,
    marginLeft: WIDTHXD(32),
  },
});
