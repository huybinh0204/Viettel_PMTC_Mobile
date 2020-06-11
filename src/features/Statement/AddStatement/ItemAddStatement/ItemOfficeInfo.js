// @flow
/* eslint-disable react/jsx-closing-tag-location */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TIEN_TE } from '../../../Invoice/DetailInvoice/dataInvoice'
import PickerItem from '../../../../common/Picker/PickerItem';
import R from '../../../../assets/R';
import { connect } from 'react-redux';
import {setIsHideGroupStatement} from '../../../../actions/statement';
import {
  HEIGHTXD,
  getFontXD,
  WIDTHXD,
  getWidth,
  getLineHeightXD
} from '../../../../config/Function';

class ItemOfficeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hardCopyDocumentNo: "",
    };
  }

  changeLayout = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleY,
        springDamping: 1.7
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 1.7
      }
    });
    this.props.setIsHideGroupStatement({isHideOfficeInfo: !this.props.isHideOfficeInfo});
  };

  renderItem = (item: Object) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: HEIGHTXD(30)
      }}
    >
      <Text style={styles.type}>{item.type}</Text>
      <View style={styles.borderText}>
        <Text style={styles.deNghi}>{item.deNghi}</Text>
      </View>
      <View style={styles.borderText}>
        <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
      </View>
    </View>
  );

  onChangeHardCopyDocumentNo = (text)=>{
    this.setState({hardCopyDocumentNo: text})
  }

  render() {
    const {isHideOfficeInfo} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[
            styles.flexTitle,
            { borderBottomWidth: isHideOfficeInfo === true ? 0.3 : 0 }
          ]}
        >
          <Text style={styles.title}>THÔNG TIN VOFFICE</Text>
          {isHideOfficeInfo === true ? (
            <Ionicons
              name="ios-arrow-down"
              size={WIDTHXD(50)}
              color={R.colors.iconGray}
            />
          ) : (
            <Ionicons
              name="ios-arrow-forward"
              size={WIDTHXD(50)}
              color={R.colors.iconGray}
            />
          )}
        </TouchableOpacity>
        {isHideOfficeInfo && (
          <View
            style={{
              paddingHorizontal: WIDTHXD(30),
              paddingVertical: HEIGHTXD(40)
            }}
          >
            <View style={styles.flexRow}>
              {/* <Text style={[styles.label, { marginRight: WIDTHXD(45) }]}>Tiền tệ</Text>
            <PickerItem
              width={WIDTHXD(300)}
              height={HEIGHTXD(90)}
              data={item.tienTe}
            /> */}
              <Text style={[styles.label, { color: R.colors.blue255 }]}>
                Số, ký hiệu văn bản
              </Text>
              <View style={styles.wrapperText}>
                <TextInput
                  onChangeText={this.onChangeHardCopyDocumentNo}
                  style={{ flex: 1, width: '100%', padding:0 }}
                  numberOfLines={1}
                />
              </View>
            </View>
          </View>
        )}
        {this.props.detail && this.state.isHideOfficeInfo && (
          <View>
            <View
              style={{
                width: getWidth() / 2,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'flex-end'
              }}
            >
              <Text style={styles.leftTitle}>Đề nghị</Text>
              <Text style={styles.rightTitle}>Được duyệt</Text>
            </View>
            <FlatList
              data={TIEN_TE}
              renderItem={({ item }) => this.renderItem(item)}
              style={{ marginBottom: HEIGHTXD(40) }}
            />
          </View>
        )}
        {this.props.detail && this.state.isHideOfficeInfo && (
          <View style={styles.line} />
        )}
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    isHideOfficeInfo: state.statementRuducer.isHideOfficeInfo,
  };
}
export default connect(mapStateToProps, {
  setIsHideGroupStatement
},null, {forwardRef : true})(ItemOfficeInfo);


const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
    // borderRadius: WIDTHXD(30),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
    borderBottomColor: R.colors.iconGray,
    borderWidth: 0.2,
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(59.76)
  },
  flexColumn: {
    flexDirection: 'column'
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase'
  },
  wrapperText: {
    width: WIDTHXD(659),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(8),
    marginLeft: WIDTHXD(45),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.blue255,
    height: HEIGHTXD(99)
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label
  },
  line: {
    height: HEIGHTXD(235),
    position: 'absolute',
    width: WIDTHXD(4),
    right: WIDTHXD(330),
    bottom: HEIGHTXD(36),
    backgroundColor: R.colors.colorBackground,
    flex: 1
  },
  type: {
    width: WIDTHXD(320),
    marginLeft: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36)
  },
  borderText: {
    flex: 0,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground
  },
  deNghi: {
    width: getWidth() / 5,
    textAlign: 'right',
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36)
  },
  duocDuyet: {
    width: getWidth() / 5,
    textAlign: 'right',
    marginRight: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36)
  },
  leftTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36)
  },
  rightTitle: {
    marginRight: WIDTHXD(50),
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36)
  }
});
