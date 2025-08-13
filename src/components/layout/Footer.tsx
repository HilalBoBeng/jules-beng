const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-6 py-4 text-center text-gray-600">
        <p>&copy; {currentYear} Portal Informasi Blok M. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
