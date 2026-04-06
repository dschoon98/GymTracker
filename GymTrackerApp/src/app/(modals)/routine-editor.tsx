import ExerciseCard from '@/components/ExerciseCard';
import { useAppTheme } from '@/constants/theme';
import { Exercise, RoutineExercise } from '@/data/types';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useRoutineStore } from '@/stores/routineStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

type EditableExercise = RoutineExercise & { key: string };

export default function RoutineEditorModal() {
  const { colors, headers, fonts } = useAppTheme();
  const router = useRouter();
  const { routineId } = useLocalSearchParams<{ routineId?: string }>();
  const { getRoutine, addRoutine, updateRoutine } = useRoutineStore();
  const { exercises: allExercises, searchExercises } = useExerciseStore();

  const existing = routineId ? getRoutine(routineId) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [exercises, setExercises] = useState<EditableExercise[]>(
    existing?.exercises.map((e, i) => ({ ...e, key: `${e.exerciseId}-${i}` })) ?? []
  );
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = searchQuery.trim()
    ? searchExercises(searchQuery)
    : allExercises;

  const handleAddExercise = (exercise: Exercise) => {
    const newEx: EditableExercise = {
      exerciseId: exercise.id,
      targetSets: 3,
      targetReps: 10,
      notes: '',
      order: exercises.length,
      key: `${exercise.id}-${Date.now()}`,
    };
    setExercises((prev) => [...prev, newEx]);
    setShowPicker(false);
    setSearchQuery('');
  };

  const handleRemoveExercise = (key: string) => {
    setExercises((prev) => prev.filter((e) => e.key !== key));
  };

  const handleUpdateExercise = (key: string, updates: Partial<RoutineExercise>) => {
    setExercises((prev) =>
      prev.map((e) => (e.key === key ? { ...e, ...updates } : e))
    );
  };

  const handleDragEnd = ({ data }: { data: EditableExercise[] }) => {
    setExercises(data.map((e, i) => ({ ...e, order: i })));
  };

  const handleSave = () => {
    const trimmedName = name.trim() || 'Untitled Routine';
    const routineExercises: RoutineExercise[] = exercises.map((e, i) => ({
      exerciseId: e.exerciseId,
      targetSets: e.targetSets,
      targetReps: e.targetReps,
      notes: e.notes,
      order: i,
    }));

    if (existing) {
      updateRoutine(existing.id, { name: trimmedName, exercises: routineExercises });
    } else {
      addRoutine(trimmedName, routineExercises);
    }
    router.back();
  };

  const getExercise = useExerciseStore((s) => s.getExercise);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<EditableExercise>) => {
      const info = getExercise(item.exerciseId);
      return (
        <ScaleDecorator>
          <Pressable
            onLongPress={drag}
            disabled={isActive}
            style={[
              styles.exerciseItem,
              {
                backgroundColor: isActive ? colors.surface.level3 : colors.surface.level1,
                borderColor: isActive ? colors.brand.primary : colors.border.subtle,
              },
            ]}
          >
            <View style={styles.dragHandle}>
              <Text style={{ color: colors.onSurface.disabled, fontSize: 16 }}>⋮⋮</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[fonts.medium, { color: colors.onSurface.primary, fontSize: 14 }]} numberOfLines={1}>
                {info?.name ?? 'Unknown Exercise'}
              </Text>
              <View style={styles.targetRow}>
                <TextInput
                  style={[styles.targetInput, { color: colors.onSurface.primary, backgroundColor: colors.surface.level2, borderColor: colors.border.subtle, ...fonts.medium }]}
                  value={String(item.targetSets)}
                  onChangeText={(t) => handleUpdateExercise(item.key, { targetSets: parseInt(t, 10) || 0 })}
                  keyboardType="numeric"
                  placeholder="sets"
                  placeholderTextColor={colors.onSurface.disabled}
                />
                <Text style={[{ color: colors.onSurface.disabled, fontSize: 13 }]}>sets ×</Text>
                <TextInput
                  style={[styles.targetInput, { color: colors.onSurface.primary, backgroundColor: colors.surface.level2, borderColor: colors.border.subtle, ...fonts.medium }]}
                  value={String(item.targetReps)}
                  onChangeText={(t) => handleUpdateExercise(item.key, { targetReps: parseInt(t, 10) || 0 })}
                  keyboardType="numeric"
                  placeholder="reps"
                  placeholderTextColor={colors.onSurface.disabled}
                />
                <Text style={[{ color: colors.onSurface.disabled, fontSize: 13 }]}>reps</Text>
              </View>
            </View>
            <Pressable onPress={() => handleRemoveExercise(item.key)} style={styles.removeButton}>
              <Text style={{ color: colors.feedback.error, fontSize: 14 }}>✕</Text>
            </Pressable>
          </Pressable>
        </ScaleDecorator>
      );
    },
    [getExercise, colors, fonts]
  );

  // Exercise picker overlay
  if (showPicker) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface.level0 }]}>
        <View style={styles.pickerHeader}>
          <Text style={[headers.h2, { color: colors.onSurface.primary }]}>Add Exercise</Text>
          <Pressable onPress={() => { setShowPicker(false); setSearchQuery(''); }}>
            <Text style={[fonts.bold, { color: colors.onSurface.secondary, fontSize: 16 }]}>✕</Text>
          </Pressable>
        </View>

        <TextInput
          style={[styles.searchInput, { color: colors.onSurface.primary, backgroundColor: colors.surface.level1, borderColor: colors.border.default, ...fonts.regular }]}
          placeholder="Search exercises..."
          placeholderTextColor={colors.onSurface.disabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.pickerList}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => handleAddExercise(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface.level0 }]}>
      {/* Handle */}
      <View style={styles.handleBar}>
        <View style={[styles.handle, { backgroundColor: colors.onSurface.disabled }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 15 }]}>Cancel</Text>
        </Pressable>
        <Text style={[headers.h3, { color: colors.onSurface.primary }]}>
          {existing ? 'Edit Routine' : 'New Routine'}
        </Text>
        <Pressable onPress={handleSave}>
          <Text style={[fonts.bold, { color: colors.brand.primary, fontSize: 15 }]}>Save</Text>
        </Pressable>
      </View>

      {/* Name */}
      <TextInput
        style={[styles.nameInput, { color: colors.onSurface.primary, borderColor: colors.border.default, ...fonts.bold }]}
        placeholder="Routine Name"
        placeholderTextColor={colors.onSurface.disabled}
        value={name}
        onChangeText={setName}
      />

      {/* Draggable exercise list */}
      <Text style={[fonts.medium, { color: colors.onSurface.secondary, fontSize: 12, paddingHorizontal: 20, marginBottom: 6 }]}>
        Long-press to reorder
      </Text>

      <DraggableFlatList
        data={exercises}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.exerciseList}
      />

      {/* Add exercise button */}
      <View style={styles.bottomActions}>
        <Pressable
          onPress={() => setShowPicker(true)}
          style={[styles.addExButton, { borderColor: colors.brand.primary }]}
        >
          <Text style={[fonts.bold, { color: colors.brand.primary, fontSize: 14 }]}>+ Add Exercise</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  handleBar: { alignItems: 'center', paddingTop: 12 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  nameInput: {
    fontSize: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  exerciseList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  dragHandle: {
    width: 20,
    alignItems: 'center',
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  targetInput: {
    width: 44,
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addExButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  // Picker styles
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  searchInput: {
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  pickerList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
