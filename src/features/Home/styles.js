import { StyleSheet, Platform } from 'react-native';
import { HEIGHT, WIDTH, getFont, getLineHeight, HEIGHTXD, getWidth, WIDTHXD } from '../../config';
import R from '../../assets/R';

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#F1F3F6',
    borderTopLeftRadius: WIDTHXD(67),
    borderTopRightRadius: WIDTHXD(67),
    marginTop: Platform.OS === 'android'? HEIGHTXD(260) : HEIGHTXD(221.7),
    paddingBottom: HEIGHTXD(48)
  },
  label: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFont(18),
    lineHeight: getLineHeight(26),
    fontWeight: 'bold',
    color: R.colors.black0,
    marginTop: HEIGHT(16),
    marginLeft: WIDTH(18)
  },
  line: {
    width: getWidth(),
    height: HEIGHTXD(45),
    backgroundColor: R.colors.strickColor,
  },
  line2: {
    width: WIDTH(375),
    height: HEIGHTXD(50),
    backgroundColor: R.colors.strickColor,
  },
  renderBox: {
    flexDirection: 'row',
    width: WIDTH(170),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: R.colors.backgroundColor,
    alignSelf: 'center'
  },
  legendBox: {
    width: WIDTH(10),
    height: WIDTH(10),
    marginTop: HEIGHT(5)
  },
});

export default styles;
