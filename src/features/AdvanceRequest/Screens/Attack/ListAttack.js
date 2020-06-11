import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import R from '../../../../assets/R';
import { convertTypeFile, WIDTHXD } from '../../../../config';
import ItemAttachment from './ItemViews/ItemAttachment';
import FlatListSwipe from '../../../../common/Swipe/FlatListSwipe';
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import { getListAttackFile, deleteAttackFile } from '../../../../apis/Functions/statement';
import global from '../../global'
import ItemTrong from '../../../../common/Item/ItemTrong'
import i18n from '../../../../assets/languages/i18n';
import OnPressFileAttack from './Function'
import advanceRequest from '../../../../apis/Functions/advanceRequest'


class Attackments extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      adTableId: global.TABLE_ID,
      isActive: 'Y',
      isDeleted: 'N',
      dataAttach: [],
      refreshing: false
    }
  }

  _onDel = async (indexs, indexDel, adAttachmentId) => {
    if (adAttachmentId) {
      const response = await deleteAttackFile([adAttachmentId]);
      if (response.status === 200) {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá file đính kèm thành công');
        let dataAttachTmp = [...this.state.dataAttach];
        dataAttachTmp.splice(indexDel, 1);
        this.setState({ dataAttach: dataAttachTmp });
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Xóa file thất bại');
      }
    }
  };

  componentDidMount() {
    // console.log('RUN IN DID MOUNT')
    if (this.props.coVoffice) {
      // console.log('RUN IN DID MOUNT 1111')
      this._getFileVoffice(this.props.idVoffice)
    } else {
      if (this.props.advanceRequestId) {
        // console.log('RUN IN DID MOUNT 222222')
        this._getListAttack(this.props.advanceRequestId)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uploadFileAttack !== this.props.uploadFileAttack) {
      this._refreshData()
    }
    if (nextProps.coVoffice !== this.props.coVoffice && nextProps.idVoffice === null) {
      // console.log('RUN IN NEXT PROPS  1111')
      this._getListAttack(this.props.advanceRequestId)
    }
    if (nextProps.coVoffice !== this.props.coVoffice && nextProps.idVoffice !== null) {
      // console.log('RUN IN NEXT PROPS  222222')
      this._getFileVoffice(nextProps.idVoffice)
    }
  }

  _getListAttack = async (id) => {
    const body = {
      adTableId: this.state.adTableId,
      recordId: id,
      isActive: this.state.isActive,
      isDeleted: this.state.isDeleted,
    }
    try {
      const response = await getListAttackFile(body);
      if (response.status === 200) {
        this.setState({ dataAttach: response.data, refreshing: false })
      }
    } catch (error) {
    }
  }

  _getFileVoffice = async (idVoffice) => {
    try {
      const response = await advanceRequest.listAttackVoffice(idVoffice)
      console.log('ID VOFFICE:', idVoffice)
      console.log('RESPONSE LIST --', response)
      if (response && response.status === 200) {
        this.setState({ dataAttach: response.data, refreshing: false })
      }
    } catch (err) {
      console.log('ERROR:', err)
    }
  }

  _refreshData = () => {
    if (this.props.idVoffice === null) this._getListAttack(this.props.id)
    else this._getFileVoffice(this.props.idVoffice)
  }

  render() {
    console.log('LENGTH---', this.state.dataAttach.length)
    if (this.state.dataAttach.length === 0) {
      return <ItemTrong title={i18n.t('NULL_DATA_SEARCH')} />
    }
    return (
      <View style={styles.container}>
        <FlatListSwipe
          data={this.state.dataAttach}
          renderItem={({ item, index }) => {
            return <ItemAttachment
              pressItemAttack={() => {
                OnPressFileAttack(item)
              }}
              filename={item.filename}
              index={index}
              type={convertTypeFile(item.filename)}
              onPressIcon={this._onDel}
            />
          }}
          onPressIcon={(indexOfIcon, indexOfItem, adAttachmentId) => {
            this._onDel(indexOfIcon, indexOfItem, adAttachmentId);
          }}
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(130)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
          refreshing={this.state.refreshing}
          onRefresh={() => this.setState({ refreshing: true }, () => this._refreshData())}
        />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    uploadFileAttack: state.advanceRequestReducer.uploadFileAttack,
    coVoffice: state.advanceRequestReducer.coVoffice,
    idVoffice: state.advanceRequestReducer.idVoffice,
    advanceRequestId: state.advanceRequestReducer.advanceRequestId,
  }
}

export default connect(mapStateToProps, {})(Attackments)

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
});
