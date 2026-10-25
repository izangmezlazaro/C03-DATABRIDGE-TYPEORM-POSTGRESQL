import { useEffect, useState } from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Evento = { id: number; nombre: string; ciudad: string; categoria: string; fecha: string };

// En web usa localhost; en móvil físico con Expo Go usa la IP del ordenador.
const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.176.160.172:3000';

export default function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  async function filtrar() {
    const url = API_URL + '/eventos?ciudad=Zaragoza&categoria=Tecnologia';
    const r = await fetch(url);
    setEventos(await r.json());
  }

  useEffect(() => {
    filtrar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerLabel}>EVENT RADAR · DESPUÉS DEL RETO</Text>
        <Text style={styles.title}>Eventos filtrados</Text>

        {/* Tarjeta de filtro activo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Zaragoza</Text>
          <Text style={styles.cardSubtitle}>Categoría: Tecnología</Text>
        </View>

        {/* Tarjetas de eventos obtenidos */}
        <FlatList
          data={eventos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🎫 {item.nombre}</Text>
              <Text style={styles.cardSubtitle}>
                {item.ciudad} · {item.categoria === 'Tecnologia' ? 'Tecnología' : item.categoria}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 36 : 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  list: {
    paddingTop: 0,
  },
});