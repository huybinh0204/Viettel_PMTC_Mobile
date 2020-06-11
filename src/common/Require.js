import React, { Component } from 'react';
import { Text } from 'react-native';
import { getFontXD, WIDTHXD } from '../config/Function';

export const redStar = () => {
  return (
    <Text style={{
      color: 'red',
      fontSize: getFontXD(36),
    }}> *</Text>
  )
}