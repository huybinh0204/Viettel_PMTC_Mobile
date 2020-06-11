import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import { connect } from 'react-redux';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
// import BottomMenu from '../../common/BottomMenu';
import BottomMenu from '../../../Invoice/common/BottomMenu';
import BottomTabAdd from '../../ItemViews/BottomTabAdd';
import { WIDTHXD } from '../../../../config/Function';
import ItemAttachment from './Items/Item';
import { dataAttach } from '../../../Invoice/CreateInvoice/Attachment/dataAttach';
import {setTypeOfIconAttackInfo} from '../../../../actions/statement';
import { getListAttackFile, deleteAttackFile} from '../../../../apis/Functions/statement';
import {convertTypeFile} from "../../../../config"
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import ItemTrong from '../../../../common/Item/ItemTrong'


class Attackments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reRender: true,
      adTableId: 1000077,
      recordId: 926,
      isActive: "Y",
      isDeleted: "N",
      dataAttach:[],
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
    // this.dataAttach = dataAttach;
  }
  async componentDidMount()
  {
   this._getListAttack();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uploadFileAttack !== this.props.uploadFileAttack) {
      this._getListAttack();
    }
  }

  async _getListAttack(){
    const body = {      
      adTableId: this.state.adTableId,
      recordId: this.state.recordId,
      isActive: this.state.isActive,
      isDeleted: this.state.isDeleted,
    }
    const response = await getListAttackFile(body);
    if(response.status===200)
    {
      // this.dataAttach=response.data;
      this.setState({dataAttach: response.data, loading: false})
    }
  }

  
  _onDel = async(indexs, indexDel, adAttachmentId) => {
    if(adAttachmentId)
    {
      const response = await deleteAttackFile([adAttachmentId]);
      if(response.status ===200)
      {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá thành công');
        let dataAttachTmp = this.state.dataAttach;
        dataAttachTmp.splice(indexDel, 1);
        this.setState({ dataAttach: dataAttachTmp });
      }
      else{
        showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại đường truyền');
      }
    }
  };

  _onChangeBottomMenu = index => {};

  render() {
    return (
      <View style={styles.container}>
        <FlatListSwipe
          data={this.state.dataAttach}
          renderItem={({ item, index }) => {
            return <ItemAttachment
              pressItemAttack={()=>{
                this.props.setTypeOfIconAttackInfo(0)
                this.props.navigation.navigate('AttackmentInfo', {dataItem: item})
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
          ListEmptyComponent={!this.state.loading && <ItemTrong />}
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(129)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
        />

      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    statusMenu: state.statementRuducer.statusMenu
  };
}
export default connect(mapStateToProps, {setTypeOfIconAttackInfo})(Attackments);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  }
});
