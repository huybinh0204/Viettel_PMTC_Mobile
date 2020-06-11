import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import { connect } from 'react-redux'
import NavigationService from 'routers/NavigationService';
import { CreateCustomer } from 'routers/screenNames';
import { setTypeOfIcon } from 'actions/invoice';
import i18n from 'assets/languages/i18n';
import apiInvoice from 'apis/Functions/invoice'
import Confirm from '../../../../../common/ModalConfirm/Confirm';
import { showAlert, TYPE } from '../../../../../common/DropdownAlert';
import ItemTrong from '../../../../../common/Item/ItemTrong';
import ButtonAdd from '../../../../../common/Button/ButtonAdd';
import { HEIGHTXD, WIDTHXD, NetworkSetting } from '../../../../../config';
import R from '../../../../../assets/R';
import ItemSignFile from './item';
import FlatListSwipe from '../../../../../common/Swipe/FlatListSwipe'
import { GetData, PutData } from 'apis/helpers';
import BottomMenu from '../../../CreateVOffice/GeneralInfor/ItemViews/BottomMenu';
import ModalAttachment from '../../../../../common/FilePicker/ModalAttachment';
import axios from 'axios';
import global from '../../../global';

// choose file attach and upload to vOffice, get id return then add this file to list sign file
// by default, type of file will be attachment
export const addSignFile = async (file, user_id, vOfficeId, lineno = 1, onSuccess = null, isFileSign = 'N', slient = false) => {
  try {
    // update new api 29/05/2020
    // first create file
    const data = {
      "cdocumentsignId": vOfficeId,//id trình ký voffice
      "filename": file.name,//tên file
      "lineno": lineno,//thứ tự
      "maxno": 4, // unknown this param, skip
      "isFileSignName": isFileSign === 'N' ? "Không" : "Có",
      "isFileSignType": isFileSign === 'N' ? "File đính kèm" : "File ký chính",
      "isFileSign": isFileSign//file ký chính
    }
    const addSignFileResponse = await axios.post(`${NetworkSetting.ROOT}/erp-service-mobile/cAttachmentinfoRsServiceRest/create/`, data);
    console.log(addSignFileResponse)
    if (addSignFileResponse && addSignFileResponse.status === 200) {
      const cattachmentinfoId = addSignFileResponse.data;
      // create success, upload file
      const formData = new FormData()
      formData.append('attachments', file);
      const url = `${NetworkSetting.ROOT}/erp-service-mobile/cAttachmentinfoRsServiceRest/attachFile/${cattachmentinfoId}/${user_id}/${user_id}/${file.name}`;
      const uploadResponse = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('uploadResponse', uploadResponse)
      if (uploadResponse && uploadResponse.status === 200) {
        slient || showAlert(TYPE.SUCCESS, 'Thông báo', 'Thêm mới file trình ký thành công.');
        onSuccess && onSuccess();
        return uploadResponse;
      } else {
        slient || showAlert(TYPE.ERROR, 'Thông báo', 'Upload file không thành công.');
      }
    } else {
      slient || showAlert(TYPE.ERROR, 'Thông báo', 'Thêm file trình ký không thành công.');
    }
  } catch (error) {
    console.log(error, error.config)
    slient || showAlert(TYPE.ERROR, 'Thông báo', 'Upload file không thành công.');
  }
  return false;
}

export const updateSignFile = async (item, onSuccess = null) => {
  try {
    const data = {
      'cdocumentsignId': item.cdocumentsignId,//id trình ký voffice
      'cattachmentinfoId': item.cattachmentinfoId,//id
    }

    const addSignFileResponse = await axios.post(`${NetworkSetting.ROOT}/erp-service-mobile/cAttachmentinfoRsServiceRest/isFileSign/`, data);
    // console.log(addSignFileResponse)
    if (addSignFileResponse && addSignFileResponse.status === 200) {
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhật file trình ký thành công.');
      onSuccess && onSuccess();
    } else {
      showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật file trình ký không thành công.');
    }
  } catch (error) {
    console.log(error.response)
    showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật file trình ký không thành công.');
  }
}

const nextLineNo = (listFile) => {
  if (!listFile || listFile.length < 1) return 1;
  let max = listFile[0].lineno;
  listFile.map(x => max = (x.lineno > max ? x.lineno : max));
  return max + 1;
}

