import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment'
import { connect } from 'react-redux'
import { CreateInvoice, DetailInvoice } from 'routers/screenNames';
import NavigationService from '../../../routers/NavigationService';
import { setListInvoice } from '../../../actions/invoice'
import i18n from '../../../assets/languages/i18n';
import apiInvoice from '../../../apis/Functions/invoice';
import Confirm from '../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import { LoadingComponent } from '../../../common/Loading/LoadingComponent';
import ItemInvoice from './item';
import { HEIGHTXD, getFontXD, getWidth, convertDataInvoice, mapTimeVNToWorld, getHeight, WIDTHXD, getLineHeightXD } from '../../../config';
import HeaderBtnSearch from '../../../common/Header/HeaderBtnSearch';
import ItemTrong from '../../../common/Item/ItemTrong'
import ButtonAdd from '../../../common/Button/ButtonAdd';
import R from '../../../assets/R'
import SecsionListSwipe from '../../../common/Swipe/SecsionListSwipe'
import _ from 'lodash'

class ListInvoice extends Component {
  ConfirmPopup = {
  };

  invoiceSelected = [];
  oldSearch = '';

  timeoutSearch;

  readEnd = false;

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
      dataInvoice: [],
      invoice: null,
    }
    this.invoiceSelected = []
    this.oldSearch = ''
    this.indexOfItem = '0.0'
    this.maxData = 0;
    this.openRowRef = null;
  }

  _onChangeSearch = async (search) => {
    clearTimeout(this.timeoutSearch);
    this.timeoutSearch = setTimeout(async () => {
      if (this.oldSearch === search) {
        let resInvoice = await this._getData(0, search);

        let dataInvoice = this.state.dataInvoice;
        if (resInvoice.data) {
          dataInvoice = convertDataInvoice([], resInvoice.data);
        }
        this.setState({ reRender: true, dataInvoice })
      }
    }, 300);
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
    this.readEnd = false;
    this.setState({ refreshing: true }, async () => {
      let resInvoice = await this._getData(0, this.state.search);
      let dataInvoice = this.state.dataInvoice;

      if (resInvoice.data) {
        this.maxData = resInvoice.data.length
        dataInvoice = convertDataInvoice([], resInvoice.data);
      }
      this.setState({ refreshing: false, Firstloading: false, dataInvoice })
    })
  }

  _getData = async (start, searchKey) => {
    let body
    let resInvoice
    if (this.props.navigation.state.params && this.props.navigation.state.params.id) {
      body = {
        apInvoiceGroupId: this.props.navigation.state.params.id,
        start,
        searchKey,
        maxResult: R.strings.PAGE_LIMIT.PAGE_INVOICE,
        sortField: 'TRANS_DATE',
        sortDir: 'DESC'
      }
      resInvoice = await apiInvoice.getInvoiceListForSelect(body);
    } else {
      body = {
        adOrgId: this.props.userData.loggedIn.adOrgId,
        start,
        searchKey,
        maxResult: R.strings.PAGE_LIMIT.PAGE_INVOICE,
        sortField: 'TRANS_DATE',
        sortDir: 'DESC'
      }
      resInvoice = await apiInvoice.getListInvoice(body);
    }
    // console.log(JSON.stringify(body))
    // console.log(JSON.stringify(resInvoice))
    return resInvoice;
  }

  _addDuplicate = async (apInvoiceId) => {
    this.setState({ reRender: true });
    let res = await apiInvoice.duplInvoice({ apInvoiceId });
    if (res && res.data) {
      this._refreshData()
      this.setState({ reRender: false });
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), 'Sao chép hóa đơn thành công.')
    } else {
      this.setState({ reRender: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), 'Sao chép hóa đơn thất bại')
    }
  }

  _loadMoreData = async () => {
    let { search, showfooter } = this.state;
    if (showfooter || this.readEnd) return;
    // console.log('loadmore')
    this.setState({ showfooter: true }, async () => {
      let resInvoice = await this._getData(this.maxData, search)
      let dataInvoice = this.state.dataInvoice;
      if (resInvoice.data) {
        this.maxData += resInvoice.data.length
        if (resInvoice.total >= this.maxData) {
          dataInvoice = convertDataInvoice(dataInvoice, resInvoice.data)
        }

        if (resInvoice.data.length < R.strings.PAGE_LIMIT.PAGE_INVOICE) {
          this.readEnd = true;
        }
      }
      this.setState({ showfooter: false, dataInvoice: JSON.parse(JSON.stringify(dataInvoice)) })
    })
  }


  _renderFooter = () => (
    (this.state.showfooter && this.maxData >= R.strings.PAGE_LIMIT.PAGE_INVOICE) ? (
      <View style={{ height: HEIGHTXD(110), paddingTop: HEIGHTXD(50) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  _alertDelSuccess = async () => {
    const { idSelected } = this.state;
    this.setState({ reRender: true });
    let res = await apiInvoice.delInvoice(idSelected);
    if (res) {
      let dataInvoice = this.state.dataInvoice;
      const [section] = this.indexOfItem.split('.');
      const newData = [...dataInvoice];
      const prevIndex = dataInvoice[section].data.findIndex(
        items => items.key === this.indexOfItem
      );
      if (newData[section].data.length > 1) {
        newData[section].data.splice(prevIndex, 1);
      } else {
        newData[section] = { title: '', data: [] }
      }
      dataInvoice = newData
      this.setState({ reRender: false, dataInvoice });
      showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Delete_successful'))
    } else {
      this.setState({ reRender: false });
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
    }
  }

  _onPressIcon = (indexOfIcon, indexOfItem) => {
    let dataInvoice = this.state.dataInvoice;
    const [section] = indexOfItem.split('.');
    const newData = [...dataInvoice];
    const { userData } = this.props
    const prevIndex = dataInvoice[section].data.findIndex(
      items => items.key === indexOfItem
    );
    this.setState({ reRender: !this.state.reRender })
    if (indexOfIcon === 1) {
      if (userData.adUserId === newData[section].data[prevIndex].updatedby) {
        NavigationService.navigate(CreateInvoice, { idInvoice: newData[section].data[prevIndex].apInvoiceId, refreshData: this._refreshData })
      } else {
        NavigationService.navigate(DetailInvoice, { idInvoice: newData[section].data[prevIndex].apInvoiceId, refreshData: () => {} })
      }
    } else if (indexOfIcon === 2) {
      if (userData.adUserId === newData[section].data[prevIndex].updatedby) {
        this.setState({ idSelected: newData[section].data[prevIndex].apInvoiceId, invoice: newData[section].data[prevIndex] })
        this.indexOfItem = indexOfItem
        this.ConfirmPopup.setModalVisible(true);
      } else {
        showAlert(TYPE.ERROR, 'Bạn không có quyền xoá hoá đơn này.')
      }
    } else {
      this._addDuplicate(newData[section].data[prevIndex].apInvoiceId)
      this.setState({ reRender: !this.state.reRender })
    }
  }

  _onPressItem = (content) => {
    let isChooseInvoice = this.props.navigation.state.params && this.props.navigation.state.params.id ? true : false
    if (isChooseInvoice) {
      let indexTmp = -1
      _.forEach(this.invoiceSelected, (item, index) => {
        if (content.apInvoiceId === item.apInvoiceId) {
          indexTmp = index
        }
      })
      if (indexTmp >= 0) {
        this.invoiceSelected.splice(indexTmp, 1)
      } else {
        this.invoiceSelected.push(content)
      }
      this.setState({ reRender: !this.state.reRender })
    } else {
      if (this.props.userData.adUserId === content.updatedby) {
        if (content.documentNo && content.docstatus && content.docstatus === 'CO') {
          NavigationService.navigate(DetailInvoice, { idInvoice: content.apInvoiceId, refreshData: () => { } })
        } else {
          NavigationService.navigate(CreateInvoice, { idInvoice: content.apInvoiceId, refreshData: this._refreshData })
        }
      } else {
        NavigationService.navigate(DetailInvoice, { idInvoice: content.apInvoiceId, refreshData: () => {}})
      }
    }
  }

  _renderItem = ({ item, index }) => {
    let day = moment(mapTimeVNToWorld(item.transDate)).format('D');
    let month = moment(mapTimeVNToWorld(item.transDate)).format('M');
    let year = moment(mapTimeVNToWorld(item.transDate)).format('YYYY');
    let content = {
      transDate: item.transDate,
      name: item.sellerName,
      id: item.invoiceNo,
      price: item.requestAmount,
      status: item.description,
      apInvoiceId: item.apInvoiceId,
      updatedby: item.updatedby,
      documentNo: item.documentNoTHTT,
      docstatus: item.docstatus,
    }
    let c = R.strings.TRANG_THAI_TO_TRING[0].color;
    let isSelectItem = false
    let isChooseInvoice = this.props.navigation.state.params && this.props.navigation.state.params.id ? true : false
    if (isChooseInvoice) {
      let indexTmp = -1
      _.forEach(this.invoiceSelected, (item, index) => {
        if (content.apInvoiceId === item.apInvoiceId) {
          indexTmp = index
        }
      })
      if (indexTmp >= 0) {
        isSelectItem = true
      }
    }

    return (
      <ItemInvoice
        time={{ day, month, year }}
        content={content}
        index={index}
        colorStatus={c}
        isSelectItem={isSelectItem}
        onPressItem={this._onPressItem}
      />
    )
  }

  _saveInvoiceForInvoiceGroup = async () => {
    if (this.invoiceSelected.length > 0) {
      let idList = ''
      _.forEach(this.invoiceSelected, (item => {
        let idListTmp = ''
        if (idList == "") {
          idListTmp = `${item.apInvoiceId}`
        } else {
          idListTmp = `${idList},${item.apInvoiceId}`
        }
        idList = idListTmp
      }))
      let body = {
        apInvoiceIdLst: idList,
        apInvoiceGroupId: this.props.navigation.state.params.id
      }
      const response = await apiInvoice.saveInvoiceForInvoiceGroup(body)
      // console.log('REPOSNE DATA---', response)
      // console.log('body__saveInvoiceForInvoiceGroup', JSON.stringify(body))
      // console.log('response__saveInvoiceForInvoiceGroup', response)
      if (response) {
        NavigationService.pop()
        this.props.navigation.state.params.onPressItem(this.invoiceSelected)
      } else {
        showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), 'Lưu hoá đơn không thành công')
      }
    } else {
      NavigationService.pop()
    }
  }

  render() {
    let isChooseInvoice = this.props.navigation.state.params && this.props.navigation.state.params.id ? true : false
    let textSelectSaveSelection = ''
    if (isChooseInvoice) {
      textSelectSaveSelection = (isChooseInvoice && this.invoiceSelected.length > 0) ? `Lưu (${this.invoiceSelected.length})` : "Lưu"
    }
    const { Firstloading, search, isSearch, dataInvoice } = this.state
    if (Firstloading) {
      return (
        <View style={styles.container}>
          <HeaderBtnSearch
            title="Danh sách hóa đơn"
            placeholderSearch="Số chứng từ, số tiền DN"
            search={search}
            isSearch={isSearch}
            setIsSearch={this._setIsSearch}
            onChangeSearch={this._onChangeSearch}
            onButtonSearch={() => { this._setIsSearch(true) }}
          />
          <View style={styles.view} />
          <LoadingComponent isLoading={true} />
        </View>
      )
    }
    const renderSectionHeader = ({ section }) => {
      if (section.title === '' || !section.title) return []
      if (section.key === 0) {
        return (<Text style={styles.txtMonth}>{section.title}</Text>)
      } else {
        return (
          <View>
            <Text style={styles.txtMonthTopBorder}>{section.title}</Text>
          </View>
        )
      }
    };

    return (
      <View style={styles.container}>
        <HeaderBtnSearch
          title="Danh sách hóa đơn"
          placeholderSearch="Số chứng từ, số tiền DN"
          search={search}
          isSearch={isSearch}
          setIsSearch={this._setIsSearch}
          onChangeSearch={this._onChangeSearch}
          onButtonSearch={() => { this._setIsSearch(true) }}
        />
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn xóa bản ghi này không ?"
          titleLeft="HUỶ BỎ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this._alertDelSuccess()}
        />
        <View style={styles.view}>
          <SecsionListSwipe
            useSectionList
            data={dataInvoice}
            sections={dataInvoice}
            keyExtractor={(item, index) => item.key}
            extraData={dataInvoice}
            renderItem={({ item, index }) => this._renderItem({ item, index })}
            ListEmptyComponent={!this.state.refreshing && <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />}
            onEndReached={this._loadMoreData}
            ListFooterComponent={this._renderFooter}
            onRefresh={this._refreshData}
            refreshing={this.state.refreshing}
            onEndReachedThreshold={0.1}
            onPressIcon={(indexOfIcon, indexOfItem) => { this._onPressIcon(indexOfIcon, indexOfItem) }}
            listIcons={[R.images.iconCoppy, R.images.iconEdit, R.images.iconDelete]}
            closeAllOpenRows={true}
            widthListIcon={WIDTHXD(417)}
            rightOfList={WIDTHXD(30)}
            styleOfIcon={{ width: WIDTHXD(110), height: WIDTHXD(110), marginLeft: WIDTHXD(30), marginBottom: WIDTHXD(23) }}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={renderSectionHeader}
          />
        </View>
        {isChooseInvoice && this.invoiceSelected.length > 0 ?
          <TouchableOpacity
            style={styles.btIcon}
            onPress={() => {
              this._saveInvoiceForInvoiceGroup()
            }
            }
            underlayColor="transparent"
          >
            <View style={{ alignItems: 'center' }}>
              <FastImage source={R.images.iconSave} style={styles.icIcon} />
              <Text style={styles.txtIcon}>{textSelectSaveSelection}</Text>
            </View>
          </TouchableOpacity> : null
        }
        <ButtonAdd
          onButton={() => NavigationService.navigate(CreateInvoice, { refreshData: this._refreshData })}
          bottom={HEIGHTXD(150)}
        />
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    listInvoice: state.invoiceReducer.listInvoice,
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, { setListInvoice })(ListInvoice);
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
    paddingTop: HEIGHTXD(30),
  },
  item: {
    marginTop: HEIGHTXD(50),
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.MontserratMedium
  },
  txtMonth: {
    marginLeft: WIDTHXD(46),
    lineHeight: getLineHeightXD(43),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    marginTop: HEIGHTXD(23),
    opacity: 1,
    fontFamily: R.fonts.RobotoMedium
  },

  txtMonthTopBorder: {
    paddingHorizontal: WIDTHXD(46),
    paddingTop: getLineHeightXD(25),
    lineHeight: getLineHeightXD(43),
    color: R.colors.black0,
    fontSize: getFontXD(36),
    marginTop: HEIGHTXD(23),
    opacity: 1,
    fontFamily: R.fonts.RobotoMedium,
    borderTopColor: R.colors.grey300,
    borderTopWidth: 1,
  },
  btIcon: {
    flexDirection: 'column',
    alignItems: 'center',
    height: HEIGHTXD(200),
    backgroundColor: R.colors.white,
    justifyContent: 'space-around',
  },
  icIcon: {
    width: WIDTHXD(57),
    height: WIDTHXD(57)
  },

  txtIcon: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(33),
    color: R.colors.colorNameBottomMenu,
    marginTop: WIDTHXD(20)
  },

});
