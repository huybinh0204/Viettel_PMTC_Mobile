import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { getFontXD, WIDTHXD, HEIGHTXD, getLineHeightXD } from '../../../config';
import R from '../../../assets/R';

export default ({ item, index, sourceIcon, onPressItem }) => (
  <View style={[{ marginTop: -HEIGHTXD(1) }]}>
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.8}
      key={index}
      onPress={() => onPressItem(item, index)}
    >
      <View style={styles.viewLeft}>
        <View style={styles.viewIcon}>
          <Image
            resizeMode="contain"
            source={sourceIcon}
            style={styles.icon}
          />
        </View>
        <View style={styles.viewColumn}>
          <Text style={styles.txtNameGray}>{item.documentNo}</Text>
          <Text style={styles.txtName}>{item.description}</Text>
          <Text style={[styles.textAction, styles.textStatus, { marginTop: HEIGHTXD(15) }]}>{item.updated}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
)
const styles = StyleSheet.create({
  icon: {
    width: WIDTHXD(120),
    height: WIDTHXD(120),
    borderRadius: WIDTHXD(60),

  },
  itemContainerGray: {
    width: WIDTHXD(1065),
    borderRadius: WIDTHXD(30),
    paddingTop: HEIGHTXD(30),
    paddingBottom: HEIGHTXD(45),
    backgroundColor: R.colors.borderD4,
    flexDirection: 'row',
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(62),
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#181F4D21',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
    marginBottom: HEIGHTXD(30)
    // justifyContent: 'space-between',
  },
  itemContainer: {
    width: WIDTHXD(1065),
    borderRadius: WIDTHXD(30),
    paddingVertical: HEIGHTXD(30),
    backgroundColor: R.colors.white,
    flexDirection: 'row',
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(62),
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#181F4D21',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
    marginBottom: HEIGHTXD(30)
    // justifyContent: 'space-between',
  },
  txtName: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(55),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.black0,
    width: WIDTHXD(823),
    flexWrap: 'wrap'
  },

  txtNameGray: {
    fontSize: getFontXD(36),
    lineHeight: getLineHeightXD(55),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.grayText,
    flexWrap: 'wrap'
  },

  viewIcon: {
    width: WIDTHXD(120),
    height: WIDTHXD(120),
    borderRadius: WIDTHXD(60),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: WIDTHXD(30),
  },
  viewLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  viewColumn: {
    flexDirection: 'column',
  },

  textAction: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(30),
    color: R.colors.color777
  },
  textStatus: {
    color: R.colors.colorNameBottomMenu
  }
})
