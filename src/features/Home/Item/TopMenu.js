import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import FastImage from 'react-native-fast-image'
import i18n from 'assets/languages/i18n';
import { getWidth, WIDTHXD, getFontXD, getLineHeightXD, HEIGHTXD } from '../../../config';
import R from '../../../assets/R';

const menu = [
  {
    name: i18n.t('STATEMENT_T'),
    icon: R.images.toTrinh
  },
  {
    name: 'Đề nghị TT',
    icon: R.images.deNghi
  },
  {
    name: 'Bảng THTT',
    icon: R.images.bangTHTT
  },
  {
    name: i18n.t('INVOICE_T'),
    icon: R.images.hoaDon
  },
]

const _renderItem = (item, index, onChange) => (
  <TouchableOpacity
    style={styles.itemContainer}
    onPress={() => onChange(index)}
  >
    <View>
      <FastImage
        style={styles.viewIcon}
        source={item.icon}
      />
    </View>
    <Text style={styles.iconName}>{item.name}</Text>
  </TouchableOpacity>
)

const TopMenu = (props) => {
  const { onChange } = props;
  return (
    <View style={styles.container}>
      <FlatList
        data={menu}
        renderItem={({ item, index }) => _renderItem(item, index, onChange)}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

export default TopMenu;

const styles = StyleSheet.create({
  container: {
    width: WIDTHXD(1035),
    alignSelf: 'center',
    paddingHorizontal: WIDTHXD(40),
    backgroundColor: R.colors.white,
    paddingTop: HEIGHTXD(39),
    marginTop: Platform.OS === 'android' ? HEIGHTXD(30) : -HEIGHTXD(8),
    paddingBottom: HEIGHTXD(42),
    borderRadius: WIDTHXD(36),
    shadowColor: '#00000014',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemContainer: {
    width: WIDTHXD(1035 - 80) / 4,
    alignItems: 'center',
  },
  viewIcon: {
    width: WIDTHXD(150),
    height: WIDTHXD(150),
    borderRadius: WIDTHXD(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    opacity: 1
  },
  iconName: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    lineHeight: getLineHeightXD(48),
    color: R.colors.black0,
    fontFamily: R.fonts.RobotoRegular,
    opacity: 1,
    marginTop: HEIGHTXD(21),
    alignSelf: 'center'
  },
});
