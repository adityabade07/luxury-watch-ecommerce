import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ShoppingBag, X, Menu, ArrowRight, Plus, Minus, Check,
  ChevronDown, ChevronRight, Search, Filter, MapPin, Phone, Mail,
  Star, Package, RotateCcw, Shield, Clock, Gem,
} from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "home" | "catalog" | "product" | "cart" | "checkout" | "about" | "contact" | "faq" | "policies";
type Collection = "Heritage" | "Sport" | "Prestige" | "Ladies";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  collection: Collection;
  price: number;
  movement: string;
  caseDiameter: string;
  material: string;
  waterResistance: string;
  image: string;
  altImages: string[];
  description: string;
  features: string[];
  inStock: boolean;
  badge?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "tourbillon-classique",
    name: "Classic Tourbillon",
    subtitle: "Mechanical Mastery",
    collection: "Heritage",
    price: 28500,
    movement: "Manual-wind tourbillon, 72h power reserve",
    caseDiameter: "42mm",
    material: "18K rose gold",
    waterResistance: "30m",
    image: "https://images.unsplash.com/photo-1647738236657-4994defde1cc?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1610897534349-7759782118b9?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=900&h=900&fit=crop&auto=format",
    ],
    description: "The Tourbillon Classique represents the apex of horological artistry. Hand-assembled by a single master watchmaker over 600 hours, each piece embodies the relentless pursuit of mechanical perfection that has defined our maison for over a century.",
    features: ["Hand-finished tourbillon cage", "Sapphire exhibition caseback", "Hand-stitched alligator strap", "Certificate of authenticity", "5-year manufacturer warranty"],
    inStock: true,
    badge: "Signature",
  },
  {
    id: "perpetuel-calendrier",
    name: "Royal Calendar",
    subtitle: "Eternal Precision",
    collection: "Prestige",
    price: 42000,
    movement: "Automatic, perpetual calendar, moon phase",
    caseDiameter: "40mm",
    material: "Platinum 950",
    waterResistance: "50m",
    image: "https://images.unsplash.com/photo-1610897534349-7759782118b9?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1587865501868-36104829d7db?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1647738236657-4994defde1cc?w=900&h=900&fit=crop&auto=format",
    ],
    description: "A horological monument that accounts for the irregular lengths of months and leap years without manual correction until 2100. The perpetual calendar complication remains one of the most coveted achievements in fine watchmaking.",
    features: ["Perpetual calendar correct until 2100", "Accurate astronomical moon phase", "Satin-brushed platinum case", "Hand-guilloché silver dial", "In-house calibre movement"],
    inStock: true,
    badge: "Limited",
  },
  {
    id: "prestige-gmt",
    name: "Prestige GMT",
    subtitle: "World Without Borders",
    collection: "Heritage",
    price: 18750,
    movement: "Automatic, GMT function, 48h power reserve",
    caseDiameter: "41mm",
    material: "Stainless steel & 18K gold",
    waterResistance: "100m",
    image: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1623998021661-dc7555b2213d?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578998323870-83a9a3d609e5?w=900&h=900&fit=crop&auto=format",
    ],
    description: "The Prestige GMT was conceived for those who traverse time zones as effortlessly as borders. A simultaneous reading of two time zones, executed with the understated elegance that defines the Heritage collection.",
    features: ["24-hour GMT hand", "Bi-directional rotating bezel", "Anti-reflective sapphire crystal", "Integrated bracelet design", "Quick-set independent date"],
    inStock: true,
  },
  {
    id: "aqua-profonde",
    name: "Ocean Pro",
    subtitle: "Depths of Excellence",
    collection: "Sport",
    price: 12900,
    movement: "Automatic chronograph, 60h power reserve",
    caseDiameter: "44mm",
    material: "Grade 5 Titanium",
    waterResistance: "500m",
    image: "https://images.unsplash.com/photo-1629581678313-36cf745a9af9?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1549972574-8e3e1ed6a347?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578998323870-83a9a3d609e5?w=900&h=900&fit=crop&auto=format",
    ],
    description: "Engineered for the deep. The Aqua Profonde withstands 50 atmospheres of pressure while maintaining the refined aesthetics expected of a maison of our heritage. Tested rigorously to the standards of professional diving.",
    features: ["500m water resistance", "Helium escape valve", "Unidirectional rotating bezel", "Super-LumiNova C3 indices", "Titanium bracelet & rubber strap"],
    inStock: true,
  },
  {
    id: "solstice-grande",
    name: "Sunrise Grande",
    subtitle: "A New Day, Every Day",
    collection: "Heritage",
    price: 22400,
    movement: "Automatic, day-date, 55h power reserve",
    caseDiameter: "40mm",
    material: "18K yellow gold",
    waterResistance: "50m",
    image: "https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1623998021661-dc7555b2213d?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1610897534349-7759782118b9?w=900&h=900&fit=crop&auto=format",
    ],
    description: "The Solstice Grande pairs an 18K yellow gold case with a champagne dial of exceptional radiance. A celebration of each sunrise, worn by those who approach every day with intention and grace.",
    features: ["Full day-date display", "Champagne sunburst dial", "Diamond-set crown", "President-style bracelet", "22K oscillating micro-rotor"],
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: "lumiere-automatique",
    name: "Lumiere Auto",
    subtitle: "Light Made Timeless",
    collection: "Heritage",
    price: 9800,
    movement: "Automatic, 42h power reserve, 25 jewels",
    caseDiameter: "38mm",
    material: "Stainless steel",
    waterResistance: "50m",
    image: "https://images.unsplash.com/photo-1623998021661-dc7555b2213d?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1615357291590-534b23453de2?w=900&h=900&fit=crop&auto=format",
    ],
    description: "The Lumière Automatique distills our craft to its purest expression. A clean, light-catching dial, a perfectly proportioned case, and an in-house movement that speaks through the crystal-clear exhibition caseback.",
    features: ["Exhibition caseback", "Sunray-brushed dial", "Côtes de Genève decoration", "Mirror-polished lugs", "Visible movement architecture"],
    inStock: true,
  },
  {
    id: "atlas-chronograph",
    name: "Atlas Chrono",
    subtitle: "Every Second Counts",
    collection: "Sport",
    price: 15600,
    movement: "Automatic column-wheel chronograph, 50h",
    caseDiameter: "43mm",
    material: "Stainless steel & black ceramic",
    waterResistance: "200m",
    image: "https://images.unsplash.com/photo-1578998323870-83a9a3d609e5?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1629581678313-36cf745a9af9?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=900&h=900&fit=crop&auto=format",
    ],
    description: "Built for those who measure their victories in fractions of a second. The Atlas Chronographe features a column-wheel mechanism, a tachymeter scale on its ceramic bezel, and a dial machined from a single piece of aluminum.",
    features: ["Column-wheel chronograph", "Ceramic tachymeter bezel", "30-minute & 12-hour counters", "Screw-down crown and pushers", "Flyback reset function"],
    inStock: true,
  },
  {
    id: "meridian-squelette",
    name: "Meridian Skeleton",
    subtitle: "The Soul Laid Bare",
    collection: "Prestige",
    price: 31200,
    movement: "Manual-wind skeleton, 8-day power reserve",
    caseDiameter: "41mm",
    material: "18K white gold",
    waterResistance: "30m",
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1647738236657-4994defde1cc?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1587865501868-36104829d7db?w=900&h=900&fit=crop&auto=format",
    ],
    description: "To look through the Méridian Squelette is to witness centuries of horological knowledge distilled into moving architecture. Each bridge is hand-beveled, anglage-finished, and decorated with circular Côtes de Genève.",
    features: ["Full skeleton movement", "8-day power reserve", "Hand-beveled bridges", "Glashütte ribbing", "Double-face sapphire display"],
    inStock: false,
    badge: "Sold Out",
  },
  {
    id: "equinox-perpetuel",
    name: "Equinox Royal",
    subtitle: "Celestial Harmony",
    collection: "Prestige",
    price: 38900,
    movement: "Automatic, perpetual calendar, moon phase",
    caseDiameter: "42mm",
    material: "18K rose gold",
    waterResistance: "30m",
    image: "https://images.unsplash.com/photo-1587865501868-36104829d7db?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1610897534349-7759782118b9?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=900&h=900&fit=crop&auto=format",
    ],
    description: "The Équinox Perpétuel captures the grand passage of celestial time. A blue enamel moon phase disk accurate to one day every 577 years, paired with a perpetual calendar that anticipates the irregularities of human timekeeping.",
    features: ["Astronomical moon phase", "Grand feu enamel dial", "Perpetual calendar module", "Power reserve indicator", "Leap year indicator"],
    inStock: true,
    badge: "New",
  },
  {
    id: "cortex-ultra-thin",
    name: "Cortex Slim",
    subtitle: "The Art of Restraint",
    collection: "Heritage",
    price: 7400,
    movement: "Ultra-thin automatic, 2.4mm calibre, 36h",
    caseDiameter: "39mm",
    material: "Stainless steel",
    waterResistance: "30m",
    image: "https://images.unsplash.com/photo-1615357291590-534b23453de2?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1623998021661-dc7555b2213d?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=900&h=900&fit=crop&auto=format",
    ],
    description: "At 5.8mm total case height, the Cortex Ultra-Thin disappears beneath a shirt cuff with aristocratic discretion. The movement — just 2.4mm thick — required three years of engineering to achieve without compromise to precision.",
    features: ["5.8mm total case height", "2.4mm movement thickness", "Dressage alligator strap", "Gold-tipped hands", "Minimalist sunburst dial"],
    inStock: true,
  },
  {
    id: "tempest-titanium",
    name: "Tempest Steel",
    subtitle: "Resilience Refined",
    collection: "Sport",
    price: 11200,
    movement: "Automatic, anti-magnetic, 72h power reserve",
    caseDiameter: "42mm",
    material: "Grade 5 titanium",
    waterResistance: "300m",
    image: "https://images.unsplash.com/photo-1556453007-ee036169934b?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1629581678313-36cf745a9af9?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578998323870-83a9a3d609e5?w=900&h=900&fit=crop&auto=format",
    ],
    description: "Forged from Grade 5 titanium — the same alloy used in aerospace applications — the Tempest weighs just 68 grams on the wrist. Anti-magnetic to 1,000 gauss, it thrives where lesser timepieces falter.",
    features: ["Grade 5 titanium construction", "Anti-magnetic to 1,000 gauss", "Titanium & rubber bracelet", "Luminescent dial treatment", "Power reserve display"],
    inStock: true,
  },
  {
    id: "celestia-diamant",
    name: "Celestia Diamond",
    subtitle: "Constellation of Light",
    collection: "Ladies",
    price: 54000,
    movement: "Automatic, 35h power reserve",
    caseDiameter: "34mm",
    material: "18K white gold & diamonds",
    waterResistance: "30m",
    image: "https://images.unsplash.com/photo-1579543768549-96d37c1df78f?w=900&h=900&fit=crop&auto=format",
    altImages: [
      "https://images.unsplash.com/photo-1618215650201-8d552591218d?w=900&h=900&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?w=900&h=900&fit=crop&auto=format",
    ],
    description: "The Célestia Diamant is a wearable constellation. One hundred and forty-two VS1 diamonds are set by hand across the case and bezel, each chosen for its exceptional clarity and fire. The mother-of-pearl dial shifts in color with each turn of light.",
    features: ["142 VS1 diamonds", "Mother-of-pearl dial", "Diamond-set bezel", "White gold crown", "Satin Milanese bracelet"],
    inStock: true,
    badge: "Exclusive",
  },
];

