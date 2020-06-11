import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD, numberWithCommas } from '../../../../../config';
import ItemCheckBox from '../../GeneralInfor/ItemViews/ItemCheckBox'

const ItemSignFile = (props) => {
  const { item, onPressItem, viewOnly, onPressCheckbox } = props
  return (
    <TouchableOpacity style={styles.root} onPress={() => onPressItem && onPressItem(item)}>
      <Text style={{
        width: WIDTHXD(83),
        fontSize: getFontXD(42),
        fontFamily: R.fonts.RobotoRegular,
        color: '#000',
        textAlign: 'center',
        alignSelf: 'center'
      }}>{item.lineno}</Text>
      <View style={{ width: 1, backgroundColor: '#E6E6E6', height: '100%' }} />
      <View style={{
        width: WIDTHXD(270),
        paddingVertical: HEIGHTXD(38.5),
      }}>
        <Text style={styles.text_title}>Loại file</Text>
        <Text style={[styles.text_title, { paddingTop: HEIGHTXD(36) }]}>Tên file</Text>
      </View>
      <View style={{
        flex: 1,
        paddingVertical: HEIGHTXD(38.5),
      }}>
        <View style={{
          flexDirection: 'row'
        }}>
          <Text style={styles.text_content}>{item.isFileSignType}</Text>
          <ItemCheckBox title='File ký chính'
            disabled={viewOnly}
            checked={item.isFileSign === 'Y'}
            onPress={() => {
              onPressCheckbox && onPressCheckbox(item);
            }} />
        </View>
        <Text style={[styles.text_content, { paddingTop: HEIGHTXD(30) }]}>{item.filename}</Text>
      </View>
    </TouchableOpacity >
  )
}
export default ItemSignFile;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: WIDTHXD(1070),
    // alignItems: 'center',
    backgroundColor: R.colors.white,
    marginTop: HEIGHTXD(23),
    marginHorizontal: WIDTHXD(28),
    paddingRight: WIDTHXD(53),
    borderRadius: WIDTHXD(34),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  text_title: {
    color: '#919191',
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    paddingLeft: WIDTHXD(29),
    marginTop: HEIGHTXD(6),
  },
  text_content: {
    color: '#000000',
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    flex: 1
  }
});
