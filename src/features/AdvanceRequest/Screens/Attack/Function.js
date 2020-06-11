// import React from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import RnFetchBlob from 'rn-fetch-blob'
import { NetworkSetting } from '../../../../config/Setting';
import NavigationService from '../../../../routers/NavigationService'
import { convertTypeFile } from '../../../../config';
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'


const onPressItemAttack = (item) => {
  const typeFile = convertTypeFile(item.filename || item.name);
  if (item.isFileSign === 'Y') {
    NavigationService.navigate('DetailAttack', { id: item.cdocumentsignId })
  } else {
    switch (typeFile) {
      case 3:
        NavigationService.navigate('ViewFileAttack', item)
        break
      case 2:
        NavigationService.navigate('ViewFileAttack', item)
        break
      case 1:
        _requestFileManagerPermission(item)
        break
      case 0:
        _requestFileManagerPermission(item)
        break
      default:
        showAlert(TYPE.WARN, 'Thông báo', 'Định dạng file không hỗ trợ')
        break
    }
  }
}

const _requestFileManagerPermission = async (item) => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Truy cập File',
          message: 'Phần Mềm Tài chính muốn truy cập vào trong bộ nhớ thiết bị của bạn',
          buttonPositive: 'OK',
          buttonNegative: 'Từ chối'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        _downloadFile(item)
      } else {
        showAlert(TYPE.WARN, 'Thông báo', 'Không thể chọn file')
      }
    } catch (error) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra')
    }
  } else {
    _downloadFile(item)
  }
}

const _downloadFile = (item) => {
  showLoading()
  const url = encodeURI(NetworkSetting.ROOT
    .concat(`/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${item.title}", "folder": "${item.folder}"}`))
  RnFetchBlob.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: 'Download',
      description: 'Download file đính kèm',
      path: RnFetchBlob.fs.dirs.DownloadDir.concat('/').concat(item.filename),
    },
    path: RnFetchBlob.fs.dirs.DocumentDir.concat('/').concat(item.filename),
    fileCache: true,
  }).fetch('GET', url)
    .then((res) => {
      // showAlert(TYPE.SUCCESS, 'Thông báo', 'Tải file thành công')
      if (Platform.OS === 'ios') {
        RnFetchBlob.ios.openDocument(res.path())
      } else {
        RnFetchBlob.android.actionViewIntent(res.path())
      }
    })
    .catch(() => {
      showAlert(TYPE.ERROR, 'Thông báo', 'Tải file thất bại')
    })
    .finally(() => hideLoading())
}

export default onPressItemAttack
