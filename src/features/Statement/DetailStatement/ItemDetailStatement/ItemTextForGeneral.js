import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import R from 'assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../../../config/Function';

export default props => {
  let { title, content, width } = props;
  return (
    <View style={styles.flexColumn}>
      <Text style={styles.label}>{title && title}</Text>
      <View style={[styles.wrapperText, width && { width }]}>
        <Text numberOfLines={1} style={styles.content}>
          {content && content}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  flexColumn: {
    flexDirection: 'column'
  },
  wrapperText: {
    width: WIDTHXD(352),
    paddingHorizontal: WIDTHXD(36),
    borderRadius: HEIGHTXD(20),
    height: HEIGHTXD(100),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0
  }
});
