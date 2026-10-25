import { useEffect, useState } from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// En web usa localhost; en móvil físico con Expo Go usa la IP de tu ordenador.
const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.176.160.172:3000';

type Viaje = {
  id: number;
  destino: string;
  pais: string;
  estado: string;
  fecha: string;
};

export default function App() {
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [estado, setEstado] = useState('RESERVADO');
  const [fecha, setFecha] = useState('10/04/2027');
  const [mensaje, setMensaje] = useState('');

  // Cargar datos iniciales desde PostgreSQL al iniciar la app
  useEffect(() => {
    fetch(`${API_URL}/viajes/1`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Viaje | null) => {
        if (data) {
          setViaje(data);
          setEstado(data.estado);
          setFecha(data.fecha);
        }
      })
      .catch(() => {
        setMensaje('No se pudo conectar con la API al iniciar');
      });
  }, []);

  async function actualizar() {
    try {
      const r = await fetch(`${API_URL}/viajes/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado, fecha }),
      });

      if (r.ok) {
        const actualizado: Viaje = await r.json();
        setViaje(actualizado);
        setMensaje('Viaje actualizado ✓');
      } else {
        setMensaje('No se pudo actualizar');
      }
    } catch {
      setMensaje('Error de conexión con la API');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>✈️ Travel Book</Text>
        <Text style={styles.subtitle}>Editar viaje</Text>

        {/* Tarjeta de visualización del viaje */}
        <View style={styles.card}>
          <Text style={styles.cardDestino}>✈️ {viaje?.destino ?? 'Tokio'}</Text>
          <Text style={styles.cardPaisEstado}>
            {viaje?.pais ?? 'Japón'} · {viaje?.estado ?? estado}
          </Text>
          <Text style={styles.cardFecha}>
            📅 Fecha: {viaje?.fecha ?? fecha}
          </Text>
        </View>

        {/* Formulario de edición */}
        <View style={styles.form}>
          <Text style={styles.label}>Estado:</Text>
          <TextInput
            style={styles.input}
            value={estado}
            onChangeText={setEstado}
            placeholder="Ej: RESERVADO, CONFIRMADO, REALIZADO"
          />

          <Text style={styles.label}>Fecha:</Text>
          <TextInput
            style={styles.input}
            value={fecha}
            onChangeText={setFecha}
            placeholder="Ej: 10/04/2027"
          />

          <View style={styles.buttonWrapper}>
            <Button
              title="Guardar cambios"
              color="#2563EB"
              onPress={actualizar}
            />
          </View>

          {mensaje !== '' && (
            <Text
              style={[
                styles.feedback,
                mensaje.includes('✓') ? styles.success : styles.error,
              ]}
            >
              {mensaje}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardDestino: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  cardPaisEstado: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
  },
  cardFecha: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    padding: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    color: '#0F172A',
  },
  buttonWrapper: {
    marginTop: 18,
    borderRadius: 8,
    overflow: 'hidden',
  },
  feedback: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  success: {
    color: '#16A34A',
  },
  error: {
    color: '#DC2626',
  },
});
