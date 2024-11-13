// App.js
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJiwSq08G7EA9B1dhaGOBSvl3Q_wESiVw",
  authDomain: "traffic-87802.firebaseapp.com",
  databaseURL: "https://traffic-87802-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "traffic-87802",
  storageBucket: "traffic-87802.appspot.com",
  messagingSenderId: "186281498105",
  appId: "YOUR_APP_ID" // Replace with your app ID from Firebase project settings
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [trafficData, setTrafficData] = useState({
    node1: { status: "RED" },
    node2: { status: "RED" },
    node3: { status: "RED" },
    node4: { status: "RED" },
    nextNode: "1",
  });

  useEffect(() => {
    const trafficRef = ref(database, 'trafficLight');
    
    onValue(trafficRef, (snapshot) => {
      const data = snapshot.val();
      setTrafficData({
        node1: data.node1,
        node2: data.node2,
        node3: data.node3,
        node4: data.node4,
        nextNode: data.nextNode,
      });
    });

    // Clean up the listener on component unmount
    return () => {
      off(trafficRef);
    };
  }, []);

  return (
    <div style={styles.app}>
      <h1>4-Way Traffic Light System</h1>
      <div style={styles.container}>
        {Object.keys(trafficData).slice(0, 4).map((node, index) => (
          <TrafficLight key={index} node={node} status={trafficData[node].status} />
        ))}
      </div>
      <div style={styles.nextNode}>
        <p>Current Node: <strong>{trafficData.nextNode}</strong></p>
      </div>
    </div>
  );
}

const TrafficLight = ({ node, status }) => {
  return (
    <div style={styles.trafficLight}>
      <h2>{node}</h2>
      <div style={{ ...styles.light, ...styles.red, ...(status === 'RED' ? styles.active : {}) }}></div>
      <div style={{ ...styles.light, ...styles.yellow, ...(status === 'YELLOW' ? styles.active : {}) }}></div>
      <div style={{ ...styles.light, ...styles.green, ...(status === 'GREEN' ? styles.active : {}) }}></div>
    </div>
  );
};

const styles = {
  app: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  trafficLight: {
    width: 80,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    textAlign: 'center',
    color: 'white',
  },
  light: {
    width: 40,
    height: 40,
    margin: '8px auto',
    borderRadius: '50%',
    backgroundColor: '#555',
    opacity: 0.3,
  },
  active: {
    opacity: 1,
  },
  red: {
    backgroundColor: 'red',
  },
  yellow: {
    backgroundColor: 'yellow',
  },
  green: {
    backgroundColor: '#19FC05',
  },
  nextNode: {
    marginTop: 20,
    fontSize: '1.2em',
  },
};

export default App;
