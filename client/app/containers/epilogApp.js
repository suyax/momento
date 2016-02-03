import React, {
  AsyncStorage,
  StyleSheet,
  Component,
  Text,
  View,
  Dimension,
  NativeModules
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import Home from '../components/home';
import CameraView from '../components/camera';
import Capture from '../components/capture';
import Library from '../components/library';
import Story from '../components/story';
import NewStory from '../components/newStory';
import EditMoment from '../components/editMoment';
import LogIn from '../components/logIn';
import SignUp from '../components/signUp';
import LogOut from '../components/logOut';
//import LogInFail from '../components/logInFail';
//router for the app
class EpiLogApp extends Component {

  // This could also be a thunk fetch
  submitMoment(textInputs, asset) {
    var storyTitle = textInputs.storyTitle;
    var momentCaption = textInputs.caption;
    var submitMomentURL = 'http://127.0.0.1:3000/api/stories/check';


    return AsyncStorage.getItem('token')
      .then((result) => {
        return fetch(submitMomentURL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': result
          },
          body: JSON.stringify({
            caption: momentCaption,
            title: storyTitle
          })
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData) {
            var storyid = responseData.id;
            var title = storyTitle.split(' ').join('+');
            var caption = momentCaption.split(' ').join('+');
            var userid = responseData.users[0].id;
            var upload = {
              uri: asset.node.image.uri,
              uploadUrl: 'http://127.0.0.1:3000/api/moments',
              fileName: title + '_' + caption + '_' + String(storyid) + '_' + String(userid) + '_.png',
              mimeType: 'image'
            };

            NativeModules.FileTransfer.upload(upload, (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log(res);
              }
            });

            redirect = 'HOME';
          }

          return 'NEW_STORY';
        })
        .catch((error) => {
          console.log(error);
        });
      })
      .then((result) => {
        return result
      });
  }

  submitNewStory(textInputs) {
    var storyTitle = textInputs.newStoryTitle;
    var storyDescription = textInputs.newStoryDescription;
    var storyCharacters = textInputs.newStoryCharacters.split(', ');

    fetch('http://127.0.0.1:3000/api/:userId/stories', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyTitle: storyTitle,
        storyDescription: storyDescription,
        storyCharacters: storyCharacters
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      // Send the user to the Story view
    })
    .catch((error) => {
      console.error('Error adding new story: ', error);
    });
  }

  // This could also be a thunk fetch
  submitNewStory(textInputs) {
    var storyTitle = textInputs.newStoryTitle;
    var storyDescription = textInputs.newStoryDescription;
    var storyCharacters = textInputs.newStoryCharacters.split(', ');

    fetch('http://127.0.0.1:3000/api/:userId/stories', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyTitle: storyTitle,
        storyDescription: storyDescription,
        storyCharacters: storyCharacters
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      // Send the user to the Story view
    })
    .catch((error) => {
      console.error('Error adding new story: ', error);
    });
  }


  render() {
    // Be explicit about what is available as props
    const {
      viewControlState,
      viewControlActions,
      storiesState,
      storiesActions,
      authState,
      authActions,

    } = this.props;

    switch (viewControlState.currentView) {
<<<<<<< 0e9a04fa33768f29246e4e104207829e31a65672
      case "CAMERAVIEW":
        return (
          <CameraView
          onTakePicture={ () => {viewControlActions.setView('CAPTURE')}}
          />
          );
=======
>>>>>>> Work on adding new story functionality
      case "HOME":
        return (
          <Home
          onCamera={ () => {viewControlActions.setView('CAMERAVIEW') }}
          onLogOut={ () => {viewControlActions.setView('LOGOUT') }}
          />);
      case "LOGIN":
        return (
          <LogIn
          successLoggedIn={ () => { viewControlActions.setView('HOME') }}
          onSignUp={ () => { viewControlActions.setView('SIGNUP') }}
          />);

      case "SIGNUP":
        return (
          <SignUp
          successSignedUp={ () => { viewControlActions.setView('HOME') }}
          onLogIn={ () => { viewControlActions.setView('LOGIN') }}
          />);
      case "LOGOUT":
        return (
          <LogOut
          successLoggedOut={ () => { viewControlActions.setView('LOGIN') }}
          />);
      case "LIBRARY":
        return (
          <Library
          stories={storiesState}
          onLoad={storiesActions.fetchStories}
          onTouchImage={ (asset) =>{ viewControlActions.setView('STORY', { asset: asset }) }}
          />);
      case "STORY":
        return (
          <Story
          asset={viewControlState.passedProps.asset}
          onBack={ () => { viewControlActions.setView('LIBRARY') }}
          />);
      case "NEW_STORY":
        return (
          <NewStory
          asset={viewControlState.passedProps.asset}
          storyTitle={viewControlState.passedProps.storyTitle}
          onBack={()=>{viewControlActions.setView('CAPTURE')}}
          onSubmit={(textInputs)=>{
            if (textInputs.newStoryTitle && 
                textInputs.newStoryDescription &&
                textInputs.newStoryCharacters) {
              this.submitNewStory(textInputs);
            }
          }}
          />
        );
      case "CAPTURE":
        return (
          <Capture
          onTouchImage={ (asset) => { viewControlActions.setView('EDIT_MOMENT', { asset: asset }); }}
          />);
      case "EDIT_MOMENT":
        return(<EditMoment
          asset={viewControlState.passedProps.asset}
          onCancel={()=>{viewControlActions.setView('CAPTURE')}}
          onSubmit={(textInputs, asset)=>{
              if (textInputs.caption && textInputs.storyTitle) {
                this.submitMoment(textInputs, asset)
                  .then((result) => {
                    if (result === 'HOME') {
                      viewControlActions.setView('HOME', {});
                    } else {
                      viewControlActions.setView('NEW_STORY', {'asset': asset});
                    }
                  });
              }
            }
          }
        />);
      default:
        return <LogIn />;
    }
  }
}

export default connect(state => ({
    viewControlState: state.viewControl,
    storiesState: state.stories,
    authState: state.authControl,
    Urls:state.Urls, // where the various url's are
  }),
  (dispatch) => ({
    viewControlActions: bindActionCreators(actions.viewControlActions, dispatch),
    storiesActions: bindActionCreators(actions.storiesActions, dispatch),
    authActions: bindActionCreators(actions.authActions, dispatch),
    thunkFetch: bindActionCreators(actions.thunkFetch, dispatch),
  })
)(EpiLogApp);

