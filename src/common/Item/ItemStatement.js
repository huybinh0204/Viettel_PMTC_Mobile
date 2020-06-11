import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import R from '../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD } from '../../config';
import SwipeableRowItem from '../Swipe/SwipeableRowItem'

const listIcon = [
  { name: 'arrange-bring-forward', bgrColor: '#ddd', color: '#000' },
  { name: 'pencil', bgrColor: '#ddd', color: '#000' },
  { name: 'delete', bgrColor: '#dd2c00', color: '#fff' }
]
const ItemStatement = (props) => {
  const { isShowMonth, index, time, color, content, onPressIcon } = props
  return (
    <View style={{ marginBottom: HEIGHTXD(30) }}>
      {(isShowMonth && index > 0) && <View style={styles.line} />}
      {isShowMonth && <Text style={styles.txtMonth}>{`Tháng ${time.month}, ${time.year}`}</Text>}
      <SwipeableRowItem
        key={index.toString()}
        listIcon={listIcon}// list icon per swipe
        onPress={(indexs) => { onPressIcon(indexs) }}// when touch icon will receipt index of icon
        index={index}
        width={50 * listIcon.length}
      >
        <TouchableOpacity style={styles.content}>
          <View style={[styles.txtDay, { borderLeftColor: color }]}>
            <Text style={styles.month}>{`T${time.month}`}</Text>
            <Text style={styles.day}>{`${time.day}`}</Text>
          </View>
          <View style={styles.secView}>
            <View style={styles.leftTxt}>
              <Text style={styles.id}>{content.id}</Text>
              <Text style={[styles.price, { color }]}>{content.price}</Text>
            </View>
            <Text numberOfLines={1} style={styles.title}>{content.title}</Text>
            <Text style={[styles.deadline, { color }]}>{`${content.status} ngày ${content.deadline}`}</Text>
          </View>
        </TouchableOpacity>
      </SwipeableRowItem>

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
    borderLeftWidth: WIDTHXD(16),
    borderRightWidth: 1,
    // height: HEIGHTXD(240),
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
    // width: getWidth() * 80 / 100,
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
  title: {
    fontSize: getFontXD(42),
    // fontWeight: 'bold',
    width: WIDTHXD(754),
    fontFamily: R.fonts.RobotoMedium,
    lineHeight: getLineHeightXD(51),
    marginBottom: HEIGHTXD(21),
    opacity: 1
  },
  leftTxt: {
    flexDirection: 'row',
    width: getWidth() * 78 / 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HEIGHTXD(23)
  },
});
