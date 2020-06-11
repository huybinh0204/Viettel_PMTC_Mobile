import React from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';

class App extends React.Component {
  componentWillMount() {
    // To Configure react native app with cloud of Google Firebase database !
    let config = {
      apiKey: 'AIzaSyBaslBAwGSag6QVQuVDYlRC2DHLrj2rzVE',
      authDomain: 'testapp-46385.firebaseapp.com',
      databaseURL: 'https://testapp-46385.firebaseio.com',
      projectId: 'testapp-46385',
      storageBucket: 'testapp-46385.appspot.com',
      messagingSenderId: '219971896747',
      appId: '1:219971896747:web:0bd33b09536a67e266beee'
    };
    firebase.initializeApp(config);

    // To select data from firebase every time data has changed !
    firebase.database().ref('users').on('value', (data) => {
      // console.log(data.toJSON());
    })

    // To Await 5 seconds to insert a new user
    setTimeout(() => {
      firebase.database().ref('users/004').set(
        {
          name: 'Pheng Sengvuthy 004',
          age: 24
        }
      ).then(() => {
        // console.log('INSERTED !');
      })
        .catch((error) => {
          // console.log(error);
        });
    }, 5000);

    // To Update a user
    firebase.database().ref('users/004').update({
      name: 'Pheng Sengvuthy'
    });

    // To Remove a user
    firebase.database().ref('users/004').remove();
  }

  render() {
    return (
      <View style={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
          Welcome To ------>
          {'\n'}
          Our Google Firebase Database !
        </Text>
      </View>
    )
  }
}

export default App;
