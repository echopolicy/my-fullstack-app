// Seo.jsx
import { Helmet } from "react-helmet-async";

const Seo = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    {/* Optional: OpenGraph tags for better sharing */}
    {title && <meta property="og:title" content={title} />}
    {description && <meta property="og:description" content={description} />}
    <meta property="og:type" content="website" />
  </Helmet>
);

export default Seo;
