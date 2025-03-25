// Minimum 24pt font size for elderly users with visual impairments
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
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
    
    // Predefined text styles for consistent usage
    style: {
      title: {
        fontSize: 42,
        fontWeight: '700',
        lineHeight: 1.2,
      },
      subtitle: {
        fontSize: 36,
        fontWeight: '600',
        lineHeight: 1.5,
      },
      body: {
        fontSize: 28,
        fontWeight: '400',
        lineHeight: 1.5,
      },
      button: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 1.2,
      },
      weatherInfo: {
        fontSize: 32,
        fontWeight: '600',
        lineHeight: 1.5,
      },
    },
  };
  
  export default fonts;