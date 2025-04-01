export const formatPostingImagePath = (path: string) =>
  path.startsWith("images/")
    ? `${useRequestURL().origin}/images/image-502f2a8a.png`
    : path;
