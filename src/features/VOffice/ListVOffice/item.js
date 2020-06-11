import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import R from '../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD, numberWithCommas } from '../../../config';

const ItemInvoice = (props) => {
  const { time, content, onPressItem, colorStatus } = props
  // console.log(content)
  return (
    <TouchableOpacity
      onPress={() => {
        // console.log(content)
        onPressItem(content.cDocumentsignId, content.updatedby);
      }}
      style={styles.item}
      activeOpacity={0.8}
    >
      <View style={styles.content_shadow} >
        <View style={styles.content} >
          <View style={{
            backgroundColor: colorStatus,
            width: WIDTHXD(15.72),
          }} />
          <View style={styles.txtDay}>
            <Text style={styles.month}>{time.month && `T${time.month}`}</Text>
            <Text style={styles.day}>{time.day && `${time.day}`}</Text>
          </View>
          <View style={styles.secView}>
            <View style={styles.viewTop}>
              <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{content.name}</Text>
              <Text style={[styles.price, { color: colorStatus }]}>{content.amount ? `${numberWithCommas(content.amount)}` : '0'}</Text>
            </View>
            <Text style={{ ...styles.status, color: colorStatus }}>{content.vwstatus ? content.vwstatus : ''}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
export default ItemInvoice;

const styles = StyleSheet.create({
  item: {
    width: WIDTHXD(1068),
    marginLeft: WIDTHXD(30),
    marginBottom: HEIGHTXD(30),
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
    // marginTop: HEIGHTXD(23),
    borderRadius: WIDTHXD(30),
    // shadowColor: '#181F4D21',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.22,
    // shadowRadius: 2,
    // elevation: 3,
    overflow: 'hidden'
  },
  content_shadow: {
    // flexDirection: 'row',
    // width: WIDTHXD(1065),
    // alignSelf: 'center',
    backgroundColor: R.colors.white,
    // marginTop: HEIGHTXD(23),
    borderRadius: WIDTHXD(30),
    shadowColor: "#181F4D",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,

    elevation: 3,
    // overflow: 'hidden'
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
    paddingTop: HEIGHTXD(27),
    paddingBottom: HEIGHTXD(30),
    paddingRight: WIDTHXD(36),
    paddingLeft: WIDTHXD(33.3),
  },
  price: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.black0,
  },
  status: {
    fontSize: getFontXD(36),
    color: '#1777F1',
    lineHeight: getLineHeightXD(43),
    fontFamily: R.fonts.RobotoItalic,
    marginTop: HEIGHTXD(37)

  },
  title: {
    color: R.colors.black0,
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    flex: 1,
  },
  viewTop: {
    flexDirection: 'row',
    paddingRight: WIDTHXD(10),
    minHeight: HEIGHTXD(102)
  },
  line: {
    marginTop: HEIGHTXD(23),
    width: getWidth(),
    marginLeft: -WIDTHXD(30),
    height: 1,
    backgroundColor: R.colors.grey300
  },
});
