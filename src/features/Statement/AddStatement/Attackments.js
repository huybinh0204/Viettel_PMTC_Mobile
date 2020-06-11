import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import { connect } from 'react-redux';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
// import BottomMenu from '../../common/BottomMenu';
import BottomMenu from '../../Invoice/common/BottomMenu';
import BottomTabAdd from '../ItemViews/BottomTabAdd';
import { WIDTHXD } from '../../../config/Function';
import ItemAttachment from '../../Invoice/CreateInvoice/Attachment/Item';
import { dataAttach } from '../../Invoice/CreateInvoice/Attachment/dataAttach';

class Attackments extends PureComponent {
  constructor(props) {
    super(props);
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

  _onChangeBottomMenu = index => {};

  render() {
    return (
      <View style={styles.container}>
        <FlatListSwipe
          data={this.dataAttach}
          renderItem={({ item, index }) => (
            <ItemAttachment
              title={item.name}
              index={index}
              type={item.type}
              onPressIcon={this._onDel}
            />
          )}
          onPressIcon={(indexOfIcon, indexOfItem) => {
            this._onDel(indexOfIcon, indexOfItem);
          }}
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(129)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
        />

        {/* <BottomMenu
          menu={this.state.menu}
          onChange={this._onChangeBottomMenu}
        /> */}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    statusMenu: state.statementRuducer.statusMenu
  };
}
export default connect(mapStateToProps, {})(Attackments);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  }
});
