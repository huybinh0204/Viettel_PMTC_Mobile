import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getWidth, getFont, HEIGHTXD } from '../../../config';
import R from '../../../assets/R';

const renderItem = (item, index, onChange, length) => {
  let color = '';
  color = R.colors.colorMain
  return (
    <TouchableOpacity
      style={[styles.itemContainer, (length && length > 0) && { width: getWidth() / length }]}
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

const TabBottom = (props) => {
  const { menu, onChange } = props;
  return (
    <View style={styles.container}>
      <FlatList
        data={menu}
        renderItem={({ item, index }) => renderItem(item, index, onChange, menu.length)}
        horizontal
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
}

export default TabBottom;

const styles = StyleSheet.create({
  container: {
    width: getWidth(),
    height: HEIGHTXD(200),
    position: 'absolute',
    bottom: 0,
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
