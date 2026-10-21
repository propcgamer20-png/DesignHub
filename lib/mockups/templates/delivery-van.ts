import { logo, mockupDoc, onPrimaryLarge, text, truncate } from "@/lib/mockups/kit";
import type { MockupTemplate } from "@/lib/mockups/types";

const W = 1600;
const H = 1200;
const GROUND = 880;

// Side view of a panel van facing right. Every number below is in canvas px.
const REAR = 200;
const FRONT = 1410;
const ROOF = 340;
const SILL = 790;
const WHEEL_Y = 806;
const WHEEL_R = 86;
const ARCH_R = 108;
const REAR_WHEEL_X = 470;
const FRONT_WHEEL_X = 1210;
/** Where the cargo box ends and the cab begins. */
const CAB_X = 1020;
/** The door's rear seam and its front seam. */
const DOOR_REAR = 1085;
const DOOR_FRONT = 1300;

/**
 * The flat part of the side panel: clear of the rear door seam, the roof curve, the wheel arches and the
 * cab. All of the copy stays inside it, and everything that could run past its width is shortened.
 */
export const VAN_PANEL = { x: 290, y: 400, width: 680, height: 280 };

/** The top of the wheel arches: the copy has to end above this line. */
export const VAN_ARCH_TOP = WHEEL_Y - ARCH_R;

const archHalf = Math.sqrt(ARCH_R ** 2 - (WHEEL_Y - SILL) ** 2);
const r1 = (value: number) => Math.round(value * 10) / 10;

/** One wheel arch cut out of the lower edge, drawn from its right end to its left end. */
const arch = (cx: number) => `L${r1(cx + archHalf)} ${SILL} A${ARCH_R} ${ARCH_R} 0 0 0 ${r1(cx - archHalf)} ${SILL}`;

/** The body outline: roof, windscreen, bonnet, front bumper, sill with both wheel arches, and the rear. */
export const VAN_BODY = [
  `M${REAR + 34} ${ROOF}`,
  `H${CAB_X + 60}`,
  `C${CAB_X + 150} ${ROOF} ${CAB_X + 190} ${ROOF + 30} ${CAB_X + 250} ${ROOF + 110}`,
  `L${FRONT - 60} ${ROOF + 190}`,
  `Q${FRONT - 6} ${ROOF + 204} ${FRONT} ${ROOF + 260}`,
  `V${SILL - 20}`,
  `Q${FRONT} ${SILL} ${FRONT - 24} ${SILL}`,
  arch(FRONT_WHEEL_X),
  arch(REAR_WHEEL_X),
  `H${REAR + 20}`,
  `Q${REAR} ${SILL} ${REAR} ${SILL - 20}`,
  `V${ROOF + 34}`,
  `Q${REAR} ${ROOF} ${REAR + 34} ${ROOF}`,
  "Z",
].join(" ");

/** The livery: the brand color across the cargo box, ending in a curve that follows the cab line. */
const LIVERY = `M${REAR - 20} ${ROOF - 20} H${CAB_X + 20} C${CAB_X + 90} ${ROOF + 120} ${CAB_X - 20} ${ROOF + 330} ${CAB_X + 60} ${SILL + 40} H${REAR - 20} Z`;

/** A band in the second brand color along the lower body, below the copy and following the sill. */
const STRIPE = `M${REAR - 20} ${SILL - 100} C${REAR + 340} ${SILL - 120} ${REAR + 640} ${SILL - 70} ${FRONT + 20} ${SILL - 110} V${SILL - 62} C${REAR + 640} ${SILL - 22} ${REAR + 340} ${SILL - 72} ${REAR - 20} ${SILL - 52} Z`;

/** The cab's side window, inside the door seams. */
const WINDOW = `M${DOOR_REAR + 15} ${ROOF + 45} H${DOOR_REAR + 60} C${DOOR_REAR + 112} ${ROOF + 45} ${DOOR_REAR + 142} ${ROOF + 70} ${DOOR_REAR + 176} ${ROOF + 116} L${DOOR_FRONT - 12} ${ROOF + 152} H${DOOR_REAR + 15} Z`;

const wheel = (cx: number, id: string) => `<g>
    <circle cx="${cx}" cy="${WHEEL_Y}" r="${WHEEL_R}" fill="#16171a"/>
    <circle cx="${cx}" cy="${WHEEL_Y}" r="${WHEEL_R - 14}" fill="#2a2c31"/>
    <circle cx="${cx}" cy="${WHEEL_Y}" r="${WHEEL_R - 30}" fill="url(#${id})"/>
    <circle cx="${cx}" cy="${WHEEL_Y}" r="9" fill="#9aa0a8"/>
    ${[0, 72, 144, 216, 288]
      .map((angle) => {
        const radians = (angle * Math.PI) / 180;
        const x = r1(cx + Math.cos(radians) * 30);
        const y = r1(WHEEL_Y + Math.sin(radians) * 30);
        return `<circle cx="${x}" cy="${y}" r="5" fill="#16171a" fill-opacity=".55"/>`;
      })
      .join("")}
  </g>`;

