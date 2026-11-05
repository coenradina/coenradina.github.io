import type { SpriteFrame } from "./PixelSprite";

// Pixel Astrid, drawn to match the portrait on the character card:
// maroon wavy hair, green top, a small white necklace.
export const ASTRID_PALETTE: Record<string, string> = {
  k: "#0F172A", // outline
  h: "#881337", // hair
  H: "#BE123C", // hair highlight
  s: "#F2C39A", // skin
  S: "#D99A73", // skin shade / closed eyes
  e: "#3B1D0E", // eyes
  m: "#C2410C", // mouth
  g: "#166534", // top
  w: "#FFFFFF", // necklace
  p: "#1E293B", // trousers
  b: "#475569", // shoes
};

const HEAD = [
  "...kkkkkk...",
  "..khhhhhhk..",
  ".khHhhhhhhk.",
  ".khhhhhhhhk.",
  "khhssssssshk",
  "khsesssseshk",
  "khsssmmssshk",
  "khhsssssshhk",
  "khhhkssskhhk",
  "khhkgwwwgkhk",
  ".kkggggggkk.",
];
const BLINK_HEAD = HEAD.map((row, i) => (i === 5 ? "khsSssssSshk" : row));
const BODY = ["kssgggwggssk", "kssggggggssk", ".kkggggggkk."];
const LEGS_STAND = ["..kppppppk..", "..kppkkppk..", "..kppk.kppk.", "..kbbk.kbbk."];
const LEGS_WALK_A = ["..kppppppk..", ".kppk..kppk.", ".kppk..kppk.", ".kbbk..kbbk."];
const LEGS_WALK_B = ["..kppppppk..", "...kppkppk..", "...kppkppk..", "...kbbkbbk.."];

export const ASTRID: Record<"stand" | "blink" | "walkA" | "walkB" | "wave" | "sit", SpriteFrame> = {
  stand: [...HEAD, ...BODY, ...LEGS_STAND],
  blink: [...BLINK_HEAD, ...BODY, ...LEGS_STAND],
  walkA: [...HEAD, ...BODY, ...LEGS_WALK_A],
  walkB: [...HEAD, ...BODY, ...LEGS_WALK_B],
  // Right hand up beside the head
  wave: [
    ...HEAD.slice(0, 6).map((r) => r + "..."),
    "khsssmmssshk.ks",
    "khhsssssshhkkss",
    "khhhkssskhhkks.",
    "khhkgwwwgkhkgk.",
    ".kkggggggkkgk..",
    "kssgggwggggk...",
    "kssggggggk.....",
    ".kkggggggkk....",
    ...LEGS_STAND,
  ],
  // Legs out in front, two rows shorter so she sits lower
  sit: [
    "............",
    "............",
    ...HEAD,
    ...BODY,
    "..kpppppppkk",
    "..kkkkkkkbbk",
  ],
};

// The intruder: a small lime bug with two leg poses.
export const BUG_PALETTE: Record<string, string> = {
  k: "#0F172A",
  l: "#84CC16",
  L: "#4D7C0F",
  w: "#FFFFFF",
  r: "#DC2626",
};

const BUG_TOP = ["k........k", ".k......k.", "..kkkkkk..", ".klllllLk.", "klwklwklLk", "kllllllllk", ".kLrrrrLk."];
export const BUG: SpriteFrame[] = [
  [...BUG_TOP, "k.k.kk.k.k"],
  [...BUG_TOP, ".k.k..k.k."],
];
