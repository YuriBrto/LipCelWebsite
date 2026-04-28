import { Component,
   HostListener,
   OnInit, OnDestroy,
    ViewChildren, ViewChild, QueryList,
     ElementRef, AfterViewInit,
     ChangeDetectionStrategy,
      ChangeDetectorRef, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent, ProductBenefit } from './components/product-card/product-card.component';
export interface Product {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  productKey: 'neutro' | 'maca' | 'limao' | 'clear';
  benefits: ProductBenefit[];
  bgColor: string;         // Cor de fundo do body ao entrar no produto
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── Estado do header ─────────────────────────────
  isScrolled   = false;
  isOnDark     = false;   // true quando sobre seção escura (produto)
  isMenuOpen   = false;

  // ── Produto ativo (para indicador lateral) ───────
  activeProductIdx = -1;

  // ── Bolhas hero ──────────────────────────────────
  heroBubbles: HeroBubble[] = [];


//------------------------ entrada
@ViewChild('introLogo') introLogo!: ElementRef<HTMLElement>; @ViewChild('headerLogo') headerLogo!: ElementRef<HTMLElement>; showIntro = true;

  // ── Referências às seções de produto ─────────────
 @ViewChildren('productSection') productSections!: QueryList<ElementRef<HTMLElement>>;

  private productObserver!: IntersectionObserver;
  private heroObserver!: IntersectionObserver;

  // ── Catálogo de produtos ──────────────────────────
  readonly products: Product[] = [
    {
      id: '01',
      title: 'LipCel Neutro',
      subtitle: 'pH neutro, cuidado puro para suas mãos.',
      image: 'https://res.cloudinary.com/dzuhpfu87/image/upload/v1777406251/WhatsApp_Image_2026-04-28_at_15.18.36__1_-removebg-preview_bjaftx.png',
      productKey: 'neutro',
      bgColor: '#E8F4FF',
      benefits: [
        { text: 'pH neutro — protege as mãos' },
        { text: 'Sem perfume artificial' },
        { text: 'Ideal para louças delicadas' },
        { text: 'Alto rendimento por gota' },
      ],
    },
    {
      id: '02',
      title: 'LipCel Maçã',
      subtitle: 'Fragrância irresistível, espuma duradoura.',
      image: 'https://res.cloudinary.com/dzuhpfu87/image/upload/v1777406251/WhatsApp_Image_2026-04-28_at_15.18.35-removebg-preview_zuabhy.png',
      productKey: 'maca',
      bgColor: '#FFF0F3',
      benefits: [
        { text: 'Fragrância suave de maçã' },
        { text: 'Espuma rica e duradoura' },
        { text: 'Remove gordura com facilidade' },
        { text: 'Alto rendimento por gota' },
      ],
    },
    {
      id: '03',
      title: 'LipCel Limão',
      subtitle: 'Poder desengordurante cítrico extremo.',
      image: 'https://res.cloudinary.com/dzuhpfu87/image/upload/v1777406251/WhatsApp_Image_2026-04-28_at_15.18.36-removebg-preview_b4vg1k.png',
      productKey: 'limao',
      bgColor: '#FFFBE8',
      benefits: [
        { text: 'Ação desengordurante potente' },
        { text: 'Aroma cítrico refrescante' },
        { text: 'Indicado para panelas e frigideiras' },
        { text: 'Alto rendimento por gota' },
      ],
    },
    {
      id: '04',
      title: 'LipCel Clear',
      subtitle: 'Transparência total, brilho impecável.',
      image: 'https://res.cloudinary.com/dzuhpfu87/image/upload/v1777409099/WhatsApp_Image_2026-04-28_at_15.18.36__2_-removebg-preview_tvl3bt.png',
      productKey: 'clear',
      bgColor: '#F0F5FF',
      benefits: [
        { text: 'Fórmula transparente sem corantes' },
        { text: 'Máximo poder de limpeza' },
        { text: 'Deixa louças com brilho impecável' },
        { text: 'Alto rendimento por gota' },
      ],
    },
  ];

  // ── Benefícios gerais ──────────────────────────────
  readonly generalBenefits = [
    {
      title: 'Protege as mãos',
      desc: 'Fórmula dermatologicamente testada para uso diário.',
      icon: 'hands',
    },
    {
      title: 'Alto rendimento',
      desc: 'Concentração premium — mais lavagens por frasco.',
      icon: 'drop',
    },
    {
      title: 'Brilho impecável',
      desc: 'Louças reluzentes sem resíduos ou películas.',
      icon: 'star',
    },
    {
      title: 'Cuidado diário',
      desc: 'Confiança e eficiência para o cotidiano da cozinha.',
      icon: 'shield',
    },
  ];

