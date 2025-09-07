/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the paths to all of your template files
  content: [
    "./*.{html,js}",     // Matches all HTML and JS files in the root directory
    "./pages/**/*.{html,js}", // Matches all HTML and JS files in the pages directory and its subdirectories
    "./pages/*.{html,js}" // Matches all HTML and JS files in the pages directory
  ],
  theme: {
    // Define responsive breakpoints for different screen sizes
    screens: {
      sm: "480px",   // Small screens (mobile)
      md: "768px",   // Medium screens (tablet)
      lg: "1025px",  // Large screens (small desktops)
      xl: "1550px"   // Extra large screens (large desktops)
    },
    extend: {
      // Extend the default theme with custom colors
      colors: {
        bodyColor: "#f3f4f6",     // Background color for the body
        lightGray: "#e5e7eb",     // Light gray color
        darkGray: "#707070",      // Dark gray color
        primaryColor: '#F8A531',  // Primary color used for key elements
        primaryButton: "#FAA61A"  // Color for primary buttons
      },
      // Extend the default theme with custom box shadows
      boxShadow: {
        'custom': '0 1px 10px 6px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1), 0 -4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      // Extend the default theme with custom margin values
      margin: {
        '-20px': '-20px', // Negative margin value
      },
    },
    // Configure the container utility
    container: {
      center: true, // Center the container
      padding: {
        DEFAULT: "10px",  // Default padding for the container
        sm: "30px",       // Padding for small screens and up
      }
    },
    // Configure custom font families
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'], // Custom font family
      brendiva: ['Brendiva', 'cursive']
    }
  },
  plugins: [], // Array of plugins to extend Tailwind CSS functionality
}
