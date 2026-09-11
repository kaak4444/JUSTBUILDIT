import { useState, useEffect } from "react";

export function useMissionData() {
  const [missions, setMissions] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [engines, setEngines] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, logsRes, engRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/logs"),
          fetch("/api/ril/engines")
        ]);
        
        if (projRes.ok) setMissions(await projRes.json());
        if (logsRes.ok) setLogs(await logsRes.json());
        if (engRes.ok) setEngines(await engRes.json());
      } catch (err) {
        console.error("Failed to fetch mission data", err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return { missions, logs, engines };
}
