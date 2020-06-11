import React, { Component } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import PickerItem from './CustomPicker';
import R from '../../../assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../../config'

type Props = {
  value: string,
  data: Array,
  onValueChange: Function,
  style: StyleProp<ViewStyle>,
  width: StyleProp<ViewStyle>,
  containerStyle: StyleProp<ViewStyle>,
  label: String,
  require: Boolean
}

export default class ItemPicker extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { onValueChange, data, value, style, width, containerStyle, isFilter, require, label } = this.props;
    return (
      <View style={[styles.container, style]}>
        <PickerItem
          enableEdit={this.props.enableEdit}
          containerStyle={[styles.ctnPicker, containerStyle]}
          isFilter={isFilter}
          data={data}
          require={require}
          label={label}
          value={value}
          onValueChange={onValueChange}
          width={width}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  ctnPicker: {
    alignSelf: 'flex-start',
    width: WIDTHXD(600),
    height: HEIGHTXD(100),
    borderColor: R.colors.borderGray,
    borderWidth: 0.3,
    marginTop: 0
  },
  require: {
    color: 'red',
    fontSize: getFontXD(42),
    marginLeft: WIDTHXD(12)
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    marginBottom: HEIGHTXD(8)
  },
})
