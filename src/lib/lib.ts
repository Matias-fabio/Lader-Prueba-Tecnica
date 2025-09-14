export const SocialLinks = {
  calendary: "https://calendly.com/franco-lader",
  whatsapp:
    "https://api.whatsapp.com/send?phone=541125134654&text=Hola!%20Quiero%20m%C3%A1s%20info%20sobre%20el%20servicio%20de%20Desarrollo%20Web",
  instagram: "https://www.instagram.com/agencialader/",
  linkedin:
    "https://www.linkedin.com/company/agencia-lader/posts/?feedView=all",
};

const domain = "http://localhost:8881";

const apiUrl = `${domain}/wp-json/wp/v2`;

export const getPagesInfo = async (slug: string) => {
  const response = await fetch(`${apiUrl}/pages?slug=${slug}`);
  if (!response.ok) {
    throw new Error("No se pudo obtener la informacion de la pagina");
  }
  const [data] = await response.json();
  const {
    title: { rendered: title },
    content: { rendered: content },
  } = data;
  return { title, content };
};

const getCategoryIdBySlug = async (slug: string): Promise<number | null> => {
  try {
    const response = await fetch(`${apiUrl}/categories?slug=${slug}`);
    if (!response.ok) return null;

    const categories = await response.json();
    return categories.length > 0 ? categories[0].id : null;
  } catch (error) {
    console.error(`Error obteniendo categoría ${slug}:`, error);
    return null;
  }
};

export const getServices = async ({
  perPage = 10,
}: { perPage?: number } = {}) => {
  const serviciosId = await getCategoryIdBySlug("servicios");

  let url = `${apiUrl}/posts?per_page=${perPage}&_embed`;
  if (serviciosId) {
    url += `&categories=${serviciosId}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo obtener la informacion de los servicios");
  }
  const results = await response.json();
  if (!results.length) {
    throw new Error("No se encontraron servicios");
  }

  const services = results.map((servicio) => {
    const {
      title: { rendered: title },
      content: { rendered: content },
      excerpt: { rendered: excerpt },
      slug,
    } = servicio;

    let featuredImage = "";
    if (
      servicio._embedded &&
      servicio._embedded["wp:featuredmedia"] &&
      servicio._embedded["wp:featuredmedia"][0]
    ) {
      featuredImage = servicio._embedded["wp:featuredmedia"][0].source_url;
    }

    return { title, content, excerpt, slug, featuredImage };
  });

  console.log("Services:", services);
  return services;
};

export const getAboutFeatures = async ({
  perPage = 10,
}: { perPage?: number } = {}) => {
  // Obtener el ID de la categoría "about"
  const aboutId = await getCategoryIdBySlug("about");

  let url = `${apiUrl}/posts?per_page=${perPage}&_embed`;
  if (aboutId) {
    url += `&categories=${aboutId}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo obtener la informacion de about");
  }
  const results = await response.json();

  if (!results.length) {
    console.log("No se encontraron posts en la categoría about");
    return [];
  }

  const features = results.map((feature) => {
    const {
      title: { rendered: title },
      content: { rendered: content },
      excerpt: { rendered: excerpt },
      slug,
    } = feature;

    let featuredImage = "";
    if (
      feature._embedded &&
      feature._embedded["wp:featuredmedia"] &&
      feature._embedded["wp:featuredmedia"][0]
    ) {
      featuredImage = feature._embedded["wp:featuredmedia"][0].source_url;
    }

    return { title, content, excerpt, slug, featuredImage };
  });

  console.log("About features:", features);
  return features;
};

export const getCategories = async () => {
  const response = await fetch(`${apiUrl}/categories`);
  if (!response.ok) {
    throw new Error("No se pudo obtener las categorías");
  }
  const categories = await response.json();
  console.log("Categorías disponibles:", categories);
  return categories;
};
