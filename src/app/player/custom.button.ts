import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

const Button = videojs.getComponent('Button');
const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');
const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

/**
 * Button that skips forward 10 seconds in the video.
 */
export class Forward10Button extends Button {
  /**
   * Creates an instance of Forward10Button.
   * @param player The video.js player instance.
   * @param options Options for the button.
   */
  constructor(player: Player, options: any) {
    super(player, options);
    (this as any).controlText('10 Sekunden vor');
  }

  /**
   * Returns the CSS class for this button.
   * @returns CSS class string.
   */
  override buildCSSClass() {
    return 'vjs-control vjs-button vjs-forward10-button';
  }

  /**
   * Handles click event: skips video forward by 10 seconds, not exceeding duration.
   */
  handleClick() {
    const currentTime = this.player().currentTime() ?? 0;
    const duration = this.player().duration() ?? 0;
    this.player().currentTime(Math.min(currentTime + 10, duration));
  }
}

/**
 * Button that skips backward 10 seconds in the video.
 */
export class Backward10Button extends Button {
  /**
   * Creates an instance of Backward10Button.
   * @param player The video.js player instance.
   * @param options Options for the button.
   */
  constructor(player: Player, options: any) {
    super(player, options);
    (this as any).controlText('10 Sekunden zurück');
  }

  /**
   * Returns the CSS class for this button.
   * @returns CSS class string.
   */
  override buildCSSClass() {
    return 'vjs-control vjs-button vjs-backward10-button';
  }

  /**
   * Handles click event: skips video backward by 10 seconds, not less than 0.
   */
  handleClick() {
    const currentTime = this.player().currentTime() ?? 0;
    this.player().currentTime(Math.max(currentTime - 10, 0));
  }
}

/**
 * Button that increases the player volume by 10%.
 */
export class VolumeUpButton extends Button {
  /**
   * Creates an instance of VolumeUpButton.
   * @param player The video.js player instance.
   * @param options Options for the button.
   */
  constructor(player: Player, options: any) {
    super(player, options);
    (this as any).controlText('Lautstärke erhöhen');
  }

  /**
   * Returns the CSS class for this button.
   * @returns CSS class string.
   */
  override buildCSSClass() {
    return 'vjs-control vjs-button vjs-volumeup-button';
  }

  /**
   * Handles click event: increases volume by 0.1 up to a max of 1.
   */
  handleClick() {
    let volume = this.player().volume() ?? 0;
    volume = Math.min(volume + 0.1, 1);
    this.player().volume(volume);
  }
}

/**
 * Customized playback rate menu button replacing default rate text with an icon.
 */
export class CustomPlaybackRateButton extends videojs.getComponent(
  'PlaybackRateMenuButton'
) {
  /**
   * Creates the DOM element for the button, replacing the rate text with an icon.
   * @returns The button element.
   */
  override createEl() {
    const el = super.createEl();

    const icon = document.createElement('span');
    icon.className = 'vjs-custom-playback-icon';

    const content = el.querySelector('.vjs-playback-rate-value');
    if (content) {
      content.replaceWith(icon);
    }

    return el;
  }
}

/**
 * Menu button that allows selecting video quality.
 */
export class QualityMenuButton extends MenuButton {
  override options_: any;
  menu?: any;

  /**
   * Creates an instance of QualityMenuButton.
   * @param player The video.js player instance.
   * @param options Options containing qualities, currentResolution, and onChange callback.
   */
  constructor(player: Player, options?: any) {
    super(player, options);
    this.options_ = options || {};
    (this as any).controlText('Qualität');
    this.menu = this.createMenu();
    this.update();
  }

  /**
   * Returns the CSS class for this button.
   * @returns CSS class string.
   */
  override buildCSSClass(): string {
    return 'vjs-control vjs-button vjs-quality';
  }

  /**
   * Creates menu items for each available quality option.
   * @returns Array of MenuItem instances.
   */
  createItems(): any[] {
    const player = this.player();
    const qualities = this.options_.qualities || [];
    const currentResolution = this.options_.currentResolution;
    const items: any[] = [];

    qualities.forEach((quality: { label: string; url: string }) => {
      const item = new MenuItem(player, {
        label: quality.label,
        selectable: true,
        selected: quality.label === currentResolution,
      } as any);

      item.on('click', () => {
        if (typeof this.options_.onChange === 'function') {
          this.options_.onChange(quality);
        }
        this.options_.currentResolution = quality.label;
        this.update();
      });

      const el = item.el() as HTMLElement;
      if (el) {
        el.innerText = quality.label;
      }

      items.push(item);
    });

    return items;
  }

  /**
   * Handles click on the quality button to toggle the quality menu visibility.
   */
  handleClick?(): void {
    if (!this.menu) {
      this.createMenu();
    }
    this.update();

    if (this.menu && !this.menu.hasClass('vjs-lock-showing')) {
      if (typeof this.menu.show === 'function') {
        this.menu.show();
      }
      this.menu.addClass('vjs-lock-showing');
    } else if (this.menu) {
      this.menu.hide();
      this.menu.removeClass('vjs-lock-showing');
    }
  }

