Hooks.once("init", () => {
  console.log("Custom Colours Redux | Init hook triggered");

  const settings = [
    {
      key: "criticalSuccess",
      name: "Critical Success",
      colorDefault: "#ff0000",
      bgDefault: "#ffffff",
      outlineDefault: "#000000", // outline color
    },
    {
      key: "success",
      name: "Success",
      colorDefault: "#ff69b4",
      bgDefault: "#ffffff",
      outlineDefault: "#000000",
    },
    {
      key: "failure",
      name: "Failure",
      colorDefault: "#808080",
      bgDefault: "#ffffff",
      outlineDefault: "#000000",
    },
    {
      key: "criticalFailure",
      name: "Critical Failure",
      colorDefault: "#8b0000",
      bgDefault: "#ffffff",
      outlineDefault: "#000000",
    },
  ];

  settings.forEach((setting) => {
    // Text color
    game.settings.register("custom-colours-redux", `${setting.key}Color`, {
      name: `${setting.name} Color`,
      hint: `This color is used for ${setting.name.toLowerCase()} messages.`,
      scope: "client",
      config: true,
      type: String,
      default: setting.colorDefault,
      onChange: () => applyColors(),
    });

    // Background color
    game.settings.register("custom-colours-redux", `${setting.key}BG`, {
      name: `${setting.name} Background`,
      hint: `This is the background color for ${setting.name.toLowerCase()} messages.`,
      scope: "client",
      config: true,
      type: String,
      default: setting.bgDefault,
      onChange: () => applyColors(),
    });

    // Outline color
    game.settings.register("custom-colours-redux", `${setting.key}Outline`, {
      name: `${setting.name} Outline Color`,
      hint: `Color for the text outline (bubble/stroke effect).`,
      scope: "client",
      config: true,
      type: String,
      default: setting.outlineDefault,
      onChange: () => applyColors(),
    });
  });
});

// Generate multi-directional text-shadow for bubble/outline effect
function generateTextOutline(color) {
  const offsets = [-1, 0, 1];
  const shadows = [];

  offsets.forEach((x) => {
    offsets.forEach((y) => {
      if (x !== 0 || y !== 0) shadows.push(`${x}px ${y}px 0 ${color}`);
    });
  });

  return shadows.join(", ");
}

// Function to style a message element
function colorDegreeOfSuccess(html) {
  const types = ["success", "failure", "criticalSuccess", "criticalFailure"];

  types.forEach((type) => {
    const color = game.settings.get("custom-colours-redux", `${type}Color`);
    const bg = game.settings.get("custom-colours-redux", `${type}BG`);
    const outlineColor = game.settings.get(
      "custom-colours-redux",
      `${type}Outline`
    );
    const outlineShadow = generateTextOutline(outlineColor);

    html.querySelectorAll(`.degree-of-success .${type}`).forEach((el) => {
      el.style.color = color;
      el.style.backgroundColor = bg;
      el.style.display = "inline-block";
      el.style.padding = "2px 6px"; // 2px top/bottom, 6px left/right
      el.style.borderRadius = "4px"; // slightly rounder corners for a bubble effect
      el.style.textShadow = outlineShadow; // apply full bubble outline
    });
  });
}

// Apply styles to all messages
function applyColors() {
  document
    .querySelectorAll(".chat-message")
    .forEach((msg) => colorDegreeOfSuccess(msg));
  console.log("Custom Colours Redux | applyColors called");
}

// Hook for new messages
Hooks.on("renderChatMessageHTML", (message, html) => {
  colorDegreeOfSuccess(html);
  applyColors();
});

// Settings UI enhancements
Hooks.on("renderSettingsConfig", (app, html) => {
  const $html = html instanceof jQuery ? html : $(html);
  const types = ["success", "failure", "criticalSuccess", "criticalFailure"];

  types.forEach((type) => {
    // Text color picker
    let input = $html.find(`input[name="custom-colours-redux.${type}Color"]`);
    if (input.length) {
      input.attr("type", "color");
      input.val(game.settings.get("custom-colours-redux", `${type}Color`));
      input.on("input", (event) => {
        game.settings.set(
          "custom-colours-redux",
          `${type}Color`,
          event.target.value
        );
        applyColors();
      });
    }

    // Background color picker
    input = $html.find(`input[name="custom-colours-redux.${type}BG"]`);
    if (input.length) {
      input.attr("type", "color");
      input.val(game.settings.get("custom-colours-redux", `${type}BG`));
      input.on("input", (event) => {
        game.settings.set(
          "custom-colours-redux",
          `${type}BG`,
          event.target.value
        );
        applyColors();
      });
    }

    // Outline color picker
    input = $html.find(`input[name="custom-colours-redux.${type}Outline"]`);
    if (input.length) {
      input.attr("type", "color");
      input.val(game.settings.get("custom-colours-redux", `${type}Outline`));
      input.on("input", (event) => {
        game.settings.set(
          "custom-colours-redux",
          `${type}Outline`,
          event.target.value
        );
        applyColors();
      });
    }
  });
});
