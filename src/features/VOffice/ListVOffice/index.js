import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CreateVOffice, DetailVOffice } from 'routers/screenNames';
import NavigationService from '../../../routers/NavigationService';
import i18n from '../../../assets/languages/i18n';
import apiVOffice from '../../../apis/Functions/vOffice';
import Confirm from '../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import { LoadingComponent } from '../../../common/Loading/LoadingComponent';
import ItemVOffice from './item';
import { HEIGHTXD, getFontXD, getWidth, convertDataVOffice, mapTimeVNToWorld, getHeight, WIDTHXD, getLineHeightXD } from '../../../config';
import HeaderVOffice from '../../../common/Header/HeaderVOffice';
import ItemTrong from '../../../common/Item/ItemTrong'
import ButtonAdd from '../../../common/Button/ButtonAdd';
import R from '../../../assets/R'
import SecsionListSwipe from '../../../common/Swipe/SecsionListSwipe'
import ItemPicker from '../common/ItemPicker';

class ListVOffice extends Component {
  ConfirmPopup = {
  };

  dataVOffice = [];

  oldSearch = '';

  timeoutSearch;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showfooter: false,
      idSelected: 0,
      reRender: false,
      isSearch: false,
      search: '',
      Firstloading: true,
      modalVisible: false,
      filter: {
        documentStatus: { value: null, name: '' },
        signStatus: { value: null, name: '' }
      }
    }
    this.dataVOffice = []
    this.oldSearch = ''
    this.indexOfItem = '0.0'
    this.maxData = 0
  }

  _onChangeSearch = async (search) => {
    clearTimeout(this.timeoutSearch);
    this.timeoutSearch = setTimeout(async () => {
      if (this.oldSearch === search) {
        let resVOffice = await this._getData(0, search);

        if (resVOffice.data) {
          this.dataVOffice = convertDataVOffice([], resVOffice.data);
        }
        this.setState({ reRender: true })
      }
    }, 500);
    this.oldSearch = search;
    this.setState({ search })
  }

  _setIsSearch = (isSearch) => {
    this.setState({ isSearch })
  }

  componentDidMount = async () => {
    this._refreshData()
  }

  _refreshData = async () => {
    this.setState({ refreshing: true }, async () => {
      let resVOffice = await this._getData(0, this.state.search);
      if (resVOffice.data) {
        this.maxData = resVOffice.data.length
        let dataVOffices = convertDataVOffice([], resVOffice.data);
        this.dataVOffice = dataVOffices
      }
      this.setState({ refreshing: false, Firstloading: false })
    })
  }

  _getData = async (start, titlesign) => {
    let approvalstatus = this.state.filter.signStatus.value;
    let docaction = this.state.filter.documentStatus.value;
    if (approvalstatus === '') approvalstatus = null;
    if (docaction === '') docaction = null;

    // let body = {
    //   adOrgId: this.props.userData.loggedIn.adOrgId,
    //   start,
    //   searchKey: titlesign,
    //   maxResult: R.strings.PAGE_LIMIT.PAGE_VOFFICE,
    //   sortField: 'TRANS_DATE',
    //   sortDir: 'DESC',
    //   // amount: null,
    //   approvalstatus,
    //   docstatus: docaction,
    // }
    let body = {
      adOrgId: this.props.userData.loggedIn.adOrgId,
      searchKey: titlesign,
      approvalstatus: approvalstatus,
      docstatus: docaction,
      maxResult: R.strings.PAGE_LIMIT.PAGE_VOFFICE,
      start: start,
      sortDir: 'DESC',
      sortField: 'DATEACCT'
    };

    // console.log(JSON.stringify(body))
    let resVOffice = await apiVOffice.getListVOffice(body);
    // console.log(resVOffice)
    return resVOffice;
  }


  _loadMoreData = async () => {
    let { search } = this.state;
    this.setState({ showfooter: true }, async () => {
      let resVOffice = await this._getData(this.maxData, search)
      if (resVOffice.data) {
        this.maxData += resVOffice.data.length
        if (resVOffice.total >= this.maxData) {
          let dataConvert = convertDataVOffice(this.dataVOffice, resVOffice.data)
          this.dataVOffice = dataConvert;
        }
      }
      this.setState({ showfooter: false })
    })
  }


  _renderFooter = () => (
    this.state.showfooter ? (
      <View style={{ height: HEIGHTXD(110) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  _alertDelSuccess = async () => {
    const { idSelected } = this.state;
    this.setState({ reRender: true });
    let res = await apiVOffice.delVOffice(idSelected);
    console.log('ID VOFFICE---', idSelected)
    if (res) {
      const [section] = this.indexOfItem.split('.');
      const newData = [...this.dataVOffice];
      const prevIndex = this.dataVOffice[section].data.findIndex(
        items => items.key === this.indexOfItem
      );
      if (newData[section].data.length > 1) {
        newData[section].data.splice(prevIndex, 1);
      } else {
        newData[section] = { title: '', data: [] }
      }
      this.dataVOffice = newData
      this.setState({ reRender: false });
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Delete_successful'))
    } else {
      this.setState({ reRender: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
    }
  }

  _onPressIcon = (indexOfIcon, indexOfItem) => {
    const [section] = indexOfItem.split('.');
    const newData = [...this.dataVOffice];
    const { userData } = this.props
    const prevIndex = this.dataVOffice[section].data.findIndex(
      items => items.key === indexOfItem
    );

    this.setState({ reRender: !this.state.reRender })
    if (indexOfIcon === 0) {
      const item = newData[section].data[prevIndex];
      const viewOnly = userData.adUserId === item.createdby;

      NavigationService.navigate(CreateVOffice, {
        cDocumentsignId: item.cDocumentsignId,
        refreshData: this._refreshData,
        isEdit: false,
        viewOnly
      })

      // if (userData.adUserId === item.createdby) {
      //   NavigationService.navigate(CreateVOffice, { cDocumentsignId: newData[section].data[prevIndex].cDocumentsignId, refreshData: this._refreshData })
      // } else {
      //   NavigationService.navigate(DetailVOffice, { cDocumentsignId: newData[section].data[prevIndex].cDocumentsignId })
      // }
    } else if (indexOfIcon === 1) {
      // console.log('ID DELEETE VOOFFICE---', newData[section].data[prevIndex])
      // console.log('ID DELEETE VOOFFICE---', newData[section].data[prevIndex].ad)

      if (userData.adUserId === newData[section].data[prevIndex].createdby) {
        if (newData[section].data[prevIndex].docstatus === 'CO') {
          showAlert(TYPE.WARN, 'Thông báo', 'Bạn không được xoá trình ký đã CO.')
        } else {
          this.setState({ idSelected: newData[section].data[prevIndex].cDocumentsignId })
          this.indexOfItem = indexOfItem
          this.ConfirmPopup.setModalVisible(true);
        }
      } else {
        showAlert(TYPE.WARN, 'Thông báo', 'Bạn không được quyền xóa trình ký này.')
      }
    }
  }

  _onPressItem = (item, updatedby) => {
    const viewOnly = item.createdby !== this.props.userData.adUserId;
    console.log('you are viewing VOffice', item.cDocumentsignId, ' viewOnly=', viewOnly);
    NavigationService.navigate(CreateVOffice, {
      cDocumentsignId: item.cDocumentsignId,
      refreshData: this._refreshData,
      isEdit: true,
      viewOnly
    })
    // NavigationService.navigate(CreateVOffice, { cDocumentsignId: item.cDocumentsignId, refreshData: this._refreshData, isEdit: item.createdby === this.props.userData.adUserId })
    // if (this.props.userData.adUserId === updatedby) {
    //   NavigationService.navigate(CreateVOffice, { cDocumentsignId: cDocumentsignId, refreshData: this._refreshData })
    // } else {
    //   NavigationService.navigate(DetailVOffice, { cDocumentsignId: cDocumentsignId })
    // }
  }

  _renderItem = ({ item, index }) => {
    let datetime = moment(item.dateacct, 'DD/MM/YYYY');
    // let day = moment(mapTimeVNToWorld(item.created)).format('D');
    // let month = moment(mapTimeVNToWorld(item.created)).format('M');
    // let year = moment(mapTimeVNToWorld(item.created)).format('YYYY');
    let day = datetime.format('D');
    let month = datetime.format('M');
    let year = datetime.format('YYYY');
    let content = {
      name: item.titlesign,
      id: item.cDocumentsignId,
      amount: item.amount,
      vwstatus: item.vwstatus,
      cDocumentsignId: item.cDocumentsignId,
      updatedby: item.updatedby,
      createdby: item.createdby
    }
    let docStatus = R.strings.local.TRANG_THAI_TAI_LIEU.filter(x => x.id === item.docstatus);
    docStatus = (docStatus && docStatus.length > 0) ? docStatus[0] : null;
    let c = docStatus ? docStatus.color : '#949494';
    // console.log(item.docstatus);
    if (item.docstatus === 'CO') {
      let approvalStatus = R.strings.local.TRANG_THAI_KY.filter(x => x.value === item.approvalstatus);
      approvalStatus = (approvalStatus && approvalStatus.length > 0) ? approvalStatus[0] : null;
      c = approvalStatus ? approvalStatus.color : '#949494';
    }
    return (
      <ItemVOffice
        time={{ day, month, year }}
        content={content}
        index={index}
        colorStatus={c}
        onPressItem={() => this._onPressItem(item)}
      />
    )
  }

  render() {
    const { Firstloading, search, isSearch } = this.state
    if (Firstloading) {
      return (
        <View style={styles.container}>
          <HeaderVOffice
            title="Danh sách trình ký VOffice"
            placeholderSearch="Số chứng từ, số tiền DN"
            search={search}
            isSearch={isSearch}
            setIsSearch={this._setIsSearch}
            onChangeText={this._onChangeSearch}
            onButtonSearch={() => { this._setIsSearch(true) }}
          />
          <View style={styles.view} />
          <LoadingComponent isLoading={true} />
        </View>
      )
    }
    const renderSectionHeader = ({ section }) => {
      if (section.title === '' || !section.title) return []
      return (<Text style={listStyles.header_text}>{section.title}</Text>)
    };

    return (
      <View style={styles.container}>
        <HeaderVOffice
          title="Danh sách trình ký VOffice"
          placeholderSearch="Số chứng từ, số tiền DN"
          search={search}
          isSearch={isSearch}
          setIsSearch={this._setIsSearch}
          onChangeText={(text) => this._onChangeSearch(text)}
          onButtonSearch={() => { this._setIsSearch(true) }}
          onFilterPress={() => this.setState({ modalVisible: true })}
        />
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn xóa bản ghi này không ?"
          titleLeft="HUỶ BỎ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this._alertDelSuccess()}
        />
        <View style={listStyles.container}>
          <SecsionListSwipe
            useSectionList={true}
            data={this.dataVOffice}
            sections={this.dataVOffice}
            keyExtractor={(item, index) => item.key}
            extraData={this.state.reRender}
            renderItem={({ item, index }) => this._renderItem({ item, index })}
            ListEmptyComponent={!this.state.refreshing && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
            onEndReached={this._loadMoreData}
            ListFooterComponent={this._renderFooter}
            onRefresh={this._refreshData}
            refreshing={this.state.refreshing}
            onEndReachedThreshold={0.1}
            closeAllOpenRows={true}
            onPressIcon={(indexOfIcon, indexOfItem) => { this._onPressIcon(indexOfIcon, indexOfItem) }}
            listIcons={[R.images.iconEdit, R.images.iconDelete]}
            widthListIcon={WIDTHXD(288)}
            rightOfList={WIDTHXD(20)}
            styleOfIcon={{ width: WIDTHXD(110), height: WIDTHXD(110), marginLeft: WIDTHXD(30), marginBottom: WIDTHXD(23) }}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={renderSectionHeader}
          />
        </View>
        {/* <ButtonAdd
          onButton={() => NavigationService.navigate(CreateVOffice, { refreshData: this._refreshData })}
          bottom={HEIGHTXD(150)}
        /> */}
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {

          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{
                paddingHorizontal: WIDTHXD(70),
                paddingTop: HEIGHTXD(50),
                paddingBottom: HEIGHTXD(30),
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: 'space-between'
              }}>
                <View style={{
                  width: WIDTHXD(33.35)
                }} />
                <Text style={styles.modalText}>Lọc danh sách trình ký</Text>
                <TouchableOpacity
                  hitSlop={{ top: 20, bottom: 20, left: 50, right: 20 }}
                  onPress={() => this.setState({ modalVisible: false })}
                >
                  <Ionicons
                    name="md-close"
                    size={WIDTHXD(60)}
                    color="#000000aa"
                  />
                </TouchableOpacity>
              </View>
              <ItemPicker
                title="Trạng thái tài liệu"
                data={R.strings.local.TRANG_THAI_TAI_LIEU_VOFFICE}
                containerStyles={{ paddingHorizontal: 0 }}
                width={WIDTHXD(695)}
                value={this.state.filter.documentStatus.name}
                onValueChange={(value, item) => {
                  const filter = this.state.filter;
                  filter.documentStatus = item;
                  this.setState({ filter });
                }}
              />
              <ItemPicker
                title="Trạng thái ký"
                data={R.strings.local.TRANG_THAI_KY}
                containerStyles={{ paddingHorizontal: 0 }}
                width={WIDTHXD(695)}
                value={this.state.filter.signStatus.name}
                onValueChange={(value, item) => {
                  const filter = this.state.filter;
                  filter.signStatus = item;
                  this.setState({ filter });
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: !this.state.modalVisible });
                  console.log(this.state.filter)
                  this._refreshData();
                }}
              >
                <Text style={styles.text_modal_filter}>ĐỒNG Ý</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

function mapStateToProps(state) {
  console.log('STATE----- reduer', state.userReducers.userData)
  return {
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, {})(ListVOffice);
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
    // paddingTop: HEIGHTXD(30),
  },
  item: {
    marginTop: HEIGHTXD(50),
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.MontserratMedium
  },
  txtMonth: {
    marginLeft: WIDTHXD(16),
    lineHeight: getLineHeightXD(43),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    marginTop: HEIGHTXD(23),
    opacity: 1,
    fontFamily: R.fonts.RobotoMedium
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#00000088',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    width: WIDTHXD(800),
    borderRadius: WIDTHXD(30),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  text_modal_filter: {
    color: R.colors.colorNameBottomMenu,
    fontWeight: "bold",
    fontSize: getFontXD(48),
    textAlign: "center",
    paddingVertical: HEIGHTXD(60),
    marginTop: HEIGHTXD(10)
  },
  modalText: {
    textAlign: "center",
    fontSize: getFontXD(48),
    color: R.colors.colorNameBottomMenu,
    fontFamily: R.fonts.RobotoMedium,
    flex: 1
  }
});

export const listStyles = StyleSheet.create({
  container: {
    width: getWidth(),
    flex: 1,
    height: getHeight() - HEIGHTXD(20),
    backgroundColor: '#ECF0FB'
  },
  header_text: {
    marginLeft: WIDTHXD(46),
    lineHeight: getLineHeightXD(43),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    marginTop: HEIGHTXD(30.76),
    marginBottom: HEIGHTXD(23),
    opacity: 1,
    fontFamily: R.fonts.RobotoMedium
  },
})
