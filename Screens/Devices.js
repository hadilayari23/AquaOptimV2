import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Modal, StyleSheet } from 'react-native';
import { Card, Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";
import {Picker} from '@react-native-picker/picker';
import { TouchableHighlight } from 'react-native';
global.atob = decode;

const Devices = () => {
  const [filterData, setFilterData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const [deviceDeveui, setDeviceDeveui] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const auth = await SecureStore.getItemAsync('accessToken');

      if (!auth) {
        console.log("L'utilisateur n'est pas authentifié.");
        return;
      }

      const user = jwtDecode(auth);
      console.log('User ID:', user.id);
      console.log('User ID:', user);

      const response = await axios.get(`http://192.168.1.17:3000/devices/${user.id}/all`);
      const resultData = response.data;
      console.log('API Response:', resultData);

      if (resultData.data && resultData.data.length > 0) {
        console.log('Devices:', resultData.data);
        setFilterData(resultData.data);
      } else {
        console.log(resultData.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const changeState = async (deveui, onoff) => {
    try {
      const authtoken = await SecureStore.getItemAsync('accessToken');
      const headers = {
        'Authorization': `Bearer ${authtoken}`,
        'Content-Type': 'application/json',
      };
      const body = { deveui, onoff };
      const result = await axios.post(`http://192.168.1.17:3000/devices/toggle`, body, { headers });
      console.log('Toggle Response:', result.data);

      if (result.data.message === "Device state updated successfully.") {
        await axios.get('http://192.168.1.17:3000/devices/run');
        fetchData(); // Mettre à jour les données après le changement d'état
      } else {
        console.error('Changement d\'état échoué:', result.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'état:', error);
    }
  };

  const openModal = (device, adding = false) => {
    setCurrentDevice(device);
    setDeviceName(device ? device.name : '');
    setDeviceDeveui(device ? device.deveui : '');
    setDeviceType(device ? device.type : '');
    setIsAdding(adding);
    setModalVisible(true);
  };

  const closeModal = () => {
    setCurrentDevice(null);
    setDeviceName('');
    setDeviceDeveui('');
    setDeviceType('');
    setIsAdding(false);
    setModalVisible(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!deviceName.trim()) {
      newErrors.deviceName = 'Device name is required';
    }

    if (!deviceDeveui.trim()) {
      newErrors.deviceDeveui = 'Device deveui is required';
    }

    if (!deviceType.trim()) {
      newErrors.deviceType = 'Device type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateDevice = async () => {
    if (currentDevice && validateForm()) {
      console.log('Updating device:', currentDevice);
      try {
        const authtoken = await SecureStore.getItemAsync('accessToken');
        if (!authtoken) {
          throw new Error('User not authenticated');
        }

        const headers = {
          'Authorization': `Bearer ${authtoken}`,
          'Content-Type': 'application/json',
        };
        const body = {
          name: deviceName,
          deveui: deviceDeveui,
          type: deviceType,
        };

        const response = await axios.put(
          `http://192.168.1.17:3000/devices/${currentDevice._id}`,
          body,
          { headers }
        );
        console.log('Update Response:', response.data);

        if (response.data.success) {
          fetchData(); // Update the device list after successful update
          closeModal();
        } else {
          console.error('Update failed:', response.data.message);
          Alert.alert('Error', response.data.message || 'Failed to update the device.');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized access:', error.response.data.message);
        } else {
          console.error('Error updating device:', error);
          Alert.alert('Error', 'An error occurred while updating the device. Please try again.');
        }
      }
    }
  };
  const deleteDevice = async (deviceId) => {
    try {
      const authtoken = await SecureStore.getItemAsync('accessToken');
      const user = jwtDecode(authtoken);
      console.log('User ID:', user.id);
      if (!authtoken) {
        throw new Error('User not authenticated');
      }
  
      const headers = {
        'Authorization': `Bearer ${authtoken}`,
        'Content-Type': 'application/json',
      };
  
      const response = await axios.delete(`http://192.168.1.17:3000/devices/${user.id}/${deviceId}`, { headers });
      console.log('Delete Response:', response.data);
  
      if (response.data.message==='Success!') {
        fetchData(); // Update the device list after successful deletion
        Alert.alert('Success', 'Device deleted successfully.');
      } else {
        console.error('Delete failed:', response.data.message);
        Alert.alert('Error', response.data.message || 'Failed to delete the device.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access:', error.response.data.message);
      } else {
        console.error('Error deleting device:', error);
        Alert.alert('Error', 'An error occurred while deleting the device. Please try again.');
      }
    }
  };
  
  const addDevice = async () => {
    if (validateForm()) {
      try {
        const authtoken = await SecureStore.getItemAsync('accessToken');
        if (!authtoken) {
          throw new Error('User not authenticated');
        }
        const user = jwtDecode(authtoken);
        console.log('User ID:', user.id);
  
        const headers = {
          'Authorization': `Bearer ${authtoken}`,
          'Content-Type': 'application/json',
        };
        const body = {
          name: deviceName,
          deveui: deviceDeveui,
          type: deviceType,
        };

        const response = await axios.post(
          `http://192.168.1.17:3000/devices/${user.id}/add`,
          body,
          { headers }
        );
        console.log('Add Response:', response.data);

        if (response.data.success) {
          fetchData(); // Update the device list after successful addition
          closeModal();
        } else {
          console.error('Add failed:', response.data.message);
          Alert.alert('Error', response.data.message || 'Failed to add the device.');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized access:', error.response.data.message);
        } else {
          console.error('Error adding device:', error);
          Alert.alert('Error', 'An error occurred while adding the device. Please try again.');
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        icon="plus"
        mode="contained"
        onPress={() => openModal(null, true)} // Open modal for adding a new device
        style={{ marginBottom: 10 ,backgroundColor:"rgb(2 132 199)"}}
      >
        Add Device
      </Button>

      {filterData.map(({ _id, deveui, name, onoff, type }) => (
        <Card key={_id} style={{ marginBottom: 10 }}>
          <Card.Content>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Device Name: {name}</Text>
          </Card.Content>
          <Card.Actions>
            {type === 'actuator' && (
              <Icon
                name={onoff === "01" ? "water" : "water-off"}
                size={50}
                onPress={() => changeState(deveui, onoff === "01" ? "00" : "01")} // Correction ici pour inverser correctement l'état
                color="#06b6d4"
              />
            )}
            {type === 'sensor' && (
              <Icon
                name="alert-circle-outline"
                size={40}
                color="#ca8a04"
              />
              // Vous pouvez ajuster l'icône et le style en fonction du type de capteur
            )}
          <TouchableHighlight
  activeOpacity={0.6}
  underlayColor="#f5c6c6"
  onPress={() => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this device?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteDevice(_id) }
      ]
    );
  }}
  style={{ marginLeft: 20, borderRadius: 2 }}
>
  <Icon
    name="delete"
    size={40}
    color="#b91c1c"
  />
</TouchableHighlight>
          <TouchableHighlight
  activeOpacity={0.6}
  underlayColor="#aee1fb"
  onPress={() => openModal({ _id, name, deveui, type })}
  style={{ marginLeft: 20 ,borderRadius: 2  }}
>
  <Icon
    name="pencil"
    size={40}
    color="rgb(2 132 199)"
  />
</TouchableHighlight>
          </Card.Actions>
        </Card>
      ))}

      {filterData.length === 0 && (
        <Text>No devices found.</Text>
      )}

      <Modal visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isAdding ? 'Add Device' : 'Update Device'}
            </Text>
            <TextInput
              label="Device Name"
              value={deviceName}
              onChangeText={setDeviceName}
              style={styles.input}
              error={!!errors.deviceName}
              mode="outlined"
              outlineColor="rgb(2 132 199)"
              activeOutlineColor="rgb(2 132 199)"
              selectionColor="rgb(2 132 199)"
            />
            {errors.deviceName && <Text style={styles.errorText}>{errors.deviceName}</Text>}
            <TextInput
              label="Device Deveui"
              value={deviceDeveui}
              onChangeText={setDeviceDeveui}
              style={styles.input}
              error={!!errors.deviceDeveui}
              mode="outlined"
              outlineColor="rgb(2 132 199)"
              activeOutlineColor="rgb(2 132 199)"
              selectionColor="rgb(2 132 199)"
            />
            {errors.deviceDeveui && <Text style={styles.errorText}>{errors.deviceDeveui}</Text>}
            <Picker
              selectedValue={deviceType}
              onValueChange={setDeviceType}
              style={styles.input}
              mode="dropdown"
            >
              <Picker.Item label="Select Device Type" value="" />
              <Picker.Item label="Sensor" value="sensor" />
              <Picker.Item label="Actuator" value="actuator" />
            </Picker>
            {errors.deviceType && <Text style={styles.errorText}>{errors.deviceType}</Text>}
            <Button
              mode="contained"
              onPress={isAdding ? addDevice : updateDevice}
              style={styles.button}
            >
              {isAdding ? 'Add Device' : 'Update Device'}
            </Button>
            <Button
              mode="contained"
              onPress={closeModal}
              style={styles.button}
              textColor="white"
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor:"rgb(2 132 199)"
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Devices;
