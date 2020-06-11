import { StyleSheet, } from 'react-native';
import { HEIGHT, WIDTH, getFont, getHeight } from '../../config';
import R from '../../assets/R';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.colorWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: Object.assign(
    { justifyContent: 'center', alignItems: 'center' },
    { flex: 0, }
  ),
  textVersion: {
    width: WIDTH(360),
    lineHeight: HEIGHT(22),
    paddingHorizontal: WIDTH(15),
    fontSize: getFont(14),
    textAlign: 'center',
    color: R.colors.grey701,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  image: {
    marginTop: HEIGHT(30),
    width: WIDTH(179),
    height: getHeight() * (133 / 640),
  },
  label: Object.assign(
    { justifyContent: 'center', alignItems: 'center' },
    { flex: 0, }
  ),
  textLabel: {
    color: R.colors.colorBlack,
    fontSize: getFont(18),
    fontFamily: R.fonts.RobotoRegular,
    fontWeight: 'bold',
  },
  textStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 14
  }
});
