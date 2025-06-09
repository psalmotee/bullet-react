import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const userService = {
  async getById(userId) {
    const docRef = doc(db, "Users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  },

  async update(userId, updates) {
    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, updates);
  }
};