Hooks.once("init", () => {
  console.log("Custom Colours Redux | Init hook triggered");

  const settings = [
    {
      key: "criticalSuccess",
      name: "Critical Success",
      colorDefault: "#ff0000",
      bgDefault: "#ffffff",
      outlineDefault: "#000000",
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
      name: `${setting.name} - Text Colour`,
      hint: `This colour is used for ${setting.name.toLowerCase()} messages.`,
      scope: "client",
      config: true,
      type: String,
      default: setting.colorDefault,
      onChange: () => applyColors(),
    });

    // Background color
    game.settings.register("custom-colours-redux", `${setting.key}BG`, {
      name: `${setting.name} - Background Colour`,
      hint: `This is the background colour for ${setting.name.toLowerCase()} messages.`,
      scope: "client",
      config: true,
      type: String,
      default: setting.bgDefault,
      onChange: () => applyColors(),
    });

    // Outline color
    game.settings.register("custom-colours-redux", `${setting.key}Outline`, {
      name: `${setting.name} - Text Outline Colour`,
      hint: `Colour for the text outline (bubble/stroke effect).`,
      scope: "client",
      config: true,
      type: String,
      default: setting.outlineDefault,
      onChange: () => applyColors(),
    });

    // Border enabled
    game.settings.register("custom-colours-redux", `${setting.key}BorderEnabled`, {
      name: `${setting.name} - Border Enabled`,
      hint: `Enable a border around the background for ${setting.name.toLowerCase()} messages.`,
      scope: "client",
      config: true,
      type: Boolean,
      default: false,
      onChange: () => applyColors(),
    });

    // Border thickness
    game.settings.register("custom-colours-redux", `${setting.key}BorderThickness`, {
      name: `${setting.name} - Border Thickness`,
      hint: `Thickness of the border (in pixels). (ONLY UPDATES ON SAVE)`,
      scope: "client",
      config: true,
      type: Number,
      range: { min: 1, max: 10, step: 1 },
      default: 2,
      onChange: () => applyColors(),
    });

    // Border color
    game.settings.register("custom-colours-redux", `${setting.key}BorderColor`, {
      name: `${setting.name} - Border Colour`,
      hint: `Colour of the border.`,
      scope: "client",
      config: true,
      type: String,
      default: "#000000",
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
    const borderEnabled = game.settings.get("custom-colours-redux", `${type}BorderEnabled`);
    const borderThickness = game.settings.get("custom-colours-redux", `${type}BorderThickness`);
    const borderColor = game.settings.get("custom-colours-redux", `${type}BorderColor`);

    html.querySelectorAll(`.degree-of-success .${type}`).forEach((el) => {
      el.style.color = color;
      el.style.backgroundColor = bg;
      el.style.display = "inline-block";
      el.style.padding = "2px 6px";
      el.style.borderRadius = "4px";
      el.style.textShadow = outlineShadow;
      if (borderEnabled) {
        el.style.border = `${borderThickness}px solid ${borderColor}`;
      } else {
        el.style.border = "none";
      }
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

// Makes settings show as color pickers
Hooks.on("renderSettingsConfig", (app, html) => {
  const $html = html instanceof jQuery ? html : $(html);

  // Color pickers
  const colorSettings = [
    "criticalSuccessColor",
    "criticalSuccessBG",
    "criticalSuccessOutline",
    "criticalSuccessBorderColor",
    "successColor",
    "successBG",
    "successOutline",
    "successBorderColor",
    "failureColor",
    "failureBG",
    "failureOutline",
    "failureBorderColor",
    "criticalFailureColor",
    "criticalFailureBG",
    "criticalFailureOutline",
    "criticalFailureBorderColor"
  ];

  colorSettings.forEach(key => {
    const input = $html.find(`input[name="custom-colours-redux.${key}"]`);
    if (input.length) {
      input.attr("type", "color");
      input.val(game.settings.get("custom-colours-redux", key));
      input.on("input", (event) => {
        game.settings.set("custom-colours-redux", key, event.target.value);
        applyColors();
      });
    }
  });

  // Border thickness sliders
  [
    "criticalSuccessBorderThickness",
    "successBorderThickness",
    "failureBorderThickness",
    "criticalFailureBorderThickness"
  ].forEach(key => {
    const input = $html.find(`input[name="custom-colours-redux.${key}"]`);
    if (input.length) {
      input.attr("type", "range"); // Make sure it's a slider

      // Find the label that shows the value (Foundry puts it in a <span> after the input)
      const valueLabel = input.parent().find("span");

      input.on("input", (event) => {
        const value = Number(event.target.value);
        game.settings.set("custom-colours-redux", key, value);
        applyColors();
        // Update the label if it exists
        if (valueLabel.length) valueLabel.text(value);
      });
    }
  });

  // Border enabled checkboxes
  [
    "criticalSuccessBorderEnabled",
    "successBorderEnabled",
    "failureBorderEnabled",
    "criticalFailureBorderEnabled"
  ].forEach(key => {
    const input = $html.find(`input[name="custom-colours-redux.${key}"]`);
    if (input.length) {
      input.on("change", (event) => {
        game.settings.set("custom-colours-redux", key, event.target.checked);
        applyColors();
      });
    }
  });
});
