import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8000'; // <-- your FastAPI backend

const ImageSelector = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

  const openCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const newImage = result.assets[0].uri;
        setImages(prevImages => [...prevImages, newImage]);
      }
    } catch (error) {
      console.error('Error launching camera:', error);
      Alert.alert('Error', 'Failed to open camera.');
    }
  };

  const openGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0, // <-- 0 for unlimited selection
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages(prevImages => [...prevImages, ...newImages]);
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to select image.');
    }
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  const sendImagesToBackend = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please select or capture images first.');
      return;
    }
  
    try {
      setIsLoading(true);
  
      const formData = new FormData();
      images.forEach((imgUri, index) => {
        formData.append('files', {
          uri: imgUri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });
  
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        transformRequest: (data, headers) => {
          return data;
        },
      });
  
      if (response.data) {
        // Convert array of predictions to space-separated string
        const predictionString = response.data.join(' ');
        setApiResponse(predictionString);
        setModalVisible(true);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading images:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to upload images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {/* <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Icon name="photo-camera" size={24} color="white" />
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.button} onPress={openGallery}>
          <Icon name="photo-library" size={24} color="white" />
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Images */}
      <View style={styles.imageGrid}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
              <Icon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Send Button */}
      <TouchableOpacity 
        style={[styles.sendButton, isLoading && styles.disabledButton]} 
        onPress={sendImagesToBackend}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Icon name="send" size={24} color="white" />
            <Text style={styles.buttonText}>Send</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Modal for Response */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Prediction:</Text>
            <ScrollView>
              <Text style={styles.modalText}>{apiResponse}</Text>
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  button: { backgroundColor: '#4a69bd', padding: 12, borderRadius: 8, alignItems: 'center', flexDirection: 'row' },
  buttonText: { color: 'white', marginLeft: 8, fontSize: 16 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  imageWrapper: { position: 'relative', margin: 5 },
  image: { width: 100, height: 100, borderRadius: 10 },
  removeButton: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 2 },
  sendButton: { marginTop: 20, backgroundColor: '#38ada9', padding: 15, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 14 },
  closeButton: { marginTop: 20, backgroundColor: '#4a69bd', padding: 10, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: 'white', fontSize: 16 },
});

export default ImageSelector;
