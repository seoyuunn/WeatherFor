// Minimum 24pt font size for elderly users with visual impairments
const fonts = {
    // Font sizes (in points)
    size: {
      small: 24,
      medium: 28,
      large: 32,
      xlarge: 36,
      xxlarge: 42,
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