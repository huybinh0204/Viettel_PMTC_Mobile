import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { WIDTH, getFontXD, getLineHeightXD, WIDTHXD, HEIGHTXD } from '../../config/Function';
import R from '../../assets/R';

export default class HeaderProfile extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { fullName, department } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.touchImg}>
          <Image source={R.images.avatar} style={styles.img} />
        </View>
        <Text style={styles.textTitle}>{fullName}</Text>
        <Text style={styles.textDetail}>{department}</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: WIDTHXD(1065),
    marginTop: -HEIGHTXD(118)
  },
  textTitle: {
    fontSize: getFontXD(60),
    lineHeight: getLineHeightXD(72),
    color: R.colors.blue255,
    fontFamily: R.fonts.RobotoMedium,
    marginTop: HEIGHTXD(32),
    opacity: 1
  },
  textDetail: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    color: R.colors.black0,
    fontFamily: R.fonts.RobotoRegular,
    marginTop: HEIGHTXD(11),
    opacity: 1
  },
  img: {
    width: WIDTHXD(234.51),
    height: WIDTHXD(234.51),
    borderRadius: WIDTHXD(118),
  },
  touchImg: {
    alignItems: 'center',
    backgroundColor: R.colors.white,
    borderWidth: WIDTH(2),
    borderColor: R.colors.white,
    borderRadius: WIDTHXD(118),
    overflow: 'hidden',
    width: WIDTHXD(236.51),
    height: WIDTHXD(236.51),
    elevation: 2,
    shadowColor: '#181F4D21',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
  }
})
