import Script from "next/script";

const GA_MEASUREMENT_ID = "G-JRVY17LKPP";

export function GTag() {
	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
				strategy="lazyOnload"
			/>
			<Script id="google-analytics" strategy="lazyOnload">
				{`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false,
            anonymize_ip: true
          });
        `}
			</Script>
		</>
	);
}
