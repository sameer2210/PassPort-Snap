import { Wizard } from '@/components/wizard/Wizard';
import { HeaderWorkflow } from '@/components/wizard/HeaderWorkflow';
import { Camera, Globe, Shield, Sparkles, Sliders, Printer, HelpCircle } from 'lucide-react';
import { getJsonLdString } from '@/lib/seo/structured-data';

export default function Home() {
  const jsonLd = getJsonLdString();

  return (
    <div className="min-h-screen bg-app-background flex flex-col selection:bg-brand-light selection:text-brand-primary">
      {/* JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-app-border px-6 py-3.5 flex items-center justify-between md:grid md:grid-cols-3">
        <div className="flex items-center gap-2.5 select-none justify-self-start">
          <div className="w-8.5 h-8.5 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-sm shadow-brand-primary/20">
            <Camera className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-base font-bold text-app-text-primary leading-none tracking-tight">Passport Snap</span>
            <span className="text-[10px] font-semibold text-brand-accent/50 uppercase tracking-widest leading-none block mt-0.5">Studio quality</span>
          </div>
        </div>
        <div className="justify-self-center hidden md:block">
          <HeaderWorkflow />
        </div>
        <div className="flex items-center gap-3 justify-self-end">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-light text-brand-accent tracking-wide uppercase select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            Offline Mode
          </span>
        </div>
      </header>

      {/* Primary Application Workspace */}
      <Wizard />

      {/* SEO Copy & Landing Content Section */}
      <section className="bg-white border-t border-app-border py-12 px-6 md:py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Main Hero Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-app-text-primary tracking-tight">
              Free AI Passport Photo Maker Online
            </h1>
            <p className="text-sm md:text-base text-app-text-secondary max-w-2xl mx-auto leading-relaxed">
              Create compliant, high-resolution passport, visa, and ID photos in seconds. PassportSnap operates entirely in your browser using local AI, keeping your personal data completely private and secure.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-app-border rounded-2xl bg-app-background/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-app-text-primary">AI Background Removal</h2>
              <p className="text-xs text-app-text-secondary leading-relaxed">
                Isolate the portrait subject locally with one click. Normalize the background to standard solid White, Light Blue, or custom hex backdrops matching global travel regulations.
              </p>
            </div>

            <div className="p-5 border border-app-border rounded-2xl bg-app-background/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-app-text-primary">Crop & Resize Templates</h2>
              <p className="text-xs text-app-text-secondary leading-relaxed">
                Select from physical templates like US passport photos (2x2 inch), India size (35x45mm), UK, Europe, Canada, and China, or enter custom millimeter sizes directly.
              </p>
            </div>

            <div className="p-5 border border-app-border rounded-2xl bg-app-background/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-app-text-primary">Print Sheets & PDF Exports</h2>
              <p className="text-xs text-app-text-secondary leading-relaxed">
                Automatically tile multiple photo copies onto standard print sheets (A4, 4R 4x6&quot;, 5R, etc.) with custom cutlines, then export as print-ready, high-resolution PDFs.
              </p>
            </div>
          </div>

          {/* How It Works Segment */}
          <div className="border border-app-border rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-app-text-primary tracking-tight text-center md:text-left">
              How to Create Your Passport Size Photo Online
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center md:text-left list-none">
              <li className="space-y-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold">1</span>
                <h3 className="text-xs font-bold text-app-text-primary uppercase tracking-wide">Select Dimension</h3>
                <p className="text-[11px] text-app-text-muted leading-normal">Choose preset dimensions or set custom size parameters in millimeters.</p>
              </li>
              <li className="space-y-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold">2</span>
                <h3 className="text-xs font-bold text-app-text-primary uppercase tracking-wide">Upload Photo</h3>
                <p className="text-[11px] text-app-text-muted leading-normal">Upload your front-facing portrait up to 20MB in standard formats (JPG, PNG, HEIC).</p>
              </li>
              <li className="space-y-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold">3</span>
                <h3 className="text-xs font-bold text-app-text-primary uppercase tracking-wide">Crop & Adjust</h3>
                <p className="text-[11px] text-app-text-muted leading-normal">Position using face center AI auto-alignment, adjustments, and edge sharpening filters.</p>
              </li>
              <li className="space-y-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold">4</span>
                <h3 className="text-xs font-bold text-app-text-primary uppercase tracking-wide">Change Backdrop</h3>
                <p className="text-[11px] text-app-text-muted leading-normal">Remove background instantly with local neural inference. Paint to official compliance colors.</p>
              </li>
              <li className="space-y-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold">5</span>
                <h3 className="text-xs font-bold text-app-text-primary uppercase tracking-wide">Print & Download</h3>
                <p className="text-[11px] text-app-text-muted leading-normal">Arrange on A4, 4R, or A5 sheets, add crop lines, and download a print-ready PDF spooled offline.</p>
              </li>
            </ol>
          </div>

          {/* Detailed Info Block: Countries & Sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-app-text-primary flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-primary" />
                Supported Global Passport & Visa Standards
              </h2>
              <p className="text-xs text-app-text-secondary leading-relaxed">
                PassportSnap incorporates physical dimensions dynamically for all major global standards. Select your template to ensure compliance:
              </p>
              <ul className="grid grid-cols-2 gap-3 text-xs text-app-text-secondary list-disc pl-4">
                <li><strong>United States:</strong> 2x2 inch (51x51 mm)</li>
                <li><strong>India Passport:</strong> 35x45 mm</li>
                <li><strong>UK / Europe / Australia:</strong> 35x45 mm</li>
                <li><strong>Canada Visa & Passport:</strong> 50x70 mm</li>
                <li><strong>China Passport size:</strong> 33x48 mm</li>
                <li><strong>UAE / Saudi Arabia:</strong> 40x60 mm</li>
                <li><strong>Philippines:</strong> 35x45 mm</li>
                <li><strong>Custom Dimensions:</strong> Width/Height mm</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-app-text-primary flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-primary" />
                100% Privacy-First Local Processing
              </h2>
              <p className="text-xs text-app-text-secondary leading-relaxed">
                Unlike online generators that upload and store your images on external servers, PassportSnap processes your photos locally:
              </p>
              <div className="p-4 bg-blue-50/50 border border-brand-border rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-brand-accent">Why Local Execution Matters</h3>
                <p className="text-[11px] text-app-text-secondary leading-relaxed">
                  By leveraging WebAssembly (WASM) neural model runners (`@imgly/background-removal` ONNX) and MediaPipe Face Detection modules, all biometric centerings and pixel cutouts occur directly inside your browser cache. Once the application loads, you can disconnect your internet and execute the entire pipeline offline.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="space-y-6 pt-4 border-t border-app-border">
            <h2 className="text-xl font-bold text-app-text-primary tracking-tight text-center md:text-left flex items-center gap-2">
              <HelpCircle className="w-5.5 h-5.5 text-brand-primary" />
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-3">
              <details className="group border border-slate-200 rounded-xl p-4 bg-white hover:bg-slate-50/70 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between text-xs font-bold text-app-text-primary cursor-pointer list-none select-none">
                  <span>Is this passport photo creator completely free?</span>
                  <span className="transition-transform duration-200 group-open:rotate-180">
                    <svg className="w-4 h-4 text-app-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="text-[11px] text-app-text-secondary leading-relaxed mt-2.5 pt-2.5 border-t border-app-border">
                  Yes, PassportSnap is a 100% free tool. There are no hidden fees, paid subscriptions, or watermark additions. All features including custom dimensions, background replacement templates, and print layout compilations are accessible with no payment required.
                </p>
              </details>

              <details className="group border border-slate-200 rounded-xl p-4 bg-white hover:bg-slate-50/70 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between text-xs font-bold text-app-text-primary cursor-pointer list-none select-none">
                  <span>Is my face biometric and image data secure?</span>
                  <span className="transition-transform duration-200 group-open:rotate-180">
                    <svg className="w-4 h-4 text-app-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="text-[11px] text-app-text-secondary leading-relaxed mt-2.5 pt-2.5 border-t border-app-border">
                  Absolutely. PassportSnap processes all data locally on your device. We use on-device WebAssembly engines to handle background removals and face centering. Your photos are never sent to a remote server. You can even run the entire website offline.
                </p>
              </details>

              <details className="group border border-slate-200 rounded-xl p-4 bg-white hover:bg-slate-50/70 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between text-xs font-bold text-app-text-primary cursor-pointer list-none select-none">
                  <span>What sizes and specifications are supported?</span>
                  <span className="transition-transform duration-200 group-open:rotate-180">
                    <svg className="w-4 h-4 text-app-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="text-[11px] text-app-text-secondary leading-relaxed mt-2.5 pt-2.5 border-t border-app-border">
                  PassportSnap includes preconfigured templates for the USA (2x2 inch), India (35x45mm), UK/Europe (35x45mm), Canada (50x70mm), China (33x48mm), and the UAE/Saudi (40x60mm). Additionally, the custom size template lets you define custom width and height parameters in millimeters.
                </p>
              </details>

              <details className="group border border-slate-200 rounded-xl p-4 bg-white hover:bg-slate-50/70 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between text-xs font-bold text-app-text-primary cursor-pointer list-none select-none">
                  <span>How can I print my passport size photos at home?</span>
                  <span className="transition-transform duration-200 group-open:rotate-180">
                    <svg className="w-4 h-4 text-app-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="text-[11px] text-app-text-secondary leading-relaxed mt-2.5 pt-2.5 border-t border-app-border">
                  In Step 5, choose a standard photo paper size (e.g. A4, A5, 4x6&quot; 3R/4R, 5x7&quot; 5R), and click &quot;AutoFill Grid&quot; to align the copies. You can then print spooled directly via your browser or click &quot;Download PDF&quot; to save a layout compiled at 300 DPI for photo printers.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Semantic and Optimized Footer */}
      <footer className="mt-auto bg-gray-900 border-t border-gray-800 text-app-text-muted py-10 px-6 select-none">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-primary" />
            <span className="text-sm font-bold text-white tracking-wide">PassportSnap</span>
            <span className="text-[10px] text-app-text-secondary font-semibold">• Offline Photo Studio</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-app-text-muted">
            <a href="/sitemap.xml" className="hover:text-white transition-colors duration-150">Sitemap</a>
            <a href="/manifest.json" className="hover:text-white transition-colors duration-150">Manifest</a>
            <a href="#" className="hover:text-white transition-colors duration-150">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-150">Terms of Service</a>
          </div>
          <p className="text-[10px] text-app-text-secondary text-center md:text-right">
            &copy; {new Date().getFullYear()} PassportSnap. All rights reserved. Locally processed via WebAssembly.
          </p>
        </div>
      </footer>
    </div>
  );
}


