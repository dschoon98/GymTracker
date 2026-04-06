import { ThemeMode, useAppTheme } from '@/constants/theme';
import { useGymStore } from '@/stores/gymStore';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProfileScreen() {
  const { colors, headers, fonts, mode, setMode, isDark } = useAppTheme();
  const { gyms, defaultGymId, addGym, removeGym, renameGym, setDefaultGym } = useGymStore();
  const [newGymName, setNewGymName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddGym = () => {
    const name = newGymName.trim();
    if (!name) return;
    addGym(name);
    setNewGymName('');
  };

  const handleDeleteGym = (id: string, name: string) => {
    if (gyms.length <= 1) {
      Alert.alert('Cannot Delete', 'You need at least one gym.');
      return;
    }
    Alert.alert('Delete Gym', `Delete "${name}"? Workout data is preserved.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeGym(id) },
    ]);
  };

  const handleSaveRename = (id: string) => {
    const name = editName.trim();
    if (name) renameGym(id, name);
    setEditingId(null);
  };

  const themeModes: { label: string; value: ThemeMode }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background}]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[headers.h1, { color: colors.onSurface.primary, paddingTop: 16, paddingBottom: 4 }]}>
        Profile
      </Text>

      {/* User card */}
      <View style={[styles.userCard, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
        <View style={[styles.avatar, { backgroundColor: colors.brand.primary }]}>
          <Text style={[fonts.bold, { color: colors.onInteractive.primary, fontSize: 22 }]}>A</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[headers.h2, { color: colors.onSurface.primary }]}>Athlete</Text>
          <Text style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 13 }]}>
            Member since Mar 2026
          </Text>
        </View>
      </View>

      {/* Gym Management */}
      <Text style={[headers.h2, { color: colors.onSurface.primary, marginTop: 28, marginBottom: 12 }]}>
        My Gyms
      </Text>

      {gyms.map((gym) => {
        const isDefault = gym.id === defaultGymId;
        const isEditing = editingId === gym.id;

        return (
          <View
            key={gym.id}
            style={[styles.gymRow, { backgroundColor: colors.surface.level1, borderColor: isDefault ? colors.brand.primary + '40' : colors.border.subtle }]}
          >
            {isEditing ? (
              <TextInput
                style={[styles.gymNameInput, { color: colors.onSurface.primary, borderColor: colors.border.interactive, ...fonts.medium }]}
                value={editName}
                onChangeText={setEditName}
                onBlur={() => handleSaveRename(gym.id)}
                onSubmitEditing={() => handleSaveRename(gym.id)}
                autoFocus
              />
            ) : (
              <Pressable
                style={{ flex: 1 }}
                onPress={() => { setEditingId(gym.id); setEditName(gym.name); }}
              >
                <Text style={[fonts.medium, { color: colors.onSurface.primary, fontSize: 16 }]}>
                  {gym.name}
                </Text>
              </Pressable>
            )}

            <View style={styles.gymActions}>
              {isDefault ? (
                <View style={[styles.defaultBadge, { backgroundColor: colors.brand.primary + '20' }]}>
                  <Text style={[fonts.medium, { color: colors.brand.primary, fontSize: 11 }]}>DEFAULT</Text>
                </View>
              ) : (
                <Pressable onPress={() => setDefaultGym(gym.id)} style={styles.actionButton}>
                  <Text style={[fonts.regular, { color: colors.onSurface.secondary, fontSize: 12 }]}>Set default</Text>
                </Pressable>
              )}
              <Pressable onPress={() => handleDeleteGym(gym.id, gym.name)} style={styles.actionButton}>
                <Text style={{ color: colors.feedback.error, fontSize: 12 }}>✕</Text>
              </Pressable>
            </View>
          </View>
        );
      })}

      {/* Add gym */}
      <View style={[styles.addGymRow, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
        <TextInput
          style={[styles.addGymInput, { color: colors.onSurface.primary, ...fonts.regular }]}
          placeholder="Add a gym..."
          placeholderTextColor={colors.onSurface.disabled}
          value={newGymName}
          onChangeText={setNewGymName}
          onSubmitEditing={handleAddGym}
        />
        <Pressable
          onPress={handleAddGym}
          style={[styles.addGymButton, { backgroundColor: newGymName.trim() ? colors.brand.primary : colors.interactive.disabled }]}
        >
          <Text style={[fonts.bold, { color: colors.onInteractive.primary, fontSize: 18 }]}>+</Text>
        </Pressable>
      </View>

      {/* Theme */}
      <Text style={[headers.h2, { color: colors.onSurface.primary, marginTop: 28, marginBottom: 12 }]}>
        Appearance
      </Text>
      <View style={[styles.themeRow, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
        {themeModes.map((t) => (
          <Pressable
            key={t.value}
            onPress={() => setMode(t.value)}
            style={[
              styles.themeButton,
              {
                backgroundColor: mode === t.value ? colors.brand.primary : 'transparent',
                borderColor: mode === t.value ? colors.brand.primary : colors.border.default,
              },
            ]}
          >
            <Text
              style={[
                fonts.medium,
                {
                  color: mode === t.value ? colors.onInteractive.primary : colors.onSurface.secondary,
                  fontSize: 13,
                },
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Settings placeholders */}
      <Text style={[headers.h2, { color: colors.onSurface.primary, marginTop: 28, marginBottom: 12 }]}>
        Settings
      </Text>
      <View style={[styles.settingRow, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
        <Text style={[fonts.regular, { color: colors.onSurface.primary, fontSize: 15 }]}>Weight Unit</Text>
        <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 15 }]}>kg</Text>
      </View>
      <View style={[styles.settingRow, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle }]}>
        <Text style={[fonts.regular, { color: colors.onSurface.primary, fontSize: 15 }]}>Rest Timer Default</Text>
        <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 15 }]}>90s</Text>
      </View>
      <View style={[styles.settingRow, { backgroundColor: colors.surface.level1, borderColor: colors.border.subtle, marginBottom: 100 }]}>
        <Text style={[fonts.regular, { color: colors.onSurface.primary, fontSize: 15 }]}>Backend Sync</Text>
        <Text style={[fonts.medium, { color: colors.onSurface.disabled, fontSize: 15 }]}>Not connected</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    marginTop: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gymRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  gymNameInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  gymActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  actionButton: {
    padding: 6,
  },
  addGymRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addGymInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  addGymButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeRow: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
});
