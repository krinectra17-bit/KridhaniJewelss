const API = process.env.REACT_APP_BACKEND_URL;

export const getSiteSettings = async () => {
  const res = await fetch(`${API}/api/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};

export const updateSiteSettings = async (data, token) => {
  const res = await fetch(`${API}/api/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
};
