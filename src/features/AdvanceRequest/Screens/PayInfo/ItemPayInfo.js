import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import _ from 'lodash'
import R from '../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD, toPriceVnd, timeFormat } from '../../../../config';

type Props = {
  isShowMonth: Boolean,
  index: number,
  time: Object,
  color: String,
  content: Object,
  onSuccess: Function,
  onDelete: Function,
  onPressIcon: Function,
}

const ItemStatement = (props: Props) => {
  const { isShowMonth, index, time, content, onPressIcon } = props;
  const documentNo = content.documentNo ? content.documentNo : ''
  const amtAcct = content.amtAcct ? content.amtAcct : ''
  const descriptionLine = content.descriptionLine ? content.descriptionLine : ''
  let day = moment(content.dateAcct, timeFormat).format('D');
  let month = moment(content.dateAcct, timeFormat).format('M');
  let status = ''
  if (content.status) {
    _.forEach(R.strings.local.TRANG_THAI_HACH_TOAN, item => {
      if (item.value === content.status) {
        status = item.name
      }
    })
  }

  return (
    <View style={{ marginBottom: HEIGHTXD(30) }}>
      {(isShowMonth && index > 0) && <View style={styles.line} />}
      {isShowMonth && <Text style={styles.txtMonth}>{`Tháng ${time.month}, ${time.year}`}</Text>}
      <TouchableOpacity style={styles.content} onPress={() => onPressIcon()}>
        <View style={[styles.txtDay]}>
          <Text style={styles.month}>{`T${month}`}</Text>
          <Text style={styles.day}>{`${day}`}</Text>
        </View>
        <View style={styles.secView}>
          <View style={styles.leftTxt}>
            <Text style={styles.id}>{documentNo}</Text>
            <Text style={styles.id}>{toPriceVnd(amtAcct)}</Text>
          </View>
          <Text numberOfLines={1} style={styles.title}>{descriptionLine}</Text>
          <Text style={[styles.deadline]}>{status}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
export default ItemStatement;

const styles = StyleSheet.create({
  line: {
    marginBottom: HEIGHTXD(5),
    width: getWidth(),
    height: 1,
    backgroundColor: R.colors.grey300
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
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(30),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  txtDay: {
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
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoMedium,
    opacity: 1,
    color: R.colors.black0
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
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoItalic,
    opacity: 1,
    color: R.colors.black0
  },
  txtPaymentStatus: {
    fontSize: getFontXD(33),
  },
  title: {
    fontSize: getFontXD(36),
    width: WIDTHXD(754),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(21),
    opacity: 1,
    color: R.colors.black0
  },
  leftTxt: {
    flexDirection: 'row',
    width: getWidth() * 78 / 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HEIGHTXD(23)
  },
});
