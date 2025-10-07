// storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "soulockeData";

export const saveSoulockeData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving data:", err);
  }
};

export const loadSoulockeData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.error("Error loading data:", err);
    return null;
  }
};

export const clearSoulockeData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing data:", err);
  }
};

// Clears only the team data but preserves settings
export const clearSoulockeTeamsOnly = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return; // nothing to clear

    const saved = JSON.parse(raw);

    // Preserve settings, wipe teams
    const updated = {
      flyerEdits: saved.flyerEdits || {},
      ruleBreakingOption: saved.ruleBreakingOption || "no",
      focusPair: saved.focusPair || null,
      sortOption: saved.sortOption || "none",
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    console.log("Cleared Soulocke teams, preserved settings.");
  } catch (err) {
    console.error("Error clearing teams from Soulocke data:", err);
  }
};
