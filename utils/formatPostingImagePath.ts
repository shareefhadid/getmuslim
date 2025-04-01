export const formatPostingImagePath = (path: string) =>
  path.startsWith("images/") ? `${useRequestURL().origin}/${path}` : path;
