import React, { PureComponent } from 'react'
import {
  View, StyleSheet
} from 'react-native'
import Pdf from 'react-native-pdf';
import _ from 'lodash';
import { Text } from 'react-native-animatable';
import HeaderPDF from '../Header/HeaderPDF';
import NavigationService from '../../routers/NavigationService';
import { HEIGHT, getWidth, HEIGHTXD } from '../../config';

/**
 * This compornent to help you see file PDF
 * @param content {Uri, tittle} fileuri and filename
 */
export default class SeePDF extends PureComponent {
  goBack = () => {
    NavigationService.pop();
  }

  render() {
    let sourcePDF = {
      uri: _.has(this.props.navigation.getParam('content'), 'sourcePDF') && this.props.navigation.getParam('content').sourcePDF,
      cache: true
    };
    let title = _.has(this.props.navigation.getParam('content'), 'title') && this.props.navigation.getParam('content').title;
    return (
      <View style={styles.cntViewPDF}>
        <HeaderPDF
          title={title || 'Detail'}
          onButton={this.goBack}
        />
        <View style={styles.cntPDF}>
          {!_.isUndefined(sourcePDF.uri) && !_.isNull(sourcePDF.uri)
            ? <Pdf
              source={sourcePDF}
              style={styles.pdf}
            />
            : <Text style={{ marginTop: HEIGHTXD(50), width: getWidth(), textAlign: 'center' }}>Url invalid</Text>
          }


        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: HEIGHT(20),
  },
  cntViewPDF: {
    flex: 1,
  },
  cntMain: {
    flex: 1,
    alignItems: 'center',
  },
  cntPDF: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: getWidth(),
  }
})
