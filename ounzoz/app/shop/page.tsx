"use client";
import { useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    category: "planners",
    name: "Ultimate Daily Planner",
    tagline: "Plan with purpose. Track what matters.",
    price: "$4.97",
    pages: "12 Pages",
    badge: "BESTSELLER",
    features: ["Daily schedule 6AM–10PM", "30-Day habit tracker", "Expense tracker", "Evening reflection"],
    url: "https://ounzozofficial.gumroad.com/l/rrmbtw",
    color: "#4a7a58",
  },
  {
    id: 2,
    category: "planners",
    name: "Ultimate Weekly Planner",
    tagline: "Plan your week. Own your time.",
    price: "$3.97",
    pages: "8 Pages",
    badge: "NEW",
    features: ["Year at a glance", "Monthly overview", "Weekly spread", "Goals & priorities tracker"],
    url: "https://ounzozofficial.gumroad.com/l/eyffhc",
    color: "#4a7a58",
  },
  {
    id: 3,
    category: "kids",
    name: "Animal Adventures Early Math Pack",
    tagline: "20 printable worksheets for ages 3–7.",
    price: "$3.99",
    pages: "20 Worksheets",
    badge: null,
    features: ["Counting exercises", "Pattern recognition", "Addition basics", "A4 & US Letter"],
    url: "https://ounzozofficial.gumroad.com/l/jrmtal",
    color: "#c47d2a",
  },
  {
    id: 4,
    category: "kids",
    name: "Animal Habitats Cut & Paste Pack",
    tagline: "20 printable activity worksheets.",
    price: "$4.99",
    pages: "20 Worksheets",
    badge: null,
    features: ["Habitat matching", "Cut & paste activities", "Fine motor skills", "A4 & US Letter"],
    url: "https://ounzozofficial.gumroad.com/l/wympis",
    color: "#c47d2a",
  },
  {
    id: 5,
    category: "kids",
    name: "Animal Adventures Memory Match",
    tagline: "48 printable animal cards for kids.",
    price: "$3.99",
    pages: "48 Cards",
    badge: null,
    features: ["48 animal cards", "Memory game format", "Print & play", "A4 & US Letter"],
    url: "https://ounzozofficial.gumroad.com/l/AnimalAdventures",
    color: "#c47d2a",
  },
  {
    id: 6,
    category: "kids",
    name: "Animal Adventures Coloring Book",
    tagline: "50 printable coloring & activity pages.",
    price: "$5.99",
    pages: "50 Pages",
    badge: null,
    features: ["50 coloring pages", "Activity pages included", "Ages 3–8", "A4 & US Letter"],
    url: "https://ounzozofficial.gumroad.com/l/animal-adventures-coloring-book",
    color: "#c47d2a",
  },
  {
    id: 7,
    category: "ai",
    name: "160 AI Prompts Master Pack",
    tagline: "Copy-paste ready prompts for every task.",
    price: "$2.00",
    pages: "160 Prompts",
    badge: "LAUNCH PRICE",
    features: ["Social media & SEO", "E-commerce & freelancing", "Productivity & automation", "Business & entrepreneurship"],
    url: "https://ounzozofficial.gumroad.com/l/160AIPromptsMasterPack",
    color: "#00b4d8",
  },
];
const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "planners", label: "Planners" },
  { id: "kids", label: "Kids & Education" },
  { id: "ai", label: "AI Tools" },
];

