import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import R from '../../../../../assets/R';
import PickerDate from '../../../../../common/Picker/PickerDate'
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth } from '../../../../../config/Function';

type Props = {
  item: Object,
  value: Object,
  onChangeValue: Function,
};
type State = {
  expanded: boolean
}


class OtherInfo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: true,
      clearingDueDate: '',
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(
      {
        duration: 500,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ expanded: !this.state.expanded });
  }

  componentDidMount() {
    if (this.props.data) {
      this.setState({ clearingDueDate: this.props.data.clearingDueDate })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ clearingDueDate: nextProps.data.clearingDueDate })
    }
  }

  render() {
    const { onChangeValue, } = this.props;
    const { expanded } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30), paddingVertical: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>THÔNG TIN KHÁC</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingHorizontal: WIDTHXD(30) }}>
              <View style={styles.flexRow}>
                <Text style={styles.label}>Thời hạn quyết toán</Text>
                <PickerDate
                  enableEdit={this.props.enableEdit}
                  value={this.state.clearingDueDate ? this.state.clearingDueDate : this.state.clearingDueDate}
                  width={WIDTHXD(300)}
                  onValueChange={date => {
                    this.setState({ clearingDueDate: date })
                    onChangeValue({ key: 'clearingDueDate', value: date })
                  }
                  }
                  containerStyle={{ height: HEIGHTXD(86), width: null, borderWidth: 0 }}
                />
              </View>
            </View>
          )
        }
      </View>
    )
  }
}

export default OtherInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.borderGray,
    paddingVertical: WIDTHXD(30)
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
    paddingVertical: HEIGHTXD(10)
  },
  label: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    marginVertical: HEIGHTXD(13),
    color: R.colors.color777,
  },
})
