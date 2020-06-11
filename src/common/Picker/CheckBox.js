import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { CheckBox } from 'react-native-elements'
import R from '../../assets/R'; 
import { WIDTH, HEIGHT, getFont,WIDTHXD, HEIGHTXD } from '../../config/Function';
/**
 * To display a checkbox with a title you must pass data including the title and initialization value of the checkbox
 * @param title title of checkbox
 * @param textStyle to custom style text title
 * @param value to set value init of checkbox
 * @method onChangeBox call when you enter checkbox
 * @callback onValueChange If you want to get the value of the checkbox when changing this function down
 */
class CheckBoxs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // checked: false
    };
  }

  /**
 * Function to change value when touch checkbox
 */
  onChangeBox = () => {
    const { onValueChange } = this.props
    onValueChange && onValueChange(!this.props.value)
    // this.setState({ checked: !this.state.checked })
  }

  componentDidMount() {
    // const { value } = this.props
    // if (typeof value === 'boolean') {
    //   this.setState({ checked: value })
    // }
  }

  render() {
    const { title, textStyle, containerStyle } = this.props
    const { checked } = this.state
    return (
      <View style={styles.inputBox}>
        <CheckBox
          onPress={this.onChangeBox}
          containerStyle={[{ backgroundColor: 'transparent', borderWidth: 0, marginLeft: -WIDTH(10) }, containerStyle]}
          center
          title={title}
          size={WIDTH(30)}
          iconLeft
          iconType="material"
          checkedIcon={<Image style={{height: WIDTHXD(54), width: WIDTHXD(54)}} source={R.images.iconCheck} />}
          uncheckedIcon={<Image  style={{height: WIDTHXD(54), width: WIDTHXD(54)}} source={R.images.iconUnCheck} />}
          checkedColor={R.colors.colorMain}
          uncheckedColor="#BAC7D3"
          checked={this.props.value}
          textStyle={[styles.textDate, textStyle]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputBox: {
    // width: WIDTH(339),
    // borderRadius: HEIGHT(8),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textDate: {
    fontSize: getFont(16),
    color: '#4F4F4F',
    fontWeight: 'normal'
  }
});

export default CheckBoxs;
