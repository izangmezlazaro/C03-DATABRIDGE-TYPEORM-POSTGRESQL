import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Tipo que describe la entidad Pelicula que recibimos desde NestJS/TypeORM
type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
  favorita: boolean;
};

// En web usa localhost, en móvil físico usa la IP del ordenador.
const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.176.160.172:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarPeliculas() {
    setCargando(true);
    setError('');
    try {
      // GET http://TU_IP_LOCAL:3000/peliculas
      const respuesta = await fetch(API_URL + '/peliculas');

      if (!respuesta.ok) {
        throw new Error('La API no ha respondido correctamente');
      }

      const datos: Pelicula[] = await respuesta.json();
      setPeliculas(datos);
    } catch {
      setError(
        'No se ha podido conectar con NestJS. Revisa la IP (10.176.160.172:3000) y que el backend esté activo.',
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPeliculas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>CINEBOX</Text>
        <Text style={styles.title}>Cartelera</Text>
        <Text style={styles.subtitle}>
          Colección de películas ordenada por puntuación con find()
        </Text>
      </View>

      {cargando && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E11D48" />
          <Text style={styles.loadingText}>Cargando cartelera...</Text>
        </View>
      )}

      {error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={cargarPeliculas}>
            <Text style={styles.retryText}>Reintentar conexión</Text>
          </TouchableOpacity>
        </View>
      )}

      {!cargando && error === '' && (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.movieEmoji}>🎬</Text>
                  <Text style={styles.movieTitle}>
                    {item.titulo}
                    <Text
                      style={
                        item.favorita
                          ? styles.favHeartActive
                          : styles.favHeartInactive
                      }
                    >
                      {item.favorita ? '♥' : '♡'}
                    </Text>
                  </Text>
                </View>

                {/* Reto: Indicador visual de favorita ♥ / ♡ proveniente de PostgreSQL */}
                <View
                  style={[
                    styles.favBadge,
                    item.favorita ? styles.favActive : styles.favInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.favHeart,
                      item.favorita ? styles.favHeartActive : styles.favHeartInactive,
                    ]}
                  >
                    {item.favorita ? '♥' : '♡'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.movieDetails}>
                  {item.genero} · {item.anio}
                </Text>

                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>
                    ★ {Number(item.puntuacion).toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 20,
  },
  eyebrow: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  movieEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  movieTitle: {
    color: '#F8FAFC',
    fontSize: 19,
    fontWeight: '700',
    flexShrink: 1,
  },
  favBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favActive: {
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    borderWidth: 1,
    borderColor: '#E11D48',
  },
  favInactive: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  favHeart: {
    fontSize: 18,
  },
  favHeartActive: {
    color: '#E11D48',
  },
  favHeartInactive: {
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
    marginTop: 4,
  },
  movieDetails: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  ratingBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: '#854D0E',
    fontWeight: '700',
    fontSize: 13,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 15,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  error: {
    color: '#F87171',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
