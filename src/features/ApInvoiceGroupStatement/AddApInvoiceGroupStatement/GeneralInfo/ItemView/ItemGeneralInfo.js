import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'assets/languages/i18n';
import moment from 'moment';
import PickerDate from '../../../../../common/Picker/PickerDate';
import PickerSearch from '../../../../../common/Picker/PickerSearch';
import PickerItem from '../../../../../common/Picker/PickerItem';
import ItemTitle from '../../../../../common/Item/ItemTitle';
import R from '../../../../../assets/R';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth, getLineHeightXD } from '../../../../../config/Function';
import ItemInputTextGeneral from '../../../../../common/Item/ItemInputTextGeneral'
import AdvanceRequest from '../../../../../apis/Functions/advanceRequest';
import ModalSearch from '../../../common/Modal';

class ItemGeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      isReadOnly: false,
      body: {}
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ body: this.props.value, isReadOnly: this.props.isReadOnly })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ body: nextProps.value })
    }
    if (nextProps.showAllField !== this.props.showAllField) {
      this.setState({ expanded: nextProps.showAllField })
    }
    if (nextProps.isReadOnly !== this.props.isReadOnly) {
      this.setState({ isReadOnly: nextProps.isReadOnly })
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
    const { listParner, onChangeValue } = this.props;
    const { expanded, body, isReadOnly } = this.state;
    let parnerName = body.cBpartnerName ? body.cBpartnerName : ''
    let costCategoryName = body.cCostCategoryName ? body.cCostCategoryName : ''
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>{i18n.t('GENERAL_INFORMATION')}</Text>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingLeft: WIDTHXD(30), paddingRight: WIDTHXD(31), paddingTop: HEIGHTXD(20) }}>
              {body.documentNo
                ? <View style={styles.flexRowDoc}>
                  <Text style={[styles.label, { textAlign: 'left', flex: 1.5 }]}>Số chứng từ</Text>
                  <Text style={{ fontSize: getFontXD(42), fontFamily: R.fonts.RobotoRegular, textAlign: 'center', flex: 4.5 }}>{body.documentNo}</Text>
                </View>
                : null}
              <View style={[styles.flexRow]}>
                <View style={styles.flexColumn}>
                  <ItemTitle
                    title={i18n.t('TYPE_APINVOICE_GROUP_STATEMENT')}
                    isRequire={true}
                  />
                  <PickerItem
                    // value={item && item.type}
                    disabled={isReadOnly}
                    width={WIDTHXD(670)}
                    maxHeight={HEIGHTXD(210)}
                    data={R.strings.local.APINVOICE_GROUP_STATEMENT_TYPE}
                    onValueChange={(pos, itemChild) => {
                      body.type = itemChild.value;
                      body.typeName = itemChild.name;
                      onChangeValue({ key: 'type', value: itemChild.value })
                      onChangeValue({ key: 'typeName', value: itemChild.name })

                    }}
                    defaultValue={body.typeName}
                    value={body.typeName}
                  />
                </View>
                <View style={styles.flexColumn}>
                  <ItemTitle
                    title={i18n.t('TRANS_DATE')}
                    isRequire={true}
                  />
                  <PickerDate
                    disabled={isReadOnly}
                    // value={item && moment(item.created).format('DD/MM/YYYY')}
                    width={WIDTHXD(342)}
                    onValueChange={obj => {
                      body.transDate = obj;
                      onChangeValue({ key: 'transDate', value: obj })
                    }}
                    value={body.transDate}
                  />
                </View>
              </View>
              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(40) }]}>
                <TextInput
                  editable={!isReadOnly}
                  multiline
                  maxLength={250}
                  // value={item && item.description}
                  placeholder={i18n.t('CONTENT_T')}
                  style={styles.formEnterInfo}
                  onChangeText={text => {
                    body.description = text;
                    onChangeValue({ key: 'description', value: text })
                  }}
                  value={body.description}
                />
              </View>

              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(40) }]}>
                <ItemTitle
                  title={i18n.t('ACCOUNTING_EMAIL')}
                  isRequire={true}
                />
                <View style={styles.flexColumn}>
                  <TextInput
                    editable={!isReadOnly}
                    maxLength={50}
                    style={[styles.wrapperText, styles.content, { width: WIDTHXD(1064), paddingVertical: 0 }]}
                    onChangeText={text => {
                      body.email = text;
                      onChangeValue({ key: 'email', value: text.trim() })
                    }}
                    value={body.email}
                  />
                </View>
              </View>
              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(40) }]}>
                <ItemTitle
                  title={i18n.t('REQUESTER')}
                  isRequire={true}
                />
                <ModalSearch
                  value={parnerName}
                  id={body.cBpartnerId}
                  title={i18n.t('REQUESTER')}
                  isReadOnly={isReadOnly}
                  keyApi="partner"
                  onValueChange={obj => {
                    body.cBpartnerId = obj.id
                    body.cBpartnerName = obj.name
                    onChangeValue({ key: 'cBpartnerId', value: obj.id })
                    onChangeValue({ key: 'cBpartnerName', value: obj.name })
                  }}
                />
              </View>
              <View style={[styles.flexColumn, styles.lastItem, { marginTop: HEIGHTXD(40) }]}>
                <Text style={styles.label}>{i18n.t('COST_CATEGORY')}</Text>
                <ModalSearch
                  value={costCategoryName}
                  id={body.cCostCategoryId}
                  title="Yếu tố chi phí"
                  keyApi="costFactor"
                  isReadOnly={isReadOnly}
                  onValueChange={obj => {
                    body.cCostCategoryId = obj.id
                    body.cCostCategoryName = obj.name
                    onChangeValue({ key: 'cCostCategoryId', value: obj.id })
                    onChangeValue({ key: 'cCostCategoryName', value: obj.name })
                  }}
                />
              </View>
            </View>
          )}
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
  flexRowDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHTXD(30),
    marginBottom: HEIGHTXD(20)
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(36),
    borderBottomColor: R.colors.borderGray
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.iconGray,
  },
  flexColumn: {
    flexDirection: 'column',
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  formEnterInfo: {
    textAlignVertical: 'top',
    paddingHorizontal: WIDTHXD(36),
    minHeight: HEIGHTXD(200),
    width: WIDTHXD(1064),
    marginTop: HEIGHTXD(30),
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    borderColor: R.colors.iconGray,
    color: R.colors.black0,
    borderWidth: 0.3,
    borderRadius: WIDTHXD(20)
  },
  wrapperText: {
    width: WIDTHXD(352),
    paddingHorizontal: WIDTHXD(36),
    borderRadius: HEIGHTXD(20),
    height: HEIGHTXD(99),
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(46),
    marginTop: HEIGHTXD(30)
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label,
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0
  },
  btnText: {
    flex: 0,
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    borderRadius: HEIGHTXD(20),
  },
  require: {
    color: 'red',
    fontSize: getFontXD(42),
    marginLeft: WIDTHXD(12)
  },
})
