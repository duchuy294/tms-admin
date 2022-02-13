export const IMAGES_ROOT = 'assets/img/';

export const layoutSizes = {
  resWidthCollapseSidebar: 1200
};

export class ColorHelper {
  static mix = (color1, color2, weight) => {
    const d2h = (d) => d.toString(16);
    const h2d = (h) => parseInt(h, 16);

    let result = '#';
    for (let i = 1; i < 7; i += 2) {
      const color1Part = h2d(color1.substr(i, 2));
      const color2Part = h2d(color2.substr(i, 2));
      const resultPart = d2h(Math.floor(color2Part + (color1Part - color2Part) * (weight / 100)));
      result = `${result}${(`0${resultPart}`).slice(-2)}`;
    }
    return result;
  }
}

export const isMobile = () => (/android|webos|iphone|ipad|ipod|blackberry|windows phone/).test(navigator.userAgent.toLowerCase());
