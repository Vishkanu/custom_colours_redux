Hooks.once('init', () => {
  console.log("Custom Colours Redux | Initializing");

  // Register color settings
  game.settings.register('custom_colours_redux', 'criticalSuccessColor', {
    name: 'Critical Success Color',
    hint: 'Pick the color used for critical successes in chat.',
    scope: 'client',
    config: true,
    type: String,
    default: '#00ff99'
  });
  game.settings.register('custom_colours_redux', 'successColor', {
    name: 'Success Color',
    scope: 'client',
    config: true,
    type: String,
    default: '#33ccff'
  });
  game.settings.register('custom_colours_redux', 'failureColor', {
    name: 'Failure Color',
    scope: 'client',
    config: true,
    type: String,
    default: '#ff9933'
  });
  game.settings.register('custom_colours_redux', 'criticalFailureColor', {
    name: 'Critical Failure Color',
    scope: 'client',
    config: true,
    type: String,
    default: '#ff3333'
  });
});

Hooks.once('ready', () => {
  // Inject dynamic style tag
  const style = document.createElement('style');
  style.id = 'custom-colours-redux-style';
  style.innerHTML = `
    .dice-roll.critical.success { background-color: ${game.settings.get('custom_colours_redux', 'criticalSuccessColor')} !important; }
    .dice-roll.success:not(.critical) { background-color: ${game.settings.get('custom_colours_redux', 'successColor')} !important; }
    .dice-roll.failure:not(.critical) { background-color: ${game.settings.get('custom_colours_redux', 'failureColor')} !important; }
    .dice-roll.critical.failure { background-color: ${game.settings.get('custom_colours_redux', 'criticalFailureColor')} !important; }
  `;
  document.head.appendChild(style);
});
