import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import _ from 'lodash'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PickerItem from '../../../common/ItemPicker';
import PickerDate from '../../../../../common/Picker/PickerDate';
import R from '../../../../../assets/R';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth } from '../../../../../config/Function';
import ModalSearch from '../../../common/Modal';

class ItemGeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      body: {}
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ body: this.props.value })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ body: nextProps.value })
    }
    if (nextProps.showAllField !== this.props.showAllField) {
      this.setState({ expanded: nextProps.showAllField })
    }
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(
      {
        duration: 500,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ expanded: !this.state.expanded }, () => this.props.updateExpanded(this.state.expanded, 0));
  }

  render() {
    const { value, onChangeValue } = this.props;
    const { body, expanded } = this.state
    const documentNo = body && body.documentNo ? body.documentNo : '';
    const requestType = body.requestType !== '' ? body.requestType : '';
    const paymentOrgName = body && body.paymentOrgName ? body.paymentOrgName : '';
    const cBpartnerName = body && body.cBpartnerName ? body.cBpartnerName : '';
    let paymentMethod = '';
    if (body.paymentMethod) {
      _.forEach(R.strings.local.HINH_THUC_CHI_TRA, item => {
        if (item.value === body.paymentMethod) {
          paymentMethod = item.name
        }
      })
    }
    const cCostCategoryName = body && body.cCostCategoryName ? body.cCostCategoryName : '';
    const description = body && body.description ? body.description : '';
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30), paddingVertical: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>Thông tin chung</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingHorizontal: WIDTHXD(30) }}>
              {value.documentNo
                ? <View style={styles.flexRowDoc}>
                  <Text style={[styles.label, { textAlign: 'left' }]}>Số chứng từ</Text>
                  <Text style={{ fontSize: getFontXD(42), fontFamily: R.fonts.RobotoRegular, flex: 1, textAlign: 'center' }}>{documentNo}</Text>
                  <Text style={[styles.label, { textAlign: 'left', color: 'white' }]}>Số chứng từ</Text>
                </View>
                : null}
              <View style={styles.flexRow}>
                <View style={[styles.flexColumn]}>
                  <PickerItem
                    enableEdit={this.props.enableEdit}
                    label="Loại đề nghị"
                    require={false}
                    width={WIDTHXD(692)}
                    data={R.strings.local.LOAI_DE_NGHI}
                    value={requestType}
                    onValueChange={(pos, itemChild) => {
                      onChangeValue({ key: 'requestType', value: itemChild.value })
                    }}
                  />
                </View>
                <View style={styles.flexColumn}>
                  <Text style={styles.label}>Ngày chứng từ</Text>
                  <PickerDate
                    enableEdit={this.props.enableEdit}
                    containerStyle={styles.ctnPicker}
                    value={body.transDate ? body.transDate : value.transDate}
                    width={WIDTHXD(342)}
                    onValueChange={obj => {
                      body.transDate = obj;
                      this.setState({ body })
                      onChangeValue({ key: 'transDate', value: obj })
                    }}
                  />
                </View>
              </View>
              <View style={[styles.flexColumn, { alignItems: 'flex-start' }]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  require={false}
                  label="Người yêu cầu"
                  value={cBpartnerName}
                  id={body.cBpartnerId}
                  title="Người yêu cầu"
                  keyApi="cBpartner"
                  onValueChange={obj => {
                    body.cBpartnerName = obj.name
                    onChangeValue({ key: 'cBpartnerId', value: obj.id })
                    this.setState({ body })
                  }}
                />
              </View>
              <View style={[styles.flexColumn, { alignItems: 'flex-start' }]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  require={true}
                  label="Đơn vị chi trả"
                  value={paymentOrgName}
                  id={body.paymentOrgId}
                  title="Đơn vị chi trả"
                  keyApi="payUnit"
                  onValueChange={obj => {
                    body.paymentOrgName = obj.name
                    onChangeValue({ key: 'paymentOrgId', value: obj.id })
                    this.setState({ body })
                  }}
                />
              </View>
              <View style={[styles.flexColumn]}>
                <TextInput
                  editable={this.props.enableEdit}
                  maxLength={250}
                  multiline={true}
                  numberOfLines={2}
                  value={description}
                  onChangeText={text => {
                    body.description = text;
                    this.setState({ body })
                    onChangeValue({ key: 'description', value: text })
                  }}
                  placeholder="Nội dung"
                  style={styles.formEnterInfo}
                />
              </View>
              <View style={[styles.flexColumn]}>
                <PickerItem
                  enableEdit={this.props.enableEdit}
                  require={true}
                  label="Hình thức chi trả"
                  width={WIDTHXD(1065)}
                  data={R.strings.local.HINH_THUC_CHI_TRA}
                  value={paymentMethod}
                  onValueChange={(pos, itemChild) => {
                    onChangeValue({ key: 'paymentMethod', value: itemChild.value })
                  }}
                />
              </View>
              <View style={[styles.flexColumn, { marginBottom: HEIGHTXD(36) }]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  require={false}
                  label="Yếu tố chi phí"
                  value={cCostCategoryName}
                  id={body.cCostCategoryId}
                  title="Yếu tố chi phí"
                  keyApi="costFactor"
                  onValueChange={obj => {
                    body.cCostCategoryName = obj.name
                    onChangeValue({ key: 'cCostCategoryId', value: obj.id })
                  }}
                />
              </View>
            </View>
          )
        }
      </View>
    )
  }
}

export default ItemGeneralInfo;

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
  ctnPicker: {
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    width: null,
    paddingHorizontal: WIDTHXD(64),
  },
  itemLast: {
    alignItems: 'flex-start',
    paddingBottom: HEIGHTXD(24),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.borderGray,
    paddingVertical: 0,
  },
  flexRowDoc: {
    flexDirection: 'row',
    paddingVertical: 0,
    alignItems: 'center',
    marginTop: HEIGHTXD(30),
  },
  flexColumn: {
    flexDirection: 'column',
    marginTop: HEIGHTXD(40),
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
    paddingVertical: WIDTHXD(10)
  },
  formEnterInfo: {
    fontSize: getFontXD(42),
    minHeight: HEIGHTXD(220),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    paddingHorizontal: WIDTHXD(32),
    paddingBottom: HEIGHTXD(12),
    width: WIDTHXD(1064),
    borderColor: R.colors.iconGray,
    borderWidth: 0.3,
    borderRadius: WIDTHXD(20),
  },
  wrapperText: {
    width: WIDTHXD(300),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(20),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.borderGray,
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(46)
  },
  label: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    marginBottom: HEIGHTXD(8)
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0
  }
})