export default function ShopPage() {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === active);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B1120",
      fontFamily: "'Poppins', sans-serif",
      color: "#e8eaf0",
    }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0B1120 0%, #111d36 100%)",
        borderBottom: "1px solid #1a2a40",
        padding: "72px 24px 56px",
        textAlign: "center",
      }}>
        <p style={{ color: "#00E5FF", fontSize: 13, letterSpacing: 4, fontWeight: 600, marginBottom: 16 }}>
          OUNZOZ · DIGITAL PRODUCTS
        </p>
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 800,
          lineHeight: 1.1,
          margin: "0 0 20px",
          color: "#ffffff",
        }}>
          Tools That Work.
          <br />
          <span style={{ color: "#FFD600" }}>Planners That Stick.</span>
        </h1>
        <p style={{ color: "#8899aa", fontSize: 18, maxWidth: 520, margin: "0 auto 40px" }}>
          Printable planners, kids' worksheets, and AI prompt packs — instant download, print at home.
        </p>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              style={{
                padding: "10px 24px",
                borderRadius: 100,
                border: active === cat.id ? "2px solid #00E5FF" : "2px solid #1e2e44",
                background: active === cat.id ? "#00E5FF15" : "transparent",
                color: active === cat.id ? "#00E5FF" : "#8899aa",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "56px 24px 80px",
      }}>
        {/* Section labels */}
        {active === "all" && (
          <>
            <SectionLabel label="📋 Planners & Productivity" />
            <ProductGrid products={PRODUCTS.filter(p => p.category === "planners")} />
            <SectionLabel label="🎨 Kids & Education" />
            <ProductGrid products={PRODUCTS.filter(p => p.category === "kids")} />
            <SectionLabel label="🤖 AI Tools" />
            <ProductGrid products={PRODUCTS.filter(p => p.category === "ai")} />
          </>
        )}
        {active !== "all" && <ProductGrid products={filtered} />}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #1a2a40",
        padding: "32px 24px",
        textAlign: "center",
        color: "#445566",
        fontSize: 14,
      }}>
        <span style={{ color: "#00E5FF", fontWeight: 700 }}>OUN</span>
        <span style={{ color: "#FFD600", fontWeight: 700 }}>ZOZ</span>
        <span style={{ marginLeft: 12 }}>· Digital Products · All sales are instant downloads</span>
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 28,
      marginTop: 16,
    }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#c8d8e8" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#1a2a40" }} />
    </div>
  );
}

function ProductGrid({ products }: { products: typeof PRODUCTS }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 24,
      marginBottom: 56,
    }}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

function ProductCard({ product: p }: { product: typeof PRODUCTS[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#111d36" : "#0e1828",
        border: `1px solid ${hovered ? p.color + "60" : "#1a2a40"}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.25s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 40px ${p.color}20` : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Card header */}
      <div style={{
        background: `linear-gradient(135deg, ${p.color}18, ${p.color}08)`,
        padding: "28px 24px 20px",
        borderBottom: `1px solid ${p.color}20`,
        position: "relative",
      }}>
        {p.badge && (
          <span style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: p.color,
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            padding: "4px 10px",
            borderRadius: 100,
          }}>
            {p.badge}
          </span>
        )}
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 2,
          color: p.color,
          marginBottom: 8,
        }}>
          {p.pages}
        </div>
        <h3 style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 8px",
          lineHeight: 1.3,
        }}>
          {p.name}
        </h3>
        <p style={{ color: "#7788aa", fontSize: 14, margin: 0 }}>
          {p.tagline}
        </p>
      </div>

      {/* Features */}
      <div style={{ padding: "20px 24px", flex: 1 }}>
        {p.features.map((f, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            fontSize: 14,
            color: "#8899aa",
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: p.color,
              flexShrink: 0,
            }} />
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "0 24px 24px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#FFD600" }}>
            {p.price}
          </span>
          <span style={{ fontSize: 12, color: "#445566" }}>Instant download</span>
        </div>
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            padding: "14px",
            background: hovered ? p.color : "transparent",
            border: `2px solid ${p.color}`,
            borderRadius: 10,
            color: hovered ? "#fff" : p.color,
            fontWeight: 700,
            fontSize: 15,
            textAlign: "center",
            textDecoration: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
          }}
        >
          Get Instant Access →
        </a>
      </div>
    </div>
  );
}
