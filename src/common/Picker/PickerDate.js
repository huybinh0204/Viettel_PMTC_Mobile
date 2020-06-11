import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../config/Function';
import R from '../../assets/R';

/**
   * This Function to choice date
   * @callback onValueChange value of date you choice
   * @param value value of date you choice
   * @param containerStyle custom containerStyle of view
   * @param textStyle style value of date
   * @param placeholder value of placeholder
   * @param width width of datePicker
   * @param date value of date you choice
   * other you can make minDate,maxDate... with props of libary react-native-datepicker
   */
class PickerDate extends Component {
  state = {
    date: new Date()
  };

  /**
   * This Function to set date
   * @param date value of date you choice
   */
  onChangeDate = (date) => {
    this.setState({ date })
  }

  render() {
    const { onValueChange, value, containerStyle, textStyle, placeholder, width, disabled } = this.props
    return (
      <View style={[styles.inputBox, containerStyle && containerStyle, width && { width }]}>
        {disabled ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              ...styles.textDate,
              ...textStyle
            }}
            >
              {value && value}
            </Text>
            <Image
              resizeMode="contain"
              source={R.images.iconCalendar}
              style={{
                width: WIDTHXD(39),
                height: WIDTHXD(39),
                marginLeft: WIDTHXD(18),
              }}
            />
          </View>

        ) : (
          <DatePicker
            confirmBtnText="Đồng ý"
            cancelBtnText="Huỷ"
            locale="vi"
            style={[{ paddingHorizontal: 0, borderWidth: 0, width: WIDTHXD(960), }, width && { width: width - WIDTHXD(30) }]}
            date={value || this.state.date}
            mode="date"
            placeholder={placeholder && placeholder}
            format="DD/MM/YYYY"// you can change format of date in date picker
            git
            iconComponent={
              <Image
                resizeMode="contain"
                source={R.images.iconCalendar}
                style={{
                  width: WIDTHXD(39),
                  height: WIDTHXD(39),
                  marginLeft: WIDTHXD(18),
                }}
              />
          }// to custom icon
            customStyles={{
              dateInput: {
                flex: 0,
                marginLeft: WIDTHXD(0),
                borderWidth: 0,
                color: R.colors.black0
              },
              dateText: {
                ...styles.textDate,
              },
              
            }}
            onDateChange={(date) => {
              this.onChangeDate(date)
              onValueChange && onValueChange(date)// return value of date, Fuction from parent
            }}
            {...this.props}
          />
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputBox: {
    borderRadius: WIDTHXD(20),
    width: WIDTHXD(1007),
    height: HEIGHTXD(100),
    borderWidth: 0.3,
    borderColor: R.colors.borderGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: HEIGHTXD(17),
  },
  textDate: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0,
    paddingVertical: HEIGHTXD(25),
  }
});

export default PickerDate;
