import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NavigationService from 'routers/NavigationService';
import { TabDetailStatement } from 'routers/screenNames';
import R from '../../assets/R';
import {
  HEIGHTXD,
  WIDTHXD,
  getFontXD,
  getWidth,
  getLineHeightXD,
  toPriceVnd
} from '../../config';
import SwipeableRowItem from '../../common/Swipe/SwipeableRowItem';

type Props = {
  isShowMonth: Boolean,
  index: number,
  time: Object,
  color: String,
  content: Object,
  onSuccess: Function,
  onDelete: Function,
  onPressIcon: Function
};

const ItemStatement = (props: Props) => {
  const {
    isShowMonth,
    index,
    time,
    color,
    content,
    onPressItem,
    onPressIcon,
    vwamount,
    isSelectItem
  } = props;
  const month = time && time.month ? time.month : '';
  const day = time && time.day ? time.day : '';
  const documentNo = content && content.documentNo ? content.documentNo : '';
  const vwAmount = content && content.vwamount ? content.vwamount : '';
  const vwstatus = content && content.vwstatus ? content.vwstatus : '';
  const payStatus = content && content.payStatus ? content.payStatus : '';
  const docstatus = content && content.docstatus ? content.docstatus : '';
  return (
    <View style={styles.item}>
        <TouchableOpacity
          //  onPress={() => {
          //   NavigationService.navigate(TabDetailStatement, { cStatementId: content.cStatementId })
          // }}
          onPress={() => {
            onPressItem(content);
          }}
          style={[styles.content, { backgroundColor: isSelectItem ? R.colors.borderD4 : R.colors.white }]}
          >
          <View style={[styles.txtDay, { borderLeftColor: color }]}>
            <Text style={styles.month}>{`T${month}`}</Text>
            <Text style={styles.day}>{`${day}`}</Text>
          </View>
          <View style={styles.secView}>
            <View style={styles.leftTxt}>
              <Text style={styles.id}>{documentNo}</Text>
              <Text style={[styles.price, {color: color}]}>
                {toPriceVnd(vwAmount)}
              </Text>
            </View>
            <Text numberOfLines={1} style={styles.title}>
              {content.description}
            </Text>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text style={[styles.deadline, {color: color}]}>{vwstatus}</Text>
              <Text style={styles.txtPaymentStatus}>{payStatus}</Text>
            </View>
          </View>
        </TouchableOpacity>
    </View>
  );
};
export default ItemStatement;

const styles = StyleSheet.create({
  line: {
    marginBottom: HEIGHTXD(5),
    width: getWidth(),
    height: 1,
    backgroundColor: R.colors.grey300
  },
  item: {
    width: WIDTHXD(1068),
    marginLeft: WIDTHXD(30),
  },
  txtMonth: {
    marginLeft: WIDTHXD(46),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    marginBottom: HEIGHTXD(23),
    lineHeight: getLineHeightXD(43),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1
  },
  content: {
    flexDirection: 'row',
    width: WIDTHXD(1065),
    alignSelf: 'center',
    marginTop: HEIGHTXD(23),
    borderRadius: WIDTHXD(30),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },

  txtDay: {
    borderLeftWidth: WIDTHXD(16),
    borderRightWidth: 1,
    width: WIDTHXD(131),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: WIDTHXD(30),
    borderTopLeftRadius: WIDTHXD(30),
    borderRightColor: R.colors.grey300,
    fontFamily: R.fonts.RobotoMedium
  },
  id: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    lineHeight: getLineHeightXD(43),
    opacity: 1
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
    paddingVertical: HEIGHTXD(32),
    paddingHorizontal: WIDTHXD(36)
  },
  price: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1
  },
  deadline: {
    fontSize: getFontXD(33),
    fontFamily: R.fonts.RobotoItalic,
    lineHeight: getLineHeightXD(43),
    opacity: 1
  },
  txtPaymentStatus: {
    fontSize: getFontXD(33)
  },
  title: {
    fontSize: getFontXD(42),
    width: WIDTHXD(754),
    fontFamily: R.fonts.RobotoMedium,
    lineHeight: getLineHeightXD(51),
    marginBottom: HEIGHTXD(21),
    opacity: 1
  },
  leftTxt: {
    flexDirection: 'row',
    width: (getWidth() * 78) / 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HEIGHTXD(23)
  }
});
