import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
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
      <Image source={item.iconName} style={styles.image} resizeMode="stretch" />
      <Text style={[styles.iconName, { color }]}>{item.name}</Text>
    </TouchableOpacity>
  );
};

class BottomTabAdd extends Component {
  // const BottomTabAdd = (props) => {
  render() {
    const { menu, activeIndex, onChange } = this.props;
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
  }
}

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
    width: getWidth() / 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconName: {
    fontSize: getFont(13)
  },
  image: {
    height: HEIGHTXD(58.9),
    width: HEIGHTXD(58.9)
  }
});
