export const initGA = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
  
    window.gtag = gtag; 
  
    gtag('js', new Date());
    gtag('config', 'G-EH3W0WJ4YX1');
  };
  