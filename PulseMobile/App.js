// PulseMobile App.js (Expo React Native Version)
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, useColorScheme, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const API_URL = 'http://localhost:8000'; // Replace with your backend IP or domain

const App = () => {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [weather, setWeather] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await axios.get(`${API_URL}/trending`);
        setHeadlines(res.data);
      } catch (err) {
        console.error('Error fetching headlines:', err);
        setError('Failed to load trending news.');
      } finally {
        setLoading(false);
      }
    };
    fetchHeadlines();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(`${API_URL}/weather?lat=${latitude}&lon=${longitude}`);
          if (!res.data.error) {
            const { location, temperature, condition } = res.data;
            setWeather({ location, temperature, condition });
            setLocalTime(new Date().toLocaleTimeString());
          }
        } catch (e) {
          console.error('Weather fetch failed', e);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed', err);
        setWeather(null);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const categories = ['All', ...Array.from(new Set(headlines.map(h => h.category || 'General')))]
  const visibleHeadlines = selectedCategory === 'All'
    ? headlines
    : headlines.filter(item => item.category === selectedCategory);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colorScheme === 'dark' ? '#111' : '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>📰 Pulse – Trending</Text>

      {weather && (
        <Text style={{ textAlign: 'center', fontSize: 14, color: '#666', marginBottom: 12 }}>
          📍 {weather.location} • {weather.temperature}°C, {weather.condition} • {localTime}
        </Text>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={{
              backgroundColor: selectedCategory === category ? '#2563eb' : '#ddd',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              marginRight: 8
            }}
          >
            <Text style={{ color: selectedCategory === category ? 'white' : 'black' }}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      ) : (
        <FlatList
          data={visibleHeadlines}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.link)}
              style={{
                backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#f1f5f9',
                padding: 12,
                borderRadius: 12,
                marginBottom: 10
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>{item.source} • {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default App;
