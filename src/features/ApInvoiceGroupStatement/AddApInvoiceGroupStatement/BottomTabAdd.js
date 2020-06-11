import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getWidth, getFont, HEIGHTXD } from '../../../config';
import R from '../../../assets/R';

const renderItem = (item, index, activeIndex, onChange) => {
  let color = '';
  if (index === activeIndex) {
    color = R.colors.colorMain
  } else {
    color = '#77869E'
  }
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onChange(index)}
    >
      <Image
        source={item.iconName}
        style={styles.image}
        resizeMode="stretch"
      />
      <Text style={[styles.iconName, { color }]}>{item.name}</Text>
    </TouchableOpacity>
  )
}

const BottomTabAdd = (props) => {
  const { menu, activeIndex, onChange } = props;
  return (
    <View style={styles.container}>
      {renderItem(menu[0], 0, activeIndex, onChange)}
      {renderItem(menu[1], 1, activeIndex, onChange)}
    </View>
  );
}

export default BottomTabAdd;

const styles = StyleSheet.create({
  container: {
    width: getWidth(),
    height: HEIGHTXD(200),
    // position: 'absolute',
    // bottom: 0,
    flexDirection: 'row',
    backgroundColor: R.colors.white,
    shadowRadius: 2,
    shadowOffset: {
      width: 15,
      height: -10,
    },
    shadowColor: '#000000',
    elevation: 4,
  },
  itemContainer: {
    width: getWidth() / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconName: {
    fontSize: getFont(13),
    marginTop: HEIGHTXD(20)
  },
  image: {
    height: HEIGHTXD(58.9),
    width: HEIGHTXD(58.9)
  }
});
