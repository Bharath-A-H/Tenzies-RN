import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Dice from './Dice'; // Ensure you have a Dice component

export default function Tenzies() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [time, setTime] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  useEffect(() => {
    if (!tenzies) {
      const timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [tenzies]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: i,
      });
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      const newDice = dice.map(die => {
        return die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) };
      });
      setDice(newDice);
      setRolls(prevRolls => prevRolls + 1);

      const values = newDice.map(die => die.value);
      const mostCommonValue = values
        .sort((a, b) =>
          values.filter(v => v === a).length - values.filter(v => v === b).length
        )
        .pop();

      setSelectedNumber(mostCommonValue !== undefined ? mostCommonValue : null);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRolls(0);
      setTime(0);
      setSelectedNumber(null);
    }
  }

  function holdDice(id: number, value: number) {
    if (selectedNumber === null || selectedNumber === value) {
      setDice(prevDice => prevDice.map(die => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      }));
      setSelectedNumber(value);
    }
  }

  const diceElements = dice.map(die => (
    <Dice
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id, die.value)}
      isSameNumber={selectedNumber === null || die.value === selectedNumber}
    />
  ));

  return (
    <ImageBackground
      source={require('./assets/ten1.jpg')} // Ensure the path is correct
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Tenzies Game</Text>
        <Text style={styles.instructions}>
          Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
        </Text>
        <View style={styles.diceContainer}>
          {diceElements}
        </View>
        {tenzies ? (
          <View style={styles.gameOver}>
            <Text style={styles.gameOverText}>Game Over!</Text>
            <TouchableOpacity style={styles.button} onPress={rollDice}>
              <Text style={styles.buttonText}>New Game</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={rollDice}>
            <Text style={styles.buttonText}>Roll</Text>
          </TouchableOpacity>
        )}
        <View style={styles.stats}>
          <Text style={styles.statsText}>Rolls: {rolls}</Text>
          <Text style={styles.statsText}>Time: {time} seconds</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(227, 207, 207, 0.9)', // Make the background semi-transparent
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    color: '#0e0e0e',
    marginBottom: 20,
    fontWeight: 'bold', // Make the title bold
  },
  instructions: {
    fontSize: 18,
    color: '#0c0c0c', // Dark black color
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  diceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 150, // Adjust width
    alignItems: 'center', // Center text within button
  },
  buttonText: {
    color: 'white', // Dark black color
    fontSize: 18,
    fontWeight: 'bold', // Make button text bold
  },
  stats: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  statsText: {
    fontSize: 20,
    color: '#0c0c0c', // Dark black color
    textAlign: 'center', // Center text
  },
  gameOver: {
    marginTop: 20,
    alignItems: 'center', // Center the text horizontally
  },
  gameOverText: {
    fontSize: 24,
    color: 'red', // Dark black color
    marginBottom: 10,
    fontWeight: 'bold', // Make text bold
  },
});
