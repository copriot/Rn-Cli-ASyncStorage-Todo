import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [updatedText, setUpdatedText] = useState('');

  const saveTodos = async saveTodo => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.log(error);
    }
  };

  const loadTodos = async () => {
    try {
      const storedData = await AsyncStorage.getItem('todos');
      if (storedData) {
        setTodos(JSON.parse(storedData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = id => {
    const filtredTodos = todos.filter(item => item.id !== id);
    setTodos(filtredTodos);
    saveTodos(filtredTodos);
  };

  const showUpdateModal = (id, text) => {
    setCurrentTodo(id);
    setUpdatedText(text);
    setModalVisible(true);
  };

  const handleUpdate = () => {
    const updatedTodos = todos.map(item =>
      item.id === currentTodo ? {...item, text: updatedText} : item,
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setModalVisible(false);
    setCurrentTodo(null);
    setUpdatedText('');
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = () => {
    if (todo === '') return;
    const updatedTodos = [...todos, {id: uuid.v4(), text: todo.trim()}];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setTodo('');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <Text style={styles.headerText}>React Native Async Storage</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={todo}
            onChangeText={text => setTodo(text)}
            placeholder="Type a Todo"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={addTodo}
            style={[styles.button, styles.addButton]}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={todos}
          renderItem={({item}) => (
            <View style={styles.todoItem}>
              <Text style={{color: '#00000'}}>{item.text}</Text>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item?.id)}
                    style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => showUpdateModal(item.id, item.text)}
                    style={[styles.button, styles.updateButton]}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item?.id?.toString()}
        />

        {/* Modal  */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Update Todo</Text>
              <TextInput
                value={updatedText}
                onChangeText={text => setUpdatedText(text)}
                style={{
                  color: 'black',
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: 'gray',
                  padding: 10,
                  borderRadius: 5,
                }}
                placeholder="Update your todo"
                placeholderTextColor="gray"
              />

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={handleUpdate}
                  style={[styles.button, styles.saveButton]}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[styles.button, styles.cancelButton]}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  headerText: {fontSize: 24, marginBottom: 20, fontWeight: 'bold'},
  inputContainer: {flexDirection: 'row', alignItems: 'center'},
  input: {
    borderWidth: 1,
    padding: 10,
    flex: 1,
    borderRadius: 10,
    borderColor: 'grey',
  },
  button: {
    marginLeft: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 5,
  },
  buttonText: {color: 'white', fontSize: 16},
  addButton: {alignItems: 'center', justifyContent: 'center', padding: 8},
  buttonContainer: {},
  deleteButton: {backgroundColor: 'red'},
  updateButton: {backgroundColor: 'purple'},
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {fontSize: 18, marginBottom: 10, color: 'black'},
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  saveButton: {backgroundColor: 'green'},
  cancelButton: {backgroundColor: 'red'},
});
