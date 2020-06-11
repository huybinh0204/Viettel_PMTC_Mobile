import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import R from 'assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD, getLineHeightXD, getWidth } from '../../../config';


const ItemCustomer = (props) => {
  const { companyName, phone, index, onPressItem, companyAdd } = props
  return (
    <View style={{
      width: getWidth(),
      shadowColor: '#181F4D21',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    }}>
      <TouchableOpacity
        onPress={() => onPressItem && onPressItem()}
        style={styles.containerItem}
        key={index}
      >
        <Text style={styles.textTitle}>{companyName}</Text>
        <Text style={styles.textPhone}>{phone}</Text>
        <Text style={styles.textAdd}>{companyAdd}</Text>
      </TouchableOpacity>
    </View>

  )
};

export default ItemCustomer

const styles = StyleSheet.create({
  containerItem: {
    width: WIDTHXD(1065),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(30),
    alignSelf: 'center',
    marginTop: HEIGHTXD(30),
    paddingHorizontal: WIDTHXD(45)
  },
  textTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(42),
    marginTop: HEIGHTXD(24),
    lineHeight: getLineHeightXD(51)
  },
  textPhone: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(39),
    marginTop: HEIGHTXD(24),
    marginBottom: HEIGHTXD(17),
    lineHeight: getLineHeightXD(47)
  },
  textAdd: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(39),
    marginVertical: HEIGHTXD(17),
    lineHeight: getLineHeightXD(47),
  }
})
