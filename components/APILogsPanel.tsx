export default function APILogsPanel() {
  const [logs, setLogs] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsResponse, statusResponse] = await Promise.all([
          api.getLogs(),
          api.getSyncStatus()
        ]);
        
        setLogs(await logsResponse.json());
        setSyncStatus(await statusResponse.json());
      } catch (error) {
        console.error('Failed to fetch API data:', error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="api-logs-panel">
      <h3>API Status</h3>
      <p>Last WHO sync: {syncStatus?.lastSyncedAt || 'Loading...'}</p>
      
      <h4>Recent API Calls</h4>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            {log.timestamp} - {log.endpoint} ({log.status})
          </li>
        ))}
      </ul>
    </div>
  );
}