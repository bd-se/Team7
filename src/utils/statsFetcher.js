export const fetchStats = async () => {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};