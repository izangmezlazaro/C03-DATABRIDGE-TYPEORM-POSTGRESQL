// App.tsx
// RESPONSABILIDAD: mostrar una Playlist relacionada y añadir canciones.
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Cancion = { id: number; titulo: string; artista: string };
type Playlist = { id: number; nombre: string; canciones: Cancion[] };

// En web usa localhost; en móvil físico con Expo Go usa la IP de tu ordenador.
const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.176.160.172:3000';

export default function App() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    try {
      const r = await fetch(API_URL + '/playlists/1');
      if (!r.ok) throw new Error('Error al obtener playlist');
      const data = await r.json();
      setPlaylist(data);
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function agregarCancion() {
    if (!titulo.trim() || !artista.trim()) {
      Alert.alert('Campos incompletos', 'Introduce el título y el artista de la canción.');
      return;
    }
    if (!playlist) return;

    try {
      setGuardando(true);
      const res = await fetch(`${API_URL}/playlists/canciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.trim(),
          artista: artista.trim(),
          playlistId: playlist.id,
        }),
      });

      if (!res.ok) throw new Error('No se pudo guardar');

      setTitulo('');
      setArtista('');
      await cargar();
    } catch {
      Alert.alert('Error', 'No se pudo añadir la canción a la playlist.');
    } finally {
      setGuardando(false);
    }
  }

  if (!playlist) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando playlist...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Cabecera Playlist */}
        <View style={styles.header}>
          <Text style={styles.playlistBadge}>PLAYLIST</Text>
          <Text style={styles.playlistTitle}>🎵 {playlist.nombre}</Text>
          <Text style={styles.playlistSubtitle}>
            {playlist.canciones?.length ?? 0} {playlist.canciones?.length === 1 ? 'canción' : 'canciones'}
          </Text>
        </View>

        {/* Formulario para añadir canción */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Añadir nueva canción</Text>
          <TextInput
            style={styles.input}
            placeholder="Título de la canción..."
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Artista o banda..."
            placeholderTextColor="#888"
            value={artista}
            onChangeText={setArtista}
          />
          <TouchableOpacity
            style={[styles.addButton, guardando && styles.addButtonDisabled]}
            onPress={agregarCancion}
            disabled={guardando}
          >
            <Text style={styles.addButtonText}>
              {guardando ? 'Añadiendo...' : '+ Añadir a esta playlist'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de canciones */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Canciones en la lista</Text>
          <FlatList
            data={playlist.canciones}
            keyExtractor={(x) => String(x.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <View style={styles.songCard}>
                <Text style={styles.songIndex}>#{index + 1}</Text>
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{item.titulo}</Text>
                  <Text style={styles.songArtist}>{item.artista}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay canciones en esta playlist todavía.</Text>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#B3B3B3',
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  playlistBadge: {
    color: '#1DB954',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  playlistTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  playlistSubtitle: {
    color: '#A7A7A7',
    fontSize: 14,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    marginBottom: 16,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#282828',
    color: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#383838',
  },
  addButton: {
    backgroundColor: '#1DB954',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 15,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 32,
    gap: 10,
  },
  songCard: {
    backgroundColor: '#181818',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242424',
  },
  songIndex: {
    color: '#1DB954',
    fontWeight: '800',
    fontSize: 14,
    width: 32,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  songArtist: {
    color: '#9E9E9E',
    fontSize: 13,
  },
  emptyText: {
    color: '#777777',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});