import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { getFont, HEIGHT, WIDTH } from '../../config/Function';
import R from '../../assets/R';

/**
   * This Function to render modal search With data and keywords you enter to bring up the list of matches
   * @param title string title of Modal
   * @param placeholder string placeholder input text
   * @param boxInputStyle custom style box Input
   * @param listStyle custom style list item
   * @param containerStyle custom style container
   * @param textItemStyle custom style of text item
   * @param renderItem function render item, if null use default
   * @param itemListStyle to custom style item of list
   * @param onValueChange Function when you choice result return param Item
   * @param iconStyle to custom style of icon search
   * @param data list data you want to find in ( for example [{ name: 'Mother'},{name: 'Brother'}])
   * @method findItem to search with param text you enter
   * @callback onValueChange If you want to get back the data, pass this function down and get the result with name and value of item
   */
class AutoCompleteSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
    this.dataSearch = []
  }
  /**
   * This Function to open, close modal
   */

  componentDidMount() {
    this.loadData()
  }

  /**
   * This Function to search with query
   * @param query value of input text
   */
  findItem(query) {
    if (query === '') {
      return this.dataSearch.slice(0, 5);
    }
    const regex = new RegExp(`${query.trim()}`, 'i');
    return this.dataSearch.filter(film => film.name.search(regex) >= 0);
  }

  /**
   * This Function to load data, can use for load data from server
   */
  loadData = () => {
    this.dataSearch = this.props.data && this.props.data
  }


  render() {
    const {
      title, placeholder, boxInputStyle, listStyle, containerStyle, textItemStyle,
      renderItem, itemListStyle, onValueChange, iconStyle } = this.props
    const { query } = this.state;
    const dataSearch = this.findItem(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={[styles.modal, containerStyle && containerStyle]}>
        {title !== '' && <Text style={styles.title}>{title}</Text>}
        <View style={styles.container}>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            multiline={true}
            inputContainerStyle={[styles.inputBox, boxInputStyle && boxInputStyle]}
            placeholderTextColor="gray"
            style={[{ width: WIDTH(331), }, boxInputStyle && boxInputStyle]}
            containerStyle={styles.autocompleteContainer}
            data={dataSearch.length === 1 && comp(query, dataSearch[0].name) ? [] : dataSearch}
            defaultValue={query}
            listStyle={[styles.listStyle, listStyle && listStyle]}
            onChangeText={text => { this.setState({ query: text, }) }}
            placeholder={placeholder || 'Nhập nội dung'}
            renderItem={({ item, index }) => {
              if (renderItem) { renderItem(item, index) } else {
                return (
                  <TouchableOpacity
                    style={[{ paddingVertical: HEIGHT(5), paddingHorizontal: WIDTH(10) }, itemListStyle && itemListStyle]}
                    onPress={() => {
                      onValueChange && onValueChange(`${item.name}`, item)
                      this.setState({ query: item.name })
                    }}
                  >
                    <Text style={[styles.itemText, textItemStyle && textItemStyle]}>
                      {`${item.name}`}
                    </Text>
                  </TouchableOpacity>
                )
              }
            }
           }
          />
          {this.state.query.length !== 0
                && (
                <TouchableOpacity
                  onPress={() => { this.setState({ query: '' }) }}
                  style={[styles.iconStyle, iconStyle && iconStyle]}
                >
                  <AntDesign name="close" size={WIDTH(18)} color="#BAC7D3" />
                </TouchableOpacity>
                )
                }
        </View>
      </View>

    );
  }
}

export default AutoCompleteSearch;
const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.white100,
  },
  modal: {
    backgroundColor: R.colors.white100,
    width: WIDTH(355),
    borderRadius: WIDTH(10),
    flex: 1,
    paddingTop: HEIGHT(16),
    paddingBottom: HEIGHT(14),
    alignItems: 'center',
    paddingHorizontal: WIDTH(12)
  },
  body: {
    width: WIDTH(331)
  },
  title: {
    color: R.colors.colorMain,
    fontSize: getFont(16),
    fontWeight: 'bold',
    marginBottom: HEIGHT(8),
    marginTop: HEIGHT(12),
    alignSelf: 'center',
  },
  container: {
    borderRadius: HEIGHT(8),
    marginTop: HEIGHT(6),
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH(331),
  },
  autocompleteContainer: {
    zIndex: 1,
    width: WIDTH(331),
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  inputBox: {
    width: WIDTH(331),
    paddingVertical: HEIGHT(2),
    borderRadius: HEIGHT(8),
    minHeight: HEIGHT(52),
    paddingHorizontal: WIDTH(14),
    paddingRight: WIDTH(35),
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D3DEE8',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: { position: 'absolute',
    top: HEIGHT(3),
    right: WIDTH(8),
    zIndex: 1,
    height: HEIGHT(48),
    width: WIDTH(30),
    justifyContent: 'center',
    alignItems: 'center' },
  listStyle: { width: WIDTH(339),
    marginLeft: 0,
    marginTop: 0,
    borderColor: '#D3DEE8',
    borderBottomLeftRadius: WIDTH(8),
    borderBottomRightRadius: WIDTH(8),
    maxHeight: HEIGHT(230)
  }
});
