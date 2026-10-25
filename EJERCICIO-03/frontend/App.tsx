// App.tsx
// RESPONSABILIDAD: solicitar una mascota concreta y mostrar su ficha.
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  ciudad: string;
  nivelEnergia: number;
};

// En web usa localhost; en móvil físico con Expo Go usa la IP del ordenador.
const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.176.160.172:3000';

export default function App() {
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Concepto protagonista: findOneBy({ id }) en el backend busca por PK.
    fetch(API_URL + '/mascotas/1')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((dato: Mascota) => setMascota(dato))
      .catch(() =>
        setError('No se pudo conectar con el backend. Revisa la IP y el puerto.'),
      );
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!mascota) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Cargando ficha...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.emoji}>🐶</Text>
        <Text style={styles.title}>{mascota.nombre}</Text>
        <Text style={styles.breed}>{mascota.raza}</Text>
        <Text style={styles.detail}>{mascota.edad} años · {mascota.ciudad}</Text>
        <View style={styles.energyRow}>
          <Text style={styles.energyLabel}>Energía</Text>
          <Text style={styles.energyBar}>
            {'⚡'.repeat(mascota.nivelEnergia)}{'·'.repeat(10 - mascota.nivelEnergia)}
          </Text>
          <Text style={styles.energyValue}>{mascota.nivelEnergia}/10</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#EEF6FF',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  breed: { fontSize: 16, color: '#64748B', marginBottom: 4 },
  detail: { fontSize: 14, color: '#94A3B8', marginBottom: 16 },
  energyRow: { alignItems: 'center', gap: 4 },
  energyLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600', letterSpacing: 1 },
  energyBar: { fontSize: 18, letterSpacing: 2 },
  energyValue: { fontSize: 13, color: '#3B82F6', fontWeight: '700' },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 15 },
  errorText: { color: '#EF4444', textAlign: 'center', fontSize: 15 },
});