const COLLECTIONS = ["Heritage", "Sport", "Prestige", "Ladies"] as const;

const FAQS = [
  {
    q: "How do I authenticate my timepiece?",
    a: "Every Rolexs timepiece comes with a numbered certificate of authenticity, a unique caseback engraving, and a tamper-evident holographic seal. You may also register your piece in our online database using the serial number found on the caseback.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express), wire transfers, and certified bank drafts. For purchases above $20,000 we also offer flexible financing plans through our partner institutions at preferred rates.",
  },
  {
    q: "How long does shipping take?",
    a: "All timepieces are shipped via insured, signature-required courier. Domestic orders arrive within 2–3 business days. International shipments typically take 5–7 business days and include all necessary customs documentation.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day return window from the date of delivery. Timepieces must be returned in original, unworn condition with all original packaging, certificates, and accessories. Custom-engraved pieces are non-returnable.",
  },
  {
    q: "Do you offer custom engraving?",
    a: "Yes. We offer bespoke caseback engraving in a variety of scripts and styles. Please contact our client services team to discuss your requirements. Engraving typically adds 5–7 business days to your delivery timeline.",
  },
  {
    q: "How should I care for my watch?",
    a: "Avoid exposing your timepiece to extreme temperatures, strong magnetic fields, or harsh chemicals. For mechanical movements, we recommend annual timing checks. Sport models should have their gaskets inspected every two years to maintain water resistance ratings.",
  },
  {
    q: "What warranty do you offer?",
    a: "All Rolexs timepieces carry a 5-year manufacturer warranty covering defects in materials and workmanship. This warranty does not cover normal wear, accidental damage, or servicing performed by unauthorized watchmakers.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to over 60 countries worldwide. All international orders include full insurance coverage and are accompanied by the appropriate export documentation. Import duties and local taxes are the responsibility of the recipient.",
  },
  {
    q: "Can I finance my purchase?",
    a: "Yes. We partner with three premiere financial institutions to offer tailored financing for qualified buyers. Terms of 12, 24, or 36 months are available on purchases over $5,000. Please speak with a client advisor to explore your options.",
  },
  {
    q: "How do I schedule a service appointment?",
    a: "Authorized service is available at our Geneva atelier and through a network of certified service centers worldwide. Use our contact form or call our client services line to arrange a consultation. Complimentary servicing is included for the first 5 years.",
  },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getPathForPage(page: Page, id?: string) {
  switch (page) {
    case "catalog":
      return "/collections";
    case "product":
      return id ? `/products/${id}` : "/collections";
    case "cart":
      return "/cart";
    case "checkout":
      return "/checkout";
    case "about":
      return "/about";
    case "contact":
      return "/contact";
    case "faq":
      return "/faq";
    case "policies":
      return "/policies";
    case "home":
    default:
      return "/";
  }
}

function getPageFromPath(pathname: string): Page {
  if (pathname === "/collections") return "catalog";
  if (pathname.startsWith("/products/")) return "product";
  if (pathname === "/cart") return "cart";
  if (pathname === "/checkout") return "checkout";
  if (pathname === "/about") return "about";
  if (pathname === "/contact") return "contact";
  if (pathname === "/faq") return "faq";
  if (pathname === "/policies") return "policies";
  return "home";
}

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.4, ease: [0.25, 0, 0, 1] },
};

