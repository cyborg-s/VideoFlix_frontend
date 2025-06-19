import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

const Button = videojs.getComponent('Button');
const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');
const Menu = videojs.getComponent('Menu');
const Component = videojs.getComponent('Component');

export class Forward10Button extends Button {
  constructor(player: Player, options: any) {
    super(player, options);
    (this as any).controlText('10 Sekunden vor');
  }

  override buildCSSClass() {
    return 'vjs-control vjs-button vjs-forward10-button';
  }

  handleClick() {
    const currentTime = this.player().currentTime() ?? 0;
    const duration = this.player().duration() ?? 0;
    this.player().currentTime(Math.min(currentTime + 10, duration));
  }
}

export class Backward10Button extends Button {
  constructor(player: Player, options: any) {
    super(player, options);
    (this as any).controlText('10 Sekunden zurück');
  }

  override buildCSSClass() {
    return 'vjs-control vjs-button vjs-backward10-button';
  }

  handleClick() {
    const currentTime = this.player().currentTime() ?? 0;
    this.player().currentTime(Math.max(currentTime - 10, 0));
  }
}

export class VolumeUpButton extends Button {
  constructor(player: Player, options: any) {
    super(player, options);
    (this as any).controlText('Lautstärke erhöhen');
  }

  override buildCSSClass() {
    return 'vjs-control vjs-button vjs-volumeup-button';
  }

  handleClick() {
    let volume = this.player().volume() ?? 0;
    volume = Math.min(volume + 0.1, 1);
    this.player().volume(volume);
  }
}

export class CustomPlaybackRateButton extends videojs.getComponent(
  'PlaybackRateMenuButton'
) {
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

export class QualityMenuButton extends MenuButton {
  override options_: any;
  menu?: any;

  constructor(player: Player, options?: any) {
    super(player, options);
    this.options_ = options || {};
    (this as any).controlText('Qualität');
    this.menu = this.createMenu();
    this.update();
  }

  override buildCSSClass(): string {
    return 'vjs-control vjs-button vjs-quality';
  }

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

  update() {
    const qualities = this.options_.qualities || [];
    const currentResolution = this.options_.currentResolution;

    const children = (this.menu?.children() || []) as any[];
    children.forEach((item: any, index: number) => {
      item.selected(qualities[index].label === currentResolution);
    });
  }
}

export class TitleDisplay extends Component {
  private title: string;

  constructor(player: Player, options: any) {
    super(player, options);
    this.title = options.title || '';
    this.updateTitle(this.title);
  }

  override createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-title-display vjs-control',
    });
  }

  updateTitle(newTitle: string) {
    this.title = newTitle;
    if (this.el()) {
      this.el().innerHTML = this.title;
    }
  }
}

export class CenteredControls extends Component {
  private hideTimeout?: number;
  private playPauseBtn!: HTMLButtonElement;
  private headerEl?: HTMLElement;

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

  private showHeader() {
    if (this.headerEl) {
      this.headerEl.style.opacity = '1';
    }
  }

  private hideHeader() {
    if (this.headerEl) {
      this.headerEl.style.opacity = '0';
    }
  }

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
