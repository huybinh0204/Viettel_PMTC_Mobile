import React from 'react'
import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';
import R from 'assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../../../../../config/Function';


export default (props) => {
  let { onChangeValue, value } = props
  return (
    <View style={styles.btnText}>
      <TextInput
        value={value && value}
        maxLength={500}
        multiline={true}
        style={[styles.wrapperText, styles.content, { paddingVertical: 0 }]}
        onChangeText={text => {
          onChangeValue && onChangeValue(text)
        }}
        placeholder="Nhập nội dung"
      />
    </View>
  )
}
const styles = StyleSheet.create({
  flexColumn: {
    flexDirection: 'column',
  },
  btnText: {
    flex: 0,
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    borderRadius: HEIGHTXD(20),
    width: WIDTHXD(1064),
    minHeight: HEIGHTXD(200),
    alignSelf: 'center',
    marginTop: HEIGHTXD(40),
  },
  wrapperText: {
    paddingHorizontal: WIDTHXD(36),
    height: HEIGHTXD(100),
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: WIDTHXD(1064),
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label,
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0
  }
})
