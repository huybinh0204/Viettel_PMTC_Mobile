import React from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';
import { WIDTHXD, getWidth, HEIGHTXD } from '../../config';

const rowSwipeAnimatedValues = {};


/**
   * Displays a swipe use as FlatList
   *@param listIcon list image icon in swipe (for example :  [R.image.iconDelete] )
   *@param widthListIcon with of list icon
   *@callback onPressIcon call when you choice one of list icon return index of icon and index of item
   *@param rightOfList end of list icon margin Right screen
   *@param styleOfIcon custom style of icon
   *@param data you must convert data to format [{title:"",data:[{...Object1,key:'0.0'},{...Object2,key:'0.1'},..]},{title:"",data:[{...Object3,key:'1.0'},{...Object4,key:'1.1'},...]}]
   * example see in list Invoice
   */
export default class SecsionListSwipe extends React.PureComponent {
    indexOfItem = 0.0

    closeRow = (rowMap, rowKey) => {
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
    };

    renderRightAction = (rowMap, image, indexOfIcon) => (
      <TouchableHighlight
        underlayColor="transparent"
        key={indexOfIcon.toString()}
        onPress={() => {
          this.closeRow(rowMap, this.indexOfItem)
          this.props.onPressIcon(indexOfIcon, this.indexOfItem)
        }}
        style={{ flex: 0, justifyContent: 'center' }}
      >
        <Image
          source={image}
          style={[styles.trash, this.props.styleOfIcon && this.props.styleOfIcon]}
        />
      </TouchableHighlight>
    );

      onRowOpen = rowKey => {
        this.indexOfItem = rowKey
      };

      onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
        rowSwipeAnimatedValues[key].setValue(Math.abs(value));
      };

        convertData =(data) => {
          this.props.data
            .forEach((_, i) => {
              _.data.forEach((item, index) => {
                rowSwipeAnimatedValues[`${item.key}`] = new Animated.Value(0);
              })
            });
          let dataTmp = []
          data.map((item, index) => {
            dataTmp.push({ ...item, key: index })
          })
          return dataTmp
        }

      renderHiddenItem = (data, rowMap) => (
        <Animated.View style={[styles.backRightBtnRight, this.props.rightOfList && { right: this.props.rightOfList },
          { transform: [{ translateX: rowSwipeAnimatedValues[data.item.key].interpolate({
            inputRange: [0, getWidth()],
            outputRange: [getWidth(), 0],
          }) }] }
        ]}
        >
          {this.props.listIcons.map((item, index) => this.renderRightAction(rowMap, item, index))}
        </Animated.View>
      )


      render() {
        const data = this.convertData(this.props.data)
        const { widthListIcon } = this.props
        return (
          <View style={styles.container}>
            <SwipeListView
              {...this.props}
              data={data}
              renderHiddenItem={this.renderHiddenItem}
              rightOpenValue={-widthListIcon || -WIDTHXD(387)}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowOpen={this.onRowOpen}
              onSwipeValueChange={this.onSwipeValueChange}
              disableRightSwipe={true}
              swipeToOpenPercent={10}
              swipeToClosePercent={10}
            />
          </View>
        );
      }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  backRightBtnRight: {
    flexDirection: 'row',
    flex: 1,
  },
  trash: {
    height: WIDTHXD(99),
    width: WIDTHXD(99),
    marginLeft: WIDTHXD(30),
    marginTop: HEIGHTXD(30)
  },
});