  /**
   * Creates and initializes the quality selection menu.
   * @returns The created Menu instance.
   */
  createMenu(): any {
    this.menu = new Menu(this.player(), {});
    this.addChild(this.menu);

    const menuEl = this.menu.el();
    if (menuEl && menuEl.parentElement) {
      menuEl.parentElement.classList.add('my-menu-wrapper');
    }
    while (this.menu.children().length) {
      this.menu.removeChild(this.menu.children()[0]);
    }

    const items = this.createItems();
    items.forEach((item: any) => this.menu.addChild(item));

    this.addChild(this.menu);

    return this.menu;
  }

  /**
   * Updates the menu items to reflect the current selected quality.
   */
  update() {
    const qualities = this.options_.qualities || [];
    const currentResolution = this.options_.currentResolution;

    const children = (this.menu?.children() || []) as any[];
    children.forEach((item: any, index: number) => {
      item.selected(qualities[index].label === currentResolution);
    });
  }
}

/**
 * Component to display a title above the player controls.
 */
export class TitleDisplay extends Component {
  private title: string;

  /**
   * Creates an instance of TitleDisplay.
   * @param player The video.js player instance.
   * @param options Options containing initial title.
   */
  constructor(player: Player, options: any) {
    super(player, options);
    this.title = options.title || '';
    this.updateTitle(this.title);
  }

  /**
   * Creates the DOM element for the title display.
   * @returns The created HTMLElement.
   */
  override createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-title-display vjs-control',
    });
  }

  /**
   * Updates the displayed title text.
   * @param newTitle The new title string.
   */
  updateTitle(newTitle: string) {
    this.title = newTitle;
    if (this.el()) {
      this.el().innerHTML = this.title;
    }
  }
}

/**
 * Component that displays centered play/pause, back, and forward controls,
 * and manages showing/hiding controls on user interaction.
 */
export class CenteredControls extends Component {
  private hideTimeout?: number;
  private playPauseBtn!: HTMLButtonElement;
  private headerEl?: HTMLElement;

  /**
   * Creates an instance of CenteredControls.
   * @param player The video.js player instance.
   * @param options Options for the component.
   */
  constructor(player: Player, options: any) {
    super(player, options);
    this.addClass('vjs-centered-controls');
    this.hide();

    this.headerEl = document.querySelector(
      '.vjs-header-controls'
    ) as HTMLElement;
    if (this.headerEl) {
      this.headerEl.style.opacity = '0';
      this.headerEl.style.transition = 'opacity 0.3s ease';
    }

    const backBtn = videojs.dom.createEl('button', {
      className: 'vjs-center-back-button',
      innerHTML: '',
    }) as HTMLButtonElement;

    this.playPauseBtn = videojs.dom.createEl('button', {
      className: 'vjs-center-play-button',
      innerHTML: '',
    }) as HTMLButtonElement;

    const forwardBtn = videojs.dom.createEl('button', {
      className: 'vjs-center-forward-button',
      innerHTML: '',
    }) as HTMLButtonElement;

    this.playPauseBtn.onclick = () => {
      if (player.paused()) {
        player.play();
      } else {
        player.pause();
      }
    };

    backBtn.onclick = () => {
      player.currentTime((player.currentTime() ?? 0) - 10);
    };

    forwardBtn.onclick = () => {
      player.currentTime((player.currentTime() ?? 0) + 10);
    };

    this.el().appendChild(backBtn);
    this.el().appendChild(this.playPauseBtn);
    this.el().appendChild(forwardBtn);

    player.on('touchstart', () => this.showTemporarily());
    player.on('mousemove', () => this.showTemporarily());

    player.on('play', () => this.updatePlayPauseIcon());
    player.on('pause', () => this.updatePlayPauseIcon());
  }

  /**
   * Shows controls and header temporarily, then hides after timeout.
   */
  private showTemporarily() {
    this.show();
    this.showHeader();

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = window.setTimeout(() => {
      this.hide();
      this.hideHeader();
    }, 3000);
  }

  /**
   * Shows the header controls by setting opacity.
   */
  private showHeader() {
    if (this.headerEl) {
      this.headerEl.style.opacity = '1';
    }
  }

  /**
   * Hides the header controls by setting opacity.
   */
  private hideHeader() {
    if (this.headerEl) {
      this.headerEl.style.opacity = '0';
    }
  }

  /**
   * Updates the play/pause button icon based on player state.
   */
  private updatePlayPauseIcon() {
    const isPaused = this.player().paused();

    if (isPaused) {
      this.playPauseBtn.classList.remove('vjs-center-pause-button');
      this.playPauseBtn.classList.add('vjs-center-play-button');
    } else {
      this.playPauseBtn.classList.remove('vjs-center-play-button');
      this.playPauseBtn.classList.add('vjs-center-pause-button');
    }
  }

  /**
   * Cleans up event listeners and timeouts when component is disposed.
   */
  override dispose() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }

    this.player().off('touchstart', this.showTemporarily);
    this.player().off('mousemove', this.showTemporarily);

    super.dispose();
  }
}
