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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { TabAddStatement } from 'routers/screenNames';
import _ from 'lodash';
import NavigationService from '../../../routers/NavigationService';
import {
  setStatusMenu,
  setTypeOfIconStatementLine,
  setDataStatementLine,
  setStatusCOStatement
} from '../../../actions/statement';
import i18n from '../../../assets/languages/i18n';
import HeaderStatement from '../../../common/Header/HeaderStatement';
import { getListInvoice, delInvoice } from '../../../apis/Functions/invoice';
import ItemGeneralInfo from './ItemDetailStatement/ItemGeneralInfo';
import Confirm from '../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import { LoadingComponent } from '../../../common/Loading/LoadingComponent';
import {
  getListcStatementLine,
  deleteItemStatement,
  deleteItemStatementLine,
  duplicateStatementLine,
  findByIdStatementLine,
  updateSatementLine,
  coStatement,
  raStatement
} from '../../../apis/Functions/statement';
import ItemStatement from './ItemStatement';
import {
  HEIGHTXD,
  WIDTHXD,
  getFontXD,
  getWidth,
  convertDataStatement,
  mapTimeVNToWorld,
  getHeight,
  validateEmail
} from '../../../config';
import HeaderBtnSearch from '../../../common/Header/HeaderBtnSearch';
import ItemTrong from '../../../common/Item/ItemTrong';
import ButtonAdd from '../../../common/Button/ButtonAdd';
import R from '../../../assets/R';
import { statusBottomMenu } from '../../../config/constants';
import ItemGeneralInfoLine from './ItemDetailStatement/ItemGeneralInfoLine';
import ItemDifferentLine from './ItemDetailStatement/ItemDifferentLine';
import ItemAccountant from './ItemDetailStatement/ItemAccountantLine';
import ItemBudget from './ItemDetailStatement/ItemBudgetLine';
import FakeData from './dataInvoice';
import BottomTabAdd from './BottomTabAdd';
import global from '../global';

class DetailStatementLine extends Component {
  ConfirmPopup = {};

  differentLineeRef = React.createRef();

  budgeteRef = React.createRef();

  generalInfoLineeRef = React.createRef();

  accountanteRef = React.createRef();


  constructor(props) {
    super(props);
    global.onSumitDetailGeneralInfoLine= this.onSubmitStatementLine.bind(this)
    this.props.setTypeOfIconStatementLine(1);
    this.state = {
      refreshing: false,
      showfooter: false,
      cStatementLineId: 0,
      search: '',
      index: 0,
      loading: true,
      Firstloading: true,
      isLoadingFooter: false,
      data: [],
      reRender: false,
      bodyFilter: {},
      isSearch: false,
      adOrgId: this.props.adOrgId,
      start: 0,
      maxResult: 10,
      sortField: 'TRANS_DATE',
      sortDir: 'DESC',
      dataStatement: [],
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
        updated: new Date().getTime(),
        updatedFrom: null,
        updatedTo: null,
        updatedby: 10362509,
        updatedbyName: null,
        description: 'Tờ trình kinh phí test them moi lan thu 2',
        isactive: 'Y',
        isDeleted: 'N',
        // requestAmount: 6628475195,
        // approveAmount: 6628475195,
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
        // isOutOfBudget: null,
        // requestBeforeTaxAmount: 6.628475195e9,
        // approvedBeforeTaxAmount: 6.628475195e9,
        // requestTaxAmount: null,
        // approvedTaxAmount: null,
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
        iconName: R.images.iconSaveActive
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

    global.goBackToListDetailStatement = this._goBackToListDetailStatement.bind(
      this
    );
    this.dataItem = {};
  }

  _goBackToListDetailStatement = () => {
    this.props.navigation.goBack();
  };

  onSubmitStatementLine = async () => {

    if (!this.generalInfoLineeRef.current.state.description) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa nhập nội dung');
      return;
    }

    if (this.generalInfoLineeRef.current.state.description.length > 250 ) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn nhập nội dung quá dài');
      return;
    }

