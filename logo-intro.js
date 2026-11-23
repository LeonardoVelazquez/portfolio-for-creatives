/* LEO Logo Intro: draw from nose -> eye blink -> finish drawing -> reveal website.
   The code never rewrites or changes the rest of your existing page. */
(() => {
  "use strict";
  const KEY = "leo-intro-shown-v3";
  const root = document.documentElement;
  const intro = document.getElementById("leo-intro");
  if (!intro) { root.classList.remove("leo-intro-active"); return; }

  let saved = false;
  try { saved = sessionStorage.getItem(KEY) === "true"; } catch (_) {}
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (saved || reduceMotion) {
    intro.remove();
    root.classList.remove("leo-intro-active");
    return;
  }

  let exiting = false;
  let finishTimer;
  let removeTimer;
  const skip = intro.querySelector(".leo-intro__skip");

  function removeIntro() {
    clearTimeout(removeTimer);
    root.classList.remove("leo-intro-active");
    intro.remove();
    document.removeEventListener("keydown", handleKey);
  }

  function finishIntro() {
    if (exiting) return;
    exiting = true;
    clearTimeout(finishTimer);
    try { sessionStorage.setItem(KEY, "true"); } catch (_) {}
    intro.classList.add("is-exiting");
    const onExitAnimationEnd = (e) => {
      if (e.target !== intro || e.animationName !== "leo-curtain") return;
      intro.removeEventListener("animationend", onExitAnimationEnd);
      removeIntro();
    };
    intro.addEventListener("animationend", onExitAnimationEnd);
    removeTimer = setTimeout(removeIntro, 1150); // fallback if animations are blocked
  }

  function handleKey(e) { if (e.key === "Escape") finishIntro(); }
  skip?.addEventListener("click", finishIntro);
  document.addEventListener("keydown", handleKey);
  root.classList.add("leo-intro-active");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { intro.classList.add("is-playing"); });
  });
  finishTimer = setTimeout(finishIntro, 3300);
})();
