import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CourseLessons = ({ route }) => {
      const navigation = useNavigation();
    
    const { course } = route.params;

    // Sample lessons data - replace with your actual data
    const lessons = [
        {
             id: 1, title: 'Introduction to ASL', duration: '5:30',

            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 
         },
        { id: 2, title: 'Basic Greetings', duration: '7:15',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' 

         },
        { id: 3, title: 'Common Phrases', duration: '8:45',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' 

         },
        { id: 4, title: 'Numbers 1-20', duration: '6:20',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' 

         },
        { id: 5, title: 'Asking Questions', duration: '9:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' 
         },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Course Header */}
            <View style={styles.courseHeader}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
                <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>{course.duration}</Text>
                    <Text style={styles.metaText}>{course.lessons} lessons</Text>
                </View>
            </View>

            {/* Lessons List */}
            <View style={styles.lessonsContainer}>
                <Text style={styles.lessonsTitle}>Lessons</Text>
                {lessons.map((lesson) => (
                    <TouchableOpacity
                        key={lesson.id}
                        style={styles.lessonCard}
                        onPress={() => console.log('Play lesson:', lesson.title)}
                    >
                        <View style={styles.lessonInfo}>
                            <Text style={styles.lessonNumber}>{lesson.id}</Text>
                            <View>
                                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                            </View>
                        </View>
                        <Ionicons name="play-circle" size={24} color="#007AFF"
                            onPress={() => navigation.navigate('VideoPlayer', {
                                videoUrl: lesson.videoUrl,
                                lessonTitle: lesson.title
                            })}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        padding: 16,
    },
    courseHeader: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2c3e50',
    },
    courseDescription: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 12,
        lineHeight: 24,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    metaText: {
        fontSize: 14,
        color: '#95a5a6',
        fontWeight: '600',
    },
    lessonsContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lessonsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2c3e50',
    },
    lessonCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    lessonInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lessonNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 12,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    lessonTitle: {
        fontSize: 16,
        color: '#2c3e50',
        marginBottom: 4,
    },
    lessonDuration: {
        fontSize: 12,
        color: '#95a5a6',
    },
});

export default CourseLessons;