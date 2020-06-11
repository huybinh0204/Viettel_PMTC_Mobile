import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import R from '../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getLineHeightXD } from '../../../../config';
import SwipeableRowItem from '../../../../common/Swipe/SwipeableRowItem'
import { listIcon } from '../../../../config/constants'

const ItemStatement = (props) => {
  const { index, color, content, onPressIcon } = props;
  const icon = [listIcon.Duplicate, listIcon.Edit, listIcon.Delete];
  const email = content && content.email ? content.email : ''
  const no = content && content.no ? content.no : ''
  const cDepartmentName = content && content.cDepartmentName ? content.cDepartmentName : ''
  let status = ''
  if (content && content.approveStatus) {
    _.forEach(R.strings.local.TRANG_THAI_DUYET, item => {
      if (item.id === content.approveStatus) {
        status = item.name
      }
    })
  }
  return (
    <SwipeableRowItem
      key={index.toString()}
      listIcon={icon}
      onPress={(indexs) => { onPressIcon(indexs) }}
      index={index}
      width={50 * icon.length}
    >
      <TouchableOpacity style={styles.content} onPress={() => onPressIcon(4)}>
        <View style={[styles.txtDay, { borderLeftColor: color }]}>
          <Text style={styles.day}>{no}</Text>
        </View>
        <View style={styles.secView}>
          <Text style={styles.title}>{cDepartmentName}</Text>
          <Text>{email}</Text>
          <Text style={[styles.deadline, { color }]}>{status}</Text>
        </View>
      </TouchableOpacity>
    </SwipeableRowItem>
  )
}
export default ItemStatement;

const styles = StyleSheet.create({
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
    width: WIDTHXD(131),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: WIDTHXD(30),
    borderTopLeftRadius: WIDTHXD(30),
    borderRightColor: R.colors.grey300,
    fontFamily: R.fonts.RobotoMedium
  },
  des: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(36),
    color: R.colors.black0
  },
  day: {
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoRegular,
    opacity: 1,
    textAlign: 'center'
  },
  secView: {
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: HEIGHTXD(32),
    paddingHorizontal: WIDTHXD(36)
  },
  deadline: {
    fontSize: getFontXD(33),
    fontFamily: R.fonts.RobotoItalic,
    opacity: 1,
    marginTop: WIDTHXD(16)
  },
  title: {
    color: R.colors.grayText,
    fontSize: getFontXD(42),
    width: WIDTHXD(754),
    fontFamily: R.fonts.RobotoMedium,
    lineHeight: getLineHeightXD(51),
    marginBottom: HEIGHTXD(21),
    opacity: 1
  },
});
