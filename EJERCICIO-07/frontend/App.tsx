import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Sneaker = {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  talla: number;
  stock: number;
};

const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://TU_IP_LOCAL:3000';

async function api(url: string, options?: RequestInit) {
  const r = await fetch(API_URL + url, options);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.status === 204 ? null : r.json();
}

export default function App() {
  const [items, setItems] = useState<Sneaker[]>([]);

  async function cargar() {
    try {
      const data = await api('/sneakers');
      setItems(data);
    } catch {
      Alert.alert('Error', 'No se pudo conectar con la API');
    }
  }

  useEffect(() => { cargar(); }, []);

  async function crear() {
    try {
      await api('/sneakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca: 'Nike', modelo: 'Air Max 1', precio: 149.99, talla: 42, stock: 10 }),
      });
      await cargar();
    } catch {
      Alert.alert('Error', 'No se pudo crear el sneaker');
    }
  }

  async function actualizarStock(item: Sneaker, delta: number) {
    const nuevoStock = item.stock + delta;
    if (nuevoStock < 0) return;
    try {
      await api('/sneakers/' + item.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nuevoStock }),
      });
      await cargar();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el stock');
    }
  }

  async function eliminar(id: number) {
    try {
      await api('/sneakers/' + id, { method: 'DELETE' });
      setItems(prev => prev.filter(s => s.id !== id));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar');
    }
  }

  function confirmarEliminar(item: Sneaker) {
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Eliminar ${item.marca} ${item.modelo}?`)) eliminar(item.id);
      return;
    }
    Alert.alert('Eliminar', `${item.marca} ${item.modelo}`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(item.id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>👟 Sneaker Vault</Text>

      <TouchableOpacity style={styles.addBtn} onPress={crear}>
        <Text style={styles.addBtnText}>+ Añadir sneaker</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={x => String(x.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const agotado = item.stock === 0;
          return (
            <View style={[styles.card, agotado && styles.cardAgotado]}>
              {/* Badge AGOTADO — dato derivado, no guardado en BD */}
              {agotado && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>AGOTADO</Text>
                </View>
              )}

              <Text style={styles.nombre}>
                {item.marca} {item.modelo}
              </Text>
              <Text style={styles.detalle}>
                Talla {item.talla} · {Number(item.precio).toFixed(2)} €
              </Text>

              {/* Control de stock */}
              <View style={styles.stockRow}>
                <TouchableOpacity
                  style={[styles.stockBtn, agotado && styles.stockBtnDisabled]}
                  onPress={() => actualizarStock(item, -1)}
                  disabled={agotado}
                >
                  <Text style={styles.stockBtnText}>−</Text>
                </TouchableOpacity>

                <Text style={[styles.stockNum, agotado && styles.stockNumAgotado]}>
                  {item.stock}
                </Text>

                <TouchableOpacity style={styles.stockBtn} onPress={() => actualizarStock(item, 1)}>
                  <Text style={styles.stockBtnText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => confirmarEliminar(item)}
                >
                  <Text style={styles.deleteBtnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    letterSpacing: -0.5,
  },
  addBtn: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#1D1D1D',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#A3A3A3',
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    position: 'relative',
  },
  cardAgotado: {
    borderColor: '#7F1D1D',
    backgroundColor: '#1A0E0E',
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    marginRight: 80,
  },
  detalle: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 14,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stockBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockBtnDisabled: {
    opacity: 0.3,
  },
  stockBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  stockNum: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },
  stockNumAgotado: {
    color: '#EF4444',
  },
  deleteBtn: {
    marginLeft: 'auto' as never,
    padding: 6,
  },
  deleteBtnText: {
    fontSize: 18,
  },
});