function trackAnalyticsEvent(action: string, params: Record<string, unknown> = {}) {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId || typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", action, params);
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ text }: { text: string }) {
  const isSoldOut = text === "Sold Out";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase font-mono-label ${
        isSoldOut
          ? "bg-muted text-muted-foreground border border-border"
          : "bg-primary text-primary-foreground"
      }`}
    >
      {text}
    </span>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

function NavBar({
  cartCount,
  onNavigate,
  currentPage,
}: {
  cartCount: number;
  onNavigate: (p: Page) => void;
  currentPage: Page;
}) {
  const [open, setOpen] = useState(false);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Collections", page: "catalog" },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex flex-col items-start gap-0 group"
        >
          <span
            className="text-xs tracking-[0.5em] uppercase text-primary font-mono-label group-hover:opacity-80 transition-opacity"
          >
            ROLEXS
          </span>
          <span className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase font-mono-label -mt-0.5">
            Maison de Haute Horlogerie
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              key={l.page}
              onClick={() => onNavigate(l.page)}
              className={`text-[11px] tracking-[0.2em] uppercase transition-colors font-mono-label ${
                currentPage === l.page
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("cart")}
            className="relative text-foreground hover:text-primary transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-mono-label flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((l) => (
                <button
                  key={l.page}
                  onClick={() => { onNavigate(l.page); setOpen(false); }}
                  className="text-left text-[11px] tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors font-mono-label py-1"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <p className="text-xs tracking-[0.5em] text-primary font-mono-label uppercase mb-1">ROLEXS</p>
            <p className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase font-mono-label mb-4">
              Maison de Haute Horlogerie
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Founded in Geneva in 1892, Rolexs has crafted exceptional timepieces for those who understand that true luxury is measured in centuries, not seasons.
            </p>
          </div>
          {/* Links */}
          {[
            {
              title: "Shop",
              links: [
                { label: "All Collections", page: "catalog" as Page },
                { label: "Heritage", page: "catalog" as Page },
                { label: "Sport", page: "catalog" as Page },
                { label: "Prestige", page: "catalog" as Page },
                { label: "Ladies", page: "catalog" as Page },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "Our Story", page: "about" as Page },
                { label: "Craftsmanship", page: "about" as Page },
                { label: "Contact Us", page: "contact" as Page },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "FAQ", page: "faq" as Page },
                { label: "Shipping Policy", page: "policies" as Page },
                { label: "Returns", page: "policies" as Page },
                { label: "Warranty", page: "policies" as Page },
                { label: "Privacy Policy", page: "policies" as Page },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-mono-label mb-4">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => onNavigate(l.page)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono-label">
            © 2024 Rolexs SA, Geneva. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["VISA", "MC", "AMEX", "WIRE"].map((m) => (
              <span key={m} className="text-[9px] tracking-widest text-muted-foreground font-mono-label border border-border px-2 py-1">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onView,
  onAdd,
}: {
  product: Product;
  onView: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="group cursor-pointer rounded-[2px] border border-border/80 bg-card/70 p-3 shadow-[0_8px_25px_rgba(45,33,20,0.04)] transition-transform duration-300 hover:-translate-y-1">
      <div
        className="relative mb-4 aspect-square overflow-hidden border border-border/70 bg-[linear-gradient(135deg,#f5ebdc_0%,#efe0c7_100%)]"
        onClick={onView}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent" />
        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge text={product.badge} />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="text-xs tracking-[0.2em] text-muted-foreground font-mono-label uppercase">
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-mono-label">
          {product.collection}
        </p>
        <h3
          className="font-display text-lg text-foreground leading-snug cursor-pointer hover:text-primary transition-colors"
          onClick={onView}
        >
          {product.name}
        </h3>
        <p className="text-xs tracking-wide text-muted-foreground">{product.subtitle}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-mono-label text-sm tracking-wide text-foreground">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={onAdd}
            disabled={!product.inStock}
            className="border border-border px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-mono-label text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {product.inStock ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

function HomePage({
  onNavigate,
  onAddToCart,
}: {
  onNavigate: (p: Page, id?: string) => void;
  onAddToCart: (p: Product) => void;
}) {
  const featured = PRODUCTS.filter((p) => p.badge === "Signature" || p.badge === "Bestseller" || p.badge === "New" || p.badge === "Limited").slice(0, 4);

  const collectionCards = [
    {
      name: "Heritage",
      desc: "Classic dress and complications rooted in tradition.",
      image: "https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?w=700&h=900&fit=crop&auto=format",
    },
    {
      name: "Sport",
      desc: "Precision instruments built for the extraordinary.",
      image: "https://images.unsplash.com/photo-1629581678313-36cf745a9af9?w=700&h=900&fit=crop&auto=format",
    },
    {
      name: "Prestige",
      desc: "The pinnacle of complication and craft.",
      image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=700&h=900&fit=crop&auto=format",
    },
    {
      name: "Ladies",
      desc: "Feminine mastery of time and brilliance.",
      image: "https://images.unsplash.com/photo-1579543768549-96d37c1df78f?w=700&h=900&fit=crop&auto=format",
    },
  ];

  return (
    <motion.div {...fade} className="pt-16">
      {/* Hero */}
      <section className="relative h-screen flex items-end overflow-hidden bg-background">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1729078946289-92397e8d0b58?w=1600&h=1000&fit=crop&auto=format"
            alt="Luxury watch close-up"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0, 0, 1] }}
          >
            <p className="text-[10px] tracking-[0.4em] text-primary font-mono-label uppercase mb-6">
              Since 1892 • Geneva
            </p>
            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[1.05] mb-8 max-w-3xl"
            >
              Luxury watches<br />
              <em className="not-italic text-primary">made for everyday pride.</em>
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => onNavigate("catalog")}
                className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary/90 transition-colors"
              >
                Explore Watches
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onNavigate("about")}
                className="text-[11px] tracking-[0.2em] uppercase font-mono-label text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-muted-foreground pb-0.5"
              >
                Our Story
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="border-y border-border bg-card overflow-hidden py-3">
        <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {Array(3).fill([
            "Heritage", "Sport", "Prestige", "Ladies",
            "Since 1892", "Geneva", "Swiss Made", "Haute Horlogerie",
          ]).flat().map((t, i) => (
            <span key={i} className="text-[9px] tracking-[0.3em] text-muted-foreground font-mono-label uppercase shrink-0">
              {t}
              <span className="mx-6 text-primary">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-2">Popular Picks</p>
            <h2 className="font-display text-4xl text-foreground">Best Watches for You</h2>
          </div>
          <button
            onClick={() => onNavigate("catalog")}
            className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors uppercase font-mono-label"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={() => onNavigate("product", p.id)}
              onAdd={() => onAddToCart(p)}
            />
          ))}
        </div>
      </section>

      {/* Collections grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-2">Curated for You</p>
          <h2 className="font-display text-4xl text-foreground">Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collectionCards.map((col) => (
            <button
              key={col.name}
              onClick={() => onNavigate("catalog")}
              className="group relative overflow-hidden aspect-[3/4] bg-card text-left"
            >
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="font-display text-xl text-foreground mb-1">{col.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">{col.desc}</p>
                <div className="flex items-center gap-1 mt-2 text-primary">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-mono-label">Explore</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-card">
            <img
              src="https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=800&h=1000&fit=crop&auto=format"
              alt="Person wearing luxury watch"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border px-4 py-3">
              <p className="text-[9px] tracking-[0.3em] text-primary font-mono-label uppercase">Since</p>
              <p className="font-display text-3xl text-foreground">1892</p>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase">Why People Trust Us</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
              A century of careful craft and honest quality.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In our Geneva workshop, every watch is made with care by skilled hands. We believe quality should feel personal, dependable, and easy to trust.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From the first detail to the final check, each timepiece is handled with attention and pride. That is why our watches are loved by people who value timeless style and lasting quality.
            </p>
            <button
              onClick={() => onNavigate("about")}
              className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase font-mono-label text-primary hover:gap-5 transition-all"
            >
              Our Story <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card border-t border-b border-border py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-10 text-center">Testimonials</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The Tourbillon Classique is the finest thing I own. Its presence on my wrist is a daily reminder that true mastery is patient.",
                name: "Alexandre Moreau",
                title: "Collector, Paris",
              },
              {
                quote: "I wore the Prestige GMT across fourteen time zones in a single week. It never missed a beat. The craftsmanship is simply without peer.",
                name: "James Whitfield",
                title: "Managing Director, London",
              },
              {
                quote: "A gift for a milestone, the Célestia Diamant exceeded every expectation. The service from first contact to delivery was impeccable.",
                name: "Priya Mehta",
                title: "Principal, New York",
              },
            ].map((t, i) => (
              <div key={i} className="space-y-4 border-l border-primary pl-6">
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} size={10} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-display italic text-lg text-foreground leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm text-foreground font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-mono-label tracking-wide">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Package size={20} strokeWidth={1.5} />, title: "Complimentary Shipping", desc: "Fully insured, door to door" },
            { icon: <RotateCcw size={20} strokeWidth={1.5} />, title: "30-Day Returns", desc: "No questions asked" },
            { icon: <Shield size={20} strokeWidth={1.5} />, title: "5-Year Warranty", desc: "On every timepiece" },
            { icon: <Gem size={20} strokeWidth={1.5} />, title: "Certificate of Authenticity", desc: "Included with every watch" },
          ].map((s) => (
            <div key={s.title} className="text-center space-y-3">
              <div className="flex justify-center text-primary">{s.icon}</div>
              <p className="text-sm font-medium text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-secondary/20 py-16">
        <div className="max-w-xl mx-auto px-6 text-center space-y-6">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase">Stay Updated</p>
          <h2 className="font-display text-3xl text-foreground">
            Early access to new arrivals and private events.
          </h2>
          <div className="flex gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-primary-foreground px-6 text-[10px] tracking-[0.15em] uppercase font-mono-label hover:bg-primary/90 transition-colors whitespace-nowrap">
              Join
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ─── CatalogPage ──────────────────────────────────────────────────────────────

function CatalogPage({
  onNavigate,
  onAddToCart,
}: {
  onNavigate: (p: Page, id?: string) => void;
  onAddToCart: (p: Product) => void;
}) {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(60000);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const toggleCollection = (c: string) => {
    setSelectedCollections((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (selectedCollections.length > 0 && !selectedCollections.includes(p.collection)) return false;
      if (inStockOnly && !p.inStock) return false;
      if (p.price > maxPrice) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.collection.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [selectedCollections, inStockOnly, maxPrice, searchQuery, sortBy]);

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-mono-label mb-4">Collection</p>
        <div className="space-y-2.5">
          {COLLECTIONS.map((c) => (
            <label key={c} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                  selectedCollections.includes(c) ? "border-primary bg-primary" : "border-border group-hover:border-primary"
                }`}
                onClick={() => toggleCollection(c)}
              >
                {selectedCollections.includes(c) && <Check size={10} className="text-primary-foreground" />}
              </div>
              <span
                className="text-sm text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer"
                onClick={() => toggleCollection(c)}
              >
                {c}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-mono-label mb-4">
          Max Price: {formatPrice(maxPrice)}
        </p>
        <input
          type="range"
          min={5000}
          max={60000}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#c9a84c]"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono-label mt-1">
          <span>$5K</span><span>$60K</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-4 h-4 border flex items-center justify-center transition-colors ${
              inStockOnly ? "border-primary bg-primary" : "border-border group-hover:border-primary"
            }`}
            onClick={() => setInStockOnly(!inStockOnly)}
          >
            {inStockOnly && <Check size={10} className="text-primary-foreground" />}
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors" onClick={() => setInStockOnly(!inStockOnly)}>
            In Stock Only
          </span>
        </label>
      </div>

      {(selectedCollections.length > 0 || inStockOnly || maxPrice < 60000) && (
        <button
          onClick={() => { setSelectedCollections([]); setInStockOnly(false); setMaxPrice(60000); }}
          className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors font-mono-label"
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <motion.div {...fade} className="pt-16">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-2">All Timepieces</p>
          <h1 className="font-display text-4xl text-foreground">Collections</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-mono-label text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-2"
            >
              <Filter size={12} />
              Filters
            </button>
            <p className="text-xs text-muted-foreground font-mono-label">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border border-border pl-8 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors w-40 md:w-56"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-card border border-border px-3 py-2 text-[11px] text-muted-foreground font-mono-label focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar filters */}
          <aside className="hidden md:block w-52 shrink-0">
            <FilterPanel />
          </aside>

          {/* Mobile filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden mb-6 border border-border p-4 bg-card"
              >
                <FilterPanel />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-muted-foreground mb-2">No watches found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onView={() => onNavigate("product", p.id)}
                    onAdd={() => onAddToCart(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── ProductDetailPage ────────────────────────────────────────────────────────

function ProductDetailPage({
  productId,
  onNavigate,
  onAddToCart,
}: {
  productId: string;
  onNavigate: (p: Page, id?: string) => void;
  onAddToCart: (p: Product) => void;
}) {
  const product = PRODUCTS.find((p) => p.id === productId)!;
  const [activeImg, setActiveImg] = useState(0);
  const allImages = [product.image, ...product.altImages];
  const related = PRODUCTS.filter((p) => p.collection === product.collection && p.id !== product.id).slice(0, 3);

  if (!product) return null;

  return (
    <motion.div {...fade} className="pt-16">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-mono-label text-muted-foreground uppercase tracking-widest">
          <button onClick={() => onNavigate("home")} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight size={10} />
          <button onClick={() => onNavigate("catalog")} className="hover:text-foreground transition-colors">Collections</button>
          <ChevronRight size={10} />
          <span className="text-primary">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden border border-border/70 bg-[linear-gradient(135deg,#f5ebdc_0%,#efe0c7_100%)] p-4">
              <img
                src={allImages[activeImg]}
                alt={product.name}
                className="h-full w-full object-contain transition-opacity duration-300"
              />
            </div>
            <div className="flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 overflow-hidden border bg-[linear-gradient(135deg,#f5ebdc_0%,#efe0c7_100%)] p-1 transition-colors ${
                    activeImg === i ? "border-primary" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              {product.badge && <Badge text={product.badge} />}
              <p className="text-[10px] tracking-[0.3em] text-primary uppercase font-mono-label mt-3 mb-2">
                {product.collection} Collection
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-muted-foreground tracking-wide">{product.subtitle}</p>
            </div>

            <p className="font-mono-label text-3xl text-foreground tracking-wide">
              {formatPrice(product.price)}
            </p>

            <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>

            {/* Features */}
            <div>
              <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-mono-label mb-3">Features</p>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 shrink-0">◆</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specs table */}
            <div className="border-t border-b border-border py-4 space-y-3">
              {[
                { label: "Movement", value: product.movement },
                { label: "Case Diameter", value: product.caseDiameter },
                { label: "Material", value: product.material },
                { label: "Water Resistance", value: product.waterResistance },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-mono-label text-[11px] tracking-wide uppercase">{s.label}</span>
                  <span className="text-foreground">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <div className="space-y-3">
              <button
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className="w-full bg-primary text-primary-foreground py-4 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? "Add to Cart" : "Currently Unavailable"}
              </button>
              <button
                onClick={() => onNavigate("contact")}
                className="w-full border border-border text-muted-foreground py-4 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:border-primary hover:text-foreground transition-colors"
              >
                Speak with an Advisor
              </button>
            </div>

            {/* Assurances */}
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
              {[
                { icon: <Package size={14} />, label: "Free Shipping" },
                { icon: <Shield size={14} />, label: "5-Year Warranty" },
                { icon: <RotateCcw size={14} />, label: "30-Day Returns" },
              ].map((a) => (
                <div key={a.label} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="text-primary">{a.icon}</span>
                  <span className="text-[9px] tracking-[0.1em] text-muted-foreground uppercase font-mono-label">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-border pt-16">
            <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-2">You May Also Like</p>
            <h2 className="font-display text-3xl text-foreground mb-8">From the {product.collection} Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onView={() => onNavigate("product", p.id)}
                  onAdd={() => onAddToCart(p)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── CartPage ─────────────────────────────────────────────────────────────────

function CartPage({
  cart,
  onNavigate,
  onUpdate,
  onRemove,
}: {
  cart: CartItem[];
  onNavigate: (p: Page, id?: string) => void;
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <motion.div {...fade} className="pt-16">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-2">Your Selection</p>
          <h1 className="font-display text-4xl text-foreground">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-muted-foreground" />
            <div>
              <h2 className="font-display text-3xl text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground">Discover our exceptional timepieces.</p>
            </div>
            <button
              onClick={() => onNavigate("catalog")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary/90 transition-colors"
            >
              Explore Watches <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-0 divide-y divide-border">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-6 py-6">
                  <div
                    className="w-24 h-24 shrink-0 overflow-hidden bg-card cursor-pointer"
                    onClick={() => onNavigate("product", item.product.id)}
                  >
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-mono-label mb-1">
                      {item.product.collection}
                    </p>
                    <h3
                      className="font-display text-lg text-foreground leading-tight cursor-pointer hover:text-primary transition-colors"
                      onClick={() => onNavigate("product", item.product.id)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.product.material} · {item.product.caseDiameter}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => item.quantity > 1 ? onUpdate(item.product.id, item.quantity - 1) : onRemove(item.product.id)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-mono-label">{item.quantity}</span>
                        <button
                          onClick={() => onUpdate(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono-label text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => onRemove(item.product.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-6 space-y-4 sticky top-24">
                <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-mono-label">Order Summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-mono-label">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-mono-label">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Insurance</span>
                    <span className="text-primary font-mono-label">Included</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="text-foreground font-medium">Total</span>
                  <span className="font-mono-label text-lg text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <button
                  onClick={() => onNavigate("checkout")}
                  className="w-full bg-primary text-primary-foreground py-4 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => onNavigate("catalog")}
                  className="w-full text-center text-[10px] tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors uppercase font-mono-label"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── CheckoutPage ─────────────────────────────────────────────────────────────

function CheckoutPage({
  cart,
  onNavigate,
  onOrderComplete,
}: {
  cart: CartItem[];
  onNavigate: (p: Page) => void;
  onOrderComplete: () => void;
}) {
  const [step, setStep] = useState(1);
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "Switzerland",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canAdvance = () => {
    if (step === 1) return form.firstName && form.lastName && form.email;
    if (step === 2) return form.address && form.city && form.zip;
    if (step === 3) return form.cardName && form.cardNumber && form.expiry && form.cvv;
    return true;
  };

  const handleNext = () => {
    if (step < 3) { setStep(step + 1); return; }
    setPlaced(true);
    onOrderComplete();
  };

  const inputClass =
    "w-full bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  if (placed) {
    return (
      <motion.div {...fade} className="pt-16 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 border border-primary flex items-center justify-center mx-auto">
            <Check size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-foreground mb-3">Order Confirmed</h1>
            <p className="text-muted-foreground leading-relaxed">
              Thank you for your acquisition. Your timepiece will be prepared in our Geneva atelier and dispatched within 2 business days via insured courier. You will receive a confirmation at {form.email || "your email"}.
            </p>
          </div>
          <div className="bg-card border border-border p-6 space-y-3 text-left">
            <p className="text-[10px] tracking-[0.2em] text-primary font-mono-label uppercase">Order Reference</p>
            <p className="font-mono-label text-foreground text-lg tracking-widest">
              HOR-{Math.random().toString(36).slice(2, 8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary/90 transition-colors"
          >
            Return Home <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    );
  }

  const steps = ["Contact", "Shipping", "Payment"];

  return (
    <motion.div {...fade} className="pt-16">
      <div className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="font-display text-4xl text-foreground mb-6">Checkout</h1>
          {/* Progress */}
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono-label transition-colors ${
                      i + 1 < step
                        ? "bg-primary text-primary-foreground"
                        : i + 1 === step
                        ? "border border-primary text-primary"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {i + 1 < step ? <Check size={10} /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] tracking-[0.15em] uppercase font-mono-label ${
                      i + 1 === step ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-px mx-3 ${i + 1 < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-foreground mb-6">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input className={inputClass} placeholder="First name" value={form.firstName} onChange={update("firstName")} />
                <input className={inputClass} placeholder="Last name" value={form.lastName} onChange={update("lastName")} />
              </div>
              <input className={inputClass} type="email" placeholder="Email address" value={form.email} onChange={update("email")} />
              <input className={inputClass} type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={update("phone")} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-foreground mb-6">Shipping Address</h2>
              <input className={inputClass} placeholder="Street address" value={form.address} onChange={update("address")} />
              <div className="grid grid-cols-2 gap-4">
                <input className={inputClass} placeholder="City" value={form.city} onChange={update("city")} />
                <input className={inputClass} placeholder="State / Province" value={form.state} onChange={update("state")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input className={inputClass} placeholder="Postal code" value={form.zip} onChange={update("zip")} />
                <select className={inputClass} value={form.country} onChange={update("country")}>
                  {["Switzerland", "United States", "United Kingdom", "France", "Germany", "Japan", "Singapore", "UAE"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-foreground mb-6">Payment Details</h2>
              <div className="bg-card border border-border p-4 flex items-center gap-3 mb-2">
                <Shield size={14} className="text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your payment information is encrypted with 256-bit SSL and processed securely.
                </p>
              </div>
              <input className={inputClass} placeholder="Cardholder name" value={form.cardName} onChange={update("cardName")} />
              <input className={inputClass} placeholder="Card number" value={form.cardNumber} onChange={update("cardNumber")} maxLength={19} />
              <div className="grid grid-cols-2 gap-4">
                <input className={inputClass} placeholder="MM / YY" value={form.expiry} onChange={update("expiry")} maxLength={7} />
                <input className={inputClass} placeholder="CVV" value={form.cvv} onChange={update("cvv")} maxLength={4} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-[11px] tracking-[0.2em] uppercase font-mono-label text-muted-foreground hover:text-foreground transition-colors border border-border px-6 py-3.5"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className="flex-1 bg-primary text-primary-foreground py-3.5 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {step < 3 ? "Continue" : "Place Order"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border p-6 space-y-4 sticky top-24">
            <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-mono-label">Order Summary</p>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-12 h-12 shrink-0 overflow-hidden bg-background">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{item.product.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono-label">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-mono-label text-foreground shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono-label">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping & Insurance</span>
                <span className="text-primary font-mono-label">Complimentary</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-medium">
              <span className="text-foreground">Total</span>
              <span className="font-mono-label text-lg text-foreground">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── AboutPage ────────────────────────────────────────────────────────────────

function AboutPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const values = [
    { title: "Precision", desc: "Every calibre is regulated to ±2 seconds per day — a standard we have held since the founding of our maison." },
    { title: "Continuity", desc: "Our head watchmaker, Édouard Favre, is the fourth generation of his family to hold that role at Rolexs." },
    { title: "Restraint", desc: "We produce fewer than 800 timepieces per year. Volume would compromise what cannot be compromised." },
    { title: "Integrity", desc: "Every component used in our movements is manufactured within our Geneva workshops. Zero outsourcing." },
  ];

  return (
    <motion.div {...fade} className="pt-16">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=1600&h=900&fit=crop&auto=format"
            alt="Watchmaker at work"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-3">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight">
            A Maison of<br />
            <em className="not-italic text-primary">Absolute Devotion</em>
          </h1>
        </div>
      </section>

      {/* History */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase">Since 1892</p>
            <h2 className="font-display text-4xl text-foreground">Founded on a single belief: that time deserves to be beautiful.</h2>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              In 1892, Henri-Louis Moreau established a small atelier on the Rue de la Paix in Geneva with a conviction that mechanical watchmaking was, above all else, an art form. His first creation — a pocket watch with a hand-painted enamel dial — sold to a Swiss banker for the equivalent of six months wages. It was not the price that mattered, but the principle: that a beautifully made instrument could command extraordinary devotion.
            </p>
            <p>
              Today, Rolexs occupies the same address on the Rue de la Paix, though the workshop has expanded through six neighboring buildings. We have never moved. We have never been acquired. We have never compromised.
            </p>
            <p>
              Our current collection of twelve references represents over four decades of development, each piece a deliberate evolution of the last. When we introduce a new complication, we introduce it because we have mastered it — not because the market has asked for it.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-10">Milestones</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { year: "1892", event: "Founded in Geneva by Henri-Louis Moreau" },
              { year: "1921", event: "First in-house tourbillon movement completed" },
              { year: "1967", event: "Introduction of the Heritage collection" },
              { year: "2008", event: "Maison awarded the Grand Prix d'Horlogerie" },
            ].map((m) => (
              <div key={m.year} className="border-l border-primary pl-4">
                <p className="font-mono-label text-2xl text-primary mb-2">{m.year}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-10">Our Principles</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {values.map((v) => (
            <div key={v.title} className="space-y-3">
              <h3 className="font-display text-2xl text-foreground">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card py-16">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="font-display text-4xl text-foreground">Ready to find your perfect watch?</h2>
          <p className="text-muted-foreground">Explore timeless watches made with care, comfort, and style in mind.</p>
          <button
            onClick={() => onNavigate("catalog")}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary/90 transition-colors"
          >
            Explore Collections <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </motion.div>
  );
}

// ─── ContactPage ──────────────────────────────────────────────────────────────

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const u = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputClass =
    "w-full bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <motion.div {...fade} className="pt-16">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-2">Get in Touch</p>
          <h1 className="font-display text-4xl text-foreground">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          {sent ? (
            <div className="space-y-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center">
                <Check size={16} className="text-primary" />
              </div>
              <h2 className="font-display text-3xl text-foreground">Message Received</h2>
              <p className="text-muted-foreground">A member of our client services team will respond within one business day. For urgent enquiries, please call our Geneva atelier directly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="font-display text-3xl text-foreground mb-6">Send a Message</h2>
              <div className="grid grid-cols-2 gap-4">
                <input className={inputClass} placeholder="Your name" value={form.name} onChange={u("name")} />
                <input className={inputClass} type="email" placeholder="Email address" value={form.email} onChange={u("email")} />
              </div>
              <select className={inputClass} value={form.subject} onChange={u("subject")}>
                <option value="">Select a subject</option>
                <option>Purchase Inquiry</option>
                <option>Service & Maintenance</option>
                <option>Authentication</option>
                <option>Custom Commission</option>
                <option>General Inquiry</option>
              </select>
              <textarea
                className={`${inputClass} resize-none h-36`}
                placeholder="Your message..."
                value={form.message}
                onChange={u("message")}
              />
              <button
                onClick={() => { if (form.name && form.email && form.message) setSent(true); }}
                className="w-full bg-primary text-primary-foreground py-4 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary/90 transition-colors"
              >
                Send Message
              </button>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-3xl text-foreground mb-6">Our Atelier</h2>
            <div className="space-y-5">
              {[
                { icon: <MapPin size={16} strokeWidth={1.5} />, label: "Address", value: "14, Rue de la Paix\nGeneva 1204, Switzerland" },
                { icon: <Phone size={16} strokeWidth={1.5} />, label: "Telephone", value: "+41 22 310 0892" },
                { icon: <Mail size={16} strokeWidth={1.5} />, label: "Email", value: "clients@rolexs.ch" },
                { icon: <Clock size={16} strokeWidth={1.5} />, label: "Hours", value: "Monday–Friday: 9:00–18:00\nSaturday: 10:00–16:00" },
              ].map((c) => (
                <div key={c.label} className="flex gap-4">
                  <span className="text-primary mt-0.5 shrink-0">{c.icon}</span>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-mono-label uppercase mb-1">{c.label}</p>
                    <p className="text-sm text-foreground whitespace-pre-line">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border p-6">
            <p className="text-[10px] tracking-[0.2em] text-primary font-mono-label uppercase mb-3">Private Appointments</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For a more personal experience, we invite you to schedule a private viewing in our salon. Our specialists will prepare a curated selection based on your interests and guide you through each timepiece.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── FAQPage ──────────────────────────────────────────────────────────────────

function FAQPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <motion.div {...fade} className="pt-16">
      <div className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-2">Frequently Asked</p>
          <h1 className="font-display text-4xl text-foreground">Questions & Answers</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="divide-y divide-border">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className={`font-display text-lg transition-colors ${open === i ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground shrink-0 ml-4 transition-transform ${open === i ? "rotate-180 text-primary" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-card border border-border p-8 text-center space-y-4">
          <p className="font-display text-2xl text-foreground">Still have questions?</p>
          <p className="text-sm text-muted-foreground">Our client advisors are available Monday through Friday, 9:00–18:00 CET.</p>
          <button
            onClick={() => onNavigate("contact")}
            className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-mono-label hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Contact Us <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PoliciesPage ─────────────────────────────────────────────────────────────

function PoliciesPage() {
  const [tab, setTab] = useState(0);

  const tabs = [
    { title: "Shipping", content: [
      { heading: "Delivery Methods", body: "All timepieces are dispatched via fully insured, signature-required courier. We partner exclusively with Brink's Global Services and Malca-Amit for international shipments, ensuring the highest standards of security." },
      { heading: "Delivery Timelines", body: "Switzerland and EU: 2–3 business days. North America and United Kingdom: 3–5 business days. Asia Pacific and Middle East: 5–7 business days. All delivery estimates begin from the day of dispatch from our Geneva atelier." },
      { heading: "Shipping Costs", body: "Complimentary fully insured shipping is included on all orders. There are no additional charges for special handling, insurance, or signature requirements." },
      { heading: "Customs & Import Duties", body: "International orders may be subject to customs duties and local import taxes. These charges are the sole responsibility of the recipient and are not included in the purchase price. We provide all required documentation to facilitate customs clearance." },
    ]},
    { title: "Returns", content: [
      { heading: "Return Window", body: "We accept returns within 30 calendar days from the confirmed delivery date. The timepiece must be returned in original, unworn condition with all original packaging, certificates, straps, and accessories." },
      { heading: "Non-Returnable Items", body: "Timepieces that have been worn, resized, engraved, or otherwise personalized are not eligible for return. Special commission pieces and limited editions designated as final sale are also excluded." },
      { heading: "Return Process", body: "To initiate a return, contact our client services team at clients@rolexs.ch with your order reference number. We will arrange insured collection from your address at no cost. Refunds are processed within 7 business days of receipt and inspection." },
      { heading: "Exchanges", body: "We are pleased to facilitate exchanges within the same return window. If the replacement timepiece is of greater value, the difference must be settled at time of exchange. If of lesser value, a refund for the difference will be issued." },
    ]},
    { title: "Warranty", content: [
      { heading: "Coverage Period", body: "Every Rolexs timepiece is protected by a 5-year manufacturer warranty from the date of purchase, registered to the original purchaser." },
      { heading: "What Is Covered", body: "The warranty covers defects in materials and workmanship under normal use, including movement malfunction not arising from misuse, water infiltration resulting from defective case sealing, and defects in case or bracelet finishing." },
      { heading: "What Is Not Covered", body: "The warranty does not cover normal wear and aging, cosmetic damage from daily use, damage from accidents or unauthorized modification, battery replacement (for quartz models), or servicing performed by unauthorized watchmakers." },
      { heading: "Making a Warranty Claim", body: "To submit a warranty claim, contact our service department with your certificate of authenticity and proof of purchase. We will arrange secure transport to our Geneva service center and provide a detailed assessment within 10 business days." },
    ]},
    { title: "Privacy", content: [
      { heading: "Data We Collect", body: "We collect information you provide during purchase, warranty registration, and correspondence, including name, contact details, shipping address, and payment information. We also collect usage data on our website to improve the client experience." },
      { heading: "How We Use Your Data", body: "Your data is used to process orders, communicate about your purchase, fulfill warranty obligations, and — with your explicit consent — inform you of new collections and exclusive events. We do not sell or share personal data with third parties for marketing purposes." },
      { heading: "Data Security", body: "All personal data is stored on secure, encrypted servers. Payment information is processed by PCI-DSS compliant payment processors and is never stored on our systems. Access to personal data is restricted to authorized personnel only." },
      { heading: "Your Rights", body: "Under applicable data protection regulations, you have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, contact our data protection officer at privacy@rolexs.ch." },
    ]},
  ];

  return (
    <motion.div {...fade} className="pt-16">
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <p className="text-[10px] tracking-[0.3em] text-primary font-mono-label uppercase mb-2">Legal & Policies</p>
          <h1 className="font-display text-4xl text-foreground">Our Policies</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-border mb-10">
          {tabs.map((t, i) => (
            <button
              key={t.title}
              onClick={() => setTab(i)}
              className={`px-6 py-3 text-[11px] tracking-[0.15em] uppercase font-mono-label transition-colors border-b-2 -mb-px ${
                tab === i
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {tabs[tab].content.map((section) => (
            <div key={section.heading} className="border-l border-border pl-6">
              <h3 className="font-display text-xl text-foreground mb-3">{section.heading}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 right-6 z-50 bg-card border border-primary px-5 py-3 flex items-center gap-3"
    >
      <Check size={14} className="text-primary shrink-0" />
      <p className="text-sm text-foreground">{message}</p>
    </motion.div>
  );
}

function ProductRoute({
  onNavigate,
  onAddToCart,
}: {
  onNavigate: (p: Page, id?: string) => void;
  onAddToCart: (p: Product) => void;
}) {
  const { productId } = useParams();

  if (!productId) {
    return <Navigate to="/collections" replace />;
  }

  return (
    <>
      <ProductDetailPage productId={productId} onNavigate={onNavigate} onAddToCart={onAddToCart} />
      <Footer onNavigate={onNavigate} />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = useMemo(() => getPageFromPath(location.pathname), [location.pathname]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId || typeof window === "undefined") return;
    if (typeof window.gtag === "function") {
      window.gtag("config", measurementId, { page_path: location.pathname });
    }
  }, [location.pathname]);

  const navigateToPage = (p: Page, id?: string) => {
    navigate(getPathForPage(p, id));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product) => {
    if (!product.inStock) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product, quantity: 1 }];
    });
    trackAnalyticsEvent("add_to_cart", {
      currency: "INR",
      value: product.price,
      item_id: product.id,
      item_name: product.name,
    });
    showToast(`${product.name} added to your cart`);
  };

  const updateCartQty = (id: string, qty: number) => {
    setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        :root { color-scheme: dark; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); }
        ::selection { background: rgba(201,168,76,0.25); color: #f0ebe0; }
      `}</style>

      <NavBar cartCount={cartCount} onNavigate={navigateToPage} currentPage={currentPage} />

      <main className="overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div key="home" {...fade}>
                  <HomePage onNavigate={navigateToPage} onAddToCart={addToCart} />
                  <Footer onNavigate={navigateToPage} />
                </motion.div>
              }
            />
            <Route
              path="/collections"
              element={
                <motion.div key="catalog" {...fade}>
                  <CatalogPage onNavigate={navigateToPage} onAddToCart={addToCart} />
                  <Footer onNavigate={navigateToPage} />
                </motion.div>
              }
            />
            <Route
              path="/products/:productId"
              element={
                <motion.div key="product" {...fade}>
                  <ProductRoute onNavigate={navigateToPage} onAddToCart={addToCart} />
                </motion.div>
              }
            />
            <Route
              path="/cart"
              element={
                <motion.div key="cart" {...fade}>
                  <CartPage cart={cart} onNavigate={navigateToPage} onUpdate={updateCartQty} onRemove={removeFromCart} />
                  <Footer onNavigate={navigateToPage} />
                </motion.div>
              }
            />
            <Route
              path="/checkout"
              element={
                <motion.div key="checkout" {...fade}>
                  <CheckoutPage
                    cart={cart}
                    onNavigate={navigateToPage}
                    onOrderComplete={() => {
                      setCart([]);
                      trackAnalyticsEvent("purchase", {
                        currency: "INR",
                        value: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
                        transaction_id: `ROLEXS-${Date.now()}`,
                      });
                    }}
                  />
                </motion.div>
              }
            />
            <Route
              path="/about"
              element={
                <motion.div key="about" {...fade}>
                  <AboutPage onNavigate={navigateToPage} />
                  <Footer onNavigate={navigateToPage} />
                </motion.div>
              }
            />
            <Route
              path="/contact"
              element={
                <motion.div key="contact" {...fade}>
                  <ContactPage />
                  <Footer onNavigate={navigateToPage} />
                </motion.div>
              }
            />
            <Route
              path="/faq"
              element={
                <motion.div key="faq" {...fade}>
                  <FAQPage onNavigate={navigateToPage} />
                  <Footer onNavigate={navigateToPage} />
                </motion.div>
              }
            />
            <Route
              path="/policies"
              element={
                <motion.div key="policies" {...fade}>
                  <PoliciesPage />
                  <Footer onNavigate={navigateToPage} />
                </motion.div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && <Toast key={toast} message={toast} />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
