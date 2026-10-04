import { el, esc } from "./dom.js";
import { t } from "./text.js";

// A text field over a filtered list. Native menus are unusable once a library
// grows past a screenful, and they cannot be styled or searched.

export function comboMarkup(id, placeholder) {
  return (
    '<span class="combo" id="' +
    id +
    'Combo">' +
    '<input class="combo-input" id="' +
    id +
    '" type="text" role="combobox" autocomplete="off" ' +
    'aria-expanded="false" aria-autocomplete="list" aria-controls="' +
    id +
    'Pop" ' +
    'placeholder="' +
    esc(placeholder) +
    '">' +
    '<span class="combo-caret">▾</span>' +
    '<div class="combo-pop" id="' +
    id +
    'Pop" role="listbox" hidden></div></span>'
  );
}

// items: [{ value, label }]. onPick fires only when the value actually changes.
export function mountCombo(id, items, value, onPick) {
  const input = el(id),
    pop = el(id + "Pop");
  let open = false,
    active = -1,
    shown = items;

  // An empty value is "nothing chosen": leave the field blank so the grey
  // placeholder shows instead of a label that reads like a typed-in answer.
  function labelOf(v) {
    if (!v) return "";
    for (let i = 0; i < items.length; i++) if (items[i].value === v) return items[i].label;
    return "";
  }
  function mark(label, q) {
    if (!q) return esc(label);
    const at = label.toLowerCase().indexOf(q.toLowerCase());
    if (at < 0) return esc(label);
    return (
      esc(label.slice(0, at)) +
      "<mark>" +
      esc(label.slice(at, at + q.length)) +
      "</mark>" +
      esc(label.slice(at + q.length))
    );
  }
  function draw(q) {
    shown = q
      ? items.filter(function (it) {
          return it.label.toLowerCase().indexOf(q.toLowerCase()) >= 0;
        })
      : items;
    if (!shown.length) {
      pop.innerHTML = '<div class="combo-empty">' + esc(t("combo.noMatch")) + "</div>";
      active = -1;
      return;
    }
    active = 0;
    for (let i = 0; i < shown.length; i++) if (shown[i].value === value) active = i;
    pop.innerHTML = shown
      .map(function (it, i) {
        return (
          '<div class="combo-opt" role="option" data-i="' +
          i +
          '" aria-selected="' +
          (i === active ? "true" : "false") +
          '">' +
          mark(it.label, q) +
          "</div>"
        );
      })
      .join("");
  }
  function highlight() {
    const opts = pop.querySelectorAll(".combo-opt");
    for (let i = 0; i < opts.length; i++)
      opts[i].setAttribute("aria-selected", i === active ? "true" : "false");
    if (opts[active]) opts[active].scrollIntoView({ block: "nearest" });
  }
  function show() {
    if (open) return;
    open = true;
    draw("");
    pop.hidden = false;
    input.setAttribute("aria-expanded", "true");
    // Flip below the field when the picker sits at the top of the screen.
    pop.classList.toggle("below", input.getBoundingClientRect().top < 260);
    highlight();
  }
  function hide() {
    open = false;
    pop.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.value = labelOf(value);
  }
  function pick(i) {
    if (!shown[i]) return;
    const next = shown[i].value;
    hide();
    if (next === value) return;
    value = next;
    input.value = labelOf(value);
    if (onPick) onPick(value);
  }

  input.value = labelOf(value);
  input.onfocus = function () {
    show();
    input.select();
  };
  input.onclick = function () {
    show();
  };
  input.oninput = function () {
    open = true;
    pop.hidden = false;
    draw(input.value);
    highlight();
  };
  input.onkeydown = function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return show();
      active = Math.min(shown.length - 1, Math.max(0, active + (e.key === "ArrowDown" ? 1 : -1)));
      highlight();
    } else if (e.key === "Enter") {
      if (open) {
        e.preventDefault();
        pick(active);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        hide();
      }
    } else if (e.key === "Tab") {
      if (open) hide();
    }
  };
  pop.onmousedown = function (e) {
    const opt = e.target.closest(".combo-opt");
    if (!opt) return;
    e.preventDefault();
    pick(Number(opt.dataset.i));
  };
  input.onblur = function () {
    if (open) hide();
  };

  return {
    get value() {
      return value;
    },
    clear: function () {
      value = "";
      input.value = "";
    },
  };
}
