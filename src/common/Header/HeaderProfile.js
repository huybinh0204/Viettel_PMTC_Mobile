import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WIDTH, getFontXD, getLineHeightXD, WIDTHXD, HEIGHTXD } from '../../config/Function';
import R from '../../assets/R';

export default class HeaderProfile extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { fullName, department, nonLinear } = this.props
    return (

      <View
        style={styles.container}
      >
        <StatusBar
          backgroundColor={R.colors.colorMain}
          barStyle="light-content"
        // translucent={true}
        />
        <TouchableOpacity
          onPress={this.props.onPress}
          style={{ flexDirection: 'row' }}
        >
          <View
            style={[styles.touchImg]}
          >
            <Image source={R.images.avatar} style={styles.img} />
          </View>
          <View style={styles.textProfile}>
            <Text style={styles.textTitle}>{fullName}</Text>
            <Text style={styles.textDetail}>{department}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: WIDTHXD(48.51),
    paddingTop: HEIGHTXD(57),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: HEIGHTXD(73.45)
  },
  textTitle: {
    fontSize: getFontXD(45),
    lineHeight: getLineHeightXD(65),
    color: R.colors.white,
    fontFamily: R.fonts.RobotoMedium,
    marginLeft: WIDTHXD(33.64),
    opacity: 1
  },
  textDetail: {
    fontSize: getFontXD(39),
    lineHeight: getLineHeightXD(47),
    color: R.colors.white,
    fontFamily: R.fonts.RobotoRegular,
    marginLeft: WIDTHXD(33.64),
    opacity: 0.5
  },
  img: {
    width: WIDTHXD(121.85),
    height: WIDTHXD(121.85),
  },
  touchImg: {
    alignItems: 'center',
    backgroundColor: R.colors.white,
    borderWidth: 1,
    borderColor: R.colors.white,
    borderRadius: WIDTHXD(65),
    overflow: 'hidden',
    opacity: 1
  },
  textProfile: {
    justifyContent: 'center',
    flexDirection: 'column',
  }
})
