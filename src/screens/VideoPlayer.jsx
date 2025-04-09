import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';

const VideoPlayer = ({ route, navigation }) => {
  const { videoUrl, lessonTitle } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        controls={true}
        resizeMode="contain"
        paused={false}
      />
      
      {/* Back Button */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{lessonTitle}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPlayer;