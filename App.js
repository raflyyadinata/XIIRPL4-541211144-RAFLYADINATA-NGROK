import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const getQuizzes = async () => {
    try {
      const url = ' https://3566-36-73-35-94.ngrok-free.app/api/quizzes';
      const headers = {
        'ngrok-skip-browser-warning': 'true',
      };

      const response = await axios.get(url, { headers });

      // Initialize selected answers state with empty values for each question
      const initialSelectedAnswers = {};
      response.data.forEach((quiz) => {
        initialSelectedAnswers[quiz.id] = null;
      });

      setData(response.data);
      setSelectedAnswers(initialSelectedAnswers);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getQuizzes();
  }, []);

  const handleAnswerSelection = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleClearAnswer = (questionId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: null,
    }));
  };

  const handleSubmitAll = () => {
    // Handle the submission logic here using selectedAnswers state
    console.log('Selected Answers:', selectedAnswers);
    // You can send the selected answers to the server or perform other actions
  };

  const renderQuizItem = ({ item }) => (
    <View style={styles.quizItem}>
      <Text style={styles.quizTitle}>Quiz: {item.quiz}</Text>
      {['A', 'B', 'C', 'D'].map((answer) => (
        <TouchableOpacity
          key={answer}
          style={[
            styles.answerOption,
            selectedAnswers[item.id] === answer && styles.selectedAnswer,
          ]}
          onPress={() => handleAnswerSelection(item.id, answer)}
        >
          <Text>
            {answer}: {item[answer.toLowerCase()]}
          </Text>
        </TouchableOpacity>
      ))}
      <Button
        title="Clear"
        onPress={() => handleClearAnswer(item.id)}
        style={styles.clearButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quiz List</Text>

      {data && data.length > 0 ? (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderQuizItem}
          />
          <Button title="Submit All" onPress={handleSubmitAll} />
        </>
      ) : (
        <Text>No quiz data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quizItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerOption: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  selectedAnswer: {
    backgroundColor: '#4caf50', // Green color for selected answer
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#ff6f61', // Red color for clear button
  },
});
