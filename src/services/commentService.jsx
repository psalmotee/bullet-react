import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query,
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const commentService = {
  async create(commentData) {
    const docRef = await addDoc(collection(db, "comments"), {
      ...commentData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getByDiscussionId(discussionId) {
    const q = query(
      collection(db, "comments"),
      where("discussionId", "==", discussionId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async delete(id) {
    await deleteDoc(doc(db, "comments", id));
  }
};