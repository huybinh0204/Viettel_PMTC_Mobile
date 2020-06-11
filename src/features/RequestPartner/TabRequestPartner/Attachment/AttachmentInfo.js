import React, { PureComponent } from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import { connect } from 'react-redux';
import Pdf from 'react-native-pdf';
import global from '../../../Invoice/global';
import { WIDTHXD } from '../../../../config/Function';
import { convertTypeFile, NetworkSetting } from '../../../../config';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';
import { TYPE, showAlert } from 'common/DropdownAlert';
import { _downloadFile } from '../../../Invoice/CreateInvoice/Attachment/AttachmentInfo';

class AttachmentInfo extends PureComponent {
  constructor(props) {
    super(props);
    global.goBackToListListAttackFile = this._goBackToListAttackFile.bind(this);
    this.state = {
      reRender: true,
    }
  }

  componentDidMount() {
    const dataItem = this.props.navigation.getParam('dataItem');
    if (dataItem) {
      const typeFile = convertTypeFile(dataItem.filename);
      if (typeFile < 2) {
        _downloadFile(dataItem);
        this.props.navigation.goBack();
        this.props.screenProps.onAttachmentTabChange && this.props.screenProps.onAttachmentTabChange(0);
      }
    }
  }

  _goBackToListAttackFile = () => {
    this.props.navigation.goBack();
  };

  renderAttackmenInfo() {
    const dataItem = this.props.navigation.getParam('dataItem');
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
          // console.log('dataItem', this.props)
          // _downloadFile(dataItem);
          // this.props.navigation.goBack();
          // this.props.screenProps.onAttachmentTabChange && this.props.screenProps.onAttachmentTabChange(0);
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
