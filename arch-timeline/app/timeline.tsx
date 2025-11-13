import React from 'react';
import { useTimelineData } from '../hooks/useTimelineData';

export default function TimelinePage() {
  const { data, loading, error } = useTimelineData();

  if (loading) return <div>Loading timeline...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found.</div>;

  // Example: Render Macros and their Movements
  return (
    <div style={{ padding: 32 }}>
      <h1>Architecture Timeline</h1>
      {data.Macros?.map((macro: any) => (
        <section key={macro.Name} style={{ marginBottom: 32 }}>
          <h2>{macro.Name} ({macro.Start}–{macro.End})</h2>
          <p>{macro.Description}</p>
          <h3>Movements:</h3>
          <ul>
            {data.Movements?.filter((m: any) => m['Macro Parent (choose)'] === macro.Name).map((movement: any) => (
              <li key={movement['Sub-Movement']}>
                <strong>{movement['Sub-Movement']}</strong> ({movement['Start Year']}–{movement['End Year']})<br />
                <em>{movement['Hallmark Traits']}</em>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
