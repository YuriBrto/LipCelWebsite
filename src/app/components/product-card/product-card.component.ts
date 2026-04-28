import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductBenefit {
  text: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="immersive-section"
      [attr.data-product]="productKey"
      [attr.aria-label]="'LipCel ' + title"
      #sectionEl
    >
      <!-- Fundo dinâmico -->
      <div class="product-bg" [ngStyle]="{ background: bgGradient }"></div>

      <!-- Glow atrás da garrafa -->
      <div class="product-glow" [ngStyle]="{ background: glowColor }"></div>

      <!-- Número decorativo -->
      <span class="product-number" aria-hidden="true">{{ id }}</span>

      <!-- Camada de partículas decorativas -->
      <div class="decor-layer" #decorLayer aria-hidden="true">
        <ng-content select="[decor]"></ng-content>
        <div
          *ngFor="let p of particles"
          class="particle"
          [ngStyle]="{
            width: p.size + 'px',
            height: p.size + 'px',
            left: p.x + '%',
            bottom: p.startY + 'px',
            background: p.color,
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's'
          }"
        ></div>
      </div>

      <!-- Produto flutuando -->
      <div class="product-img-wrap">
        <div class="img-container" [class.float-anim]="isVisible">
          <!-- Shine periódico -->
          <div class="shine-overlay" [class.shine-active]="isVisible"></div>
          <img
            [src]="image"
            [alt]="'Garrafa LipCel ' + title"
            class="product-img"
            loading="lazy"
            [class.entered]="isVisible"
          />
        </div>
      </div>

      <!-- Conteúdo — rodapé imersivo mobile -->
      <div class="product-content" [class.entered]="isVisible">
        <p class="product-eyebrow">{{ id }} — {{ productKey | titlecase }}</p>
        <h3 class="product-name">{{ title }}</h3>
        <p class="product-tagline">{{ subtitle }}</p>

        <ul class="product-benefits" *ngIf="benefits.length">
          <li *ngFor="let b of benefits; let i = index"
            [class.entered]="isVisible"
            [style.transitionDelay]="isVisible ? (0.35 + i * 0.08) + 's' : '0s'"
          >
            <span class="check-icon">
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <path d="M2 5l2.5 2.5L8 3"/>
              </svg>
            </span>
            {{ b.text }}
          </li>
        </ul>

        <button class="btn-conhecer" (click)="onConhecer()" [class.entered]="isVisible">
          Conhecer
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </button>
      </div>
    </section>
  `,
  styles: [`
    // ── SEÇÃO IMERSIVA ─────────────────────────────────
    .immersive-section {
      min-height: 100svh;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    // ── FUNDO ──────────────────────────────────────────
    .product-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      transition: background 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    // ── GLOW ATRÁS DA GARRAFA ──────────────────────────
    .product-glow {
      position: absolute;
      width: 340px;
      height: 340px;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -68%);
      filter: blur(90px);
      z-index: 1;
      opacity: 0;
      transition: opacity 1.2s ease;
      pointer-events: none;
    }
    .immersive-section.visible .product-glow,
    :host-context(.product-section.visible) .product-glow {
      opacity: 0.5;
    }

    // ── NÚMERO DECORATIVO ─────────────────────────────
    .product-number {
      position: absolute;
      top: 80px;
      left: 20px;
      z-index: 3;
      font-size: 6rem;
      font-weight: 800;
      letter-spacing: -0.06em;
      line-height: 1;
      opacity: 0.05;
      color: #1D1D1F;
      pointer-events: none;
      user-select: none;
    }

    // ── PARTÍCULAS DECORATIVAS ─────────────────────────
    .decor-layer {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      border-radius: 50%;
      animation: particleFloat linear infinite;
    }

    // ── IMAGEM PRODUTO ─────────────────────────────────
    .product-img-wrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 70%;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .img-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      &.float-anim {
        animation: floatLoop 8s ease-in-out infinite;
      }
    }

    .product-img {
      max-width: 62vw;
      max-height: 62vh;
      width: auto;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 28px 48px rgba(0, 0, 0, 0.13));
      mix-blend-mode: multiply;
      transform: translateY(40px) scale(0.9);
      opacity: 0;
      transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);

      &.entered {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    // ── SHINE PERIÓDICO ────────────────────────────────
    .shine-overlay {
      position: absolute;
      top: 0;
      left: -60%;
      width: 40%;
      height: 100%;
      background: linear-gradient(
        105deg,
        transparent 20%,
        rgba(255, 255, 255, 0.55) 50%,
        transparent 80%
      );
      z-index: 5;
      pointer-events: none;
      opacity: 0;

      &.shine-active {
        opacity: 1;
        animation: shinePass 2.4s ease-in-out 1.5s infinite;
        animation-play-state: running;
      }
    }

    // ── CONTEÚDO RODAPÉ ────────────────────────────────
    .product-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 5;
      padding: 32px 24px 48px;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.62) 0%,
        rgba(0, 0, 0, 0.35) 55%,
        transparent 100%
      );
      transform: translateY(24px);
      opacity: 0;
      transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.15s,
                  opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s;

      &.entered {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .product-eyebrow {
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 6px;
    }

    .product-name {
      font-size: 3rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.0;
      letter-spacing: -0.03em;
      margin-bottom: 8px;
    }

    .product-tagline {
      font-size: 0.92rem;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 16px;
      line-height: 1.55;
    }

    // ── BENEFÍCIOS ─────────────────────────────────────
    .product-benefits {
      list-style: none;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      li {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.84rem;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.82);
        transform: translateX(-12px);
        opacity: 0;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.5s ease;

        &.entered {
          transform: translateX(0);
          opacity: 1;
        }
      }
    }

    .check-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        width: 10px;
        height: 10px;
        stroke: #fff;
      }
    }

    // ── BOTÃO CONHECER ─────────────────────────────────
    .btn-conhecer {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 50px;
      color: #fff;
      font-family: 'Sora', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: all 0.25s ease;
      transform: translateY(10px);
      opacity: 0;

      &.entered {
        transform: translateY(0);
        opacity: 1;
        transition-delay: 0.5s;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.26);
        transform: translateY(-1px);
      }

      &:active { transform: scale(0.97); }

      svg { transition: transform 0.2s ease; }
      &:hover svg { transform: translateX(4px); }
    }

    // ── KEYFRAMES LOCAIS ──────────────────────────────
    @keyframes floatLoop {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      30%       { transform: translateY(-18px) rotate(1.5deg); }
      70%       { transform: translateY(-8px) rotate(-1deg); }
    }

    @keyframes particleFloat {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.7; }
      100% { transform: translateY(-85vh) rotate(360deg); opacity: 0; }
    }

    @keyframes shinePass {
      0%   { left: -60%; }
      100% { left: 160%; }
    }

    // ── DESKTOP ───────────────────────────────────────
    @media (min-width: 768px) {
      .product-img { max-width: 50vw; max-height: 65vh; }
      .product-name { font-size: 3.8rem; }
      .product-content { padding: 40px 40px 56px; }
    }

    @media (min-width: 1024px) {
      .product-img-wrap {
        right: 0;
        left: auto;
        width: 55%;
        height: 100%;
        top: 0;
      }

      .product-content {
        left: 0;
        right: auto;
        width: 48%;
        bottom: auto;
        top: 50%;
        transform: translateY(calc(-50% + 24px));
        padding: 0 0 0 56px;
        background: none;

        &.entered {
          transform: translateY(-50%);
        }
      }

      .product-name    { color: var(--text-main, #1D1D1F); }
      .product-tagline { color: #555; }
      .product-eyebrow { color: var(--blue-lipcel, #0D5CFF); }

      .product-benefits li { color: #444; }

      .check-icon {
        background: rgba(13, 92, 255, 0.1);
        border-color: rgba(13, 92, 255, 0.2);
        svg { stroke: var(--blue-lipcel, #0D5CFF); }
      }

      .btn-conhecer {
        background: var(--blue-lipcel, #0D5CFF);
        border-color: var(--blue-lipcel, #0D5CFF);
        color: #fff;
        backdrop-filter: none;

        &:hover { background: var(--blue-dark, #0A47CC); }
      }
    }
  `],
})
export class ProductCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id = '01';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() image = '';
  @Input() color = 'rgba(13, 92, 255, 0.3)';
  @Input() productKey: 'neutro' | 'maca' | 'limao' | 'clear' = 'neutro';
  @Input() benefits: ProductBenefit[] = [];

  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;

  isVisible = false;
  particles: Particle[] = [];

  private observer!: IntersectionObserver;

  // ── Gradientes por produto ─────────────────────────
  private gradientMap: Record<string, string> = {
    neutro: 'radial-gradient(ellipse at 65% 30%, rgba(186,230,255,0.75) 0%, rgba(240,248,255,0.95) 45%, #E8F4FF 100%)',
    maca:   'radial-gradient(ellipse at 65% 30%, rgba(225,29,72,0.22) 0%,  rgba(255,240,244,0.95) 45%, #FFF0F3 100%)',
    limao:  'radial-gradient(ellipse at 65% 30%, rgba(250,204,21,0.38) 0%, rgba(255,252,230,0.95) 45%, #FFFBE8 100%)',
    clear:  'radial-gradient(ellipse at 65% 30%, rgba(13,92,255,0.14) 0%,  rgba(240,245,255,0.95) 45%, #F0F5FF 100%)',
  };

  // ── Cores do glow por produto ──────────────────────
  private glowMap: Record<string, string> = {
    neutro: 'rgba(13, 92, 255, 0.28)',
    maca:   'rgba(220, 38, 38, 0.32)',
    limao:  'rgba(234, 179, 8, 0.42)',
    clear:  'rgba(13, 92, 255, 0.18)',
  };

  // ── Cores de partículas por produto ───────────────
  private particleColorMap: Record<string, string[]> = {
    neutro: ['rgba(186,230,255,0.6)', 'rgba(13,92,255,0.15)', 'rgba(255,255,255,0.5)'],
    maca:   ['rgba(255,182,193,0.6)', 'rgba(225,29,72,0.15)', 'rgba(255,255,255,0.4)'],
    limao:  ['rgba(253,224,71,0.65)', 'rgba(234,179,8,0.2)',  'rgba(255,255,255,0.5)'],
    clear:  ['rgba(219,234,254,0.7)', 'rgba(13,92,255,0.1)',  'rgba(255,255,255,0.6)'],
  };

  get bgGradient(): string { return this.gradientMap[this.productKey] ?? this.gradientMap['neutro']; }
  get glowColor(): string  { return this.glowMap[this.productKey]     ?? this.glowMap['neutro']; }

  ngOnInit(): void {
    this.generateParticles();
  }

  ngAfterViewInit(): void {
    this.initObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private generateParticles(): void {
    const colors = this.particleColorMap[this.productKey] ?? this.particleColorMap['neutro'];
    this.particles = Array.from({ length: 14 }, (_, i) => ({
      size:     Math.random() * 28 + 8,
      x:        Math.random() * 96 + 2,
      startY:   -(Math.random() * 40),
      color:    colors[i % colors.length],
      duration: Math.random() * 14 + 10,
      delay:    Math.random() * 10,
    }));
  }

  constructor(private cdr: ChangeDetectorRef) {}

  private initObserver(): void {
    if (!this.sectionEl) return;
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.cdr.markForCheck();
          // Mantém visível — não reseta para preservar animações
        }
      },
      { threshold: 0.22 }
    );
    this.observer.observe(this.sectionEl.nativeElement);
  }

  onConhecer(): void {
    const ctaSection = document.getElementById('cta');
    ctaSection?.scrollIntoView({ behavior: 'smooth' });
  }
}

interface Particle {
  size: number;
  x: number;
  startY: number;
  color: string;
  duration: number;
  delay: number;
}
