import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface MusicTag {
  musicTagId: string;
  musicTagName: string;
  subLabel: string;
}

interface MusicTagsResponse {
  status: string;
  message: string;
  data: MusicTag[];
}

export const useMusicTags = () => {
  const [musicTags, setMusicTags] = useState<MusicTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMusicTags = async () => {
      try {
        const response = await axios.get<MusicTagsResponse>(`${API_BASE_URL}/api/v1/concerts/music-tags`);
        if (response.data.status === "success") {
          setMusicTags(response.data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch music tags"));
      } finally {
        setLoading(false);
      }
    };

    fetchMusicTags();
  }, []);

  return { musicTags, loading, error };
};
