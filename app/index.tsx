import React from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>GemBlast</Text>
        <Text style={styles.subtitle}>Match 3 gems</Text>
        {/* Game content will go here */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900 from design system
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32, // spacing_xxl from design system (assuming 32px for xxl)
  },
  title: {
    fontSize: 32, // heading_xl from design system (assuming 32px)
    fontWeight: 'bold',
    color: '#8b5cf6', // color_primary (Purple 500) from design system
    marginBottom: 8, // spacing_md from design system (assuming 8px)
  },
  subtitle: {
    fontSize: 16, // subtitle from design system (assuming 16px)
    color: '#94a3b8', // color_secondary (Slate 400) from design system
  },
});