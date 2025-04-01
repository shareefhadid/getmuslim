import { DEFAULT_OG_IMAGE } from '~/constants/meta';

export const usePageMeta = (params: {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}) => {
  const config = useRuntimeConfig();
  const route = useRoute();
  const fullTitle = `${params.title} | getmuslim`;
  
  // Construct absolute URL for image
  const imageUrl = new URL(
    params.image || DEFAULT_OG_IMAGE,
    config.public.siteUrl
  ).toString();

  // Construct canonical URL (use provided or current route)
  const canonicalUrl = params.canonical || 
    new URL(route.path, config.public.siteUrl).toString();

  useSeoMeta({
    title: fullTitle,
    description: params.description,
    // Open Graph
    ogUrl: canonicalUrl,
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
  
  // Add canonical link separately
  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl
      }
    ]
  });
}; 