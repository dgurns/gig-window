const getParentRoute = (url: string) => {
  if (!url) return '';
  if (url.length === 1 || url.indexOf('/') === -1) {
    return url;
  }

  let cleanedUrl = url;
  if (url[url.length - 1] === '/') {
    cleanedUrl = url.slice(0, url.length - 1);
  }

  const indexOfLastSlash = cleanedUrl.lastIndexOf('/');
  return cleanedUrl.slice(0, indexOfLastSlash);
};

export default {
  getParentRoute,
};
