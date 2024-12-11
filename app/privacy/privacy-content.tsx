'use client';

import LegalDocument from '@/components/legal-document';

export default function PrivacyContent() {
  return (
    <LegalDocument>
      <div className="legal-content">
        <div data-custom-class="body">
          <div>
            <strong>
              <span style={{ fontSize: '26px' }}>
                <span data-custom-class="title">PRIVACY POLICY</span>
              </span>
            </strong>
          </div>
          <div><br /></div>
          <div>
            <span style={{ color: 'rgb(127, 127, 127)' }}>
              <strong>
                <span style={{ fontSize: '15px' }}>
                  <span data-custom-class="subtitle">Last updated December 11, 2024</span>
                </span>
              </strong>
            </span>
          </div>
          
          {/* ... Rest of your Termly content ... */}
        </div>

        <style jsx global>{`
          .legal-content [data-custom-class='body'],
          .legal-content [data-custom-class='body'] * {
            background: transparent !important;
          }

          .legal-content [data-custom-class='title'],
          .legal-content [data-custom-class='title'] * {
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
            font-size: 26px !important;
            color: #000000 !important;
          }

          .legal-content [data-custom-class='subtitle'],
          .legal-content [data-custom-class='subtitle'] * {
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
            color: #595959 !important;
            font-size: 14px !important;
          }

          .legal-content [data-custom-class='heading_1'],
          .legal-content [data-custom-class='heading_1'] * {
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
            font-size: 19px !important;
            color: #000000 !important;
          }

          .legal-content [data-custom-class='heading_2'],
          .legal-content [data-custom-class='heading_2'] * {
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
            font-size: 17px !important;
            color: #000000 !important;
          }

          .legal-content [data-custom-class='body_text'],
          .legal-content [data-custom-class='body_text'] * {
            color: #595959 !important;
            font-size: 14px !important;
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
          }

          .legal-content [data-custom-class='link'],
          .legal-content [data-custom-class='link'] * {
            color: #3030F1 !important;
            font-size: 14px !important;
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
            word-break: break-word !important;
          }

          .legal-content ul {
            list-style-type: square;
            padding-left: 1.5rem;
          }

          .legal-content ul > li > ul {
            list-style-type: circle;
          }

          .legal-content ul > li > ul > li > ul {
            list-style-type: square;
          }

          .legal-content ol li {
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          }

          .legal-content div {
            margin-bottom: 0.5rem;
          }

          .legal-content strong {
            font-weight: 600;
          }

          .legal-content br {
            display: block;
            margin: 0.5rem 0;
          }
        `}</style>
      </div>
    </LegalDocument>
  );
}