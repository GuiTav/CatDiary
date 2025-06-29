import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';


export default function NotFoundScreen() {
  return (
    <>
      <View style={styles.centeredView}>
        <Text>Ops!</Text>
        <Text>Esta tela não deveria aparecer</Text>
        <Link href='/'>Retornar para a página inicial</Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})
