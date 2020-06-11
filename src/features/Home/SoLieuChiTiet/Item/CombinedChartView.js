import React, { Component } from 'react';
import { View, processColor, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import { CombinedChart } from 'react-native-charts-wrapper';
import PickerItem from '../../../../common/Picker/PickerItem';
import { WIDTH, WIDTHXD, getFontXD, HEIGHTXD, NetworkSetting, numberWithCommas } from '../../../../config';
import R from '../../../../assets/R';
import { showAlert, TYPE } from 'common/DropdownAlert';
import { showLoading, hideLoading } from 'common/Loading/LoadingModal';
import { connect } from 'react-redux';
import { PostData } from 'apis/helpers';
import moment from 'moment';


class CombinedChartView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexShowColum: moment().quarter() - 1,
      legend: {
        enabled: false,
      },
      marker: {
        enabled: false,
      },
    };
  }

  _renderItem = (val, index) => {
    const absData = this.props.dataQuy.map(x => Math.abs(x));
    let height = Math.abs(val) / Math.abs(Math.max(...absData)) * HEIGHTXD(1000);
    // set min is 150
    if (isNaN(height) || height === Infinity || height === 0 || height < 350) height = 350;
    let left = WIDTHXD(1035 - 122 * 4) / 5 * (index + 1) + WIDTHXD(122) * (index);
    let textWidth = height - WIDTHXD(122);
    let textHeight = WIDTHXD(122);
    let OFFSET = textWidth / 2 - textHeight / 2
    if (this.state.indexShowColum === index) {
      let unit = ' VNĐ';
      let money = numberWithCommas(val);
      if (val > 100000000000) {
        unit = ' Triệu';
        money = numberWithCommas(Math.round(val / 1000000));
      }
      return (
        <View style={[
          styles.containerCol,
          { left, height, backgroundColor: this.props.showChi ? R.colors.colorMain : R.colors.corlor9c },

        ]}
          key={index + ''}
        >
          <Text
            style={[
              { height: textHeight, width: textWidth, transform: [{ rotate: '-90deg' }, { translateX: -OFFSET }, { translateY: -OFFSET }], paddingTop: WIDTHXD(30) },
              styles.textMoney
            ]}
            numberOfLines={1}
          >{money}<Text style={{ fontSize: getFontXD(42), fontFamily: R.fonts.RobotoRegular }}>{unit}</Text></Text>
          <TouchableOpacity style={styles.bottomButton} onPress={() => this.setState({ indexShowColum: index })}>
            <Text style={styles.textButton}>{R.strings.quyTitle[index]}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <TouchableOpacity key={index + 'column'} onPress={() => this.setState({ indexShowColum: index })} style={[styles.bottomButton, { position: 'absolute', bottom: HEIGHTXD(26), left }]}>
          <Text style={styles.textButton}>{R.strings.quyTitle[index]}</Text>
        </TouchableOpacity>
      )
    }
  }

  render() {
    let data = {
      lineData: {
        dataSets: [{
          values: this.props.valueSoDu,
          label: '',
          config: {
            lineWidth: 2,
            drawValues: false,
            drawCircles: false,
            color: processColor('#F57300'),
            drawFilled: true,
            drawCircleHole: false,
            highlightEnabled: false,
            fillAlpha: 50,
            fillGradient: {
              colors: [processColor('#fff8f7'), processColor('#F57300')],
              positions: [0, 1],
              angle: 90,
              orientation: 'BOTTOM_TOP',
            },
          }
        }, {
          values: this.props.valueDaChi,
          label: '',
          config: {
            drawValues: false,
            drawCircleHole: false,
            highlightEnabled: false,
            // highlightColor: processColor('transparent'),
            colors: [processColor(R.colors.colorMain)],
            mode: 'CUBIC_BEZIER',
            drawCircles: false,
            lineWidth: 2,
          }
        }],
      },
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textTitle}>{this.props.title}</Text>
          <PickerItem
            defaultValue={this.props.year}
            data={[{ name: '2020' }, { name: '2019' }]}
            width={WIDTHXD(260)}
            height={HEIGHTXD(66)}
            iconDropdown={R.images.drop}
            iconDropdownStyle={{ width: WIDTHXD(30), height: HEIGHTXD(30) }}
            containerStyle={{ borderWidth: 0 }}
            onValueChange={this.props.onValueChange}
          />
        </View>
        <CombinedChart
          scaleEnabled={false}
          doubleTapToZoomEnabled={false}
          pinchZoom={false}
          dragEnabled={false}
          data={data}
          legend={this.state.legend}
          marker={this.state.marker}
          xAxis={{ drawGridLines: false, drawAxisLine: false, drawLabels: false }}
          chartDescription={{ text: '' }}
          yAxis={{ left: { drawGridLines: false, drawAxisLine: false, drawLabels: false }, right: { drawGridLines: false, drawAxisLine: false, drawLabels: false } }}
          style={styles.containerChart}
        />
        {this.props.dataQuy.map((val, ind) => this._renderItem(val, ind))}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, {
})(CombinedChartView);

const styles = StyleSheet.create({
  containerCol: {
    width: WIDTHXD(122),
    backgroundColor: R.colors.colorMain,
    position: 'absolute',
    bottom: HEIGHTXD(26),
    borderRadius: WIDTHXD(70),
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textMoney: {
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.white,
    fontSize: getFontXD(54),
    justifyContent: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingHorizontal: HEIGHTXD(20),
  },
  textButton: {
    fontSize: getFontXD(47),
    fontFamily: R.fonts.RobotoBold
  },
  bottomButton: {
    width: WIDTHXD(122),
    height: WIDTHXD(122),
    borderRadius: WIDTHXD(70),
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    height: HEIGHTXD(800),
    marginTop: HEIGHTXD(250),
  },
  container: {
    backgroundColor: 'white',
    width: WIDTHXD(1035),
    borderRadius: WIDTHXD(36),
    alignSelf: 'center',
    shadowColor: '#00000014',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
    paddingBottom: HEIGHTXD(160)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHTXD(47),
    paddingHorizontal: WIDTHXD(35),
  },
  textTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(54)
  }
});
