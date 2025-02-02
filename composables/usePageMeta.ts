import { DEFAULT_OG_IMAGE } from '~/constants/meta';

export const usePageMeta = (params: {
  title: string;
  description: string;
  image?: string;
}) => {
  const config = useRuntimeConfig();
  const fullTitle = `${params.title} | getmuslim`;
  
  // Construct absolute URL for image
  const imageUrl = new URL(
    params.image || DEFAULT_OG_IMAGE,
    config.public.siteUrl
  ).toString();

  useSeoMeta({
    title: fullTitle,
    description: params.description,
    // Open Graph
    ogTitle: fullTitle,
    ogDescription: params.description,
    ogImage: imageUrl,
    ogType: 'website',
    
    // Twitter
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: params.description,
    twitterImage: imageUrl,
  });
}; 