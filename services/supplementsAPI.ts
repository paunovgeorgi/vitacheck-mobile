export async function categorizeSupplement(supplementName: string) {
    
  const response = await fetch('https://vitacheck-api.onrender.com/api/categorize-supplement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplementName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to categorize supplement');
  }

  return response.json();
}