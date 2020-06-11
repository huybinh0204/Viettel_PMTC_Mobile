import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput
} from 'react-native';
import R from 'assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../../config/Function';
import { redStar } from 'common/Require';


export default (props) => {
  let { title, onChangeValue, width, maxLength, value, marginTop, isNum, numberOfLines, disabled, inputProps, require } = props
  // console.log('valuevaluezz', value)
  return (
    <View style={[styles.flexColumn, marginTop && { marginTop }]}>
      <Text style={styles.label}>{title && title}{require && redStar()}</Text>
      <View style={styles.btnText}>
        <TextInput
          editable={!disabled}
          defaultValue={value && value.toString()}
          maxLength={maxLength && maxLength}
          style={[styles.wrapperText, styles.content, width && { width }, { paddingVertical: 0 }]}
          onChangeText={text => {
            onChangeValue && onChangeValue(text)
          }}
          autoCorrect={false}
          numberOfLines={numberOfLines || 10}
          keyboardType={isNum ? 'numeric' : 'default'}
          placeholder=""
          {...(inputProps ? inputProps : {})}
        />
      </View>
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
  },
  wrapperText: {
    width: WIDTHXD(352),
    paddingHorizontal: WIDTHXD(36),
    height: HEIGHTXD(100),
    alignItems: 'flex-start',
    justifyContent: 'center',

  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
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
