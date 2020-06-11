import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WIDTH, getWidth, getFont, HEIGHTXD } from '../../../config';
import R from '../../../assets/R';

const renderItem = (item, index, activeIndex, onChange) => {
  let color = '';
  if (index === activeIndex) {
    color = R.colors.colorMain;
  } else {
    color = '#77869E';
  }
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onChange(index)}
    >
      <Icon name={item.iconName} size={WIDTH(25)} color={color} />
      <Text style={[styles.iconName, { color }]}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const BottomTabAdd = props => {
  const { menu, activeIndex, onChange } = props;
  return (
    <View style={styles.container}>
      <FlatList
        data={menu}
        renderItem={({ item, index }) => renderItem(item, index, activeIndex, onChange)
        }
        horizontal
        keyExtractor={(item, index) => item + index}
        extraData={activeIndex}
      />
    </View>
  );
};

export default BottomTabAdd;

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
      height: -10
    },
    shadowColor: '#000000',
    elevation: 4
  },
  itemContainer: {
    width: getWidth() / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconName: {
    fontSize: getFont(13)
  }
});
