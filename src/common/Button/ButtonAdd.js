import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WIDTH, HEIGHT, WIDTHXD } from '../../config';
import R from '../../assets/R';

const ButtonAdd = (props) => {
  let { onButton, bottom } = props;
  return (
    <TouchableOpacity
      style={[styles.btn, { bottom: bottom === undefined ? HEIGHT(40) : bottom }]}
      onPress={onButton}
    >
      <Icon name="ios-add" size={WIDTHXD(80)} color={R.colors.white} />
    </TouchableOpacity>
  )
}

export default ButtonAdd;

const styles = StyleSheet.create({
  btn: {
    width: WIDTHXD(150),
    height: WIDTHXD(150),
    borderRadius: WIDTH(50) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.colorMain,
    position: 'absolute',
    alignSelf: 'flex-end',
    right: WIDTHXD(60)
  }
});