    // if(!this.generalInfoLineeRef.current.state.currencyId) {
    //   showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa chọn tiền tệ');
    //   return;
    // };
    if (!this.generalInfoLineeRef.current.state.currencyRate) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa nhập tỷ giá');
      return;
    }

    if (!this.accountanteRef.current.state.cBudgetId) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa chọn nguồn kinh phí');
      return;
    }

    if (!this.differentLineeRef.current.state.proposalDate) {
      showAlert(
        TYPE.WARN,
        'Thông báo',
        'Bạn chưa chọn ngày đề nghị quyết toán'
      );
      return;
    }
    
    if (this.differentLineeRef.current.state.warningEmail && !validateEmail(this.differentLineeRef.current.state.warningEmail)) {
      showAlert(
        TYPE.WARN,
        'Thông báo',
        'Email chưa hợp lệ'
      );
      return;
    }

    const { body } = this.state;
    console.log('body', body)
    body.cStatementLineId = this.props.cStatementLineId;
    body.cStatementId = this.props.cStatementId;
    body.description = this.generalInfoLineeRef.current.state.description;
    body.currencyRate = this.generalInfoLineeRef.current.state.currencyRate;
    body.requestAmount = this.generalInfoLineeRef.current.state.sumAmount;
    body.requestBeforeTaxAmount = this.generalInfoLineeRef.current.state.requestBeforeTaxAmount;
    body.requestTaxAmount = this.generalInfoLineeRef.current.state.requestTaxAmount;
    body.cCurrencyId = this.generalInfoLineeRef.current.state.cCurrencyId;

    body.cPaymentScopeId = this.accountanteRef.current.state.cPaymentScopeId;
    body.cBudgetId = this.accountanteRef.current.state.cBudgetId;

    body.cCostTypeId = this.budgeteRef.current.state.cCostTypeId;
    body.cActivityId = this.budgeteRef.current.state.cActivityId;
    
    body.isOutOfBudget = this.convertBoolToString(this.budgeteRef.current.state.isOutOfBudget);
    body.directRelease = this.convertBoolToString(this.budgeteRef.current.state.directRelease);

    body.proposalDate = this.differentLineeRef.current.state.proposalDate;
    body.warningEmail = this.differentLineeRef.current.state.warningEmail;
    body.approveDate = this.differentLineeRef.current.state.approveDate;
    body.updated = new Date().getTime();
    try {
      const response = await updateSatementLine(body); 
      if (response && response.status === 200) {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhật thành công');
        const {
          callBackListStatementLine
        } = this.props.navigation.state.params;
        if (callBackListStatementLine) {
          callBackListStatementLine();
        }
        this._goBackToListDetailStatement()
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật không thành công');
      }
    } catch (error) {}
  };

  convertBoolToString = value => {
    if (value === true) {
      return 'Y';
    }
    return 'N';
  };

  onSumitStatusStatement =async ()=>
  {
    if (this.props.cStatementId) {
      // cControlDepartmentId
      if (!this.props.statusButtonCO) {
        const response = await raStatement(this.props.cStatementId);
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'RA thành công');
          this.props.setStatusCOStatement(true);
        }
        else{
          showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại kết nối');
        }
      } else {
        const response = await coStatement(this.props.cStatementId);
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'CO thành công');
          this.props.setStatusCOStatement(false);
        } else {
          showAlert(TYPE.WARN, 'Thông báo', 'Chưa có thông tin chi tiết');
        }
      }
      return;
    }
    else{
      showAlert(TYPE.WARN, 'Thông báo', 'Chưa có tờ trình');
    }
  }


    
  onChangeBottomTab = async (index: number) => {
    switch (index) {
      case 0: {
        this.onSubmitStatementLine();
        break;
      }
      case 1: {
          this.onSumitStatusStatement();
        break;
      }
      default: {
      }
    }

    // this.setState({ index });
  };

  _onDelete = async id => {
    Alert.alert(
      '',
      'Bạn có muốn xóa bản ghi này không ?',
      [
        { text: 'HỦY BỎ', style: 'cancel' },
        {
          text: 'ĐỒNG Ý',
          onPress: async () => {
            try {
              const response = await deleteItemStatement(id);
              if (response && response.status === 200) {
                showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa thành công');
                this._onSuccess(id);
              } else {
                showAlert(TYPE.ERROR, 'Thông báo', 'Xóa thất bại');
              }
            } catch (err) {
              showAlert(TYPE.ERROR, 'Thông báo', 'Xóa thất bại');
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

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
    } catch (err) {}
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

    this.getStatementLineById();
  };

  getStatementLineById = async () => {
    try {
      const response = await findByIdStatementLine(this.props.cStatementLineId);
      if (response.status === 200) {
        this.setState({ dataStatementLine: response.data });
        this.props.setDataStatementLine(response.data);
      }
    } catch (e) {}
  };

  componentWillUnmount() {
    this.props.setTypeOfIconStatementLine(0);
  }

  _getData = async (startTmp, documentNo) => {
    const { adOrgId, start, maxResult, sortField, sortDir } = this.state;
    // const body = { cStatementId : this.props.statementId, start, maxResult}
    const body = { cStatementId: this.props.cStatementId, start, maxResult };
    const response = await getListcStatementLine(body);
    return response;
  };

  onChangeSearch = search => {
    // this.setState({ reRender: true, search })
    // this.getSearchStatement(search);
  };

  getDataSearch = async search => {
    let resStatement = await this._getData(0, search);
    if (resStatement && resStatement.status === 200) {
      this.setState({
        dataStatement: convertDataStatement(resStatement.data.data)
      });
    }
  };

  refreshData = async () => {
    let resStatement = await this._getData(0, '');
    if (resStatement && resStatement.status === 200) {
      // const statementLine = convertDataStatement(resStatement.data.data);
      this.setState({ dataStatement: resStatement.data.data });
    }
  };

  loadMoreData = async () => {
    let { search } = this.state;
    this.setState({ loading: true, showfooter: true }, async () => {
      let resInvoice = await this._getData(this.dataStatement.length, search);
      if (resInvoice.data) {
        if (resInvoice.total > this.dataStatement.length) {
          let dataConvert = convertDataStatement([
            ...this.dataStatement,
            ...resInvoice.data
          ]);
          this.dataStatement = dataConvert;
        }
      }
      this.setState({ loading: false, showfooter: false });
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
            showAlert(TYPE.SUCCESS, 'Thông báo', 'Nhân đôi thành công');
          }
        } catch {}
      } else {
        showAlert(
          TYPE.WARN,
          i18n.t('NOTIFICATION_T'),
          i18n.t('FUCTION_UPDATE')
        );
        this.setState({ reRender: !this.state.reRender });
      }
    }
  };

  onPressItem = async id => {
    try {
      const res = await findByIdStatementLine(id);
      if (res && res.status === 200) {
        await this.setState({
          dataStatementLine: res.data,
          cStatementLineId: id
        });
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Nhân đôi thành công');
      }
    } catch {}
  };

  render() {
    const { dataStatementLine } = this.state;
    return (
      <View style={styles.container}>
        <Confirm
          ref={ref => {
            this.ConfirmPopup = ref;
          }}
          title="Bạn có muốn xóa bản ghi này không ?"
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => {}}
          onPressRight={() => this.alertDelSuccess()}
        />
        <View style={styles.view}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar backgroundColor={R.colors.colorMain} />
            <View style={{ marginTop: HEIGHTXD(24) }}>
              <ItemGeneralInfoLine
                ref={this.generalInfoLineeRef}
                content={this.state.content}
                debt={this.state.debt}
                conTract={this.state.conTract}
                item={FakeData.THONG_TIN_CHUNG}
                dataStatementLine={dataStatementLine}
              />
            </View>

            <View style={{ marginTop: HEIGHTXD(24) }}>
              <ItemAccountant
                ref={this.accountanteRef}
                detail={true}
                rules={this.state.rules}
                department={this.state.department}
                market={this.state.market}
                onChangeRules={text => this.onChangeRules(text)}
                onChangeDepartment={text => this.onChangeDepartment(text)}
                onChangeMarket={text => this.onChangeMarket(text)}
                item={FakeData.THONG_TIN_QUAN_TRI}
                dataStatementLine={dataStatementLine}
              />
            </View>

            <View style={{ marginTop: HEIGHTXD(24) }}>
              <ItemBudget
                ref={this.budgeteRef}
                detail={true}
                rules={this.state.rules}
                department={this.state.department}
                market={this.state.market}
                onChangeRules={text => this.onChangeRules(text)}
                onChangeDepartment={text => this.onChangeDepartment(text)}
                onChangeMarket={text => this.onChangeMarket(text)}
                item={FakeData.THONG_TIN_QUAN_TRI}
                dataStatementLine={dataStatementLine}
              />
            </View>
            <View style={{ marginVertical: HEIGHTXD(24) }}>
              <ItemDifferentLine
                ref={this.differentLineeRef}
                item={FakeData.THONG_TIN_SO_TIEN}
                dataStatementLine={dataStatementLine}
                detail={true}
              />
              {/* <TouchableOpacity
                activeOpacity={1}
                style={{ alignItems: 'flex-end' }}
              >
                <View style={styles.button}>
                  <Icon
                    name="arrow-right"
                    size={WIDTHXD(60)}
                    color={R.colors.colorMain}
                  />
                </View>
              </TouchableOpacity> */}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setDetailData: (cocosCustomerId, data) => dispatch(setDetailData(cocosCustomerId, data))
});
function mapStateToProps(state) {
  return {
    cStatementId: state.statementRuducer.cStatementId,
    statusButtonCO: state.statementRuducer.statusButtonCO,
    cStatementLineId: state.statementRuducer.cStatementLineId,
    statusMenu: state.statementRuducer.statusMenu,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
  };
}
export default connect(mapStateToProps, {
  setStatusMenu,
  setTypeOfIconStatementLine,
  setDataStatementLine,
  setStatusCOStatement
})(DetailStatementLine);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.colorMain,
    justifyContent: 'space-around',
    position: 'relative',
    marginBottom: HEIGHTXD(200)
  },
  view: {
    width: getWidth(),
    flex: 1,
    height: getHeight() - HEIGHTXD(20),
    backgroundColor: R.colors.colorf1f,
  },
  item: {
    marginTop: HEIGHTXD(50)
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.MontserratMedium
  }
});
