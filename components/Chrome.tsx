"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Package, Plus, ShoppingBag } from "lucide-react";
import type { ProductCategory } from "@/lib/categories";

const CART_KEY = "yezi_cart_v1";

type CartLine = {
  quantity: number;
};

const DEFAULT_NAV_LABELS: Record<string, string> = {
  mens: "MENS",
  womens: "WOMENS",
  footwear: "FOOTWEAR",
  accessories: "ACCESSORIES",
  slides: "SLIDES"
};

export function StoreChrome({
  cartCount,
  backHref,
  showPlus = true,
  activeCategory = "new",
  onPlusClick,
  expanded = false,
  categories = [],
  }: {
  cartCount: number;
  backHref?: string;
  showPlus?: boolean;
  activeCategory?: string;
  onPlusClick?: () => void;
  expanded?: boolean;
  categories?: ProductCategory[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [liveCartCount, setLiveCartCount] = useState(cartCount);
  const cartRef = useRef<HTMLAnchorElement>(null);
  const [bagPulse, setBagPulse] = useState(false);
  const [flight, setFlight] = useState<{
    id: number;
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
  } | null>(null);

  useEffect(() => {
    function readCartCount() {
      try {
        const lines = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]") as CartLine[];
        setLiveCartCount(lines.reduce((sum, line) => sum + (line.quantity ?? 0), 0));
      } catch {
        setLiveCartCount(0);
      }
    }
    readCartCount();
    window.addEventListener("storage", readCartCount);
    window.addEventListener("yezi-cart-updated", readCartCount);
    return () => {
      window.removeEventListener("storage", readCartCount);
      window.removeEventListener("yezi-cart-updated", readCartCount);
    };
  }, [cartCount]);

  useEffect(() => {
    function update() {
      setScrolled(window.scrollY > 8);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    function handleAnimate(event: Event) {
      if (!cartRef.current) return;
      const customEvent = event as CustomEvent<{ x: number; y: number }>;
      const detail = customEvent.detail;
      if (!detail) return;
      const cartRect = cartRef.current.getBoundingClientRect();
      const targetX = cartRect.left + cartRect.width / 2;
      const targetY = cartRect.top + cartRect.height / 2;
      setFlight({
        id: Date.now(),
        startX: detail.x,
        startY: detail.y,
        deltaX: targetX - detail.x,
        deltaY: targetY - detail.y,
      });
      window.setTimeout(() => {
        setBagPulse(true);
      }, 520);
      window.setTimeout(() => {
        setBagPulse(false);
      }, 1280);
      window.setTimeout(() => {
        setFlight(null);
      }, 920);
    }

    window.addEventListener("yezi-cart-animate", handleAnimate as EventListener);
    return () => window.removeEventListener("yezi-cart-animate", handleAnimate as EventListener);
  }, []);

  const topBarClass = [
    "fixed inset-x-0 top-0 z-20 flex h-[6rem] items-center justify-between px-7 transition-colors duration-150",
    scrolled ? "border-b border-neutral-200 bg-white" : "bg-white/0",
  ].join(" ");
  const iconButtonClass = "inline-flex h-8 w-8 items-center justify-center";
  const rightLinkClass = "inline-flex h-7 items-center justify-center gap-1.5";
  const navLinkClass = (value: string) => {
    if (value === "new") return activeCategory === "new" || activeCategory === "all" ? "active" : "";
    return activeCategory === value ? "active" : "";
  };
  const navItems = [
    { value: "new", label: "NEW", href: "/" },
    ...categories.map((category) => ({
      value: category.value,
      label: DEFAULT_NAV_LABELS[category.value] ?? category.label,
      href: `/?category=${encodeURIComponent(category.value)}`
    }))
  ];
  const navRows = navItems.reduce<Array<typeof navItems>>((rows, item, index) => {
    const rowIndex = Math.floor(index / 3);
    rows[rowIndex] = rows[rowIndex] ?? [];
    rows[rowIndex].push(item);
    return rows;
  }, []);

  return (
    <header className={topBarClass}>
      {flight ? (
        <div
          className="cart-flight"
          key={flight.id}
          style={
            {
              "--flight-start-x": `${flight.startX}px`,
              "--flight-start-y": `${flight.startY}px`,
              "--flight-delta-x": `${flight.deltaX}px`,
              "--flight-delta-y": `${flight.deltaY}px`,
            } as React.CSSProperties
          }
        >
          <Package size={56} strokeWidth={2} />
        </div>
      ) : null}
      <div className="flex flex-1 items-center justify-start">
        {backHref ? (
          <Link className={iconButtonClass} href={backHref} aria-label="Back">
            <ChevronLeft size={30} strokeWidth={2} />
          </Link>
        ) : showPlus ? (
          <button className={iconButtonClass} aria-label="Toggle grid" onClick={onPlusClick}>
            {expanded ? <ChevronLeft size={30} strokeWidth={2} /> : <Plus size={24} strokeWidth={2.6} />}
          </button>
        ) : null}
      </div>
      {!backHref ? (
        <nav className="top-nav" aria-label="Product categories">
          {navRows.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((item) => (
                <Link className={navLinkClass(item.value)} href={item.href} key={item.value}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      ) : null}
      <div className="flex flex-1 items-center justify-end">
        <Link
          className={`${rightLinkClass} ${bagPulse ? "cart-bag-active" : ""}`}
          href="/cart"
          aria-label="Cart"
          ref={cartRef}
        >
          <span className="text-lg pt-1">{liveCartCount}</span>
          <ShoppingBag size={18} strokeWidth={2.4} />
        </Link>
      </div>
    </header>
  );
}
