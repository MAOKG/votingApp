// @flow

import React from 'react';
import { defaults, Doughnut } from 'react-chartjs-2';

defaults.global.responsive = true;

// HSV to RGB color conversion

// H runs from 0 to 360 degrees
// S and V run from 0 to 100

// Ported from the excellent java algorithm by Eugene Vishnevsky at:
// http://www.cs.rit.edu/~ncs/color/t_convert.html

const hsvToRgb = (h, s, v) => {
  let r;
  let g;
  let b;

  // Make sure our arguments stay in-range
  let h1 = Math.max(0, Math.min(360, h));
  let s1 = Math.max(0, Math.min(100, s));
  let v1 = Math.max(0, Math.min(100, v));

  // We accept saturation and value arguments from 0 to 100 because that's
  // how Photoshop represents those values. Internally, however, the
  // saturation and value are calculated from a range of 0 to 1. We make
  // That conversion here.
  s1 /= 100;
  v1 /= 100;

  if (s1 === 0) {
    // Achromatic (grey)
    r = v1;
    g = v1;
    b = v1;
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  h1 /= 60; // sector 0 to 5
  const i = Math.floor(h1);
  const f = h1 - i; // factorial part of h
  const p = v1 * (1 - s1);
  const q = v1 * (1 - s1 * f);
  const t = v1 * (1 - s1 * (1 - f));

  switch (i) {
    case 0:
      r = v1;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = v1;
      b = p;
      break;

    case 2:
      r = p;
      g = v1;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = v1;
      break;

    case 4:
      r = t;
      g = p;
      b = v1;
      break;

    default:
      // case 5:
      r = v1;
      g = p;
      b = q;
  }

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
};

// Generate distinct RGB colors
// t is the total number of colors
// you want to generate.
const rgbColors = t => {
  // distribute the colors evenly on
  // the hue range (the 'H' in HSV)
  const i = 360 / (t - 1);

  // hold the generated colors
  const r = [];
  let sv = 70;
  for (let x = 0; x < t; x += 1) {
    // alternate the s, v for more
    // contrast between the colors.
    sv = sv > 90 ? 70 : sv + 10;
    r.push(hsvToRgb(i * x, sv, sv));
  }
  return r;
};

const Chart = (props: { options: Array<Object> }) => {
  const colors = rgbColors(props.options.length);
  const data = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: colors,
        hoverBackgroundColor: colors
      }
    ]
  };
  props.options.forEach((option: { name: string, votes: number }) => {
    data.labels.push(option.name);
    data.datasets[0].data.push(option.votes);
  });
  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
};

export default Chart;
