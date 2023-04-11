import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';

export default function App() {
  const [contact, setContact] = useState(null);

  const getRandomContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const filteredContacts = data.filter(
        (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
      );

      const randomIndex = Math.floor(Math.random() * filteredContacts.length);
      const selectedContact = filteredContacts[randomIndex];

      setContact(selectedContact);
    }
  };

  const sendMessage = async () => {
    if (contact) {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
          [contact.phoneNumbers[0].number],
          'Hello from my app!'
        );

        if (result === 'sent') {
          alert('Message sent successfully!');
        } else {
          alert('Failed to send message');
        }
      } else {
        alert('SMS is not available on this device');
      }
    } else {
      alert('Please select a contact before sending a message');
    }
  };

  return (
    <View style={styles.container}>
      {contact ? (
        <View style={styles.contact}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactPhone}>
            {contact.phoneNumbers[0].number}
          </Text>
        </View>
      ) : (
        <Text style={styles.noContact}>No contact selected</Text>
      )}

      <Button title="Select random contact" onPress={getRandomContact} />

      <Button title="Send message" onPress={sendMessage} disabled={!contact} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contact: {
    marginBottom: 20,
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  contactPhone: {
    fontSize: 16,
  },
  noContact: {
    fontSize: 18,
    marginBottom: 20,
  },
});
