import { router } from "expo-router";
import { useEffect } from "react";

export default function WorkoutIndex() {
  useEffect(() => {
    router.replace("/workout/details");
  }, []);

  return null;
}
