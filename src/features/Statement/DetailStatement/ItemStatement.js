import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import R from '../../../assets/R';
import {
  HEIGHTXD,
  WIDTHXD,
  getFontXD,
  getWidth,
  getLineHeightXD,
  numberWithCommas
} from '../../../config';
import SwipeableRowItem from '../../../common/Swipe/SwipeableRowItem';

const listIcon = [
  { name: 'arrange-bring-forward', bgrColor: 'white', color: '#000' },
  { name: 'pencil', bgrColor: 'white', color: '#000' },
  { name: 'delete', bgrColor: '#dd2c00', color: '#fff' }
];
const ItemStatement = props => {
  const {
    isShowMonth,
    content,
    color,
    index,
    onPressIcon,
    time,
    onPressItem
  } = props;
  return (
    <View style={styles.item}>
      {index !== 0 && isShowMonth && <View style={styles.line} />}
      {isShowMonth && (
        <Text style={styles.txtMonth}>
          {'month' && `Tháng ${time.month}, ${time.year}`}
        </Text>
      )}
      <SwipeableRowItem
        key={index.toString()}
        listIcon={listIcon}
        onPress={indexs => {
          onPressIcon(indexs);
        }}
        index={index}
        width={50 * listIcon.length}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            onPressItem(content.cStatementLineId);
          }}
          // onPress={() => { NavigationService.navigate(TabDetailStatement, { idStatement: content.cStatementId }) }}
          style={styles.content}
        >
          <View style={[styles.txtDay, { borderLeftColor: color }]}>
            <Text style={styles.month}>{`T${time.month}`}</Text>
            <Text style={styles.day}>{`${time.day}`}</Text>
          </View>
          <View style={styles.secView}>
            <View style={styles.leftTxt}>
              <Text style={[styles.title, { width: WIDTHXD(455) }]}>
                {content.name}
              </Text>
              <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.title, {width:WIDTHXD(380),textAlign:"right"}]}>
                {content.price && `${numberWithCommas(content.price)}`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </SwipeableRowItem>
    </View>
  );
};
export default ItemStatement;

const styles = StyleSheet.create({
  item: {},
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
    marginTop: HEIGHTXD(23),
    borderRadius: WIDTHXD(30),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1
  },
  txtDay: {
    borderLeftWidth: WIDTHXD(16),
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
    paddingHorizontal: WIDTHXD(36)
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
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
  },
  leftTxt: {
    flexDirection: 'row',
    width: WIDTHXD(875),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: WIDTHXD(10)
  },
  line: {
    marginTop: HEIGHTXD(23),
    width: getWidth(),
    height: 1,
    backgroundColor: R.colors.grey300
  }
});
