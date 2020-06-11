import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import R from 'assets/R';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { WIDTHXD, getFontXD } from '../../../../../config/Function';

export default class ItemCheckBox extends React.Component {
  state = {

  }

  render() {
    const { title, checked, onPress, disabled } = this.props
    const propStyle = this.props.style;

    return (
      <TouchableOpacity style={{
        flexDirection: 'row',
        alignItems: 'center',
        ...(propStyle ? propStyle : {})
      }}
        disabled={disabled}
        onPress={onPress}>
        <View style={{
          height: WIDTHXD(54),
          width: WIDTHXD(54),
          borderRadius: WIDTHXD(18),
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: checked ? R.colors.colorStatusSubmisson : '#00000029',
          backgroundColor: checked ? R.colors.colorStatusSubmisson : '#fff'
        }}>
          <Ionicons name="md-checkmark" color={checked ? "#fff" : "#fff"} size={WIDTHXD(40)} />
        </View>
        <Text style={{
          fontSize: getFontXD(42),
          fontFamily: R.fonts.RobotoRegular,
          color: R.colors.black0,
          marginLeft: WIDTHXD(30)
        }}
        >
          {title && title}
        </Text>
      </TouchableOpacity>
    )
  }
}
