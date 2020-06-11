import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { fetchCurrencyList } from '../../../../../actions/invoice'
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, numberWithCommas } from '../../../../../config/Function';
import global from '../../../global'
import ItemCheckBox from './ItemCheckBox'

class ItemMoneyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reRender: false
    }
  }

  componentDidMount() {
    this.props.fetchCurrencyList({
      isSize: 'true',
      name: ''
    })
  }

  _reRender = () => {
    this.setState({ reRender: !this.state.reRender })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.item.cDocumentsignId !== nextProps.item.cDocumentsignId) {
      this._reRender()
    }
  }

  render() {

    const { self } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.flexRow}>
          <Text style={styles.text_total}>Tổng tiền trình ký (VNĐ)</Text>
          <TextInput
            defaultValue={numberWithCommas(self.dataItem.amount)}
            maxLength={20}
            editable={false}
            keyboardType="numeric"
            multiline={false}
            style={{ textAlign: 'right', minWidth: WIDTHXD(250), borderBottomWidth: 1, borderBottomColor: '#E6E6E6', fontSize: getFontXD(42) }}
            onChangeText={text => {
              const numbers = text.split('.');
              let money = numberWithCommas(numbers[0].split(',').join(''), ',');
              if (numbers.length > 1) {
                money += '.' + numbers[1];
              }

              self.dataItem.currencyRate = money;
              this._reRender()
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center', width: WIDTHXD(1064), justifyContent: 'space-between' }}>
          <View style={{ flex: 0.9 }}>
            <ItemCheckBox title="Mẫu trình ký"
              disabled={self.dataItem.viewOnly}
              checked={self.dataItem.isTemplate === 'Y'}
              onPress={() => {
                self.dataItem.isTemplate = self.dataItem.isTemplate === 'Y' ? 'N' : 'Y';
                this._reRender()
              }} />
            <ItemCheckBox title="Ban hành tự động" style={{ marginTop: HEIGHTXD(40) }}
              disabled={self.dataItem.viewOnly}
              checked={self.dataItem.ispromulgate === 'Y'}
              onPress={() => {
                self.dataItem.ispromulgate = self.dataItem.ispromulgate === 'Y' ? 'N' : 'Y';
                this._reRender()
              }} />
          </View>
          <View style={{ flex: 1.1 }}>
            <ItemCheckBox title="Trình ký song song" checked={true}
              disabled={self.dataItem.viewOnly}
              checked={self.dataItem.isparallelsign === 'Y'}
              onPress={() => {
                self.dataItem.isparallelsign = self.dataItem.isparallelsign === 'Y' ? 'N' : 'Y';
                this._reRender()
              }} />
            <ItemCheckBox title="Tự động chuyển văn bản" style={{ marginTop: HEIGHTXD(40) }}
              disabled={self.dataItem.viewOnly}
              checked={self.dataItem.ispublic === 'Y'}
              onPress={() => {
                self.dataItem.ispublic = self.dataItem.ispublic === 'Y' ? 'N' : 'Y';
                this._reRender()
              }} />
          </View>
        </View>

        <View style={[styles.flexRow]}>
          <View style={{ flex: 0.9 }}>
            <Text style={[styles.label,]}>Trạng thái ký</Text>
            <Text style={[styles.label, { marginTop: HEIGHTXD(40) }]}>Trạng thái tài liệu</Text>

          </View>
          <View style={{ flex: 1.1 }}>
            <Text style={[styles.content,]}>{self.dataItem.approvalstatusName}</Text>
            <Text style={[styles.content, { marginTop: HEIGHTXD(40) }]}>{self.dataItem.docstatusName}</Text>
          </View>
        </View>
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    listCurrency: state.invoiceReducer.listCurrency
  }
}
export default connect(mapStateToProps, { fetchCurrencyList })(ItemMoneyInfo);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WIDTHXD(33),
    paddingTop: HEIGHTXD(45),
    paddingBottom: HEIGHTXD(40),
  },
  wrapperText: {
    width: WIDTHXD(222),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(36),
    marginLeft: WIDTHXD(45),
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: R.colors.borderGray,
    height: HEIGHTXD(90),
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
  },
  content: {
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
  },
  text_total: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
    flex: 1
  },
})
