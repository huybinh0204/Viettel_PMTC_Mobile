import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import R from 'assets/R';
import { WIDTHXD, getWidth, getFontXD, getLineHeightXD, HEIGHTXD } from '../../../config';
import PickerSearch from '../../../common/Picker/PickerSearch';
import { redStar } from 'common/Require';

const ItemSearch = (props) => {
  const { title, titlePopUP, findData, onValueChange, value, disabled, require } = props
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}{require && redStar()}</Text>
      <PickerSearch
        disabled={disabled}
        width={WIDTHXD(1064)}
        title={titlePopUP}
        height={HEIGHTXD(99)}
        value={value && value}
        data={[]}
        findData={findData && findData}
        onValueChange={(values, item) => {
          onValueChange && onValueChange(values, item)
        }}
      />
    </View>
  )
};

export default ItemSearch

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
