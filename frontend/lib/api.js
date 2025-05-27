const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetcher = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};

console.log('Current ENV:', process.env.NODE_ENV);
console.log('Using API URL:', process.env.NEXT_PUBLIC_API_URL);

