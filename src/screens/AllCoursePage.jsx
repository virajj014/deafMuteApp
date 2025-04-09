import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const AllCoursePage = () => {
  // Sample course data
  const navigation = useNavigation();
  const courses = [
    {
      id: 1,
      title: 'ASL Basics',
      description: 'Learn the fundamentals of American Sign Language',
      duration: '4 weeks',
      lessons: 12,
      image: require('../courseImages/1.png') // Replace with your image path
    },
    {
      id: 2,
      title: 'Advanced ASL',
      description: 'Master complex conversations in ASL',
      duration: '6 weeks',
      lessons: 18,
      image: require('../courseImages/2.png')
    },
    {
      id: 3,
      title: 'ASL for Professionals',
      description: 'Specialized signs for workplace communication',
      duration: '5 weeks',
      lessons: 15,
      image: require('../courseImages/3.png')
    },
    {
      id: 4,
      title: 'ASL Storytelling',
      description: 'Learn to express narratives through sign language',
      duration: '3 weeks',
      lessons: 9,
      image: require('../courseImages/4.png')
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Available Courses</Text>
      
      {courses.map((course) => (
        <TouchableOpacity 
          key={course.id} 
          style={styles.card}
          onPress={() => navigation.navigate('CourseLessons', { course })}
                  >
          <Image source={course.image} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{course.title}</Text>
            <Text style={styles.cardDescription}>{course.description}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>{course.duration}</Text>
              <Text style={styles.metaText}>{course.lessons} lessons</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f7fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: '600',
  },
}); 

export default AllCoursePage;