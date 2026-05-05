import type { APIRoute } from "astro";
import { coloringPages } from "@/data/coloringPages";

const pageBySlug = new Map(
  coloringPages.map((page) => [page.printablePath.replace("/coloring-pages/", "").replace(".svg", ""), page]),
);

export function getStaticPaths() {
  return [...pageBySlug.keys()].map((slug) => ({ params: { slug } }));
}

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function scene(slug: string) {
  const scenes: Record<string, string> = {
    creation: `
      <circle cx="600" cy="250" r="82" />
      <path d="M120 430 C270 300 420 560 560 420 S800 360 900 470" />
      <path d="M130 650 C260 560 370 690 510 610 S760 590 900 690" />
      <path d="M160 760 C260 700 340 780 460 730 S700 700 850 790" />
      <path d="M220 270 C260 210 330 210 365 270 C330 245 270 245 220 270Z" />
      <path d="M430 180 C470 120 540 120 575 180 C535 155 475 155 430 180Z" />
      <path d="M165 850 C220 790 300 790 350 850" />
      <path d="M690 835 C740 770 825 775 875 835" />`,
    "noahs-ark": `
      <path d="M170 595 H850 C820 710 720 790 510 790 C300 790 205 710 170 595Z" />
      <path d="M310 595 V450 H710 V595" />
      <path d="M380 450 V360 H640 V450" />
      <path d="M430 360 L510 285 L590 360" />
      <rect x="455" y="492" width="95" height="103" />
      <path d="M120 820 C230 760 320 880 430 820 S635 760 750 820 S900 810 950 770" />
      <path d="M225 250 C340 150 480 160 570 260 C655 175 800 190 860 300" />
      <path d="M205 255 C340 210 445 220 570 300 C660 230 760 240 870 318" />`,
    "abraham-and-isaac": `
      <path d="M250 780 L410 420 L570 780" />
      <path d="M310 650 H515" />
      <path d="M405 420 L405 780" />
      <circle cx="230" cy="330" r="45" />
      <path d="M230 375 V560 M230 440 L165 510 M230 440 L300 495 M230 560 L175 700 M230 560 L295 700" />
      <circle cx="685" cy="360" r="38" />
      <path d="M685 398 V565 M685 455 L615 505 M685 455 L745 505 M685 565 L630 700 M685 565 L740 700" />
      <path d="M610 310 C650 230 750 225 810 300" />
      <path d="M810 300 C760 310 730 340 690 390" />`,
    "joseph-and-his-coat": `
      <circle cx="510" cy="250" r="58" />
      <path d="M365 415 C415 335 605 335 655 415 L705 760 H315Z" />
      <path d="M365 415 L245 535 L315 610" />
      <path d="M655 415 L775 535 L705 610" />
      <path d="M420 395 L420 760 M510 365 L510 760 M600 395 L600 760" />
      <path d="M350 520 H670 M330 640 H690" />
      <path d="M205 805 C320 740 430 840 520 805 S720 750 825 815" />`,
    "moses-burning-bush": `
      <path d="M245 795 C350 705 470 820 575 740 S760 700 875 790" />
      <path d="M500 720 V455" />
      <path d="M500 560 C405 505 380 410 430 315 C455 395 500 410 500 560Z" />
      <path d="M500 565 C600 500 635 410 585 300 C560 390 520 420 500 565Z" />
      <path d="M500 525 C455 430 495 350 520 245 C565 345 555 425 500 525Z" />
      <circle cx="210" cy="355" r="48" />
      <path d="M210 403 V590 M210 470 L145 530 M210 470 L280 525 M210 590 L155 730 M210 590 L270 730" />`,
    "crossing-the-red-sea": `
      <path d="M170 240 C300 350 320 595 180 800" />
      <path d="M850 240 C720 350 700 595 840 800" />
      <path d="M255 790 C360 720 455 820 560 760 S735 740 815 815" />
      <path d="M330 340 C430 300 600 300 700 340" />
      <circle cx="510" cy="500" r="42" />
      <path d="M510 542 V680 M510 595 L405 560 M510 595 L615 560 M510 680 L450 780 M510 680 L570 780" />
      <path d="M130 480 C175 450 220 450 260 480 M760 480 C805 450 850 450 890 480" />`,
    "joshua-jericho": `
      <path d="M175 735 H845 V420 H175Z" />
      <path d="M215 420 V330 H305 V420 M365 420 V330 H455 V420 M565 420 V330 H655 V420 M715 420 V330 H805 V420" />
      <path d="M255 735 V570 H385 V735 M635 735 V570 H765 V735" />
      <path d="M175 535 H845" />
      <path d="M305 875 L430 720 L535 875 L650 725 L785 875" />
      <circle cx="210" cy="235" r="34" />
      <path d="M210 270 V370 M210 315 L135 350 M210 315 L285 350" />
      <path d="M285 330 C350 300 405 305 455 340" />`,
    "david-and-goliath": `
      <circle cx="300" cy="360" r="38" />
      <path d="M300 398 V555 M300 455 L230 505 M300 455 L365 500 M300 555 L245 705 M300 555 L355 705" />
      <path d="M365 500 C465 420 535 420 620 500" />
      <circle cx="705" cy="250" r="62" />
      <path d="M705 312 V585 M705 390 L610 470 M705 390 L820 455 M705 585 L620 805 M705 585 L790 805" />
      <path d="M585 505 H820" />
      <path d="M180 825 C310 760 435 845 540 805 S730 755 850 835" />`,
    "daniel-lions-den": `
      <path d="M190 780 C175 570 270 390 510 390 C750 390 845 570 830 780Z" />
      <circle cx="510" cy="315" r="48" />
      <path d="M510 363 V560 M510 430 L420 500 M510 430 L600 500 M510 560 L445 720 M510 560 L575 720" />
      <circle cx="295" cy="640" r="55" />
      <path d="M245 705 C275 670 315 670 345 705" />
      <path d="M255 620 H255 M335 620 H335" />
      <circle cx="725" cy="640" r="55" />
      <path d="M675 705 C705 670 745 670 775 705" />
      <path d="M685 620 H685 M765 620 H765" />
      <path d="M235 870 H785" />`,
    "jonah-great-fish": `
      <path d="M205 585 C355 395 655 380 835 545 C740 580 740 660 835 700 C630 850 355 785 205 585Z" />
      <path d="M205 585 C135 520 120 450 135 385 C205 450 250 505 265 575" />
      <circle cx="690" cy="545" r="18" />
      <path d="M510 455 C555 400 635 405 680 470" />
      <path d="M320 660 C410 625 505 625 610 660" />
      <path d="M245 850 C360 790 460 880 570 830 S760 800 865 865" />
      <circle cx="460" cy="300" r="38" />
      <path d="M460 338 V445 M460 390 L380 420 M460 390 L535 420" />`,
    "birth-of-jesus": `
      <path d="M210 765 H810 L745 470 H275Z" />
      <path d="M240 470 L510 260 L780 470" />
      <path d="M510 170 L535 235 L605 235 L550 275 L570 340 L510 300 L450 340 L470 275 L415 235 L485 235Z" />
      <path d="M405 645 C455 590 565 590 615 645 V735 H405Z" />
      <circle cx="510" cy="620" r="35" />
      <path d="M360 770 C430 725 590 725 660 770" />
      <path d="M180 825 C310 775 420 850 525 815 S725 780 850 835" />`,
    "jesus-feeds-5000": `
      <circle cx="510" cy="275" r="52" />
      <path d="M385 430 C435 350 585 350 635 430 L675 705 H345Z" />
      <path d="M385 430 L275 520 M635 430 L745 520" />
      <ellipse cx="430" cy="815" rx="75" ry="35" />
      <ellipse cx="525" cy="815" rx="75" ry="35" />
      <path d="M350 760 H660 C635 870 375 870 350 760Z" />
      <path d="M195 520 C250 475 315 480 365 525 M655 525 C705 480 775 480 825 520" />
      <path d="M205 610 C260 570 315 575 365 615 M655 615 C705 575 775 575 825 610" />`,
    "jesus-calms-storm": `
      <path d="M190 620 H840 C805 760 680 830 510 830 C340 830 225 760 190 620Z" />
      <path d="M510 620 V330 L705 620" />
      <path d="M510 330 L360 620" />
      <path d="M140 805 C245 735 345 850 455 800 S650 745 770 805 S905 785 950 735" />
      <path d="M120 345 C180 270 265 270 325 345 M695 350 C755 275 840 275 900 350" />
      <circle cx="440" cy="525" r="35" />
      <path d="M440 560 V620 M440 585 L375 610 M440 585 L500 610" />`,
    "good-samaritan": `
      <path d="M165 820 C280 730 430 845 535 780 S730 735 855 820" />
      <circle cx="365" cy="330" r="45" />
      <path d="M365 375 V555 M365 435 L275 505 M365 435 L455 500 M365 555 L300 720 M365 555 L425 720" />
      <circle cx="655" cy="395" r="40" />
      <path d="M655 435 V600 M655 495 L575 555 M655 495 L735 555 M655 600 L595 735 M655 600 L715 735" />
      <path d="M250 730 C355 675 465 675 570 730" />
      <path d="M535 300 C610 250 705 265 765 330" />
      <path d="M520 785 H820" />`,
    "empty-tomb": `
      <path d="M225 780 C245 520 390 360 510 360 C630 360 775 520 795 780Z" />
      <path d="M360 780 V590 C360 505 440 455 510 455 C580 455 660 505 660 590 V780" />
      <circle cx="705" cy="735" r="92" />
      <path d="M245 835 H835" />
      <path d="M510 185 V330 M430 250 H590" />
      <path d="M195 285 C280 215 365 220 430 295 M620 295 C690 225 780 225 850 300" />`,
  };

  return scenes[slug] ?? scenes.creation;
}

function renderSvg(slug: string) {
  const page = pageBySlug.get(slug);
  if (!page) {
    return "";
  }

  const title = escapeXml(page.title);
  const reference = escapeXml(page.bibleReference);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1020" height="1320" viewBox="0 0 1020 1320" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">Printable Bible coloring page for ${reference}</desc>
  <rect width="1020" height="1320" fill="#fff" />
  <rect x="45" y="45" width="930" height="1230" rx="24" fill="none" stroke="#111" stroke-width="5" />
  <g fill="none" stroke="#111" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    ${scene(slug)}
  </g>
  <text x="510" y="110" text-anchor="middle" font-family="Trebuchet MS, Arial, sans-serif" font-size="48" font-weight="700" fill="#111">${title}</text>
  <text x="510" y="166" text-anchor="middle" font-family="Trebuchet MS, Arial, sans-serif" font-size="30" fill="#111">${reference}</text>
  <text x="510" y="1230" text-anchor="middle" font-family="Trebuchet MS, Arial, sans-serif" font-size="22" fill="#111">BibleGames.church</text>
</svg>`;
}

export const GET: APIRoute = ({ params }) => {
  const svg = renderSvg(params.slug ?? "");

  if (!svg) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
};
