const fonts = {
    // Font sizes (in points)
    size: {
      small: 24, // Minimum size for general text
      medium: 28, // Size for input fields, secondary text
      large: 32, // Size for buttons, section headers
      xlarge: 36, // Size for screen headers
      xxlarge: 42, // Size for main titles
      extraLarge: 48, // Size for splash screen text
    },
    
    // Font weights for dynamic styling
    weight: {
      regular: '400',
      semiBold: '600',
      bold: '700',
    },
    
    // Line heights for better readability
    lineHeight: {
      tight: 34,
      normal: 42,
      loose: 50,
    },
    
    // Predefined text styles for consistent usage
    style: {
      title: {
        fontSize: 42,
        fontWeight: '700',
        lineHeight: 50,
      },
      subtitle: {
        fontSize: 36,
        fontWeight: '600',
        lineHeight: 54,
      },
      body: {
        fontSize: 28,
        fontWeight: '400',
        lineHeight: 42,
      },
      button: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 38,
      },
      weatherInfo: {
        fontSize: 32,
        fontWeight: '600',
        lineHeight: 48,
      },
    },
  };
  
  export default fonts;