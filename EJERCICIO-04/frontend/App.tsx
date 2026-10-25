// App.tsx — formulario POST con precioMedio y tarjeta
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// En web usa localhost; en móvil físico con Expo Go usa la IP del ordenador.
const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.176.160.172:3000';

type Restaurante = {
  id: number;
  nombre: string;
  tipo: string;
  ciudad: string;
  puntuacion: number;
  precioMedio: number;
};

export default function App() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [precioMedio, setPrecioMedio] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [ultimoRestaurante, setUltimoRestaurante] = useState<Restaurante | null>(null);

  async function guardar() {
    if (!nombre.trim() || !ciudad.trim()) {
      setMensaje('⚠️ Por favor introduce al menos el nombre y la ciudad');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      const respuesta = await fetch(`${API_URL}/restaurantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          tipo,
          ciudad,
          puntuacion: 9,
          precioMedio: parseFloat(precioMedio) || 0,
        }),
      });

      if (!respuesta.ok) {
        throw new Error(`Error en el servidor: ${respuesta.status}`);
      }

      const creado: Restaurante = await respuesta.json();
      setUltimoRestaurante(creado);
      setMensaje('Restaurante guardado ✓');

      // Limpiar formulario tras guardar
      setNombre('');
      setTipo('');
      setCiudad('');
      setPrecioMedio('');
    } catch (error) {
      console.error(error);
      setMensaje('Error al conectar o guardar el restaurante');
    } finally {
      setCargando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🍜 Food Spots</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del restaurante"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Tipo de cocina (ej. Italiana, Sushi)"
          value={tipo}
          onChangeText={setTipo}
        />
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={ciudad}
          onChangeText={setCiudad}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio medio (€) ej: 25"
          value={precioMedio}
          onChangeText={setPrecioMedio}
          keyboardType="numeric"
        />

        {cargando ? (
          <ActivityIndicator size="small" color="#EA580C" style={styles.loader} />
        ) : (
          <Button title="Guardar restaurante" color="#EA580C" onPress={guardar} />
        )}

        {mensaje ? (
          <Text
            style={[
              styles.mensaje,
              mensaje.includes('✓') ? styles.mensajeExito : styles.mensajeError,
            ]}
          >
            {mensaje}
          </Text>
        ) : null}

        {/* Tarjeta con los datos del restaurante guardado */}
        {ultimoRestaurante && (
          <View style={styles.card}>
            <Text style={styles.cardBadge}>ÚLTIMO REGISTRO EN BD</Text>
            <Text style={styles.cardTitle}>{ultimoRestaurante.nombre}</Text>
            <Text style={styles.cardSubtitle}>
              {ultimoRestaurante.tipo ? `${ultimoRestaurante.tipo} · ` : ''}
              {ultimoRestaurante.ciudad}
            </Text>

            <View style={styles.cardRow}>
              <View style={styles.infoPill}>
                <Text style={styles.infoLabel}>Precio medio</Text>
                <Text style={styles.infoValue}>
                  {Number(ultimoRestaurante.precioMedio).toFixed(2)} €
                </Text>
              </View>

              <View style={styles.infoPill}>
                <Text style={styles.infoLabel}>Puntuación</Text>
                <Text style={styles.infoValue}>
                  ⭐ {ultimoRestaurante.puntuacion}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#9A3412',
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    fontSize: 16,
  },
  loader: {
    marginVertical: 12,
  },
  mensaje: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  mensajeExito: {
    color: '#15803D',
  },
  mensajeError: {
    color: '#B91C1C',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  cardBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EA580C',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoPill: {
    flex: 1,
    backgroundColor: '#FFEDD5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9A3412',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7C2D12',
  },
});
