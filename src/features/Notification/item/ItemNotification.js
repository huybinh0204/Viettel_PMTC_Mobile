import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { getFontXD, WIDTHXD, HEIGHTXD, getLineHeightXD, getWidth, toPriceVnd } from '../../../config';
import R from '../../../assets/R';

export default ({ item, index, sourceIcon, onPressItem }) => (
  <View style={[{ marginTop: -HEIGHTXD(1) }]}>
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: item.isRead === 0 ? R.colors.white90 : R.colors.white }]}
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
          {item.type ?
            <View>
              <View style={styles.leftTxt}>
                <Text style={styles.txtTitle}>{item.textNotify}</Text>
                <Text style={[styles.price]}>
                  {toPriceVnd(item.price)}
                </Text>
              </View>
              <Text style={styles.txtContent}>{item.description}</Text>
              <Text style={item.type === 2 ? [styles.textStatus, { color: R.colors.color504 }] : [styles.textStatus]}>{item.statusContent}</Text>
            </View>
            :
            <View style={styles.leftTxtColumn}>
              <Text style={[styles.txtTitle, { fontSize: getFontXD(R.fontsize.contentFieldTextSize) }]}>{item.contentFull}</Text>
              <Text style={[styles.txtTitle, { fontSize: getFontXD(R.fontsize.contentFieldTextSize) }]}>Vui lòng kiểm tra và thực hiện quyết toán trước thời hạn</Text>
            </View>
          }
          <Text style={styles.textDate}>{item.created}</Text>

        </View>
      </View>
    </TouchableOpacity>
  </View >
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

  txtTitle: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.grayText,
    flexWrap: 'wrap'
  },

  txtContent: {
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.black0,
    flexWrap: 'wrap',
    marginTop: HEIGHTXD(20)
  },

  viewIcon: {
    width: WIDTHXD(120),
    height: WIDTHXD(120),
    borderRadius: WIDTHXD(60),
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: WIDTHXD(30),
    marginTop: HEIGHTXD(20)
  },
  viewLeft: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  viewColumn: {
    flexDirection: 'column',
  },

  textDate: {
    marginTop: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(30),
    color: R.colors.color777
  },

  textStatus: {
    marginTop: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoItalic,
    fontSize: getFontXD(36),
    color: R.colors.colorNameBottomMenu
  },

  textAction: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(39),
    lineHeight: getLineHeightXD(55),
    color: R.colors.color777
  },

  leftTxt: {
    flexDirection: 'row',
    width: (getWidth() * 78) / 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftTxtColumn: {
    flexDirection: 'column',
    width: (getWidth() * 78) / 100,
    justifyContent: 'space-between',
  },

  price: {
    marginRight: WIDTHXD(20),
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.colorNameBottomMenu,
    opacity: 1
  },
})