  // ── Pilares de qualidade ───────────────────────────
  readonly qualityItems = [
    { title: 'Produção cuidadosa', desc: 'Processos rigorosos garantem consistência em cada lote produzido.' },
    { title: 'Fórmulas eficientes', desc: 'Desenvolvidas para maximizar a ação limpante com menor quantidade.' },
    { title: 'Embalagem atrativa', desc: 'Design moderno que se destaca na gôndola e conquista o consumidor.' },
    { title: 'Custo-benefício', desc: 'Margem competitiva para o varejista com qualidade premium garantida.' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.generateHeroBubbles();
  }

  ngAfterViewInit(): void {
    this.initProductObserver();
    this.initHeroObserver();
    this.initBenefitObserver();

    this.initQualityObserver();
    setTimeout(() => { this.playIntroAnimation(); }, 300);
   }
  ngOnDestroy(): void {
    this.productObserver?.disconnect();
    this.heroObserver?.disconnect();
  }

  // ── Scroll: header scroll state ─────────────────
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const y = window.scrollY;
    this.isScrolled = y > 50;
    this.cdr.markForCheck();
  }

  // ── Menu hamburger ────────────────────────────────
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  // ── Bolhas hero ───────────────────────────────────
  private generateHeroBubbles(): void {
    this.heroBubbles = Array.from({ length: 12 }, () => ({
      size:     Math.random() * 55 + 10,
      x:        Math.random() * 92 + 4,
      delay:    Math.random() * 14,
      duration: Math.random() * 14 + 12,
    }));
  }

  // ── Intersection: produtos ────────────────────────
  private initProductObserver(): void {
    this.productObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const idx = parseInt(el.dataset['idx'] ?? '-1', 10);

          if (entry.isIntersecting) {
            // Muda cor de fundo do body suavemente
            const bg = el.dataset['bg'] ?? '#F5F7FA';
            document.documentElement.style.setProperty('--bg-current', bg);

            this.isOnDark = true;
            this.activeProductIdx = idx;
          } else if (this.activeProductIdx === idx) {
            this.activeProductIdx = -1;
            this.isOnDark = false;
          }
          this.cdr.markForCheck();
        });
      },
      { threshold: 0.45 }
    );

    // Aguarda um tick para as viewChildren estarem prontas
    setTimeout(() => {
      this.productSections.forEach((ref, idx) => {
        const el = ref.nativeElement;
        el.dataset['idx'] = String(idx);
        this.productObserver.observe(el);
      });
    }, 100);
  }

  // ── Intersection: hero (saída = ativa on-dark) ────
  private initHeroObserver(): void {
    const hero = document.getElementById('hero');
    if (!hero) return;
    this.heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          this.isOnDark = this.activeProductIdx >= 0;
        } else {
          this.isOnDark = false;
          document.documentElement.style.setProperty('--bg-current', '#F5F7FA');
        }
        this.cdr.markForCheck();
      },
      { threshold: 0.1 }
    );
    this.heroObserver.observe(hero);
  }

  // ── Intersection: benefit cards (stagger) ─────────
  private initBenefitObserver(): void {
    const cards = document.querySelectorAll<HTMLElement>('.benefit-card');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.transitionDelay = `${i * 0.1}s`;
            el.classList.add('visible');
          }
        });
      },
      { threshold: 0.25 }
    );
    cards.forEach((c) => obs.observe(c));
  }

  // ── Intersection: quality items ───────────────────
  private initQualityObserver(): void {
    const items = document.querySelectorAll<HTMLElement>('.qual-item');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.transitionDelay = `${i * 0.12}s`;
            el.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((it) => obs.observe(it));
  }

  // ── Scroll para seção ─────────────────────────────
  scrollTo(id: string): void {
    this.closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  // ── trackBy ──────────────────────────────────────
  trackProduct(_: number, p: Product): string { return p.id; }

  // ── Ano atual para o footer ───────────────────────
  get currentYear(): number { return new Date().getFullYear(); }

  // ── Animação de entrada ───────────────────────────
  private playIntroAnimation(): void {
    const intro = this.introLogo?.nativeElement;
    const target = this.headerLogo?.nativeElement;

    if (!intro || !target) {
      this.showIntro = false;
      this.cdr.markForCheck();
      return;
    }

    const introRect = intro.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const deltaX = targetRect.left + targetRect.width / 2 - (introRect.left + introRect.width / 2);
    const deltaY = targetRect.top + targetRect.height / 2 - (introRect.top + introRect.height / 2);

    setTimeout(() => {
      intro.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.42)`;
      intro.style.opacity = '1';
    }, 700);

    setTimeout(() => {
      this.showIntro = false;
      this.cdr.markForCheck();
    }, 2200);
  }
}

interface HeroBubble {
  size: number;
  x: number;
  delay: number;
  duration: number;
}
