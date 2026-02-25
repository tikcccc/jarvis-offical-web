/**
 * CornerBrackets Component
 *
 * Decorative corner brackets that appear on card hover
 * Simulates camera viewfinder or engineering interface aesthetic
 */

export function CornerBrackets() {
  return (
    <>
      {/* Top Left */}
      <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top Right */}
      <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Bottom Left */}
      <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Bottom Right */}
      <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </>
  );
}
