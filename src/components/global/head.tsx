// import { Helmet } from "react-helmet";

// type Props = {
//   title: string;
//   description: string;
//   keywords?: string[];
//   name?: string;
//   content?: string;
//   url?: string;
//   image?: string;
// };

// const Head = ({
//   title,
//   description,
//   keywords = ["default keywords"],
//   name = "application-name",
//   content = "default-content",
//   url = "https://example.com",
//   image = "https://example.com/image.jpg",
// }: Props) => {
//   return (
//     <Helmet>
//       <title>{title}</title>

//       {/* Primary Meta Tags */}
//       <meta name="description" content={description} />
//       <meta name="keywords" content={keywords.join(", ")} />
//       <meta name={name} content={content} />
//       <meta name="viewport" content="width=device-width, initial-scale=1" />

//       {/* Open Graph / Facebook */}
//       <meta property="og:type" content="website" />
//       <meta property="og:url" content={url} />
//       <meta property="og:title" content={title} />
//       <meta property="og:description" content={description} />
//       <meta property="og:image" content={image} />

//       {/* Twitter */}
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:url" content={url} />
//       <meta name="twitter:title" content={title} />
//       <meta name="twitter:description" content={description} />
//       <meta name="twitter:image" content={image} />
//     </Helmet>
//   );
// };

// export default Head;

import React from "react";
import { Helmet } from "react-helmet";

type Props = {
  title: string;
  description: string;
  keywords?: string[];
  name?: string;
  content?: string;
  url?: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  logoUrl?: string;
  siteName?: string;
};

const Head: React.FC<Props> = ({
  title,
  description,
  keywords = ["default keywords"],
  name = "application-name",
  content = "default-content",
  url = "https://example.com",
  image = "https://example.com/image.jpg",
  author = "Default Author",
  publishedTime,
  modifiedTime,
  articleSection,
  logoUrl = "https://example.com/logo.png",
  siteName = "Your Site Name",
}) => {
  const schemaOrgWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
  };

  const schemaOrgOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: url,
    logo: logoUrl,
  };

  return (
    <Helmet>
      <title>{title}</title>
      {/* Primary Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name={name} content={content} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content={author} />
      {publishedTime && (
        <meta name="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta name="article:modified_time" content={modifiedTime} />
      )}
      {articleSection && (
        <meta name="article:section" content={articleSection} />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgWebPage)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgOrganization)}
      </script>
    </Helmet>
  );
};

export default Head;
