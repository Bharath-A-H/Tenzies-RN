/* eslint-disable no-unused-vars */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Dice({ value, isHeld, holdDice, isSameNumber }) {
  const styles = {
    backgroundColor: isHeld ? 'lightgreen' : isSameNumber ? 'lightblue' : 'white',
    borderColor: isSameNumber ? 'blue' : 'black',
  };

  return (
    <TouchableOpacity style={[diceStyles.dice, styles]} onPress={holdDice}>
      <Text style={diceStyles.diceText}>{value}</Text>
    </TouchableOpacity>
  );
}

const diceStyles = StyleSheet.create({
  dice: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 2,
  },
  diceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e0e0e',
  },
});
