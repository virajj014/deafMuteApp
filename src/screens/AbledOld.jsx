 const uploadImages = async () => {
    if (sampleImages.length === 0) {
      Alert.alert('No Images', 'No sample images found for upload.');
      return;
    }
  
    const formData = new FormData();
  
    sampleImages.forEach((image, index) => {
      formData.append('files', {
        uri: Image.resolveAssetSource(image).uri, // Convert require() to a valid URI
        type: 'image/jpeg',
        name: `sample_image_${index}.jpg`,
      });
    });
  
    try {
      const response = await fetch('http://10.0.2.2:8000/predict-asl', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const result = await response.json();
      console.log('Raw Prediction:', result.sentence);

      // HEYdTHERE
  
      // Correct grammar using Google Gemini API
      const correctedSentence = await correctGrammar(result.sentence);
      console.log('Corrected Prediction:', correctedSentence);
      // HEY THERE
  
      // Display corrected prediction in modal
      setPrediction(correctedSentence);
      setModalVisible(true);
  
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Upload Failed', 'An error occurred while uploading images.');
    }
  };

  // const uploadImages = async () => {
  //   if (images.length === 0) {
  //     Alert.alert('No Images', 'Please capture at least one image before uploading.');
  //     return;
  //   }

  //   const formData = new FormData();

  //   images.forEach((imageUri, index) => {
  //     formData.append('files', {
  //       uri: `file://${imageUri}`,
  //       type: 'image/jpeg',
  //       name: `image_${index}.jpg`,
  //     });
  //   });

  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/predict-asl', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     const result = await response.json();
  //     console.log('Prediction:', result.sentence);

  //     const correctedSentence = await correctGrammar(result.sentence);
  //     console.log('Corrected Prediction:', correctedSentence);

  //     setPrediction(correctedSentence);
  //     setModalVisible(true);

  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //     Alert.alert('Upload Failed', 'An error occurred while uploading images.');
  //   }
  // };
