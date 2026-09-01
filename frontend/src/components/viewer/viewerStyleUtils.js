// viewerStyleUtils.js - Protein Viewer Styling Utility Functions

export const getHighlightingStrategy = (viewerType, style, isModelledStructure) => {
  // Accessibility-focused colour strategies with high contrast
  const strategies = {
    '3dmol': {
      'cartoon': { 
        color: isModelledStructure ? '#FF0000' : '#000000',    // Red vs Black for clear distinction
        method: isModelledStructure ? 'color' : 'outline'      // Different highlighting methods
      },     
      'line': { 
        color: isModelledStructure ? '#FF6600' : '#FF0000',    // Dark Orange vs Red
        method: 'thick_red'                                    // Thick line highlighting
      },      
      'stick': { 
        color: isModelledStructure ? '#00AA00' : '#00FF00',    // Dark Green vs Bright Green
        method: 'color'                                        // Direct colour application
      },         
      'sphere': { 
        color: isModelledStructure ? '#AA00AA' : '#FF00FF',    // Dark Magenta vs Bright Magenta
        method: 'color'                                        // Sphere colour highlighting
      }         
    }
  };
  
  // Get viewer-specific strategies with fallback
  const viewerStrategies = strategies[viewerType] || strategies['3dmol'];
  return viewerStrategies[style] || { color: '#FFFF00', method: 'color' };
};

// Get 3DMol Style Configuration
export const get3DMolStyle = (style) => {
  switch (style) {
    case 'cartoon':
      return { cartoon: { color: 'spectrum' } };           // Spectrum colouring for clarity
    case 'line':
      return { line: { color: 'spectrum' } };              // Line representation with spectrum
    case 'stick':
      return { stick: { color: 'spectrum', radius: 0.2 } }; // Stick with appropriate radius
    case 'sphere':
      return { sphere: { color: 'spectrum', radius: 0.5 } }; // Sphere with optimal radius
    default:
      return { cartoon: { color: 'spectrum' } };           // Default to cartoon representation
  }
};

// Get NGL Style Configuration
export const getNGLStyle = (style) => {
  switch (style) {
    case 'cartoon':
      return 'cartoon';                                    // NGL cartoon representation
    case 'line':
      return 'backbone';                                   // NGL backbone for line style
    case 'stick':
      return 'licorice';                                   // NGL licorice for stick representation
    case 'sphere':
      return 'hyperball';                                  // NGL hyperball for sphere style
    default:
      return 'cartoon';                                    // Default to cartoon
  }
};

// Apply 3DMol Style with Segment Highlighting
export const apply3DMolStyle = (viewer, style, selectedChain, segmentStart, segmentEnd, isModelledStructure) => {
  if (!viewer) return;

  try {
    // Clear existing styles while preserving model data
    viewer.setStyle({}, {});
    
    // Apply base style to entire structure
    const baseStyle = get3DMolStyle(style);
    viewer.setStyle({}, baseStyle);

    // Highlight selected chain with blue colouring
    if (selectedChain) {
      viewer.setStyle(
        { chain: selectedChain },
        { ...baseStyle, color: 'blue' }
      );
    }

    // Apply segment highlighting for loop analysis
    if (selectedChain && segmentStart && segmentEnd) {
      // Generate residue array for segment selection
      const residues = [];
      for (let i = segmentStart; i <= segmentEnd; i++) {
        residues.push(i);
      }
      
      // Get accessibility-focused highlighting strategy
      const strategy = getHighlightingStrategy('3dmol', style, isModelledStructure);
      
      // Apply style-specific highlighting
      if (style === 'cartoon') {
        if (strategy.method === 'outline') {
          // Add stick representation over cartoon for outline effect
          viewer.addStyle(
            { chain: selectedChain, resi: residues },
            { 
              stick: { 
                color: strategy.color,
                radius: 0.3,
                opacity: 0.8
              } 
            }
          );
        } else {
          // Direct cartoon colouring
          viewer.setStyle(
            { chain: selectedChain, resi: residues },
            { cartoon: { color: strategy.color, thickness: 0.8 } }
          );
        }
      } else if (style === 'line') {
        // Line highlighting
        viewer.setStyle(
          { chain: selectedChain, resi: residues },
          { 
            line: { 
              color: strategy.color, 
              linewidth: 6,
              opacity: 1.0 
            } 
          }
        );
      } else if (style === 'stick') {
        // Stick highlighting with increased radius
        viewer.setStyle(
          { chain: selectedChain, resi: residues },
          { stick: { color: strategy.color, radius: 0.4 } }
        );
      } else if (style === 'sphere') {
        // Sphere highlighting for visibility
        viewer.setStyle(
          { chain: selectedChain, resi: residues },
          { sphere: { color: strategy.color, radius: 0.8 } }
        );
      }
    }

    // Single render call for performance optimisation
    viewer.render();
    
  } catch (err) {
    console.error('Error applying 3DMol style:', err);
    // Graceful fallback to basic cartoon representation
    try {
      viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
      viewer.render();
    } catch (fallbackError) {
      console.error('3DMol fallback styling failed:', fallbackError);
    }
  }
};

// Apply NGL Representation with Scientific Highlighting
export const applyNGLRepresentation = (structure, style, selectedChain, segmentStart, segmentEnd, isModelledStructure) => {
  if (!structure) return;

  try {
    // Clear existing representations for fresh styling
    structure.removeAllRepresentations();
    
    const nglStyle = getNGLStyle(style);
    
    // Add main protein structure with chain-based colouring
    structure.addRepresentation(nglStyle, {
      color: 'chainname',                                  // Chain colouring
      opacity: 0.8                                        // Optimal opacity for clarity
    });

    // Apply segment highlighting for loop analysis
    if (selectedChain && segmentStart && segmentEnd) {
      const highlightParams = {
        sele: `:${selectedChain} and ${segmentStart}-${segmentEnd}`, // NGL selection syntax
        opacity: 1.0                                       // Full opacity for prominence
      };

      // Style-specific highlighting configuration
      if (nglStyle === 'cartoon') {
        highlightParams.color = isModelledStructure ? '#FF0000' : '#FFFF00';
        highlightParams.radiusScale = 2.0;                // Improved visibility
      } else if (nglStyle === 'backbone') {
        highlightParams.color = isModelledStructure ? '#AA00AA' : '#FF00FF';
        highlightParams.radius = 0.5;                     // Appropriate line thickness
      } else if (nglStyle === 'licorice') {
        highlightParams.color = isModelledStructure ? '#FFFF00' : '#FF6600';
        highlightParams.radius = 0.5;                     // Stick radius for clarity
      } else if (nglStyle === 'hyperball') {
        highlightParams.color = isModelledStructure ? '#FF69B4' : '#00FF00';
        highlightParams.radius = 2.0;                     // Better sphere visibility
      }
      
      // Add highlighted representation for segment
      structure.addRepresentation(nglStyle, highlightParams);
    }
    
  } catch (err) {
    console.error('Error applying NGL representation:', err);
    // Graceful fallback to basic cartoon representation
    try {
      structure.addRepresentation('cartoon', { 
        color: 'chainname',
        opacity: 0.8 
      });
    } catch (fallbackError) {
      console.error('NGL fallback representation failed:', fallbackError);
    }
  }
};