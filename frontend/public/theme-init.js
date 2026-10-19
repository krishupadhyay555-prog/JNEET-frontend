/* Runs before first paint: applies the saved theme + accent so a student who chose
   dark mode never sees a white flash while the app loads. (External file because
   the site's CSP forbids inline scripts.) */
(function () {
  try {
    var root = document.documentElement;
    var dark = localStorage.getItem("jneet_theme_mode") === "dark";
    if (!dark) root.classList.add("light");
    var accent = localStorage.getItem("jneet_theme_accent") === "normal" ? "normal" : "auto";
    if (accent === "normal") root.setAttribute("data-accent", "normal");
    else {
      var student = JSON.parse(localStorage.getItem("jneet.student.v1") || "null");
      root.setAttribute("data-accent", student && student.examMode === "JEE" ? "jee" : "neet");
    }
  } catch (e) { document.documentElement.classList.add("light"); }
})();
