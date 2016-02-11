var React = require('react-native');
var {
  AsyncStorage,
  Component,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  ScrollView,
  PixelRatio,
  Dimensions,
  TouchableHighlight,
  NativeModules,
  TouchableWithoutFeedback
} = React;

import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import {SERVER_URL} from '../urls';
import NavBar from './navBar';

class NewStory extends Component {

  submitNewStory(textInputs, asset) {
    console.log('Asset in newStory: ', asset);
    var title = textInputs.newStoryTitle;
    var description = textInputs.newStoryDescription;
    var caption = asset.node.caption;
    var existingUsersToInclude = textInputs.newStoryCharacters.split(', ');

    return AsyncStorage.getItem('token')

      .then((result) => {
        fetch(SERVER_URL + '/api/users', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': result,
            'emails': JSON.stringify(existingUsersToInclude)
          }
        })
        .then((response) => response.json())
        .then((responseData) => {
          return {
            'token': result,
            'userids': responseData
          }
        })
        .then((result) => {
          fetch(SERVER_URL + '/api/stories', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': result.token
            },
            body: JSON.stringify({
              title: title,
              description: description,
              existingUsersToInclude: result.userids
            })
          })
          .then((response) => response.json())
          .then((responseData) => {

            AsyncStorage.getItem('token')
              .then((result) => {
                fetch(SERVER_URL + '/api/users', {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': result,
                    'emails': JSON.stringify(existingUsersToInclude)
                  }
                })
                .then((response) => response.json())
                .then((responseData) => {
                  return {
                    'token': result,
                    'userids': responseData
                  }
                })
                .then((result) => {
                  var characters = String(result.userids) + '_' || '';

                  return {
                    uri: asset.node.image.uri,
                    uploadUrl: SERVER_URL + '/api/moments',
                    fileName: title + '_' + caption + '_' +
                      String(responseData.storyId) + '_' +
                      String(responseData.userId) + '_' + characters + '.png',
                    mimeType: 'image',
                    headers: {
                      token: result.token
                    }
                  };
                })
                .then((result) => {
                  NativeModules.FileTransfer.upload(result, (err, res) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(res);
                      return res;
                    }
                  });
                })
              })
          })
          .catch((error) => {
            // console.error(error);
          });
        });
      });
  }


  render() {
    let { width, height } = Dimensions.get('window');
    const { asset, onBack, onSubmit } = this.props;
    const newStory = this.props.asset;
    var textInputs = {
      newStoryTitle: this.props.storyTitle
    };

    return (
      <View style={ styles.container }>

        <View style={ styles.content }>
          <Image
            source={{ uri: asset.node.image.uri }}
            style={ styles.thumbnail }
          />
        </View>
        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
        <View style={ styles.textContainer }>
          <TextInput
          style={styles.textInput}
          value={textInputs.newStoryTitle}
          onChangeText={(text)=>textInputs.newStoryTitle = text}
          onSubmitEditing={() => {
            dismissKeyboard()
          }} />
          <TextInput style={styles.textInput} placeholder='Description'
            onChangeText={(text)=>textInputs.newStoryDescription = text} />
          <TextInput style={styles.textInput} placeholder='Add friends to your story'
            onChangeText={(text)=>textInputs.newStoryCharacters = text}
            onSubmitEditing={() => {
              dismissKeyboard()
            }} />
        </View>
        </TouchableWithoutFeedback>
        <View style={ styles.buttonContainer }>
          <TouchableHighlight onPress={onBack}>
            <Text style={ styles.button }>
              Cancel
            </Text>
          </TouchableHighlight>

          <TouchableHighlight key={asset} onPress={() => {
            if (textInputs.newStoryTitle && textInputs.newStoryDescription) {
              this.submitNewStory(textInputs, asset)
                .then(() => {
                  onSubmit();
                });
            }
          }}>
            <Text style={ styles.button }>
              Submit
            </Text>
          </TouchableHighlight>
        </View>

        <View style={ styles.navBar }>
          <NavBar />
        </View>

      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: 'grey'
  },
  content: {
    flex: 11,
    justifyContent: 'center',
  },
  navBar: {
    flex: 1
  },
  textContainer: {
    marginBottom: 20
  },
  textInput: {
    flexWrap: 'wrap',
    alignSelf: 'center',
    height: 30,
    borderRadius: 2,
    padding: 1,
    width: 350,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderColor: 'black',
    borderWidth: 1,
    flex: 4,
    textAlign: 'center'
  },
  thumbnail: {
    width: 320,
    height: 240,
    alignSelf: 'center'
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginBottom: 18
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    width: 100,
    height: 30,
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: 7
  }
});

module.exports = NewStory;
