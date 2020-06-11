import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import { connect } from 'react-redux';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
import Pdf from 'react-native-pdf';
import FastImage from 'react-native-fast-image';
// import BottomMenu from '../../common/BottomMenu';
import BottomMenu from '../../../Invoice/common/BottomMenu';
import BottomTabAdd from '../../ItemViews/BottomTabAdd';
import global from '../../global';
import { WIDTHXD } from '../../../../config/Function';
import ItemAttachment from '../../../Invoice/CreateInvoice/Attachment/Item';
import { dataAttach } from '../../../Invoice/CreateInvoice/Attachment/dataAttach';
import { setTypeOfIconAttackInfo } from '../../../../actions/statement';
import { convertTypeFile } from '../../../../config';

class AttackmentInfo extends PureComponent {
  constructor(props) {
    super(props);
    global.goBackToListListAttackFile = this._goBackToListAttackFile.bind(this);
    this.props.setTypeOfIconAttackInfo(1);
    this.state = {
      reRender: true,
      menu: [
        {
          name: 'Lưu',
          iconName: this.props.statusMenu.isSave
            ? R.images.iconSaveActive
            : R.images.iconSaveInActive
        },
        {
          name: 'CO',
          iconName: this.props.statusMenu.isCOed
            ? R.images.iconCodActive
            : R.images.iconRadActive
        },
        {
          name: 'Đính kèm',
          iconName: this.props.statusMenu.isAttack
            ? R.images.iconAttackActive
            : R.images.iconAttackInActive
        },
        {
          name: 'Trình ký',
          iconName: this.props.statusMenu.isSubmitd
            ? R.images.iconSubmitdActive
            : R.images.iconSubmitdInActive
        },
        {
          name: 'Phiếu in',
          iconName: this.props.statusMenu.isPrint
            ? R.images.iconPrintActive
            : R.images.iconPrintInActive
        }
      ]
    };
    this.dataAttach = dataAttach;
  }

  _onDel = (indexs, indexDel) => {
    this.dataAttach.splice(indexDel, 1);
    this.setState({ reRender: !this.state.reRender });
  };

  componentDidMount() {}

  _goBackToListAttackFile = () => {
    this.props.navigation.goBack();
  };

  componentWillUnmount() {
    this.props.setTypeOfIconAttackInfo(0);
  }

  _onChangeBottomMenu = index => {};

  renderAttackmenInfo() {
    const dataItem = this.props.navigation.getParam('dataItem');
    if (dataItem) {
      const typeFile = convertTypeFile(dataItem.filename);
      const url = `http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${dataItem.title}", "folder": "${dataItem.folder}"}`;
      switch (typeFile) {
        case 3:
          return (
            <FastImage
              source={{
                uri: url
              }}
              style={styles.imageStyle}
              resizeMode={FastImage.resizeMode.contain}
            />
          );
        case 2: {
          return <Pdf source={{ uri: encodeURI(url) }} style={{ flex: 1 }} />;
        }
        default:
          break;
      }
    }
  }

  render() {
    return <View style={styles.container}>{this.renderAttackmenInfo()}</View>;
  }
}

function mapStateToProps(state) {
  return {
    statusMenu: state.statementRuducer.statusMenu
  };
}
export default connect(mapStateToProps, { setTypeOfIconAttackInfo })(
  AttackmentInfo
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
  imageStyle: {
    flex: 1,
  }
});
