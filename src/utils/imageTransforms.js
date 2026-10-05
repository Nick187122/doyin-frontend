const SUPABASE_TRANSFORM_PARAMS = 'width=400&height=300&resize=cover&format=webp&quality=80';

export function getThumbnailUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('supabase') && (url.includes('/storage/v1/object/'))) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${SUPABASE_TRANSFORM_PARAMS}`;
  }
  return url;
}
