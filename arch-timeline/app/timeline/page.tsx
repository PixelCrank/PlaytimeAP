import React from 'react';

// Server Component: fetches data at request time
async function getTimelineData() {
  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/timeline-data`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error('Failed to fetch timeline data');
  return res.json();
}

export default async function TimelinePage() {
  const data = await getTimelineData();

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
