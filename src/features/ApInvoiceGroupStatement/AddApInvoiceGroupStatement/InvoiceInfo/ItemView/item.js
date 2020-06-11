import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD, numberWithCommas } from '../../../../../config';

const ItemInvoice = (props) => {
  const { time, content, onPressItem } = props
  return (
    <View
      style={styles.item}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { onPressItem(content.apInvoiceId) }}
        style={styles.content}
      >
        <View style={styles.txtDay}>
          <Text style={styles.month}>{time.month && `T${time.month}`}</Text>
          <Text style={styles.day}>{time.day && `${time.day}`}</Text>
        </View>
        <View style={styles.secView}>
          <View style={styles.leftTxt}>
            <Text numberOfLines={1} style={[styles.title, { width: WIDTHXD(455) }]}>{content.sellerName}</Text>
            <Text style={[styles.title, { color: '#000000' }]}>{content.vwAmount && `${numberWithCommas(content.requestAmount)}`}</Text>
          </View>
          <Text numberOfLines={1} style={styles.price}>{content.invoiceNo && content.invoiceNo}</Text>
          <Text style={[styles.status, { color: '#000000' }]}>{content.description && content.description}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
export default ItemInvoice;

const styles = StyleSheet.create({
  item: {
    width: WIDTHXD(1068),
    marginLeft: WIDTHXD(30),
  },
  txtMonth: {
    marginLeft: WIDTHXD(16),
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
    alignSelf: 'center',
    backgroundColor: R.colors.white,
    marginTop: HEIGHTXD(23),
    borderRadius: WIDTHXD(30),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  txtDay: {
    borderRightWidth: 1,
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
    opacity: 0.7
  },
  day: {
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoRegular,
    lineHeight: getLineHeightXD(58),
    opacity: 1

  },
  secView: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: HEIGHTXD(31),
    paddingHorizontal: WIDTHXD(36),
  },
  price: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    lineHeight: getLineHeightXD(43),
    color: R.colors.black0,
    opacity: 1,
    marginTop: HEIGHTXD(27)
  },
  status: {
    fontSize: getFontXD(36),
    color: R.colors.colorHoanThanh,
    lineHeight: getLineHeightXD(43),
    fontFamily: R.fonts.RobotoItalic,
    marginTop: HEIGHTXD(21)

  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
  },
  leftTxt: {
    flexDirection: 'row',
    width: WIDTHXD(875),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: WIDTHXD(10)
  },
  line: {
    marginTop: HEIGHTXD(23),
    width: getWidth(),
    marginLeft: -WIDTHXD(30),
    height: 1,
    backgroundColor: R.colors.grey300
  },
});
