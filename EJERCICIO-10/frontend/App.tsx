import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Destino = {
  id: number;
  ciudad: string;
  pais: string;
  descripcion: string;
  visitado: boolean;
};

// En web usa localhost; en móvil físico con Expo Go usa la IP de tu ordenador.
const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.176.160.172:3000';

export default function App() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  async function request(url: string, options?: RequestInit) {
    const r = await fetch(url, options);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r;
  }

  async function cargar() {
    try {
      const r = await request(API_URL + '/destinos');
      setDestinos(await r.json());
      setError('');
    } catch {
      setError('No se pudieron cargar los destinos.');
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear() {
    if (!ciudad.trim() || !pais.trim()) {
      setError('Indica al menos ciudad y país.');
      return;
    }
    try {
      await request(API_URL + '/destinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ciudad: ciudad.trim(),
          pais: pais.trim(),
          descripcion: descripcion.trim() || 'Sin descripción',
          visitado: false,
        }),
      });
      setCiudad('');
      setPais('');
      setDescripcion('');
      setError('');
      await cargar();
    } catch {
      setError('No se pudo crear el destino.');
    }
  }

  async function toggleVisitado(item: Destino) {
    try {
      await request(API_URL + '/destinos/' + item.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitado: !item.visitado }),
      });
      await cargar();
    } catch {
      setError('No se pudo actualizar el estado de visitado.');
    }
  }

  async function editar(id: number) {
    try {
      await request(API_URL + '/destinos/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion: 'Destino actualizado' }),
      });
      await cargar();
    } catch {
      setError('No se pudo actualizar.');
    }
  }

  async function eliminar(id: number) {
    try {
      await request(API_URL + '/destinos/' + id, { method: 'DELETE' });
      await cargar();
    } catch {
      setError('No se pudo eliminar.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌍 Wander</Text>
      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {/* Formulario de creación */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={ciudad}
          onChangeText={setCiudad}
        />
        <TextInput
          style={styles.input}
          placeholder="País"
          value={pais}
          onChangeText={setPais}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <Button title="Crear destino" onPress={crear} />
      </View>

      {/* Lista de destinos */}
      <FlatList
        data={destinos}
        keyExtractor={(x) => String(x.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.destinoNombre}>
                {item.ciudad} · {item.pais}
              </Text>
              <Text style={[styles.badge, item.visitado ? styles.badgeVisitado : styles.badgePendiente]}>
                {item.visitado ? '✅ Visitado' : '✈️ Pendiente'}
              </Text>
            </View>

            <Text style={styles.descripcion}>{item.descripcion}</Text>

            <View style={styles.actionsRow}>
              <Button
                title={item.visitado ? 'Marcar pendiente' : 'Marcar visitado'}
                onPress={() => toggleVisitado(item)}
              />
              <Button title="Editar" onPress={() => editar(item.id)} />
              <Button title="Eliminar" color="#dc2626" onPress={() => eliminar(item.id)} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 36 : 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0F172A',
  },
  error: {
    color: '#DC2626',
    marginBottom: 8,
    fontWeight: '600',
  },
  form: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
  },
  list: {
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  destinoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  badgeVisitado: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
  },
  badgePendiente: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
  descripcion: {
    color: '#64748B',
    marginBottom: 10,
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
});
