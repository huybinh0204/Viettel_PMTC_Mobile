import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { WIDTH, HEIGHT } from '../../config/Function';

export const LoadingComponent = (props) => {
  if (!props.isLoading) return null;
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator color="#1C1C1C" animating size="large" />
    </View>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    elevation: 3,
    left: WIDTH(360) / 2 - WIDTH(10),
    zIndex: 10,
    top: HEIGHT(640) / 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