export const deliveryVan: MockupTemplate = {
  id: "delivery-van",
  label: "Delivery van",
  category: "Print",
  description: "The brand on the side of a delivery van, with the logo, name, website and phone number.",
  render(ctx) {
    const { surface, brand, content, mode } = ctx;
    const dark = mode === "dark";
    const on = onPrimaryLarge(ctx);
    // Van paint, glass and rubber are product colors, not brand values.
    const paint = dark ? "#2d2f35" : "#f3f1ed";
    const glass = dark ? "#0c1117" : "#1c2733";
    const road = dark ? "#121316" : "#4a4c52";

    // The copy: logo and name on one line, then the website and the phone number, each shortened to fit.
    const logoSize = 116;
    const nameX = VAN_PANEL.x + logoSize + 30;
    const nameWidth = VAN_PANEL.x + VAN_PANEL.width - nameX;
    const name = truncate(ctx, brand.name, nameWidth, 70, "h");
    const contact = [content.website, content.phone]
      .filter((item) => item.trim())
      .map((item) => truncate(ctx, item.trim(), VAN_PANEL.width, 38, "bb"));
    const top = VAN_PANEL.y;
    const copy = `${logo(ctx, { x: VAN_PANEL.x, y: top, width: logoSize, height: logoSize }, on, "van-logo")}
      ${text(nameX, top + logoSize * 0.7, name, { size: 70, fill: on, font: "h" })}
      <rect x="${VAN_PANEL.x}" y="${top + logoSize + 30}" width="120" height="6" rx="3" fill="${on}" fill-opacity=".55"/>
      ${contact
        .map((line, i) => text(VAN_PANEL.x, top + logoSize + 94 + i * 56, line, { size: 38, fill: on, font: "bb" }))
        .join("")}`;

    const defs = `<clipPath id="van-body"><path d="${VAN_BODY}"/></clipPath>
      <linearGradient id="van-shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".28"/>
        <stop offset=".35" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".8" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".28"/>
      </linearGradient>
      <linearGradient id="van-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${glass}"/>
        <stop offset=".6" stop-color="${glass}"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".2"/>
      </linearGradient>
      <radialGradient id="van-rim-r" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d4d8de"/><stop offset="1" stop-color="#8b9098"/></radialGradient>
      <radialGradient id="van-rim-f" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d4d8de"/><stop offset="1" stop-color="#8b9098"/></radialGradient>
      <linearGradient id="van-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${dark ? surface.surface : surface.background}"/>
        <stop offset="1" stop-color="${dark ? surface.background : surface.surface}"/>
      </linearGradient>
      <radialGradient id="van-glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="${surface.primary}" stop-opacity="${dark ? 0.35 : 0.2}"/>
        <stop offset="1" stop-color="${surface.primary}" stop-opacity="0"/>
      </radialGradient>
      <filter id="van-blur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="16"/></filter>`;

    const scene = `<rect width="${W}" height="${GROUND}" fill="url(#van-wall)"/>
      <circle cx="800" cy="${ROOF + 160}" r="620" fill="url(#van-glow)"/>
      <rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="${road}"/>
      <rect y="${GROUND}" width="${W}" height="4" fill="#fff" fill-opacity="${dark ? 0.1 : 0.25}"/>
      <path d="M0 1050 H${W}" stroke="#fff" stroke-opacity=".28" stroke-width="8" stroke-dasharray="90 70"/>`;

    // The wheels sit behind the body, so the arches cut around them.
    const van = `<ellipse cx="${(REAR + FRONT) / 2}" cy="${GROUND - 6}" rx="${(FRONT - REAR) / 2 + 40}" ry="26" fill="#000" fill-opacity="${dark ? 0.55 : 0.32}" filter="url(#van-blur)"/>
      <circle cx="${REAR_WHEEL_X}" cy="${WHEEL_Y}" r="${ARCH_R}" fill="#0b0c0e"/>
      <circle cx="${FRONT_WHEEL_X}" cy="${WHEEL_Y}" r="${ARCH_R}" fill="#0b0c0e"/>
      ${wheel(REAR_WHEEL_X, "van-rim-r")}
      ${wheel(FRONT_WHEEL_X, "van-rim-f")}
      <path d="${VAN_BODY}" fill="${paint}" filter="url(#soft)"/>
      <g clip-path="url(#van-body)">
        <path d="${LIVERY}" fill="${surface.primary}"/>
        <path d="${STRIPE}" fill="${surface.secondary}"/>
        <rect x="${REAR}" y="${ROOF}" width="${FRONT - REAR}" height="${SILL - ROOF}" fill="url(#van-shade)"/>
      </g>
      ${copy}
      <path d="M${REAR + 60} ${ROOF + 20} V${SILL - 30}" stroke="#000" stroke-opacity=".22" stroke-width="3"/>
      <path d="M${DOOR_REAR} ${ROOF + 8} V${SILL - 18} M${DOOR_FRONT} ${ROOF + 138} V${SILL - 18}" stroke="#000" stroke-opacity=".3" stroke-width="3"/>
      <path d="${WINDOW}" fill="url(#van-glass)" stroke="#000" stroke-opacity=".35" stroke-width="3"/>
      <rect x="${DOOR_FRONT - 66}" y="${ROOF + 232}" width="40" height="9" rx="4.5" fill="#000" fill-opacity=".4"/>
      <rect x="${DOOR_FRONT - 4}" y="${ROOF + 112}" width="26" height="58" rx="9" fill="#16171a"/>
      <rect x="${FRONT - 12}" y="${ROOF + 262}" width="22" height="40" rx="8" fill="#fff" fill-opacity=".9"/>
      <rect x="${FRONT - 34}" y="${SILL - 62}" width="46" height="40" rx="10" fill="#1b1c20"/>
      <rect x="${FRONT - 28}" y="${SILL - 44}" width="40" height="14" rx="6" fill="#fff" fill-opacity=".12"/>
      <rect x="${REAR - 6}" y="${ROOF + 230}" width="14" height="52" rx="6" fill="#d24a3b"/>`;

    return mockupDoc(ctx, W, H, `${scene}${van}`, defs);
  },
};
