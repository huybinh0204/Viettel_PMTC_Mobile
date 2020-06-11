import React, { PureComponent, Component } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import axios from 'axios';

import ModalAttachment from 'common/FilePicker/ModalAttachment';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
import BottomMenu from '../../../VOffice/CreateVOffice/GeneralInfor/ItemViews/BottomMenu';
import { WIDTHXD, convertTypeFile } from '../../../../config';
import ItemAttachment from './Item';
// import { dataAttach } from './dataAttach'
import invoice from 'apis/Functions/invoice';
import { connect } from 'react-redux';
import global from '../../global';
import { showAlert, TYPE } from 'common/DropdownAlert';
import Confirm from 'common/ModalConfirm/Confirm';

class ListFileAttachment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reRender: true,
      data: [],
      selectedIndex: 0,
    }
    // this.dataAttach = dataAttach;
  }

  componentDidMount() {
    // fetch data
    // http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/adAttachment/search
    this.fetch();
    this.props.screenProps.setRefreshAttachmentList(() => this.fetch());
  }

  fetch = async () => {
    try {
      const response = await invoice.getListAttachment(this.props.screenProps.idInvoice);
      // console.log('list file', response);
      if (response.data) this.setState({ data: response.data });
    } catch (error) {
      // console.log(error);
    }
  }

  reRender = () => this.setState({ reRender: !this.state.reRender });

  pressItemAttach = (item) => {
    this.props.navigation.navigate('AttachmentInfo', { dataItem: item });
    this.props.screenProps.onAttachmentTabChange(1);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => (
            <ItemAttachment
              title={item.filename}
              index={index}
              type={convertTypeFile(item.filename)}
              pressItemAttach={() => this.pressItemAttach(item)}
            />)}
          onRefresh={this.fetch}
          refreshing={false}
          keyExtractor={(item, index) => `attach-${index}`}
          onPressIcon={(indexOfIcon, indexOfItem) => {
            this.setState({ selectedIndex: indexOfItem });
            this.ConfirmPopup.setModalVisible(true);
          }}
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(129)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
        />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, {})(ListFileAttachment);
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
});
