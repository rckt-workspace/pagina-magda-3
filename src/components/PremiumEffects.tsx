import React, { useEffect } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function PremiumEffects() {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      // Disable all premium animations
      document.documentElement.classList.add("reduce-motion");
      return;
    }

    document.documentElement.classList.remove("reduce-motion");

    // IntersectionObserver for scroll reveals
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;

    // Navbar scroll effect
    let lastScrollY = 0;
    const navbar = document.querySelector(".site");
    if (!navbar) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReduced]);

  return null;
}