// Design XD no.141
class ListFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
    }
  }

  componentDidMount = async () => {
    // update active of bottom menu
    this.refreshBottomMenu();

    // fetch list file
    this.fetch();

    global.showAttachModal = () => this.fileModal && this.fileModal.show();
  }

  menu = [
    {
      name: i18n.t('SAVE_T'),
      iconName: R.images.voffice.save,
      enable: false,
    },
    {
      name: 'CO',
      iconName: R.images.voffice.co,
      enable: false,
    },
    {
      name: i18n.t('ATTACK_T'),
      iconName: R.images.voffice.attach,
      enable: true
    },
  ]

  refreshBottomMenu = () => {
    // console.log('refreshBottomMenu', this.props)
    const { isEdit, viewOnly } = this.props.self;
    // this.menu[0].enable = false;
    // this.menu[1].enable = false;
    this.menu[2].enable = !viewOnly && isEdit;
  }

  _refreshData = async () => {
    this.setState({ refreshing: true }, async () => {
      await this.fetch();
      this.setState({ refreshing: false })
    })
  }

  fetch = async () => {
    try {
      // const url = `${NetworkSetting.ROOT}/erp-service/cAttachmentinfoServiceRest/cAttachmentInfo/${this.props.cDocumentsignId}`;
      const url = `${NetworkSetting.ROOT}/erp-service-mobile/cAttachmentinfoRsServiceRest/cAttachmentInfo/${this.props.cDocumentsignId}`;
      const response = await GetData(url);
      console.log(response);
      this.setState({ data: response.data });
    } catch (error) {
      this.setState({ data: [] });
    }
  }

  _renderFooter = () => (
    this.state.showfooter ? (
      <View style={{ height: HEIGHTXD(110) }}>
        <ActivityIndicator animating color="#1C1C1C" size="large" />
      </View>) : (
        <View style={{ height: HEIGHTXD(110) }} />)
  )

  _alertDelSuccess = async () => {
    try {
      const { idSelected } = this.state;
      let response = await PutData(`${NetworkSetting.ROOT}/erp-service/cAttachmentinfoServiceRest/remove`, idSelected);
      if (response && response.status === 200) {
        this.fetch();
        showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Delete_successful'))
      } else {
        showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
      }
    } catch (error) {
      showAlert(TYPE.ERROR, i18n.t('NOTIFICATION_T'), i18n.t('Delete_failed'))
    }
  }

  _onPressIcon = (indexOfIcon, indexOfItem) => {
    this.setState({ idSelected: this.state.data[indexOfItem].cattachmentinfoId });
    this.ConfirmPopup.setModalVisible(true);
  }

  _onChangeBottomMenu = (index) => {

    if (index === 2) {
      this.fileModal.show();
    }
  }

  onCapturePhoto = (file) => {
    // upload photo
    addSignFile(file, this.props.userData.adUserId, this.props.cDocumentsignId, nextLineNo(this.state.data), () => this.fetch());
  }

  onChoosePhoto = (file) => {
    // upload photo
    addSignFile(file, this.props.userData.adUserId, this.props.cDocumentsignId, nextLineNo(this.state.data), () => this.fetch());
  }

  onChooseFile = (files) => {
    // upload file
    addSignFile(files[0], this.props.userData.adUserId, this.props.cDocumentsignId, nextLineNo(this.state.data), () => this.fetch());
  }

  render() {
    const { isSearch } = this.state
    let List = this.props.tabIndex === 1 ? FlatListSwipe : FlatList;

    return (
      <View style={styles.container}>
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn xóa bản ghi này không?"
          titleLeft="HUỶ BỎ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this._alertDelSuccess()}
        />
        <List
          data={this.state.data}
          extraData={this.state.data}
          renderItem={({ item, index }) => (
            <ItemSignFile
              index={index}
              onPressIcon={this._onPressIcon}
              item={item}
              onPressItem={(item) => {
                // navigate to file info
                this.props.navigation.navigate('AttachmentInfo', { dataItem: item });
              }}
              onPressCheckbox={(item) => {
                item.isFileSign = item.isFileSign === 'Y' ? 'N' : 'Y';
                updateSignFile(item, () => this.fetch())
              }}
            />)
          }
          ListEmptyComponent={!this.state.refreshing && <ItemTrong title={isSearch ? i18n.t('NULL_DATA_SEARCH') : i18n.t('NULL_T')} />}
          onEndReachedThreshold={0.1}
          onPressIcon={(indexOfIcon, indexOfItem) => { this._onPressIcon(indexOfIcon, indexOfItem) }}
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(129)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
          onEndReached={this._loadMoreData}
          ListFooterComponent={this._renderFooter}
          onRefresh={this._refreshData}
          refreshing={this.state.refreshing}
        />
        <BottomMenu
          menu={this.menu}
          onChange={this._onChangeBottomMenu}
        />
        <ModalAttachment
          onCapturePhoto={this.onCapturePhoto}
          onChoosePhoto={this.onChoosePhoto}
          onChooseFile={this.onChooseFile}
          ref={ref => this.fileModal = ref} />
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData,
  }
}
export default connect(mapStateToProps, {
  setTypeOfIcon

})(ListFile);
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
});


// // Hướng dẫn fix bug mất icon khi vuốt, tại các màn hình có nhiều Tab, nếu có nhiều hơn 2 tab có chứa FlatListSwipe, việc vuốt và đổi liên tục giữa các tab đấy sẽ có thể làm mất các icon chức năng (duplicate, delete, edit)
// import { FlatList } from 'react-native';
// import FlatListSwipe from '../../../../../common/Swipe/FlatListSwipe';


// class YourScreen extends Component {

//   render() {
//     // đẩy tabIndex vào Screen này để kiểm tra hiện tại đang focus vào nó (this.props.tabIndex === 1, thay 1 bằng index của Screen)
//     let List = this.props.tabIndex === 1 ? FlatListSwipe : FlatList;

//     return (
//       <>
//         {/* Sử dụng List thay cho FlatListSwipe như hiện tại */}
//         <List
//         // Các props giữ nguyên
//         />
//       </>
//     )
//   }
// }

// // Hiện tại Hoá đơn, VOffice, Đề xuất đối tượng đã áp dụng fix này