// @flow
import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios'
import {
  HEIGHTXD,
  getFontXD,
  getWidth,
  WIDTHXD
} from '../../../config/Function';
import R from '../../../assets/R';
import { NetworkSetting } from '../../../config/Setting';
import NavigationService from '../../../routers/NavigationService';
import HeaderForTabStatement from '../../../common/Header/HeaderForTabStatement';
import GeneralInfo from './GeneralInfo';
import {
  setStatementID,
  setKeySearchStatementLine,
  setIsHideGroupStatement,
  setStatusCOStatement,
  uploadFileAttackStatement
} from '../../../actions/statement';
import ModalPrint from '../../../common/PrintedStatement/index';
import DetailedInfo from './DetailedInfo';
import PaymentInfo from './Payment/PaymentInfo';
import SubmissonProcess from '../index';
// import * as TYPE from '../../../FlowType';
import { coStatement, raStatement, findByIdStatement } from '../../../apis/Functions/statement';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import BotomMenu from '../../AdvanceRequest/common/BottomMenu';
import { iconStatement } from '../../../config/constants';
import ModalAttachment from '../../../common/FilePicker/ModalAttachment'
import { DetailPrintInvoiceGroup } from 'routers/screenNames';
import { TABLE_STATEMENT_ID, TABLE_STATEMENT_ID_2 } from '../../../config/constants'
import moment from 'moment'
import DetailPrint from '../../ApInvoiceGroupStatement/Print/ViewPrint';
import { showLoading, hideLoading } from '../../../common/Loading/LoadingModal'

import global from '../global';

// import Attackments from '../../Invoice/Item/CreateInvoice/Item/Attackment/Attackments';
// import Statement from '../../../apis/Functions/statement';
import Attackments from './Attack/Attackments';

const renderLabel = ({ route, focused }) => (
  <View
    style={{
      marginBottom: HEIGHTXD(30),
      marginTop: HEIGHTXD(60),
      width: WIDTHXD(374)
    }}
  >
    <Text style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}>
      {route.title}
    </Text>
  </View>
);

const renderTabBar = props => (
  <LinearGradient colors={R.colors.colorHeaderGradienMenuTab}>
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabStyle}
      renderLabel={renderLabel}
      scrollEnabled={true}
    />
  </LinearGradient>
);

