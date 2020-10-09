import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import S3 from 'aws-sdk/clients/s3';
import ImagePicker from 'react-native-image-picker';
import base64 from 'react-native-base64'

  const uploadImageOnS3 = async (file) => {
    const s3bucket = new S3({
    accessKeyId: 'ASIAVIQP6Z7XFKAH43AB',
    secretAccessKey: 'CbpI9cGtQwFQ9Dg3tndE1RgkoN0dCT3WcWK1e9yP',
    Bucket: 'plant-app-project',
    signatureVersion: 'v4',
    });
    let contentType = 'image/jpeg';
    var fs = require('react-native-fs');
    let contentDeposition = 'inline;filename="' + file.name + '"';
    const base64img = await fs.readFile(file.uri, 'base64');
    const arrayBuffer = base64.decode(base64img);
    
    s3bucket.createBucket(() => {
        const params = {
          Bucket: 'plant-app-project',
          Key: file.name,
          Body: arrayBuffer,
          ContentDisposition: contentDeposition,
          ContentType: contentType,
      };
      s3bucket.upload(params, (err, data) => {
          if (err) {
            console.log('error in callback');
          }
        console.log('success');
        console.log("Respomse URL : "+ data.Location);
        });
    });
    }  

    const chooseImage = async () => {
   
      let options = {
        title: 'Upload Prescription',
        takePhotoButtonTitle: 'Take a Photo',
        chooseFromLibraryButtonTitle: 'Select From Gallery',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
   ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const file = {
           uri: response.uri,
           name: response.fileName,
           type: 'image/jpeg',
        };
        uploadImageOnS3(file);
      }
   });
   };

const App = () => {

  return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor='#1a1a1a'
        />
        {/* <Image src={}/> */}
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <TouchableOpacity onPress={chooseImage} >
          <View><Text style={styles.welcome}>UPLOAD IMAGE TO AWS HERE</Text></View>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#F5FCFF',
    marginBottom: 5,
  },
});

export default App;