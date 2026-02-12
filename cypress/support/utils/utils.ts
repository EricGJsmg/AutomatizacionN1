export function sanitize(data: any): any {
  const jwtRegex = /\beyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\b/g;

  if (typeof data === 'string') {
    if (data.toLowerCase().includes('alsa')) data = '';
    return data.replace(jwtRegex, '[REDACTED]');
  }

  if (typeof data === 'object' && data !== null) {
    const sanitizedObject: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      if (['password'].includes(key)) {
        sanitizedObject[key] = '[REDACTED]';
      } else if (typeof data[key] === 'string') {
        sanitizedObject[key] = data[key].replace(jwtRegex, '[REDACTED]');
      } else if (typeof data[key] === 'object') {
        sanitizedObject[key] = sanitize(data[key]);
      } else {
        sanitizedObject[key] = data[key];
      }
    }
    return sanitizedObject;
  }

  return data;
}
