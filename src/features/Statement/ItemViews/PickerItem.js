import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Image } from 'react-native'
import { Picker, Icon } from 'native-base'
import { HEIGHTXD, WIDTHXD, getFontXD, getLineHeightXD } from '../../../config/Function';
import R from '../../../assets/R';


type Props = {
  value?: string,
  containerStyle?: StyleProp<ViewStyle>,
  data: Array<{
    id: string,
    name: string,
    value: string
  }>,
  onValueChange?: Function,
  width: number
}
type State = {
  valueItem: string,

}
/**
   * This Function to show piker with list date (for example [{name:'Picker1'},{name:'Picker2}])
   * @callback onValueChange return value of item you choice
   * @param value value of picker you choice
   * @param containerStyle custom containerStyle of view
   * @param data data value of date
   * @param width width of picker
   * @param date value of date you choice
   * other you can make minDate,maxDate... with props of libary react-native-datepicker
   */
export default class PickerItem extends React.Component<Props, State> {
  state = {
    valueItem: '0',
  }

  render() {
    const { width, data, onValueChange, value, containerStyle, height } = this.props
    return (
      <View style={[styles.inputBox, containerStyle, width && { width }, height && { height }]}>
        <Picker
          mode="dropdown"
          selectedValue={value || (data[0] && data[0].fwmodelId)}
          style={{ width: width || WIDTHXD(960) }}
          iosHeader="Chọn"
          headerBackButtonText="Quay lại"
          iosIcon={
            <Image
              resizeMode="contain"
              source={R.images.iconDropdown}
              style={{
                width: WIDTHXD(35),
                height: WIDTHXD(18),
                marginRight: WIDTHXD(25),
              }}
            />}
          itemTextStyle={styles.itemTextStyle}
          onValueChange={(itemValue) => {
            onValueChange && onValueChange(itemValue)
            this.setState({ valueItem: itemValue })
          }
          }
        >
          {
            data && data.map((item, index) => (<Picker.Item key={index.toString()} label={item.name && item.name} value={item.fwmodelId && item.fwmodelId} />))
          }
        </Picker>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  inputBox: {
    width: WIDTHXD(960),
    borderRadius: HEIGHTXD(20),
    // paddingHorizontal: WIDTHXD(8),
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHTXD(99),
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    flexDirection: 'row',
  },
  itemTextStyle: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
  }
})
