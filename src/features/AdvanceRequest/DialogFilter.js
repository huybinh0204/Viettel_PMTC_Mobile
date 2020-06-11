import React, { Component } from 'react';
import {
  View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';
import IconClose from 'react-native-vector-icons/AntDesign'
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../config/Function';
import R from '../../assets/R';
import PickerItem from './common/ItemPicker';


class DialogSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filter: [],
      oldData: []
    };
  }

  setModalVisible = (visible) => {
    this.setState({
      modalVisible: visible,
    })
  }

  componentDidMount() {
    if (this.props.data) {
      this.initArrayResult(this.props.data)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({ filter: [] }, () => this.initArrayResult(nextProps.data))
    }
  }

  initArrayResult = (data) => {
    const { filter } = this.state;
    for (let i = 0; i < data.length; i++) {
      let itemFilter = { value: data[i].data[0].value, name: data[i].data[0].name, key: data[i].key }
      filter.push(itemFilter)
    }
    this.setState({ filter });
  }

  resetArrayResult = () => {
    const filter = [];
    _.forEach(this.props.data, item => {
      let { value, name } = item.data[0];
      let { key } = item;
      filter.push({ key, value, name })
    })
    this.setState({ filter });
  }

  renderItem = (item, index) => {
    const { filter } = this.state;
    return (
      <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title}>
            {item.title}
          </Text>
        </View>
        <PickerItem
          width={WIDTHXD(695)}
          data={item.data}
          value={filter[index].name}
          isFilter={true}
          onValueChange={(position, itemChild) => {
            filter[index].value = itemChild.value;
            filter[index].name = itemChild.name;
            this.setState({ filter })
          }}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const { textButton, data, title, onPressConfirm, isFilterChooseStatement } = this.props
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => { this.setModalVisible(false) }}
      >
        <TouchableWithoutFeedback
          onPress={() => { this.setModalVisible(false) }}
        >
          <View
            style={styles.opacity}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <View style={{ alignItems: 'center' }}>
                  <View style={styles.viewTitle}>
                    <Text style={styles.styleTitle}>{title}</Text>
                    <TouchableOpacity onPress={() => this.setModalVisible(false)} style={styles.btClose}>
                      <IconClose name="close" size={WIDTHXD(48)} color={R.colors.black0} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.body}>
                    <FlatList
                      style={styles.flatlist}
                      data={data}
                      renderItem={({ item, index }) => this.renderItem(item, index)}
                      keyExtractor={(item, index) => {
                        index.toString()
                      }}
                      extraData={this.state}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisible(false);
                        onPressConfirm(this.state.filter)
                      }}
                      style={styles.buttonComplete}
                    >
                      <Text style={styles.textBtnTao}>{textButton || 'Tìm kiếm'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default DialogSearch;

const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.7)'
  },
  styleTitle: {
    fontSize: getFontXD(48),
    color: R.colors.colorMain,
    fontFamily: R.fonts.RobotoMedium,
    flex: 10,
    textAlign: 'center',
    marginLeft: WIDTHXD(50)
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTHXD(695),
    justifyContent: 'center'
  },
  btClose: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modal: {
    backgroundColor: R.colors.white100,
    width: WIDTHXD(800),
    borderRadius: WIDTHXD(30),
    paddingTop: WIDTHXD(54),
    alignItems: 'center',
    paddingHorizontal: WIDTHXD(18),
  },
  body: {
    width: WIDTHXD(800),
    paddingBottom: WIDTHXD(24),
    marginBottom: WIDTHXD(32),
    marginTop: HEIGHTXD(10),
    alignItems: 'center',
  },
  flatlist: {
    maxHeight: HEIGHTXD(1046),
  },
  buttonComplete: {
    backgroundColor: R.colors.white,
    marginTop: WIDTHXD(96)
  },
  textBtnTao: {
    color: R.colors.colorMain,
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoMedium,
    textAlign: 'center',
  },
  title: {
    color: R.colors.color777,
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(8),
    marginTop: HEIGHTXD(50)
  },
  cell: {
    flex: 0
  },
  dropdown_row_text: {
    marginHorizontal: 4,
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    textAlignVertical: 'center',
  },
});
