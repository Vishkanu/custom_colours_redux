Hooks.once('init', () => {
  console.log("Custom Colours Redux | Init hook triggered");

    game.settings.register("custom-colours-redux", "criticalSuccessColor", {
    name: "Critical Success Color",
    hint: "This color is used for critical success messages.",
    scope: "client",
    config: true,
    type: String,
    default: "#ff0000",
    onChange: () => { console.log("Critical Success color changed"); applyColors(); }
  });
  game.settings.register("custom-colours-redux", "successColor", {
    name: "Success Color",
    hint: "This color is used for normal success messages.",
    scope: "client",
    config: true,
    type: String,
    default: "#ff69b4",
    onChange: () => { console.log("Success color changed"); applyColors(); }
  });
  game.settings.register("custom-colours-redux", "failureColor", {
    name: "Failure Color",
    hint: "This color is used for normal failure messages.",
    scope: "client",
    config: true,
    type: String,
    default: "#808080",
    onChange: () => { console.log("Failure color changed"); applyColors(); }
  });
  game.settings.register("custom-colours-redux", "criticalFailureColor", {
    name: "Critical Failure Color",
    hint: "This color is used for critical failure messages.",
    scope: "client",
    config: true,
    type: String,
    default: "#8b0000",
    onChange: () => { console.log("Critical Failure color changed"); applyColors(); }
  });
});

// Function to color a specific HTML element (message or span)
function colorDegreeOfSuccess(html) {
  const successColor = game.settings.get("custom-colours-redux", "successColor");
  const failureColor = game.settings.get("custom-colours-redux", "failureColor");
  const critSuccessColor = game.settings.get("custom-colours-redux", "criticalSuccessColor");
  const critFailureColor = game.settings.get("custom-colours-redux", "criticalFailureColor");

  html.querySelectorAll(".degree-of-success .success").forEach(el => el.style.color = successColor);
  html.querySelectorAll(".degree-of-success .failure").forEach(el => el.style.color = failureColor);
  html.querySelectorAll(".degree-of-success .criticalSuccess").forEach(el => el.style.color = critSuccessColor);
  html.querySelectorAll(".degree-of-success .criticalFailure").forEach(el => el.style.color = critFailureColor);
}

// Apply colors to all existing messages
function applyColors() {
  document.querySelectorAll(".chat-message").forEach(msg => colorDegreeOfSuccess(msg));
  console.log("Custom Colours Redux | applyColors called");
}

// Hook for new messages: color **both new message and all previous messages**
Hooks.on("renderChatMessageHTML", (message, html) => {
  console.log("Custom Colours Redux | renderChatMessageHTML triggered");
  // Color the new message immediately
  colorDegreeOfSuccess(html);
  // Optional: recolor all previous messages in case settings changed
  applyColors();
});

// Makes settings show as color pickers
Hooks.on("renderSettingsConfig", (app, html) => {
  const $html = (html instanceof jQuery) ? html : $(html);

  const settings = [
    "successColor",
    "failureColor",
    "criticalSuccessColor",
    "criticalFailureColor"
  ];

  settings.forEach(key => {
    const input = $html.find(`input[name="custom-colours-redux.${key}"]`);
    if (input.length) {
      input.attr("type", "color"); // turn the input into a color picker
      input.val(game.settings.get("custom-colours-redux", key)); // set current value
      input.on("input", (event) => {
        const newColor = event.target.value;
        game.settings.set("custom-colours-redux", key, newColor); // save new value
        applyColors(); // apply it immediately to chat
      });
    }
  });
});
