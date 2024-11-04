import {
  FlatList,
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
  //input içindeki değer
  const [todo, setTodo] = useState('');
  //eklenilen todolar
  const [todos, setTodos] = useState([]);

  const saveTodos = async saveTodo => {
    try {
      //ASyncStorage ekleme yaparken setItem la ekleme yap
      //2deger ister key string olarak digeri calue(json.stringfy())
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
  };

  useEffect(() => {
    loadTodos();
  }, []);

  //add butonuna basıldığında çalısacak fonksiyon
  const addTodo = () => {
    if (todo === '') return;
    //yeni todo olustur todos stateine ekle
    const updatedTodos = [...todos, {id: uuid.v4(), text: todo.trim()}];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setTodo('');
  };
  console.log(todos);
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
                    style={[styles.button, styles.updateButton]}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item?.id?.toString()}
        />
      </SafeAreaView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  headerText: {fontSize: 24, marginBottom: 20, fontWeight: 'bold'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonContainer: {},
  deleteButton: {backgroundColor: 'red'},
  updateButton: {backgroundColor: 'purple'},
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
  },
});
