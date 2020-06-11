import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { getWidth, getFont, HEIGHTXD, getFontXD } from '../../../../../config';
import R from '../../../../../assets/R';

const renderItem = (item, index, onChange, length) => {
  const [holding, setHolding] = useState(false);

  let color = item.enable ? R.colors.colorMain : 'rgb(121,134,156)';

  return (
    <TouchableOpacity
      style={[styles.itemContainer, (length && length > 0) && { width: getWidth() / length }]}
      onPress={() => onChange && onChange(index)}
      onPressIn={() => setHolding(true)}
      onPressOut={() => setHolding(false)}
      key={index}
      disabled={!item.enable}
      activeOpacity={1}
    >
      <Image
        source={item.enable ? (!holding ? item.iconName.in : item.iconName.out) : item.iconName.disable}
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
      <ScrollView style={{
        width: '100%',
      }} horizontal={true}>
        {menu.map((item, index) => (renderItem(item, index, onChange, menu.length)))}
      </ScrollView>
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
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: '#000000',
    elevation: 4,
    marginTop: 20
  },
  itemContainer: {
    width: getWidth() / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconName: {
    fontSize: getFontXD(33),
    marginTop: HEIGHTXD(20)
  },
  image: {
    height: HEIGHTXD(72),
    width: HEIGHTXD(72),
    resizeMode: 'contain'
  }
});
