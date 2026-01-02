export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export function updateSEO(config: SEOConfig) {
  // Update title
  document.title = config.title;

  // Update or create meta tags
  const updateOrCreateMeta = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attr}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  updateOrCreateMeta('description', config.description);
  
  if (config.keywords) {
    updateOrCreateMeta('keywords', config.keywords);
  }

  if (config.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = config.canonical;
  }

  // Open Graph tags
  updateOrCreateMeta('og:title', config.ogTitle || config.title, true);
  updateOrCreateMeta('og:description', config.ogDescription || config.description, true);
  
  if (config.ogImage) {
    updateOrCreateMeta('og:image', config.ogImage, true);
  }
  
  updateOrCreateMeta('og:type', config.ogType || 'website', true);

  // Twitter tags
  updateOrCreateMeta('twitter:card', config.twitterCard || 'summary_large_image');
  updateOrCreateMeta('twitter:title', config.ogTitle || config.title);
  updateOrCreateMeta('twitter:description', config.ogDescription || config.description);
  
  if (config.ogImage) {
    updateOrCreateMeta('twitter:image', config.ogImage);
  }
}

export function addStructuredData(data: any) {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function getMovieStructuredData(movie: any, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.description,
    image: movie.posterUrl,
    duration: `PT${movie.duration}M`,
    contentRating: movie.rating,
    genre: movie.genre,
    url: `${siteUrl}/movies?id=${movie.id}`,
    potentialAction: {
      '@type': 'WatchAction',
      target: `${siteUrl}/movies?id=${movie.id}`
    }
  };
}

export function getOrganizationStructuredData(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HostingAllTV',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Stream movies and TV series online. Watch your favorite content anytime, anywhere.',
    sameAs: [
      'https://www.facebook.com/hostingalltv',
      'https://twitter.com/hostingalltv',
      'https://www.instagram.com/hostingalltv'
    ]
  };
}
