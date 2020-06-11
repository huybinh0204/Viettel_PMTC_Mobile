import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import R from 'assets/R';
import { WIDTHXD, getWidth, getFontXD, getLineHeightXD, HEIGHTXD } from '../../../config';
import PickerItem from '../../../common/Picker/PickerItem';
import { redStar } from 'common/Require';

const ItemPicker = (props) => {
  const { title, data, onValueChange, value, width, disabled, require } = props
  return (
    <View style={[styles.container, width && { width }]}>
      <Text style={styles.title}>{title}{require && redStar()}</Text>
      <PickerItem disabled={disabled} defaultValue={value} width={width || WIDTHXD(1064)} data={data} height={HEIGHTXD(99)} onValueChange={onValueChange} />
    </View>
  )
};

export default ItemPicker

const styles = StyleSheet.create({
  container: {
    width: getWidth(),
    paddingHorizontal: WIDTHXD(30),
  },
  title: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
    marginBottom: HEIGHTXD(11),
    marginTop: HEIGHTXD(30),
  }
})
