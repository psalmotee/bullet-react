import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "Teams"));
      const teamList = snapshot.docs.map((doc) => doc.data().name);
      setTeams(teamList);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Unable to load teams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return { teams, loading, refetchTeams: fetchTeams };
};