class TabDetailStatement extends Component {
  itemGeneralInfo = React.createRef();
  // state = {
  //   index: 0,
  //   routes: [
  //     { key: 1, title: 'Thông tin chung' },
  //     { key: 2, title: 'Thông tin chi tiết' },
  //     { key: 3, title: 'Đính kèm' },
  //     { key: 4, title: 'Thông tin chi' }
  //     // { key: 5, title: 'Thông tin trình kí' }
  //   ],
  //   loading: true,
  //   cStatementId: null,
  //   search: '',
  //   isSearch: false,
  //   isShowBtnSearch: false,
  //   cStatementLineId: null,
  //   statusCO: true,
  //   typeOfIconTabStatement: 0,
  //   swipeEnabled: true,
  //   isActiveSave: true,
  //   isActiveCo: true,
  //   isActivePrint: true,
  //   isActiveAttack: true,
  //   isActiveSubmit: true,
  // };
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 1, title: 'Thông tin chung' },
        { key: 2, title: 'Thông tin chi tiết' },
        { key: 3, title: 'Đính kèm' },
        { key: 4, title: 'Thông tin chi' },
        { key: 5, title: 'Thông tin trình kí' }
      ],
      loading: true,
      cStatementId: null,
      cDocumentSignId: null,
      search: '',
      isSearch: false,
      isShowBtnSearch: false,
      cStatementLineId: null,
      statusCO: true,
      typeOfIconTabStatement: 0,
      swipeEnabled: true,
      isActiveSave: this.props.statusButtonCO,
      isActiveCo: true,
      isActivePrint: true,
      isActiveAttack: this.props.statusButtonCO,
      isActiveSubmit: true,
      statementInfo: {},
      subTitle: '',
      isViewPrint: false
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      cStatementId: this.props.cStatementId
    }, () => {
      this.fetchData();
    });
  }
  // fetchData = async () => { };


  fetchData = async () => {
    try {
      const resDetail = await findByIdStatement(this.state.cStatementId);
      console.log('resDetail', resDetail)
      if (resDetail.status === 200) {
        this.setState({ statementInfo: resDetail.data, cDocumentSignId: resDetail.data.cDocumentsignId });
      }
    } catch (e) { }
  }

  onChangeStatementLineId = id => {
    this.setState({ cStatementLineId: id });
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.typeOfIconTabStatement !== this.state.typeOfIconTabStatement
    ) {
      this.setState({
        typeOfIconTabStatement: nextProps.typeOfIconTabStatement
      });
    }
  }

  _onUpdateTitle = (title) => {
    this.setState({
      isViewPrint: true,
      subTitle: title
    })
  }

  _renderScene = ({ route }) => {
    const { cStatementId, cStatementLineId } = this.state;
    const { callBackListStatement } = this.props.navigation.state.params;
    switch (route.key) {
      case 1: {
        return (
          <GeneralInfo
            // cStatementId={this.state.cStatementId}
            ref={this.itemGeneralInfo}
            onSumitStatusStatement={this.onSumitStatusStatement}
            callBackListStatement={callBackListStatement}
            cStatementLineId={cStatementLineId}
            setIsShowBtnSearch={this.setIsShowBtnSearch}
            nextToDetail={() => {
              this.setState({ index: 1 });
            }}
          />
        );
      }
      case 2:
        return (
          <DetailedInfo
            // cStatementId={cStatementId} screenProps={idInvoice}
            screenProps={this.setIsShowBtnSearch}
            cStatementLineId={cStatementLineId}
            onChangeStatementLineId={this.onChangeStatementLineId}
          />
        );
      case 3:
        if (this.state.cDocumentSignId) {
          return <DetailPrint
            id={this.state.cStatementId}
            cDocumentSignId={this.state.cDocumentSignId}
            isViewDocumentSign={true}
            onUpdateTitle={(title) => this._onUpdateTitle(title)}
            adTableId={TABLE_STATEMENT_ID_2}
          />
        } else {
          return <Attackments />;
        }
      case 4:
        return <PaymentInfo screenProps={{ statementId: cStatementId }} />;
      case 5:
        return <SubmissonProcess statementId={cStatementId} />;
      default:
        return null;
    }
  };

  onSubmitBottomTab = async indexBottom => {
    const {
      isActiveSave,
      isActiveCo,
      isActivePrint,
      isActiveAttack,
      isActiveSubmit
    } = this.state;

    switch (indexBottom) {
      case 0: {
        if (!isActiveSave) return;
        if (this.state.index === 0) {
          global.onSumitDetailGeneralInfo();
        }
        if (this.state.index === 1) {
          if (this.props.typeOfIconTabStatement == 1) {
            global.onSumitDetailGeneralInfoLine();
          }
          if (this.props.typeOfIconTabStatement == 2) {
            global.onSumitAddGeneralInfoLine();
          }
        }
        break;
      }
      case 1:
      case 2: {
        this.onSumitStatusStatement();
        break;
      }
      case 3: {
        if (isActiveAttack) {
          this._refModalAttackment.show();
          this.setState({ index: 2 })
        }
        break;
      }
      case 4: {
        if (this.state.cDocumentSignId) {
          NavigationService.navigate('CreateVOffice', { cDocumentsignId: this.state.cDocumentSignId, refreshData: () => { } })
        } else {
          this._createVOffice()
        }
        break

      }
      case 5: {
        this._refModalPrint.setModalVisible(true)
        break;
      }
      default: {
      }
    }

    // this.setState({ index });
  };

  /**
   * create vOffice
   */
  _createVOffice = async () => {
    showLoading()
    let res = null;
    const url = NetworkSetting.ROOT.concat(`/erp-service-mobile/cDocumentsignServiceRest/attachFile/1/${this.props.adUserId}/${this.props.adUserId}/${TABLE_STATEMENT_ID_2}/${this.state.cStatementId}/`)
    console.log('url', url)
    try {
      res = await axios.post(url)
    } catch (error) {
      console.log('ERROR---', error)
      //
    }
    hideLoading()
    console.log('RES-----', res)
    console.log('')
    if (res && res.status === 200) {
      this.setState({
        cDocumentSignId: res.data.cDocumentsignId,
      })
      NavigationService.navigate('CreateVOffice', { cDocumentsignId: res.data.cDocumentsignId, refreshData: () => { } })
    } else {
      showAlert(TYPE.ERROR, 'Thông báo', 'Trình ký thất bại')
    }
    return res
  }

  _onCapturePhoto = (response) => {
    this._uploadFile(response)
  }

  _onChooseFile = (response) => {
    this._uploadFile(response)
  }

  _onChoosePhoto = response => {
    this._uploadFile(response)
  }

  _uploadFile = response => {
    if (response) {
      const url = NetworkSetting.ROOT
        .concat(`/erp-service/adAttachmentServiceRest/attachFile/1000077/${this.props.cStatementId}/1/${this.props.adUserId}/${this.props.adUserId}`)
      const formData = new FormData()
      if (typeof (response) === 'object' && response.length >= 0) {
        response.map(item => formData.append('attachments', item))
      } else {
        formData.append('attachments', response)
      }
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.returnMessage === 'Upload file thành công') {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tải lên file thành công')
          this.props.uploadFileAttackStatement()
        } else {
          showAlert(TYPE.WARN, 'Thông báo', res.data.returnMessage)
        }
      }).catch(err => {
        showAlert(TYPE.ERROR, 'Thông báo', 'Upload file thất bại')
      })
    }
  }

  onSumitStatusStatement = async () => {
    if (this.props.cStatementId) {
      const { callBackListStatement } = this.props.navigation.state.params;
      // cControlDepartmentId
      if (!this.props.statusButtonCO) {
        // const response = await raStatement(this.props.cStatementId);
        // if (response && response.status === 200) {
        //   this.props.setStatusCOStatement(true);
        //   callBackListStatement();
        //   showAlert(TYPE.SUCCESS, 'Thông báo', 'RA thành công');
        //   this.onChangeStatusMenuBottom(true)
        // } else {
        //   showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại kết nối');
        // }
        this._RAStatement()
      } else {
        // const response = await coStatement(this.props.cStatementId);
        // if (response && response.status === 200) {
        //   this.props.setStatusCOStatement(false);
        //   callBackListStatement();
        //   showAlert(TYPE.SUCCESS, 'Thông báo', 'CO thành công');
        //   this.onChangeStatusMenuBottom(false)
        // } else {
        //   showAlert(TYPE.WARN, 'Thông báo', 'Chưa có thông tin chi tiết');
        // }
        this._COStatement()
      }
    } else {
      showAlert(TYPE.WARN, 'Thông báo', 'Chưa có tờ trình');
    }
  };

  _COStatement = async () => {
    const { callBackListStatement } = this.props.navigation.state.params;
    try {
      const body = {
        ad_table_id: TABLE_STATEMENT_ID_2,
        record_id: this.state.cStatementId,
        ad_org_id: this.props.adOrgId,
        c_dept_id: this.props.adUserDepartmentId,
        updatedby: this.props.adUserId
      }
      console.log('bodyCO', body)
      const response = await coStatement(body);
      if (response.status === 200) {
        if (response.data.returnMessage) {
          showAlert(TYPE.ERROR, 'Thông báo', response.data.returnMessage)
        } else {
          this.props.setStatusCOStatement(false);
          callBackListStatement();
          this.onChangeStatusMenuBottom(false)
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Hoàn thành tờ trình thành công')
        }
      } else {
        showAlert(TYPE.ERROR, 'CO thất bại', response.data.returnMessage)
      }
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Hoàn thành tờ trình thất bại')
    }
  }
  _RAStatement = async () => {
    const { callBackListStatement } = this.props.navigation.state.params;
    try {
      const body = {
        ad_table_id: TABLE_STATEMENT_ID_2,
        record_id: this.state.cStatementId,
        ad_org_id: this.props.adOrgId,
        c_dept_id: this.props.adUserDepartmentId,
        updatedby: this.props.adUserId,
        dateAcct: moment(new Date()).format('DD/MM/YYYY'),
        ad_window_id: 100000,
        orgLevel: 2

      }
      console.log('bodyRA', body)
      const response = await raStatement(body);

      if (response.status === 200) {
        if (response.data.returnMessage) {
          showAlert(TYPE.ERROR, 'RA thất bại', response.data.returnMessage)
        } else {
          this.props.setStatusCOStatement(true);
          callBackListStatement();
          showAlert(TYPE.SUCCESS, 'Thông báo', 'RA thành công');
          this.onChangeStatusMenuBottom(true)
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Hủy hoàn thành tờ trình thành công')
        }
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Hủy hoàn thành tờ trình thất bại')
      }

    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Huỷ hoàn thành tờ trình thất bại')
    }
  }

  _accept = (url, title, fileName) => {
    // NavigationService.navigate('DetailPrint', {dataItem:item})
    NavigationService.navigate(DetailPrintInvoiceGroup, { id: this.state.cStatementId, url, title, fileName, setDocumentSignId: (id) => { this.setState({ cDocumentSignId: id }) }, adTableId: TABLE_STATEMENT_ID_2 })

  }

  setIsSearch = isSearch => {
    this.setState({ isSearch });
  };

  setIsShowBtnSearch = isShowBtnSearch => {
    this.setState({ isShowBtnSearch });
  };

  onChangeSearch = text => {
    this.props.setKeySearchStatementLine(text);
    this.setState({ search: text });
  };

  onChangeStatusMenuBottom = (statusButtonCO) => {
    if (statusButtonCO) {
      this.setState({
        isActiveSave: true,
        isActiveCo: true,
        isActivePrint: true,
        isActiveAttack: true,
        isActiveSubmit: true,
      })
    }
    else {
      this.setState({
        isActiveSave: false,
        isActiveCo: true,
        isActivePrint: true,
        isActiveAttack: false,
        isActiveSubmit: true,
      })
    }
  }


  render() {
    const {
      search,
      isSearch,
      isShowBtnSearch,
      index,
      typeOfIconTabStatement,
      isActiveSave,
      isActiveCo,
      isActivePrint,
      isActiveAttack,
      isActiveSubmit
    } = this.state;
    // const{typeOfIconTabStatement}= this.props.typeOfIconTabStatement;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={R.colors.colorWhite} />
        <HeaderForTabStatement
          title="Tờ trình"
          placeholderSearch="Số chứng từ, số tiền DN..."
          search={search}
          isSearch={isSearch}
          setIsSearch={this.setIsSearch}
          indexOfTab={index}
          typeOfIconTabStatement={this.props.typeOfIconTabStatement}
          onChangeSearch={this.onChangeSearch}
          onButtonSearch={() => {
            this.setIsSearch(true);
          }}
          setIsHideGroupStatement={this.props.setIsHideGroupStatement}
          isShowBtnSearch={isShowBtnSearch}
          setIsShowBtnSearch={this.setIsShowBtnSearch}
        />

        <TabView
          ref={ref => {
            this.TabView = ref;
          }}
          statementId={this.state.statementId}
          renderTabBar={renderTabBar}
          navigationState={this.state}
          renderScene={this._renderScene}
          swipeEnabled={this.state.swipeEnabled}
          onIndexChange={index => {
            this.setState({
              isShowBtnSearch: index === 1,
              index,
              swipeEnabled: index !== 2
            });

            // if (index === 1) {
            //   this.setState({ isShowBtnSearch: true, index })
            // } else {
            //   this.setState({ isShowBtnSearch: false, index })
            // }
          }}
          initialLayout={{ width: getWidth() }}
        />
        {(index === 1 || index === 3)
          && this.props.typeOfIconTabStatement === 0 ? null : (
            <BotomMenu
              onPress={this.onSubmitBottomTab}
              icons={iconStatement}
              activeMenu={1}
              isActiveSave={isActiveSave}
              isActiveCo={isActiveCo}
              isActiveRa={true}
              isActivePrint={isActivePrint}
              isActiveAttack={isActiveAttack}
              isActiveSubmit={isActiveSubmit}
              isRa={!this.props.statusButtonCO}
            // isActiveSave,
            // isActiveCo,
            // isActivePrint,
            // isActiveAttack,
            // isActiveSubmit
            />
          )}
        <ModalPrint
          ref={ref => {
            this._refModalPrint = ref;
          }}
          userId={this.props.adUserId}
          recordId={this.state.cStatementId}
          accept={this._accept}
        />
        <ModalAttachment
          onCapturePhoto={this._onCapturePhoto}
          onChoosePhoto={this._onChoosePhoto}
          onChooseFile={this._onChooseFile}
          ref={ref => { this._refModalAttackment = ref }}
        />

      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    typeOfIconTabStatement: state.statementRuducer.typeOfIconTabStatement,
    cStatementId: state.statementRuducer.cStatementId,
    statusButtonCO: state.statementRuducer.statusButtonCO,
    adUserId: state.userReducers.userData.loggedIn.adUserId,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    adUserDepartmentId: state.userReducers.userData.loggedIn.adUserDepartmentId,
  };
}
export default connect(mapStateToProps, {
  setStatementID,
  setKeySearchStatementLine,
  setIsHideGroupStatement,
  setStatusCOStatement,
  uploadFileAttackStatement
})(TabDetailStatement);

const styles = StyleSheet.create({
  activeTabTextColor: {
    color: R.colors.white,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
    opacity: 1
  },
  tabTextColor: {
    color: R.colors.white,
    opacity: 1,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center'
  },
  tabStyle: {
    backgroundColor: 'transparent',
    padding: 0,
    elevation: 0
    // height: HEIGHTXD(300) * 0.6,
  },
  indicatorStyle: {
    backgroundColor: R.colors.white,
    height: HEIGHTXD(12)
  }
});
