import React, { PureComponent } from 'react';
import { View, StyleSheet, Linking, Platform, PermissionsAndroid } from 'react-native';
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import { connect } from 'react-redux';
import Pdf from 'react-native-pdf';
import global from '../../global';
import { WIDTHXD } from '../../../../config/Function';
import { convertTypeFile, NetworkSetting } from '../../../../config';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';
import { TYPE, showAlert } from 'common/DropdownAlert';

const requestStoragePermission = async (onSuccess) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Viettel App Camera Permission",
        message:
          "Viettel cần tải tài liệu của bạn về trước khi xem, bạn vui lòng cấp quyền lưu file.",
        buttonNeutral: "Nhắc tôi sau",
        buttonNegative: "Huỷ bỏ",
        buttonPositive: "Đồng ý"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
      onSuccess && onSuccess();
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

export const _downloadFile = (item) => {
  const url = encodeURI(NetworkSetting.ROOT.concat(`/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${item.title}", "folder": "${item.folder}"}`));

  const downloadAndView = () => RNFetchBlob.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: 'Download',
      description: 'Download file đính kèm',
      path: RNFetchBlob.fs.dirs.DownloadDir.concat('/').concat(item.filename),
    },
    path: RNFetchBlob.fs.dirs.DocumentDir.concat('/').concat(item.filename),
    fileCache: true,
  }).fetch('GET', url)
    .then((res) => {
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Tải file thành công')
      if (Platform.OS === 'ios') {
        RNFetchBlob.ios.openDocument(res.path())
      } else {
        RNFetchBlob.android.actionViewIntent(res.path())
      }
    })
    .catch((err) => {
      showAlert(TYPE.ERROR, 'Thông báo', 'Tải file thất bại')
    })
  
    if (Platform.OS === 'android') {
      requestStoragePermission(()=>downloadAndView());
    } else {
      downloadAndView()
    }
}

class AttachmentInfo extends PureComponent {
  constructor(props) {
    super(props);
    global.goBackToListListAttackFile = this._goBackToListAttackFile.bind(this);
    this.state = {
      reRender: true,
    }
  }

  _goBackToListAttackFile = () => {
    this.props.navigation.goBack();
  };

  renderAttackmenInfo() {
    const dataItem = this.props.navigation.getParam('dataItem');
    console.log('dataItem', dataItem)
    if (dataItem) {
      const typeFile = convertTypeFile(dataItem.filename);
      const url = `http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${dataItem.title}", "folder": "${dataItem.folder}"}`;
      // console.log(url)
      switch (typeFile) {
        case 3:
          return (
            <FastImage
              source={{
                uri: encodeURI(url)
              }}
              style={styles.imageStyle}
              resizeMode={FastImage.resizeMode.contain}
            />
          );
        case 2: {
          return <Pdf source={{ uri: encodeURI(url) }} style={{ flex: 1 }} />;
        }
        default:
          _downloadFile(dataItem);
          this.props.navigation.goBack();
          return null;
      }
    }
  }

  render() {
    return <View style={styles.container}>{this.renderAttackmenInfo()}</View>;
  }
}

function mapStateToProps(state) {
  return {
  };
}
export default connect(mapStateToProps, {})(
  AttachmentInfo
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
  imageStyle: {
    flex: 1
  }
});
