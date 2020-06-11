import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  setStatusMenu,
  setTypeOfIconStatementLine,
  setStatementLineID
} from '../../../actions/statement';
import i18n from '../../../assets/languages/i18n';
import Confirm from '../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import {
  getListcStatementLine,
  deleteItemStatement,
  deleteItemStatementLine,
  duplicateStatementLine,
  findByIdStatementLine,
  updateSatementLine
} from '../../../apis/Functions/statement';
import ItemStatement from './ItemStatement';
import {
  HEIGHTXD,
  WIDTHXD,
  getFontXD,
  getWidth,
  convertDataStatement,
  mapTimeVNToWorld,
  renderColorItem,
  getHeight,
  timeFormat
} from '../../../config';
import ItemTrong from '../../../common/Item/ItemTrong';
import ButtonAdd from '../../../common/Button/ButtonAdd';
import R from '../../../assets/R';
import BottomTabAdd from './BottomTabAdd';
import global from '../global'

class ListStatementLine extends Component {
  ConfirmPopup = {};

  differentLineeRef = React.createRef();

  budgeteRef = React.createRef();

  generalInfoLineeRef = React.createRef();

  accountanteRef = React.createRef();

  menu: Array<Object>;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showfooter: false,
      cStatementLineId: 0,
      search: '',
      index: 0,
      loading: false,
      Firstloading: true,
      isLoadingFooter: false,
      data: [],
      reRender: false,
      bodyFilter: {},
      isSearch: false,
      adOrgId: this.props.adOrgId,
      start: 0,
      searchKey: '',
      maxResult: 10,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC',
      oldSearch: '',
      dataStatement: [],
      isShowDetail: false,
      dataStatementLine: {},
      body: {
        // currencyId: null,
        currencyName: null,
        adOrgId: this.props.adOrgId,
        adOrgName: null,
        adClientId: 1000000,
        adClientName: null,
        created: 1585637093426,
        createdFrom: null,
        createdTo: null,
        createdby: 10362509,
        createdbyName: null,
        updated: 1585637093426,
        updatedFrom: null,
        updatedTo: null,
        updatedby: 10362509,
        updatedbyName: null,
        description: 'Tờ trình kinh phí test them moi lan thu 2',
        isactive: 'Y',
        isDeleted: 'N',
        requestAmount: 6628475195,
        approveAmount: 6628475195,
        proposalDate: null,
        proposalDateFrom: null,
        proposalDateTo: null,
        approveDate: '31/03/2020',
        approveDateFrom: null,
        approveDateTo: null,
        warningEmail: null,
        isOutOfList: null,
        currencyRate: 1,
        qtPlanDetailId: null,
        qtPlanDetailName: null,
        planAmount: null,
        useAmount: null,
        remainAmount: null,
        isOutOfBudget: null,
        requestBeforeTaxAmount: 6.628475195e9,
        approvedBeforeTaxAmount: 6.628475195e9,
        requestTaxAmount: null,
        approvedTaxAmount: null,
        keyheader: null,
        keyline: null,
        directRelease: 'N',
        qtPlanId: null,
        qtPlanName: null,
        name: null,
        value: null,
        fwmodelId: 61362,
        logInfo:
          'Org_Value:null,Record_ID:6742029,Table_ID:1000470,Line_ID:61362,Window_ID:333,AD_Org_ID:1000000,Description:Tờ trình kinh phí test them moi,Approve_Amount:6.628.475.195,00,C_Currency_ID:null,Currency_Value:null,Currency_Rate:1',
        isSize: true,
        cCurrencyId: 234,
        cCurrencyName: null,
        cStatementId: 62321,
        cStatementLineId: 61439,
        cBudgetId: 44,
        cCostTypeId: null,
        cPaymentScopeId: null,
        cPurposeId: null,
        cActivityId: null,
        cPlanPeriodId: null,
        cStatementName: null,
        cBudgetName: null,
        cCostTypeName: null,
        cPaymentScopeName: null,
        cPurposeName: null,
        cActivityName: null,
        cPlanPeriodName: null
      }
    };
    this.getSearchStatement = _.debounce(this.getDataSearch, 500);
    this.menu = [
      {
        name: 'Lưu',
        iconName: R.images.iconSaveInActive
      },
      {
        name: 'CO',
        iconName: R.images.iconCodActive
      },
      {
        name: 'Đính kèm',
        iconName: R.images.iconAttackActive
      },
      {
        name: 'Trình ký',
        iconName: R.images.iconSubmitdActive
      },
      {
        name: 'Phiếu in',
        iconName: R.images.iconPrintInActive
      }
    ];
    this.dataItem = {};
  }

  setIsSearch = isSearch => {
    this.setState({ isSearch });
  };

  _onPressConfirm = async value => {
    try {
      const bodyFilter = this._convertParams(value);
      const response = await getListStatement(bodyFilter);
      if (response && response.status === 200) {
        this.setState({ dataStatement: response.data.data, bodyFilter });
      }
    } catch (err) { }
  };

  _convertParams = value => {
    const start = 0;
    const body = { maxResult: 10, start };
    _.forEach(value, (item, index) => {
      switch (index) {
        case 0:
          _.forEach(R.strings.local.TRANG_THAI_TAI_LIEU, itemChild => {
            if (itemChild.name === item) {
              body.docstatus = itemChild.id;
            }
          });
          break;
        case 1:
          _.forEach(R.strings.local.TRANG_THAI_DUYET, itemChild => {
            if (itemChild.name === item) {
              body.approveStatus = itemChild.id;
            }
          });
          break;
        case 2:
          _.forEach(R.strings.local.TRANG_THAI_KY, itemChild => {
            if (itemChild.name === item) {
              body.signerStatus = itemChild.value;
            }
          });
          break;
        default:
          break;
      }
    });
    return body;
  };

  componentDidMount = async () => {
    this.refreshData();
    this.props.setTypeOfIconStatementLine(0);
  };

  _getData = async () => {
    const { start, maxResult, searchKey } = this.state;
    const body = {
      cStatementId: this.props.cStatementId,
      start,
      maxResult,
      searchKey
    };
    const response = await getListcStatementLine(body);
    return response;
  };

  refreshData = () => {
    this.setState({ start: 0, reRender: true },
      async () => {
        let resStatement = await this._getData();
        if (resStatement && resStatement.status === 200) {
          this.setState({ dataStatement: resStatement.data.data });
        }
        this.setState({ loading: false, reRender: false, showfooter: false, isLoadingFooter: false, });
      }
    );
  };

  loadMoreData = () => {
    let { dataStatement } = this.state;
    this.setState({
      loading: true, showfooter: true,
      start: dataStatement.length
    }, async () => {
      let response = await this._getData();
      if (response.status === 200 && response.data.data) {
        this.setState({ dataStatement: [...dataStatement, ...response.data.data] })
      }
      this.setState({ loading: false, showfooter: false, isLoadingFooter: false, });
    });
  };

  renderFooter = () => (this.state.showfooter ? (
    <View style={{ height: HEIGHTXD(110) }}>
      <ActivityIndicator animating color="#1C1C1C" size="large" />
    </View>
  ) : (
      <View style={{ height: HEIGHTXD(110) }} />
    ));

  alertDelSuccess = async () => {
    const { cStatementLineId } = this.state;
    this.setState({ loading: true });
    let res = await deleteItemStatementLine(cStatementLineId);
    if (res) {
      this.setState({
        dataStatement: this.state.dataStatement.filter(
          item => item.cStatementLineId !== cStatementLineId
        )
      });
      this.setState({ loading: false });
      showAlert(
        TYPE.SUCCESS,
        i18n.t('NOTIFICATION_T'),
        i18n.t('Delete_successful')
      );
      global.reloadGeneralInfo();
    } else {
      this.setState({ loading: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'));
    }
  };

  onPressIcon = async (indexOfIcon, index, item) => {
    if (indexOfIcon === 2) {
      this.setState({ cStatementLineId: item.cStatementLineId });
      this.ConfirmPopup.setModalVisible(true);
    } else {
      if (indexOfIcon === 0) {
        try {
          const res = await duplicateStatementLine(item.cStatementLineId);
          if (res && res.status === 200) {
            const itemDuplicate = res.data;
            const dataStatementTmp = [
              ...this.state.dataStatement.slice(0, index),
              itemDuplicate,
              ...this.state.dataStatement.slice(index)
            ];;
            this.setState({ dataStatement: dataStatementTmp })

            showAlert(TYPE.SUCCESS, 'Thông báo', 'Nhân đôi thành công');
          }
        } catch { }
      }
      else {
        if (indexOfIcon === 1) {
          this.onPressItem(item.cStatementLineId);
        } else {
          showAlert(
            TYPE.WARN,
            i18n.t('NOTIFICATION_T'),
            i18n.t('FUCTION_UPDATE')
          );
          // this.setState({ reRender: !this.state.reRender });
        }
      }
    }
  };

  onPressItem = async id => {
    this.props.navigation.navigate('DetailStatementLine', {
      callBackListStatementLine: (item) => {
        this.refreshData();
        global.reloadGeneralInfo();
      }
    });
    this.props.setStatementLineID(id);
    this.props.setIsShowBtnSearch(false);
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.keySearchStatementLine !== nextProps.keySearchStatementLine
    ) {
      this.getSearchStatement(nextProps.keySearchStatementLine);
    }
  }

  getDataSearch = search => {
    this.setState(
      { loading: true, searchKey: search, start: 0, maxResult: 10 },
      async () => {
        let resStatement = await this._getData();
        if (resStatement && resStatement.status === 200) {
          this.setState({ dataStatement: resStatement.data.data });
        }
        this.setState({ loading: false, isLoadingFooter: false, showfooter: false });
      }
    );
  };

  renderItem = ({ item, index }) => {
    let day = moment(item.proposalDate, timeFormat).format('D');
    let month = moment(item.proposalDate, timeFormat).format('M');
    let year = moment(item.proposalDate, timeFormat).format('YYYY');
    let content = {
      name: item.description,
      id: item.cAdvanceRequestLineId,
      price: item.requestAmount,
      cStatementLineId: item.cStatementLineId,
      cStatementId: item.cStatementId,
    };
    let color = renderColorItem(
      item.docstatus,
      item.approveStatus,
      item.signerstatus
    );
    return (
      <ItemStatement
        isShowMonth={item.isShowMonth}
        time={{ day, month, year }}
        content={content}
        onPressItem={this.onPressItem}
        color={this.props.statusStatementChil.color}
        index={index}
        onPressIcon={indexOfIcon => {
          this.onPressIcon(indexOfIcon, index, item);
        }}
      />
    );
  };

  render() {
    const {
      Firstloading,
      dataStatementLine,
      search,
      isShowDetail,
      reRender,
      dataStatement
    } = this.state;
    return (
      <View style={styles.container}>
        <Confirm
          ref={ref => {
            this.ConfirmPopup = ref;
          }}
          title="Bạn có muốn xóa bản ghi này không ?"
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this.alertDelSuccess()}
        />
        <View style={styles.view}>
          <FlatList
            data={dataStatement}
            extraData={dataStatement}
            renderItem={({ item, index }) => this.renderItem({ item, index })}
            ListEmptyComponent={
              !this.state.refreshing && !this.state.loading && <ItemTrong />
            }
            onMomentumScrollEnd={() => {
              if (!reRender) {
                this.loadMoreData()
              }
            }
            }
            ListFooterComponent={this.renderFooter}
            onRefresh={this.refreshData}
            refreshing={this.state.refreshing}
            onEndReachedThreshold={0.1}
          />
          <ButtonAdd
            onButton={() => {
              this.props.navigation.navigate('AddStatementLine',
                {
                  callBackListStatementLine: (item) => {
                    this.refreshData();
                    global.reloadGeneralInfo();
                  }
                });
              this.props.setIsShowBtnSearch(false);
            }}
            bottom={HEIGHTXD(150)}
          />
        </View>

        {/* <BottomTabAdd
         menu={this.menu}
         onChange={this.onChangeBottomTab}
         activeIndex={this.state.index}
        /> */}
        {/* <BottomMenu
          menu={this.menu}
          onChange={this._onChangeBottomMenu}
          activeIndex={this.state.indexBottom}
        /> */}
      </View>
    );
  }
}

// const mapStateToProps = (state) => ({
//     station: state.station,
//     appState: state.appState,
//     cocosCustomerId: state.user.objectUser.cocosCustomerId,
//   });

const mapDispatchToProps = dispatch => ({
  setDetailData: (cocosCustomerId, data) => dispatch(setDetailData(cocosCustomerId, data))
});

function mapStateToProps(state) {
  return {
    keySearchStatementLine: state.statementRuducer.keySearchStatementLine,
    cStatementId: state.statementRuducer.cStatementId,
    statusMenu: state.statementRuducer.statusMenu,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    statusStatementChil: state.statementRuducer.statusStatementChil,
  };
}
export default connect(mapStateToProps, {
  setStatusMenu,
  setTypeOfIconStatementLine,
  setStatementLineID
})(ListStatementLine);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.colorMain
  },
  view: {
    width: getWidth(),
    flex: 1,
    height: getHeight() - HEIGHTXD(20),
    backgroundColor: R.colors.colorf1f,
    paddingTop: HEIGHTXD(30)
  },
  item: {
    marginTop: HEIGHTXD(50)
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.MontserratMedium
  }
});
