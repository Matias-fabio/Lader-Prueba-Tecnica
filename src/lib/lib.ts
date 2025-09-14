const domain = "http://localhost:8881";

const apiUrl = `${domain}/wp-json/wp/v2`;

export const getPagesInfo = async (slug: string) => {
  const response = await fetch(`${apiUrl}/pages?slug=${slug}`); // Quitado el espacio extra
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

export const getServices = async ({
  perPage = 10,
}: { perPage?: number } = {}) => {
  const response = await fetch(`${apiUrl}/posts?per_page=${perPage}&_embed`);
  if (!response.ok) {
    throw new Error("No se pudo obtener la informacion de la pagina");
  }
  const results = await response.json();
  if (!results.length) {
    throw new Error("No se encontraron resultados");
  }

  const services = results.map((servicio) => {
    const {
      title: { rendered: title },
      content: { rendered: content },
      excerpt: { rendered: excerpt },
      slug,
    } = servicio;

    const featuredImage = servicio._embedded["wp:featuredmedia"][0].source_url;
    return { title, content, excerpt, slug, featuredImage };
  });

  console.log(services);
  return services;
};
