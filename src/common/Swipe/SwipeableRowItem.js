import React, { Component } from 'react';
import { Animated, StyleSheet, View, I18nManager } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import { WIDTH, WIDTHXD, HEIGHTXD } from '../../config/Function';

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

/**
   * Displays a swipe use as (<SwipeableRowItem><Item/></SwipeableRowItem>)
   *@param listIcon list icon in swipe (for example :   [{ name: 'delete', bgrColor: '#dd2c00', color: '#fff' }]) icon in react-native-vector-icons/MaterialCommunityIcons
   *@param width with of list icon
   *@callback onPress call when you choice one of list icon return index of icon
   *@param data is a array
   */
export default class SwipeableRowItem extends Component {
  // show a action
  renderRightAction = (text, color, x, progress, dragX, colorIcon, index) => {
    let out = index === 0 ? 1 : 1.3
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x * out, 0],
    });
    const pressHandler = () => {
      this.close();
      this.props.onPress && this.props.onPress(index)
    };
    const scale = dragX.interpolate({
      inputRange: [-x, 0],
      outputRange: [1, 0.1],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View
        key={index.toString()}
        style={{ flex: 1, transform: [{ translateX: trans }] }}
      >
        <RectButton
          style={[styles.rightAction, { backgroundColor: 'transparent' }]}
          onPress={pressHandler}
        >
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <AnimatedIcon
              style={[styles.actionIcon, { transform: [{ scale }] }]}
              name={text}
              size={WIDTHXD(45)}
              color={colorIcon}
            />
          </View>
        </RectButton>
      </Animated.View>
    );
  };

  // show list action of right
  renderRightActions = (progress, dragX) => {
    let width = _.has(this.props, 'width') ? this.props.width : WIDTH(200)
    return (
      <View
        key={progress}
        style={{ width, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}
      >
        {this.props.listIcon && this.props.listIcon.map((item, index) => this.renderRightAction(item.name, item.bgrColor, width / (index + 1), progress, dragX, item.color, index))}
      </View>
    )
  }

  // set ref of Swiperable
  updateRef = ref => {
    this._swipeableRow = ref;
  };

  // set close swipe
  close = () => {
    this._swipeableRow.close();
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={10}
        rightThreshold={10}
        overshootLeft={false}
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: WIDTHXD(30),
  },
  actionIcon: {
    // width: WIDTHXD(99),
    // marginLeft: WIDTHXD(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    height: HEIGHTXD(99),
    width: HEIGHTXD(99),
    borderRadius: HEIGHTXD(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"red"
  }
});
