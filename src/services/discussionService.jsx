import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  orderBy, 
  query,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const discussionService = {
  async create(discussionData) {
    const docRef = await addDoc(collection(db, "discussions"), discussionData);
    return docRef.id;
  },

  async getAll() {
    const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async getById(id) {
    const docRef = doc(db, "discussions", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  async update(id, updates) {
    const ref = doc(db, "discussions", id);
    await updateDoc(ref, updates);
  },

  async delete(id) {
    await deleteDoc(doc(db, "discussions", id));
  }
};