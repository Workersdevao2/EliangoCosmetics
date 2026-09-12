# Eliango Cosmético — Site

Site estático do salão Eliango Cosmético (Elizabeth Raimundo).

## Stack
- HTML / CSS / JS puro
- Pronto para Cloudflare Pages
- Mobile first
- Português (padrão) + toggle Inglês

## Deploy (Cloudflare Pages)
1. Zip da pasta `eliango-cosmetico` ou ligar repositório GitHub
2. Build command: (deixar vazio)
3. Output directory: `/` (raiz da pasta)
4. Deploy

Ou via Wrangler:
```bash
npx wrangler pages deploy . --project-name=eliango-cosmetico
```

## Contacto no site
- WhatsApp: +244 938 720 335
- Instagram: @eliangocosmetico
- Facebook: profile id 100077515462072
- Local: Benfica, Via Expressa (frente AngoMart), Talatona, Luanda

## Estrutura
```
eliango-cosmetico/
├── index.html
├── css/style.css
├── js/main.js
├── images/
│   ├── logo.jpg
│   ├── owner.jpg
│   └── services.jpg
└── README.md
```

## Notas
- Formulário de contacto abre WhatsApp com a mensagem preenchida.
- Preços de produtos estão como "Consultar" — atualizar quando tiver lista definitiva.
- Galeria usa placeholders; substituir por fotos reais do Instagram quando possível.
