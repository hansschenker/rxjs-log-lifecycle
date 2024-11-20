// 3. Implement the Improved Logging Utility
// -----------------------------------------------------------
// - Implement helper functions in `colorUtils.ts`.
// - Implement the `logOperator` itself in `logOperator.ts`.

// src/colorUtils.ts
// -----------------------------------------------------------
export const isHex = (hexValue: string) => /^#[0-9A-F]{6}$/i.test(hexValue);

export const pickTextColor = (
  bgColor: string,
  lightColor: string,
  darkColor: string
) => {
  const color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) =>
    col <= 0.03928 ? col / 12.92 : Math.pow((col + 0.055) / 1.055, 2.4)
  );
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? darkColor : lightColor;
};

export const getLogStyle = (bgColor: string, color: string) =>
  `background: ${bgColor}; color: ${color}; font-size: 10px; font-weight: bold; padding: 3px; border-radius: 2px;`;
