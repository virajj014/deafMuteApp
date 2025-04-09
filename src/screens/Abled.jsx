import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const Abled = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [images, setImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');

  useEffect(() => {
    const getCameraPermission = async () => {
      const status = await check(PERMISSIONS.ANDROID.CAMERA);
      if (status === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        const result = await request(PERMISSIONS.ANDROID.CAMERA);
        setHasPermission(result === RESULTS.GRANTED);
        if (result !== RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required',
            'Camera access is required to take pictures. Please enable it in the app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
        }
      }
    };

    getCameraPermission();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const squareSize = screenWidth * 0.9;

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsLoading(true);
        const photo = await cameraRef.current.takePhoto();
        setImages((prevImages) => [...prevImages, photo.path]);
      } catch (error) {
        console.error('Error capturing image:', error);
        Alert.alert('Error', 'Failed to capture image.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const selectFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit:   1, // 0 means unlimited selection
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const selectedImages = result.assets.map(asset => asset.uri);
        setImages(prevImages => [...prevImages, ...selectedImages]);
      }
    } catch (error) {
      console.error('Error selecting images:', error);
      Alert.alert('Error', 'Failed to select images from gallery.');
    }
  };

  const sampleImages = [
    require('../../sampleImages/1.jpg'),
    require('../../sampleImages/2.jpg'),
    require('../../sampleImages/3.jpg'),
    require('../../sampleImages/4.jpg'),
    require('../../sampleImages/5.jpg'),
    require('../../sampleImages/6.jpg'),
    require('../../sampleImages/7.jpg'),
    require('../../sampleImages/8.jpg'),
    require('../../sampleImages/9.jpg'),
  ];

  const correctGrammar = async (text) => {
    const apiKey = 'AIzaSyBWvquCp_j76B6b4_BEDqk7CMrAPMYFgdc';
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Your task is to correct the grammar, spelling, and formatting of sentences while keeping the original meaning intact.  
                     Ensure proper spacing, capitalization, and punctuation.  
                     Do not add extra words.  
                     Only return the corrected sentence without any explanation.
  
                     Examples:  
                     1. Incorrect: "IdLOVOYOU"  
                        Corrected: "I love you"  
                     2. Incorrect: "Helo, hw r u?"  
                        Corrected: "Hello, how are you?"  
                     3. Incorrect: "THSI ISGREA T"  
                        Corrected: "This is great"  
                     4. Incorrect: "iamgoings chool"  
                        Corrected: "I am going to school"  
                     
                     Now correct this sentence: "${text}"`
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);
      const correctedSentence = data.candidates?.[0]?.content?.parts?.[0]?.text || text;
      return correctedSentence;
    } catch (error) {
      console.error('Error correcting grammar:', error);
      return text;
    }
  };

  // const uploadImages = async () => {
  //   if (sampleImages.length === 0) {
  //     Alert.alert('No Images', 'No sample images found for upload.');
  //     return;
  //   }
  
  //   setIsLoading(true);
  //   const formData = new FormData();
  
  //   sampleImages.forEach((image, index) => {
  //     formData.append('files', {
  //       uri: Image.resolveAssetSource(image).uri,
  //       type: 'image/jpeg',
  //       name: `sample_image_${index}.jpg`,
  //     });
  //   });
  
  //   try {
  //     const response = await fetch('http://10.0.2.2:8000/predict-asl', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  
  //     const result = await response.json();
  //     console.log('Raw Prediction:', result.sentence);

  //     const correctedSentence = await correctGrammar(result.sentence);
  //     console.log('Corrected Prediction:', correctedSentence);
      
  //     setPrediction(correctedSentence);
  //     setModalVisible(true);
  
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //     Alert.alert('Upload Failed', 'An error occurred while uploading images.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  
  const uploadImages = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please capture at least one image before uploading.');
      return;
    }

    const formData = new FormData();

    images.forEach((imageUri, index) => {
      formData.append('files', {
        uri: `file://${imageUri}`,
        type: 'image/jpeg',
        name: `image_${index}.jpg`,
      });
    });
    setIsLoading(true);

    try {
      const response = await fetch('http://10.0.2.2:8000/predict-asl', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('Prediction:', result.sentence);

      const correctedSentence = await correctGrammar(result.sentence);
      console.log('Corrected Prediction:', correctedSentence);

      setPrediction(correctedSentence);
      setModalVisible(true);

    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Upload Failed', 'An error occurred while uploading images.');
    }finally{
    setIsLoading(false);

    }
  };


  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  if (!device) return (
    <View style={styles.noCameraContainer}>
      <Icon name="camera-off" size={50} color="#6c757d" />
      <Text style={styles.noCameraText}>No camera device available</Text>
    </View>
  );

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera" size={50} color="#6c757d" />
        <Text style={styles.permissionText}>Camera access is required to use this feature.</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#4a69bd" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ASL Classifier</Text>
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
          photoQualityBalance={"quality"}
        />
        <View style={styles.cameraBorder} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Icon name="camera-alt" size={28} color="white" />
              <Text style={styles.buttonText}>Capture</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadButton, isLoading && styles.disabledButton]}
          onPress={uploadImages}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Icon name="cloud-upload" size={28} color="white" />
              <Text style={styles.buttonText}>Upload</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Gallery Selection Button */}
      <View style={styles.galleryButtonContainer}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={selectFromGallery}
          disabled={isLoading}
        >
          <Icon name="photo-library" size={24} color="white" />
          <Text style={styles.galleryButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a69bd" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      )}

      {/* Image Gallery */}
   {/* Image Gallery */}
   {images.length > 0 && (
          <View style={styles.galleryContainer}>
            <Text style={styles.galleryTitle}>Selected Images ({images.length})</Text>
            <View style={styles.galleryGrid}>
              {images.map((item, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: item }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeImage(index)}
                    disabled={isLoading}
                  >
                    <Icon name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

      {/* Prediction Modal */}
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        style={styles.modal}
        backdropOpacity={0.7}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Icon name="spellcheck" size={40} color="#4a69bd" style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Translation Result</Text>
          <Text style={styles.modalText}>{prediction}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4a69bd',
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cameraContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.9,
    borderRadius: 12,
  },
  cameraBorder: {
    position: 'absolute',
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.9,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#4a69bd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: '45%',
  },
  uploadButton: {
    backgroundColor: '#38ada9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: '45%',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  galleryContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingBottom: 30,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    marginBottom: 15,
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 5,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 15,
    color: '#4a69bd',
    fontWeight: '600',
  },
  modalButton: {
    backgroundColor: '#4a69bd',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  noCameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  noCameraText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6c757d',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  permissionText: {
    marginVertical: 20,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#4a69bd',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#495057',
  },
  galleryButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  galleryButton: {
    backgroundColor: '#6c5ce7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  galleryButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Abled;