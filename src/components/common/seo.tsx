import { Helmet } from 'react-helmet-async';

type Props = {
  author?: string;
  title?: string;
  description?: string;
  type?: string;
  image?: string;
};

export default function SEO({ author, title, description, type, image }: Props) {
  const defaultProps: Props = {
    author: 'BINUS',
    title: 'Welcome to BINUSMAYA',
    description:
      'Discover more than teaching and learning experience with BINUSMAYA. Semesta Aplikasi BINUS Higher Education to foster and empower Indonesia.',
    image: 'https://bm5cdn.azureedge.net/asset/images/logo.png',
    type: 'Learning Management System,LMS,BINUS,Bina Nusantara University,Semesta aplikasi',
  };
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title || defaultProps.title}</title>
      <meta name="author" content={author || defaultProps.author} />
      <meta name="keywords" content={type || defaultProps.type} />
      <meta name="description" content={description || defaultProps.description} />
      {/* End standard metadata tags */}
      {/* Facebook tags */}
      <meta property="og:type" content={type || defaultProps.type} />
      <meta property="og:title" content={title || defaultProps.title} />
      <meta property="og:description" content={description || defaultProps.description} />
      <meta property="og:image" content={image || defaultProps.image} />
      {/* End Facebook tags */}
    </Helmet>
  );
}
