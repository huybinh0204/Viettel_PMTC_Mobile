import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from '../../routers/NavigationService';
import { getFontXD, WIDTHXD, HEIGHTXD, getLineHeightXD } from '../../config';
import R from '../../assets/R';

export default class HeaderSimple extends PureComponent {
  render() {
    const { title } = this.props;

    return (
      <LinearGradient
        style={styles.container}
        colors={R.colors.colorHeaderGradien}
      >
        <StatusBar backgroundColor={R.colors.colorMain} barStyle="light-content" />

        <View style={styles.wrapper}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            onPress={() => NavigationService.pop()}
            style={styles.backBtn}
          >
            <Fontisto name="angle-left" size={WIDTHXD(46)} color={R.colors.white} />
          </TouchableOpacity>
          <View style={styles.view}>
            <Text style={styles.textTitle}>{title}</Text>
          </View>
        </View>
      </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: HEIGHTXD(65.68),
    paddingBottom: HEIGHTXD(91.24),
    backgroundColor: R.colors.colorMain,
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: WIDTHXD(83) },
  backBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: getFontXD(54),
    lineHeight: getLineHeightXD(65),
    color: R.colors.white,
    fontFamily: R.fonts.RobotoMedium
  },
  view: {
    justifyContent: 'center',
    width: WIDTHXD(917),
    marginLeft: WIDTHXD(50)
  },
})
