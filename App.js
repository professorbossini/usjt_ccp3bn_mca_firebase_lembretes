import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableHighlight, TouchableNativeFeedback, Alert } from 'react-native';
import ENV from './env';

import * as firebase from 'firebase';
import 'firebase/firestore'



if (!firebase.apps.length)
  firebase.initializeApp(ENV);


const db = firebase.firestore();

export default function App() {

  const adicionarLembrete = () => {
    db.collection('lembretes').add({
      texto: lembrete,
      data: new Date()
    });
    setLembrete('');
  }
  const removerLembrete = (chave) => {
    Alert.alert(
      "Apagar?",
      "Quer mesmo apagar esse lembrete?",
      [
        { text: "Cancelar" },
        { text: "Confirmar", onPress: () => db.collection("lembretes").doc(chave).delete() }
      ]
    )
  }

  const [lembrete, setLembrete] = useState('');

  const [lembretes, setLembretes] = useState([]);

  const capturarLembrete = (lembrete) => {
    setLembrete(lembrete);
  }

  useEffect(() => {
    db.collection('lembretes').onSnapshot((snapshot) => {
      let aux = [];
      snapshot.forEach(doc => {
        aux.push({
          data: doc.data().data,
          texto: doc.data().texto,
          chave: doc.id
        })
      })
      setLembretes(aux);
    })
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.entrada}
        placeholder="Digite um lembrete"
        onChangeText={capturarLembrete}
        value={lembrete} />
      <View style={styles.botao}>
        <Button
          title="OK"
          onPress={adicionarLembrete} />
        <FlatList style={{ marginTop: 4 }}
          data={lembretes}
          renderItem={l => (
            <TouchableNativeFeedback onLongPress={() => { removerLembrete(l.item.chave) }}>
              <View style={styles.itemLista}>
                <Text>{l.item.texto}</Text>
                <Text>{l.item.data.toDate().toLocaleString()}</Text>
              </View>
            </TouchableNativeFeedback>

          )}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  itemLista: {
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  botao: {
    width: '80%'
  },
  entrada: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    fontSize: 18,
    textAlign: 'center',
    width: '80%',
    marginBottom: 8
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 50
  },
});
